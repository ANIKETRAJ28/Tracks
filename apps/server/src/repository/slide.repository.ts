import { DBClient, pool } from '@repo/db';
import { ISlide } from '@repo/types';

export class SlideRepository {
  private clientPool: DBClient;

  constructor() {
    this.clientPool = pool;
  }

  async createSlide(title: string, track_id: string, position: number) {
    const client = await this.clientPool.connect();
    try {
      const query = `
        INSERT INTO slides
          (title, track_id, position)
          VALUES ($1, $2, $3)
        RETURNING *;
      `;
      const values = [title, track_id, position];
      const result = await client.query(query, values);
      const slide = result.rows[0];
      return slide;
    } finally {
      client.release();
    }
  }

  async getSlideById(id: string): Promise<ISlide> {
    const client = await this.clientPool.connect();
    try {
      const query = `
        SELECT * FROM slides 
          WHERE id = $1;
      `;
      const values = [id];
      const result = await client.query(query, values);
      const slide: ISlide = result.rows[0];
      return slide;
    } finally {
      client.release();
    }
  }

  async updateSlideTitle(id: string, title: string): Promise<ISlide> {
    const client = await this.clientPool.connect();
    try {
      const query = `
        UPDATE TABLE slides
          SET title = $1
          WHERE id = $2;
        RETURNING *;
      `;
      const values = [title, id];
      const result = await client.query(query, values);
      const slide: ISlide = result.rows[0];
      return slide;
    } finally {
      client.release();
    }
  }

  async deleteSlide(id: string): Promise<void> {
    const client = await this.clientPool.connect();
    try {
      const query = `
        DELETE FROM slides
          WHERE id = $1;
      `;
      await client.query(query, [id]);
    } finally {
      client.release();
    }
  }

  async getSlidesForTrack(track_id: string): Promise<ISlide[]> {
    const client = await this.clientPool.connect();
    try {
      const query = `
        SELECT * FROM slides
          WHERE track_id = $1
        ORDER BY position;
      `;
      const result = await client.query(query, [track_id]);
      const slides: ISlide[] = result.rows;
      return slides;
    } finally {
      client.release();
    }
  }
}
