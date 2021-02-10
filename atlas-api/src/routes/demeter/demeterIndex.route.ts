import { Router } from 'express';
import DemeterRoute from './demeter.route';
import GroupingRoute from './grouping.route';
import LevelRoute from './level.route';

// Init router and path
const router = Router();
const groupingRoutes = new GroupingRoute();
const demeterRoutes = new DemeterRoute();
const levelRoutes = new LevelRoute();

// Add sub-routes
router.use('/grouping', groupingRoutes.router);
router.use('/levels', levelRoutes.router);
router.use('/utils', demeterRoutes.router);


// Export the base-router
export default router;
