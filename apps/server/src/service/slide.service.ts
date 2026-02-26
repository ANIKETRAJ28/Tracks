import { ISlide, ISlideRequest } from '@repo/types';

import { SlideRepository } from '../repository/slide.repository';

export class SlideService {
  private slideRepositry: SlideRepository;

  constructor() {
    this.slideRepositry = new SlideRepository();
  }

  async createSlide(data: ISlideRequest): Promise<ISlide> {
    return await this.slideRepositry.createSlide(data.title, data.track_id, data.position);
  }

  async getSlideById(id: string): Promise<ISlide> {
    return await this.getSlideById(id);
  }

  async updateSlideTitle(id: string, title: string): Promise<ISlide> {
    return await this.slideRepositry.updateSlideTitle(id, title);
  }

  async deleteSlide(id: string): Promise<void> {
    return await this.slideRepositry.deleteSlide(id);
  }

  async getSlidesForTrack(track_id: string): Promise<ISlide[]> {
    return await this.slideRepositry.getSlidesForTrack(track_id);
  }
}
