import { Router } from 'express';

import { TrackController } from '../../controller/track.controller';

const route = Router();
const trackController = new TrackController();

route.get('/', trackController.getTracks.bind(trackController));
route.get('/:id', trackController.getTrackWithSlides.bind(trackController));
route.post('/', trackController.createTrack.bind(trackController));

export default route;
