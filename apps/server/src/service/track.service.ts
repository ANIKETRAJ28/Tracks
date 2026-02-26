import { ISlide, ITrack, ITrackRequest } from '@repo/types';

import { SlideRepository } from '../repository/slide.repository';
import { TrackRepository } from '../repository/track.repository';

export class TrackService {
  private trackRepository: TrackRepository;
  private slideRepository: SlideRepository;

  constructor() {
    this.trackRepository = new TrackRepository();
    this.slideRepository = new SlideRepository();
  }

  async createTrack(reqObj: ITrackRequest): Promise<ITrack> {
    return await this.trackRepository.createTrack(reqObj);
  }

  async getTrackById(id: string): Promise<ITrack> {
    return await this.trackRepository.getTrackById(id);
  }

  async getTrackWithSlides(id: string): Promise<{ track: ITrack; slides: ISlide[] }> {
    const track: ITrack = await this.trackRepository.getTrackById(id);
    const slides: ISlide[] = await this.slideRepository.getSlidesForTrack(id);
    return { track, slides };
  }

  async getAllTracks(): Promise<ITrack[]> {
    return await this.trackRepository.getAllTracks();
  }

  async getAllTracksWithOffset(offset: number): Promise<ITrack[]> {
    return await this.trackRepository.getAllTracksWithOffset(offset);
  }

  async getTrackByFilter(filter: string): Promise<ITrack[]> {
    return await this.trackRepository.getTrackByFilter(filter);
  }

  async updateTrackTitle(id: string, title: string): Promise<ITrack> {
    return await this.trackRepository.updateTrackTitle(id, title);
  }

  async updateTrackDescription(id: string, description: string): Promise<ITrack> {
    return await this.trackRepository.updateTrackDescription(id, description);
  }

  async updateCoverImage(id: string, image: string): Promise<ITrack> {
    return await this.trackRepository.updateCoverImage(id, image);
  }

  async deleteTrack(id: string): Promise<void> {
    return await this.trackRepository.deleteTrack(id);
  }
}
