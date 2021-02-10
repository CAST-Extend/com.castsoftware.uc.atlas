import { Router } from 'express';
import FrameworksController from '@controllers/artemis/frameworks.controller';
import Route from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';


class FrameworksRoute implements Route {
  public path = '/frameworks';
  public router = Router();
  public frameworksController = new FrameworksController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:name(\\w+)`, authMiddleware, this.frameworksController.getFrameworkByName);
    this.router.put(`${this.path}/:name(\\w+)`, this.frameworksController.updateFramework);
    this.router.post(`${this.path}`, this.frameworksController.addFramework);
  }
}

export default FrameworksRoute;
