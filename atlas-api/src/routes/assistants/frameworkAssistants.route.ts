
import { Router } from 'express';
import Route from '@interfaces/routes.interface';
import AssistantController from '@controller/atlas/assistant.controller';



class FrameworkAssistantRoute implements Route {
  public path = '';
  public router = Router();
  private frameworkAssistant = new AssistantController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/candidates`, this.frameworkAssistant.getCandidateList);
    this.router.post(`${this.path}/new`, this.frameworkAssistant.createNew);
    this.router.get(`${this.path}/all`, this.frameworkAssistant.getAssistants);
    this.router.delete(`${this.path}/remove/:id`, this.frameworkAssistant.deleteWithId);
    this.router.get(`${this.path}/options/categories`, this.frameworkAssistant.getFrameworkCategories);
    this.router.get(`${this.path}/options/actions`, this.frameworkAssistant.getDemeterActions);
  }
}

export default FrameworkAssistantRoute;

