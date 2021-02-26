import { Router } from 'express';
import DetectionController from '@controller/artemis/detection.controller';
import Route from '@interfaces/routes.interface';
import DetectionQueueController from '@controller/artemis/detectionQueue.controller';


class DetectionRoute implements Route {
  public path = '';
  public router = Router();
  public detectionsController = new DetectionController();
  public detectionQueueController = new DetectionQueueController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {    
    this.router.get(`${this.path}/status/:name(\\w+)`, this.detectionsController.getStatusDetection);
    this.router.get(`${this.path}/successes`, this.detectionsController.getSuccessfullDetections);
    this.router.get(`${this.path}/pending`, this.detectionsController.getPendingDetections);
    this.router.get(`${this.path}/failed`, this.detectionsController.getFailedDetections);
    this.router.post(`${this.path}/launch`, this.detectionsController.launchDetection);
    this.router.post(`${this.path}/stop`, this.detectionsController.stopDetection);
    this.router.post(`${this.path}/queue/add`, this.detectionQueueController.addCandidates);
    this.router.get(`${this.path}/queue/get`, this.detectionQueueController.getQueue);
    this.router.get(`${this.path}/queue/flush`, this.detectionQueueController.flush);
    this.router.get(`${this.path}/queue/current`, this.detectionQueueController.getCurrent);
  }
}

export default DetectionRoute;

