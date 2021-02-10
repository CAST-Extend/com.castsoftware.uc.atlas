import { Router } from 'express';
import Route from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import SynchronizerController from '@controllers/synchronizer.controller';


class SynchronizerRoute implements Route {
  public path = '';
  public router = Router();
  public synchController = new SynchronizerController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/lastUpdate`, authMiddleware, this.synchController.getLastUpdate);
    this.router.get(`${this.path}/pull`, authMiddleware, this.synchController.pullFrameworks);
    this.router.get(`${this.path}/forecast/pull`, authMiddleware, this.synchController.pullFrameworksForecast);

  }
}

export default SynchronizerRoute;
