import { ISlide, ITrack, ITrackRequest } from '@repo/types';
import { Request, Response } from 'express';

import { TrackService } from '../service/track.service';

export class TrackController {
  private trackService: TrackService;

  constructor() {
    this.trackService = new TrackService();
  }

  async getTracks(_req: Request, res: Response): Promise<void> {
    try {
      const tracks: ITrack[] = await this.trackService.getAllTracks();
      res.status(200).json({ tracks });
    } catch (error) {
      console.log(error);
    }
  }

  async createTrack(req: Request, res: Response): Promise<void> {
    try {
      const reqPayload: ITrackRequest = req.body;
      const track = await this.trackService.createTrack(reqPayload);
      res.status(200).json({ track });
    } catch (error) {
      console.log(error);
    }
  }

  async getTrackWithSlides(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const trackWithSlide: { track: ITrack; slides: ISlide[] } = await this.trackService.getTrackWithSlides(id);
      res.status(200).json({ trackWithSlide });
    } catch (error) {
      console.log(error);
    }
  }
}
