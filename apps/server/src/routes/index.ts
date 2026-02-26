import { Router } from 'express';

import slideRoute from './v1_route/slide.route';
import trackRoute from './v1_route/track.route';

export const v1Routes = Router();

v1Routes.use('/tracks', trackRoute);
v1Routes.use('/slides', slideRoute);
