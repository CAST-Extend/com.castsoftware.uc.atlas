import { Router } from "express";
import FrameworkAssistantRoute from "./frameworkAssistants.route";

// Init router and path
const router = Router();
const frameworks = new FrameworkAssistantRoute();

// Add sub-routes
router.use('/frameworks', frameworks.router);


// Export the base-router
export default router;
