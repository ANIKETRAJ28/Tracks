export interface ISlideRequest {
  track_id: string;
  title: string;
  position: number;
}

export interface ISlide extends ISlideRequest {
  id: string;
  created_at: Date;
  updated_at: Date;
}
