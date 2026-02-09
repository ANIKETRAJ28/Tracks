export interface ISlideRequest {
  track_id: string;
  title: string;
}

export interface ISlide extends ISlideRequest {
  id: string;
  position: number;
  created_at: Date;
  updated_at: Date;
}
