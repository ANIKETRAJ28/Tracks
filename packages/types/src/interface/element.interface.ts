export interface IElement {
  id: string;
  slide_id: string;
  track_id: string;
  tag_id: string;
  parent_id: string;
  position: number;
  depth: number;
  metadata: object;
  content: string;
  style: object;
  decorator: object;
  created_at: Date;
  updated_at: Date;
}
