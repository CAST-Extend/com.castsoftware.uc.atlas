import { Router } from 'express';
import Route from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import FrameworksRoute from './artemis/frameworks.route';
import SynchronizerRoute from './synchronizer.route';

class IndexAPIRoute implements Route {
  // Init router and path
  public router = Router();
  private syncController = new SynchronizerRoute();
  private frameworkController = new FrameworksRoute();

  public path = '/api';

  constructor() {
    // Add sub-routes
    this.router.use(`${this.path}/repo`, authMiddleware, this.syncController.router);
    this.router.use(`${this.path}/artemis`, authMiddleware, this.frameworkController.router);
  }
}
// Export the base-router
export default IndexAPIRoute;
