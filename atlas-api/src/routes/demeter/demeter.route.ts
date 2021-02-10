import { Router } from 'express';
import Route from '@interfaces/routes.interface';
import DemeterController from '@controller/demeter/demeter.controller';


class DemeterRoute implements Route {
  public path = '';
  public router = Router();
  public demeterController = new DemeterController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {    
    this.router.get(`${this.path}/version`, this.demeterController.getVersion);
  }
}

export default DemeterRoute;

