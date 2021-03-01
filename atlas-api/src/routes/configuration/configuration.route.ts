import ConfigurationController from "@controller/configurations/configuration.controller";
import Route from "@interfaces/routes.interface";
import { Router } from "express";

class ConfigurationRoute implements Route {
    public path = '';
    public router = Router();
    private configController = new ConfigurationController();
  
    constructor() {
      this.initializeRoutes();
    }
  
    private initializeRoutes() {
      this.router.get(`${this.path}/pythia/uri`, this.configController.getPythiaURI);
      this.router.post(`${this.path}/pythia/uri`, this.configController.setPythiaURI);

      this.router.get(`${this.path}/pythia/token`, this.configController.getPythiaTokenPresence);
      this.router.post(`${this.path}/pythia/token`, this.configController.setPythiaURI);


      this.router.get(`${this.path}/artemis/workspace`, this.configController.getArtemisWorkspace);
      this.router.post(`${this.path}/artemis/workspace`, this.configController.setArtemisWorkspace);
      this.router.get(`${this.path}/artemis/internalMode`, this.configController.getInternalMode);
      this.router.post(`${this.path}/artemis/internalMode`, this.configController.setInternalMode);

      this.router.get(`${this.path}/demeter/workspace`, this.configController.getDemeterWorkspace);
      this.router.post(`${this.path}/demeter/workspace`, this.configController.setDemeterWorkspace);
    }
  }
  
  export default ConfigurationRoute;
  