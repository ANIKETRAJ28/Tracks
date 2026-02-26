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
    CREATE TABLE elements (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tag_id UUID NOT NULL REFERENCES tags(id),
      slide_id UUID NOT NULL REFERENCES slides(id) ON DELETE CASCADE,
      track_id UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
      parent_id UUID REFERENCES elements(id),
      position NUMERIC(20,10) NOT NULL,
      depth INT DEFAULT 0,
      content JSONB,
      decorator JSONB DEFAULT '{}'::jsonb,
      style JSONB DEFAULT '{}'::jsonb,
      metadata JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMP DEFAULT now(),
      updated_At TIMESTAMP DEFAULT now()
    );
  `);

  pgm.sql(`
    CREATE INDEX idx_elements_track_slide_parent_pos
    ON elements(track_id, slide_id, parent_id, position);
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.sql(`DROP INDEX IF EXISTS idx_elements_track_slide_parent_pos;`);
  pgm.sql(`DROP TABLE IF EXISTS elements;`);
};
