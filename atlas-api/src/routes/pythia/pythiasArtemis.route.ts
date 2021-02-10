import { Router } from 'express';
import Route from '@interfaces/routes.interface';
import PythiaController from '@controller/artemis/pythia.controller';


class PythiasArtemisRoute implements Route {
  public path = '';
  public router = Router();
  public pythiaController = new PythiaController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {    
    this.router.get(`${this.path}/local/lastUpdate`, this.pythiaController.getLastUpdateBase);
    this.router.get(`${this.path}/remote/lastUpdate`, this.pythiaController.getLastUpdatePythia);
    this.router.get(`${this.path}/remote/pull`, this.pythiaController.pullFramworks);
    this.router.get(`${this.path}/remote/forecast/pull`, this.pythiaController.getPullForecast);
  }
}

export default PythiasArtemisRoute;

