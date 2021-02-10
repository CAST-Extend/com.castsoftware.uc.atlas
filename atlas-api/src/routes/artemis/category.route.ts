import { Router } from 'express';
import Route from '@interfaces/routes.interface';
import CategoryController from '@controller/artemis/category.controller';


class CategoryRoute implements Route {
  public path = '';
  public router = Router();
  public categoryController = new CategoryController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {    
    this.router.get(`${this.path}/all`, this.categoryController.getAllNodes);
    this.router.post(`${this.path}`, this.categoryController.addNode);
    this.router.put(`${this.path}`, this.categoryController.updateNode);
    this.router.delete(`${this.path}/:id`, this.categoryController.deleteNode);
  }
}

export default CategoryRoute;

