export interface ITrackRequest {
  title: string;
  description: string;
  cover_image?: string;
}

export interface ITrack extends ITrackRequest {
  id: string;
  created_at: Date;
  updated_at: Date;
}
