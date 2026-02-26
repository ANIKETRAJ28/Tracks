import { Router } from 'express';

import { SlideController } from '../../controller/slide.controller';

const route = Router();
const slideController = new SlideController();

route.post('/', slideController.createSlide.bind(slideController));
route.get('/track/:id', slideController.getSlidesForTrack.bind(slideController));
route.get('/:id', slideController.getSlideById.bind(slideController));
route.patch('/:id', slideController.updateSlideTitle.bind(slideController));
route.delete('/:id', slideController.deleteSlide.bind(slideController));
export default route;
