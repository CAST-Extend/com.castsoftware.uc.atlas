import { Router } from 'express';
import Route from '@interfaces/routes.interface';
import TagController from '@controller/configurations/tag.controller';


class TagRoute implements Route {
  public path = '';
  public router = Router();
  private tagController = new TagController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/framework`, this.tagController.getFrameworkTag);
    this.router.get(`${this.path}/level`, this.tagController.getLevelTag);
    this.router.get(`${this.path}/module`, this.tagController.getModuleTag);
  }
}

export default TagRoute;

