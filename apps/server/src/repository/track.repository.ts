import { DBClient, pool } from '@repo/db';
import { ITrack, ITrackRequest } from '@repo/types';

export class TrackRepository {
  private clientPool: DBClient;

  constructor() {
    this.clientPool = pool;
  }

  async createTrack(reqObj: ITrackRequest): Promise<ITrack> {
    const client = await this.clientPool.connect();
    try {
      let query = `
          INSERT INTO tracks
            (title, description)
            VALUES ($1, $2)
          RETURNING *;
      `;
      const values = [reqObj.title, reqObj.description];
      const result = await client.query(query, values);
      let track: ITrack = result.rows[0];
      if (reqObj.cover_image) {
        query = `
          UPDATE tracks
            SET cover_image = $1
            WHERE id = $2
          RETURNING *;
        `;
        track = await this.updateCoverImage(result.rows[0].id, reqObj.cover_image);
      }
      return track;
    } finally {
      client.release();
    }
  }

  async getTrackById(id: string): Promise<ITrack> {
    const client = await this.clientPool.connect();
    try {
      const query = `
        SELECT * FROM tracks
          WHERE id = $1;
      `;
      const values = [id];
      const result = await client.query(query, values);
      const tracks: ITrack = result.rows[0];
      return tracks;
    } finally {
      client.release();
    }
  }

  async getAllTracks(): Promise<ITrack[]> {
    const client = await this.clientPool.connect();
    try {
      const query = `
        SELECT * FROM tracks
          ORDER BY created_at DESC;
      `;
      const result = await client.query(query);
      const tracks: ITrack[] = result.rows;
      return tracks;
    } finally {
      client.release();
    }
  }

  async getAllTracksWithOffset(offset: number): Promise<ITrack[]> {
    const client = await this.clientPool.connect();
    try {
      const query = `
        SELECT * FROM tracks
          ORDER BY created_at DESC 
          LIMIT 10
          OFFSET $1;
      `;
      const values = [offset];
      const result = await client.query(query, values);
      const tracks: ITrack[] = result.rows;
      return tracks;
    } finally {
      client.release();
    }
  }

  async getTrackByFilter(filter: string): Promise<ITrack[]> {
    const client = await this.clientPool.connect();
    try {
      const query = `
        SELECT * FROM tracks
          WHERE 
            title LIKE $1 
            OR title LIKE $2
            OR title LIKE $3;
      `;
      const values = [`${filter}%`, `%${filter}`, `%${filter}%`];
      const result = await client.query(query, values);
      const tracks: ITrack[] = result.rows;
      return tracks;
    } finally {
      client.release();
    }
  }

  async updateTrackTitle(id: string, title: string): Promise<ITrack> {
    const client = await this.clientPool.connect();
    try {
      const query = `
        UPDATE TABLE tracks
          SET title = $1
          WHERE id = $2
        RETURNING *;
      `;
      const values = [title, id];
      const result = await client.query(query, values);
      const track: ITrack = result.rows[0];
      return track;
    } finally {
      client.release();
    }
  }

  async updateTrackDescription(id: string, description: string): Promise<ITrack> {
    const client = await this.clientPool.connect();
    try {
      const query = `
        UPDATE TABLE tracks
          SET description = $1
          WHERE id = $2
        RETURNING *;
      `;
      const values = [description, id];
      const result = await client.query(query, values);
      const track: ITrack = result.rows[0];
      return track;
    } finally {
      client.release();
    }
  }

  async updateCoverImage(id: string, image: string): Promise<ITrack> {
    const client = await this.clientPool.connect();
    try {
      const query = `
        UPDATE TABLE tracks
          SET cover_image = $1
          WHERE id = $2
        RETURNING *;
      `;
      const values = [image, id];
      const result = await client.query(query, values);
      const track: ITrack = result.rows[0];
      return track;
    } finally {
      client.release();
    }
  }

  async deleteTrack(id: string): Promise<void> {
    const client = await this.clientPool.connect();
    try {
      const query = `
        DELETE FROM tracks
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
