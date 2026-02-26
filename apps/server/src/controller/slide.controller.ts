import { ISlide, ISlideRequest } from '@repo/types';
import { Request, Response } from 'express';

import { SlideService } from '../service/slide.service';

export class SlideController {
  private slideService: SlideService;

  constructor() {
    this.slideService = new SlideService();
  }

  async createSlide(req: Request, res: Response): Promise<void> {
    try {
      const reqPayload: ISlideRequest = req.body;
      const slide: ISlide = await this.slideService.createSlide(reqPayload);
      res.status(201).json({ slide });
    } catch (error) {
      console.log(error);
    }
  }

  async getSlideById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const slide: ISlide = await this.slideService.getSlideById(id);
      res.status(200).json({ slide });
    } catch (error) {
      console.log(error);
    }
  }

  async getSlidesForTrack(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const slides: ISlide[] = await this.slideService.getSlidesForTrack(id);
      res.status(200).json({ slides });
    } catch (error) {
      console.log(error);
    }
  }

  async updateSlideTitle(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const { title }: { title: string } = req.body;
      const slide = await this.slideService.updateSlideTitle(id, title);
      res.status(201).json({ slide });
    } catch (error) {
      console.log(error);
    }
  }

  async deleteSlide(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      await this.slideService.deleteSlide(id);
      res.json({ message: 'Slide deleted successfully' });
    } catch (error) {
      console.log(error);
    }
  }
}
