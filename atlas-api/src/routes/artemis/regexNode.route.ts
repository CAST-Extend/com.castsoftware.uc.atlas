import { Router } from 'express';
import Route from '@interfaces/routes.interface';
import RegexNodeController from '@controller/artemis/regexNode.controller';


class RegexNodeRoute implements Route {
  public path = '';
  public router = Router();
  public regexController = new RegexNodeController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/all`, this.regexController.getAllNodes);
    this.router.post(`${this.path}/add`, this.regexController.addNode);
    this.router.put(`${this.path}/update`, this.regexController.updateNode);
    this.router.delete(`${this.path}/:id`, this.regexController.deleteNode);
    this.router.get(`${this.path}/:id/test`, this.regexController.testNode);
    this.router.get(`${this.path}/:id/request`, this.regexController.getRegexRequest);
  }
}

export default RegexNodeRoute;


