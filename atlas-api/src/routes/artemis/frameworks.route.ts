import { Router } from "express";
import FrameworksController from "@controller/artemis/frameworks.controller";
import Route from "@interfaces/routes.interface";

class FrameworksRoute implements Route {
  public path = "";
  public router = Router();
  public frameworksController = new FrameworksController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}/find/:name(\\w+)`,
      this.frameworksController.getFrameworkByName
    );

    this.router.get(
      `${this.path}/search/:name(\\w+)`,
      this.frameworksController.searchFrameworkByName
    );

    this.router.get(
      `${this.path}/total`,
      this.frameworksController.getNumberFrameworks
    );

    this.router.get(
      `${this.path}/batch`,
      this.frameworksController.getFrameworksBatch
    );

    this.router.get(
      `${this.path}/toValidate`,
      this.frameworksController.getFrameworksToValidate
    );

    this.router.get(
      `${this.path}/duplicates`,
      this.frameworksController.getDuplicateFrameworks
    );

    this.router.get(
      `${this.path}/autoClean`,
      this.frameworksController.autoClean
    );

    this.router.get(
      `${this.path}/internalTypes`,
      this.frameworksController.getFrameworksInternalType
    );

    this.router.post(
      `${this.path}/update`,
      this.frameworksController.updateFrameworks
    );

    this.router.post(
      `${this.path}/updateByID`,
      this.frameworksController.updateFrameworksByID
    );

    this.router.post(
      `${this.path}/add`,
      this.frameworksController.forceAddFramework
    );

    this.router.post(
      `${this.path}/delete`,
      this.frameworksController.deleteFrameworkTypeById
    );
    
    this.router.post(
      `${this.path}/toggle/validation`,
      this.frameworksController.toggleFrameworkTypeById
    );
  }
}

export default FrameworksRoute;
