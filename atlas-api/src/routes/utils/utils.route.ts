import { Router } from 'express';
import Route from '@interfaces/routes.interface';
import UtilsController from '@controller/utils/utils.controller';


class UtilsRoute implements Route {
  public path = '';
  public router = Router();
  public utilsController = new UtilsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {    
    this.router.get(`${this.path}`, this.utilsController.healthCheck);
  }
}

export default UtilsRoute;

