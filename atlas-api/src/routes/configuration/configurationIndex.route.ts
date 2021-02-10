import { Router } from 'express';
import ConfigurationRoute from './configuration.route';
import TagRoute from './tag.route';

// Init router and path
const router = Router();
const appRoutes = new TagRoute();
const configRoute = new ConfigurationRoute();

// Add sub-routes
router.use('/tags', appRoutes.router);
router.use('/parameters', configRoute.router);


// Export the base-router
export default router;
