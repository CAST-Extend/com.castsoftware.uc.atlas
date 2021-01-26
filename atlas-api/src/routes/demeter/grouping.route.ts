import { Router } from 'express';
import GroupingController from 'src/controller/demeter/grouping.controller';
import Route from '../../interfaces/routes.interface';


class GroupingRoute implements Route {
  public path = '';
  public router = Router();
  private groupingController = new GroupingController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/levels/:name(\\w+)/candidates`, this.groupingController.getCandidateLevelsApplication);
    this.router.get(`${this.path}/levels/:name(\\w+)/grouped`, this.groupingController.getDemeterLevelsApplication);


    this.router.get(`${this.path}/modules/:name(\\w+)/candidates`, this.groupingController.getCandidateModulesApplication);
    this.router.get(`${this.path}/modules/:name(\\w+)/grouped`, this.groupingController.getDemeterModulesApplication);
  }
}

export default GroupingRoute;

