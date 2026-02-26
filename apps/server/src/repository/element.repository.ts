import { DBClient, pool } from '@repo/db';
import { IElement, IElementRequest, ISlide, ITag, ITrack } from '@repo/types';

import { SlideRepository } from './slide.repository';
import { TagRepository } from './tag.repository';
import { TrackRepository } from './track.repository';

export class ElementRepository {
  private clientPool: DBClient;
  private trackRepository: TrackRepository;
  private slideRepository: SlideRepository;
  private tagRepository: TagRepository;

  constructor() {
    this.trackRepository = new TrackRepository();
    this.slideRepository = new SlideRepository();
    this.tagRepository = new TagRepository();
    this.clientPool = pool;
  }

  async createElement(reqObj: IElementRequest): Promise<IElement> {
    const client = await this.clientPool.connect();
    try {
      const track: ITrack = await this.trackRepository.getTrackById(reqObj.track_id);
      const slide: ISlide = await this.slideRepository.getSlideById(reqObj.slide_id);
      const tag: ITag = await this.tagRepository.getTagById(reqObj.tag_id);
      let prev_sibling: IElement | null = null;
      let next_sibling: IElement | null = null;
      let parent: IElement | null = null;
      if (reqObj.prev_sibling_id) {
        prev_sibling = await this.getElementById(reqObj.prev_sibling_id);
      }
      if (reqObj.next_sibling_id) {
        next_sibling = await this.getElementById(reqObj.next_sibling_id);
      }
      if (reqObj.parent_id) {
        parent = await this.getElementById(reqObj.parent_id);
      }
      let query: string;
      let values: (string | number)[];
      let position: number = 5;
      let depth = 0;
      if (prev_sibling && next_sibling) {
        position = prev_sibling.position + (next_sibling.position - prev_sibling.position) / 2;
        if (parent) {
          query = `
            INSERT INTO elements
              (track_id, slide_id, tag_id, parent_id, prev_sibling_id, next_sibling_id, content, position, depth)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *;
          `;
          depth = parent.depth + 1;
          values = [
            track.id,
            slide.id,
            tag.id,
            parent.id,
            prev_sibling.id,
            next_sibling.id,
            reqObj.content,
            position,
            depth,
          ];
        } else {
          query = `
            INSERT INTO elements
              (track_id, slide_id, tag_id, prev_sibling_id, next_sibling_id, content, position, depth)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
          `;
          values = [track.id, slide.id, tag.id, prev_sibling.id, next_sibling.id, reqObj.content, position, depth];
        }
      } else if (prev_sibling) {
        position = prev_sibling.position + 5;
        if (parent) {
          query = `
            INSERT INTO elements
              (track_id, slide_id, tag_id, parent_id, prev_sibling_id, content, position, depth)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
          `;
          depth = parent.depth + 1;
          values = [track.id, slide.id, tag.id, parent.id, prev_sibling.id, reqObj.content, position, depth];
        } else {
          query = `
            INSERT INTO elements
              (track_id, slide_id, tag_id, prev_sibling_id, content, position. depth)
              VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
          `;
          values = [track.id, slide.id, tag.id, prev_sibling.id, reqObj.content, position, depth];
        }
      } else if (next_sibling) {
        position = next_sibling.position / 2;
        if (parent) {
          query = `
            INSERT INTO elements
              (track_id, slide_id, tag_id, parent_id, next_sibling_id, content, position, depth)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
          `;
          depth = parent.depth + 1;
          values = [track.id, slide.id, tag.id, parent.id, next_sibling.id, reqObj.content, position, depth];
        } else {
          query = `
            INSERT INTO elements
              (track_id, slide_id, tag_id, next_sibling_id, content, position. depth)
              VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
          `;
          values = [track.id, slide.id, tag.id, next_sibling.id, reqObj.content, position, depth];
        }
      } else {
        if (parent) {
          query = `
            INSERT INTO elements
              (track_id, slide_id, tag_id, parent_id, content, position, depth)
              VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
          `;
          depth = parent.depth + 1;
          values = [track.id, slide.id, tag.id, parent.id, reqObj.content, position, depth];
        } else {
          query = `
            INSERT INTO elements
              (track_id, slide_id, tag_id, content, position, depth)
              VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
          `;
          values = [track.id, slide.id, tag.id, reqObj.content, position, depth];
        }
      }
      const result = await client.query(query, values);
      const element: IElement = result.rows[0];
      if (prev_sibling) {
        query = `
          UPDATE TABLE elements
            SET next_sibling_id = $1
            WHERE id = $2;
        `;
        await client.query(query, [element.id, prev_sibling.id]);
      }
      if (next_sibling) {
        query = `
          UPDATE TABLE elements
            SET prev_sibling_id = $1
            WHERE id = $2;
        `;
        await client.query(query, [element.id, next_sibling.id]);
      }
      return element;
    } finally {
      client.release();
    }
  }

  async getElementById(id: string): Promise<IElement> {
    const client = await this.clientPool.connect();
    try {
      const query = `
        SELECT * FROM elements 
          WHERE id = $1;
      `;
      const values = [id];
      const result = await client.query(query, values);
      const element: IElement = result.rows[0];
      return element;
    } finally {
      client.release();
    }
  }

  async getElementFirstChild(id: string): Promise<IElement | null> {
    const client = await this.clientPool.connect();
    try {
      const query = `
        SELECT * FROM elements
          WHERE parent_id = $1
          ORDER BY position
        LIMIT 1;
      `;
      const values = [id];
      const result = await client.query(query, values);
      const child: IElement | null = result.rows.length > 0 ? result.rows[0] : null;
      return child;
    } finally {
      client.release();
    }
  }

  async getElementLastChild(id: string): Promise<IElement | null> {
    const client = await this.clientPool.connect();
    try {
      const query = `
        SELECT * FROM elements
          WHERE parent_id = $1
          ORDER BY position DESC
        LIMIT 1;
      `;
      const values = [id];
      const result = await client.query(query, values);
      const child: IElement | null = result.rows.length > 0 ? result.rows[0] : null;
      return child;
    } finally {
      client.release();
    }
  }

  async getElementChildren(id: string): Promise<IElement[]> {
    const client = await this.clientPool.connect();
    try {
      const parent: IElement = await this.getElementById(id);
      const query = `
        SELECT * FROM elements
          WHERE parent_id = $1
        ORDER BY position;
      `;
      const values = [parent.id];
      const result = await client.query(query, values);
      const elements: IElement[] = result.rows;
      return elements;
    } finally {
      client.release();
    }
  }

  async getNestedChildren(id: string): Promise<IElement[]> {
    const client = await this.clientPool.connect();
    try {
      let elements: IElement[] = [];
      const curr_element: IElement = await this.getElementById(id);
      let auxilary: IElement[] = [curr_element];
      while (auxilary.length > 0) {
        let curr_auxilary: IElement[] = [];
        await auxilary.map(async (element) => {
          const children: IElement[] = await this.getElementChildren(element.id);
          elements = [...elements, ...children];
          curr_auxilary = [...curr_auxilary, ...children];
        });
        auxilary = curr_auxilary;
      }
      return elements;
    } finally {
      client.release();
    }
  }

  async getUpcomingSiblings(parent_id: string, position: number): Promise<IElement[]> {
    const client = await this.clientPool.connect();
    try {
      const query = `
        SELECT * FROM elements
          WHERE parent_id = $1
          AND position > $2
        ORDER BY poition;
      `;
      const values = [parent_id, position];
      const result = await client.query(query, values);
      const elements: IElement[] = result.rows;
      return elements;
    } finally {
      client.release();
    }
  }

  async updateElementContent(id: string, content: string): Promise<IElement> {
    const client = await this.clientPool.connect();
    try {
      const query = `
        ALTER TABLE elements
          SET content = $1
          WHERE id = $2
        RETURNING *;
      `;
      const values = [id, content];
      const result = await client.query(query, values);
      const element: IElement = result.rows[0];
      return element;
    } finally {
      client.release();
    }
  }

  async updateElementParent(element_id: string, parent_id: string | null): Promise<IElement> {
    const client = await this.clientPool.connect();
    try {
      const query = `
        UPDATE TABLE elements
          SET parent_id = $1
          WHERE id = $2
        RETURNING *;
      `;
      const values = [parent_id, element_id];
      const result = await client.query(query, values);
      const element: IElement = result.rows[0];
      return element;
    } finally {
      client.release();
    }
  }

  async updateElementPrevSibling(element_id: string, prev_sibling_id: string | null): Promise<IElement> {
    const client = await this.clientPool.connect();
    try {
      const query = `
        UPDATE TABLE elements
          SET prev_sibling_id = $1
          WHERE id = $2
        RETURNING *;
      `;
      const values = [prev_sibling_id, element_id];
      const result = await client.query(query, values);
      const element: IElement = result.rows[0];
      return element;
    } finally {
      client.release();
    }
  }

  async updateElementNextSibling(element_id: string, next_sibling_id: string | null): Promise<IElement> {
    const client = await this.clientPool.connect();
    try {
      const query = `
        UPDATE TABLE elements
          SET next_sibling_id = $1
          WHERE id = $2
        RETURNING *;
      `;
      const values = [next_sibling_id, element_id];
      const result = await client.query(query, values);
      const element: IElement = result.rows[0];
      return element;
    } finally {
      client.release();
    }
  }

  async updateElementNestDepth(element_id: string): Promise<void> {
    const client = await this.clientPool.connect();
    try {
      const curr_element = await this.getElementById(element_id);
      if (curr_element.prev_sibling_id === null) throw new Error();
      const prev_sibling: IElement = await this.getElementById(curr_element.prev_sibling_id);
      const prev_sibling_last_child: IElement | null = await this.getElementLastChild(prev_sibling.id);
      let curr_element_children: IElement[] = await this.getElementChildren(curr_element.id);
      if (curr_element_children.length > 0) {
        await this.updateElementNextSibling(curr_element.id, curr_element_children[0].id);
        await this.updateElementPrevSibling(curr_element_children[0].id, curr_element.id);
      }
      if (prev_sibling_last_child) {
        await this.updateElementNextSibling(prev_sibling_last_child.id, curr_element.id);
        await this.updateElementPrevSibling(curr_element.id, prev_sibling_last_child.id);
      }
      curr_element_children = [curr_element, ...curr_element_children];
      await Promise.all(
        curr_element_children.map(async (child, index): Promise<void> => {
          const query = `
            UPDATE TABLE elements
              SET parent_id = $1, position = $2, depth = $3
            WHERE id = $4;
          `;
          let position = 5 * (index + 1);
          if (prev_sibling_last_child) position += prev_sibling_last_child.position;
          const depth = prev_sibling.depth + 1;
          const parent_id = prev_sibling.id;
          const values = [parent_id, position, depth, child.id];
          await client.query(query, values);
        }),
      );
      if (curr_element.next_sibling_id) {
        await this.updateElementPrevSibling(curr_element.next_sibling_id, prev_sibling.id);
      }
      await this.updateElementNextSibling(prev_sibling.id, curr_element.next_sibling_id);
    } finally {
      client.release();
    }
  }

  async updateElementUnNestDepth(element_id: string): Promise<void> {
    const client = await this.clientPool.connect();
    try {
      let curr_element: IElement = await this.getElementById(element_id);
      if (curr_element.parent_id === null || curr_element.depth === 0) throw new Error();
      const parent: IElement = await this.getElementById(curr_element.parent_id);
      if (curr_element.prev_sibling_id) {
        await this.updateElementNextSibling(curr_element.prev_sibling_id, null);
      }
      if (curr_element.next_sibling_id) {
        const next_siblings: IElement[] = await this.getUpcomingSiblings(curr_element.parent_id, curr_element.position);
        const len = next_siblings.length;
        if (len > 0) {
          const curr_element_last_child: IElement | null = await this.getElementLastChild(curr_element.id);
          if (curr_element_last_child)
            await this.updateElementNextSibling(curr_element_last_child.id, next_siblings[0].id);
          await this.updateElementPrevSibling(
            next_siblings[0].id,
            curr_element_last_child ? curr_element_last_child.id : null,
          );
          const query = `
            UPDATE TABLE elements
              SET parent_id = $1, position = $2
            WHERE id = $3;
          `;
          next_siblings.map(async (sibling, index) => {
            let position = 5 * (index + 1);
            if (curr_element_last_child) position += curr_element_last_child.position;
            await client.query(query, [curr_element.id, position, sibling.id]);
          });
        }
      }
      if (parent.next_sibling_id) await this.updateElementPrevSibling(parent.next_sibling_id, curr_element.id);
      await this.updateElementNextSibling(curr_element.id, parent.next_sibling_id);
      await this.updateElementPrevSibling(curr_element.id, parent.id);
      await this.updateElementNextSibling(parent.id, curr_element.id);
      const query = `
        UPDATE TABLE elements
          SET parent_id = $1, position = $2, depth = $3
        WHERE id = $4;
      `;
      let position = parent.depth + 5;
      if (parent.next_sibling_id) {
        const parent_next_sibling: IElement = await this.getElementById(parent.next_sibling_id);
        position = parent.position + (parent_next_sibling.position - parent.position) / 2;
        const depth = parent.depth;
        const result = await client.query(query, [parent.parent_id, position, depth]);
        curr_element = result.rows[0];
      }
      const nested_children: IElement[] = await this.getNestedChildren(curr_element.id);
      await Promise.all(
        nested_children.map(async (child) => {
          const query = `
          UPDATE TABLE elements
            SET depth = $1
          WHERE id = $2;
        `;
          await client.query(query, [curr_element.depth + 1, child.id]);
        }),
      );
    } finally {
      client.release();
    }
  }
}
