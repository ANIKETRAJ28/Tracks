/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.sql(`
    CREATE TABLE slides (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      track_id UUID REFERENCES tracks(id),
      title TEXT NOT NULL,
      position NUMERIC(20,10) NOT NULL,
      created_at TIMESTAMP DEFAULT now(),
      updated_at TIMESTAMP DEFAULT now()
    );
  `);

  pgm.sql(`
    CREATE INDEX idx_slides_track_position
    ON slides(track_id, position);
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.sql(`DROP INDEX IF EXISTS idx_slides_track_position;`);
  pgm.sql(`DROP TABLE IF EXISTS slides;`);
};
