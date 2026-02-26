export interface IElementRequest {
  slide_id: string;
  track_id: string;
  tag_id: string;
  parent_id: string | null;
  prev_sibling_id: string | null;
  next_sibling_id: string | null;
  content: string;
}

export interface IElement extends IElementRequest {
  id: string;
  position: number;
  depth: number;
  metadata: object;
  decorator: object;
  created_at: Date;
  updated_at: Date;
}
