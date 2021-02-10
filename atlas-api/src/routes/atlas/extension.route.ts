import { Router } from 'express';
import Route from '@interfaces/routes.interface';
import ExtensionController from '@controller/atlas/extension.controller';
import ArtemisController from '@controller/artemis/artemis.controller';
import DemeterController from '@controller/demeter/demeter.controller';


class ExtensionRoute implements Route {
  public path = '';
  public router = Router();
  private extensionController = new ExtensionController();
  public artemisController = new ArtemisController();
  public demeterController = new DemeterController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/demeter/version`, this.demeterController.getVersion);
    this.router.get(`${this.path}/demeter/validity`, this.extensionController.getValidityDemeter);
    this.router.get(`${this.path}/artemis/version`, this.artemisController.getVersion);
    this.router.get(`${this.path}/artemis/validity`, this.extensionController.getValidityArtemis);
  }
}

export default ExtensionRoute;

