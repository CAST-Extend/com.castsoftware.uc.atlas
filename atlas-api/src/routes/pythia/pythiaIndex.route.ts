import { Router } from 'express';
import PythiasArtemisRoute from './pythiasArtemis.route';

// Init router and path
const router = Router();
const pythiaArtemis = new PythiasArtemisRoute();

// Add sub-routes
router.use('/artemis', pythiaArtemis.router);


// Export the base-router
export default router;
