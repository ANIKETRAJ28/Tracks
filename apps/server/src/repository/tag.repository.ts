import { DBClient, pool } from '@repo/db';
import { ITag } from '@repo/types';

export class TagRepository {
  private clientPool: DBClient;

  constructor() {
    this.clientPool = pool;
  }

  async createTag(name: string, metadata: object): Promise<ITag> {
    const client = await this.clientPool.connect();
    try {
      const query = `
        INSERT INTO tags
          (name, metadata)
          values ($1, $2)
        RETURNING *;
      `;
      const values = [name, metadata];
      const result = await client.query(query, values);
      const tag: ITag = result.rows[0];
      return tag;
    } finally {
      client.release();
    }
  }

  async getTagById(id: string): Promise<ITag> {
    const client = await this.clientPool.connect();
    try {
      const query = `
        SELECT * FROM tags
          WHERE id = $1;
      `;
      const values = [id];
      const result = await client.query(query, values);
      const tag: ITag = result.rows[0];
      return tag;
    } finally {
      client.release();
    }
  }

  async getTagByName(name: string): Promise<ITag> {
    const client = await this.clientPool.connect();
    try {
      const query = `
        SELECT * FROM tags
          WHERE name = $1;
      `;
      const values = [name];
      const result = await client.query(query, values);
      const tag: ITag = result.rows[0];
      return tag;
    } finally {
      client.release();
    }
  }

  async updateTagName(id: string, name: string) {
    const client = await this.clientPool.connect();
    try {
      const query = `
        ALTER TABLE tags
          SET name = $1
          WHERE id = $2
        RETURNING *;
      `;
      const values = [name, id];
      const result = await client.query(query, values);
      const tag: ITag = result.rows[0];
      return tag;
    } finally {
      client.release();
    }
  }

  async getTags(): Promise<ITag[]> {
    const client = await this.clientPool.connect();
    try {
      const query = `SELECT * FROM tags;`;
      const result = await client.query(query);
      const tags: ITag[] = result.rows;
      return tags;
    } finally {
      client.release();
    }
  }

  async deleteTagById(id: string): Promise<void> {
    const client = await this.clientPool.connect();
    try {
      const query = `
        DELETE FROM tags
          WHERE id = $1;
      `;
      const values = [id];
      await client.query(query, values);
      return;
    } finally {
      client.release();
    }
  }
}
