export interface ITagRequest {
  name: string;
  metadata: object;
}

export interface ITag extends ITagRequest {
  id: string;
  created_at: Date;
  updated_at: Date;
}
