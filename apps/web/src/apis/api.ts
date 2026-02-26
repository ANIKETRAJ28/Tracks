import { ISlide, ISlideRequest, ITrack } from '@repo/types';

import { axiosInstance } from '../config/axiosConfig';

export async function getTracks(): Promise<ITrack[]> {
  const response = await axiosInstance.get('tracks');
  return response.data.tracks;
}

export async function createTrack(title: string, description: string): Promise<ITrack> {
  const response = await axiosInstance.post('tracks', { title, description });
  return response.data.track;
}

export async function getTrackWithSlides(id: string): Promise<{ track: ITrack; slides: ISlide[] }> {
  const response = await axiosInstance.get(`tracks/${id}`);
  return response.data.trackWithSlide;
}

export async function createSlide(reqData: ISlideRequest): Promise<ISlide> {
  const response = await axiosInstance.post('slides', { ...reqData });
  return response.data.slide;
}
