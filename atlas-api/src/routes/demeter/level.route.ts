import { Router } from 'express';
import GroupingController from '@controller/demeter/grouping.controller';
import Route from '@interfaces/routes.interface';
import LevelController from '@controller/demeter/level.controller';


class LevelRoute implements Route {
  public path = '';
  public router = Router();
  private levelController = new LevelController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // GET
    this.router.get(`${this.path}/:name(\\w+)/candidates`, this.levelController.getCandidateLevelsApplication);
    this.router.get(`${this.path}/:name(\\w+)/grouped`, this.levelController.getDemeterLevelsApplication);
    this.router.get(`${this.path}/:name(\\w+)/all`, this.levelController.getAllLevels5);

    // POST
    this.router.post(`${this.path}/:name(\\w+)/group`, this.levelController.executeLevelGrouping);
    this.router.post(`${this.path}/:name(\\w+)/undo`, this.levelController.undoOneLevel);
    this.router.post(`${this.path}/:name(\\w+)/rename`, this.levelController.renameLevel);
  }
}

export default LevelRoute;

