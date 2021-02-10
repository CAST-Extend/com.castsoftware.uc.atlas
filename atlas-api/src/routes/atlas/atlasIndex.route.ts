import { Router } from 'express';
import AgentRoute from './agent.route';
import ExtensionRoute from './extension.route';

// Init router and path
const router = Router();
const extensionRoute = new ExtensionRoute();
const agentRoute = new AgentRoute();

// Add sub-routes
router.use('/extensions', extensionRoute.router);
router.use('/agents', agentRoute.router);


// Export the base-router
export default router;
