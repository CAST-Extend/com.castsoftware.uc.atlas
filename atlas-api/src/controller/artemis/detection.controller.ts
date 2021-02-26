import { NextFunction, Request, Response } from 'express';
import { LaunchDetectionDto } from '@dtos/artemis/detection.dto';
import { CancellablePromise, Detection, DetectionStatus } from '@interfaces/artemis/detectionStatus.interface';
import DetectionService from '@services/artemis/detection.service';
import { Framework } from '@interfaces/artemis/framework.interface';

class DetectionController {
  public detectionService:DetectionService = DetectionService.getInstance();

  public getStatusDetection = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

      const name = String(req.params.name);
      const results:Detection = this.detectionService.getDetectionStatus(name);
      
      res.status(200).send({ data: results, message: "status" });
      
    } catch (error) {
      next(error);
    }
  };

  public getSuccessfullDetections = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

      const results:Detection[] = this.detectionService.getSuccesfulDetections();
      
      res.status(200).send({ data: results, message: "success" });
      
    } catch (error) {
      next(error);
    }
  };

  public getPendingDetections = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

      const results:Detection[] = this.detectionService.getPendingDetections();
      
      res.status(200).send({ data: results, message: "pending" });
      
    } catch (error) {
      next(error);
    }
  };


  public getFailedDetections = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

      const results:Detection[] = this.detectionService.getFailedDetections();
      
      res.status(200).send({ data: results, message: "failed" });
      
    } catch (error) {
      next(error);
    }
  };

  public launchDetection = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const detectionParams:LaunchDetectionDto = req.body;
      const val:CancellablePromise<Framework[]> = this.detectionService.launchDetection(detectionParams.application, detectionParams.language);
      const b:boolean = (val != null);
      res.status(200).send({ data: b, message: "detection" });
      
    } catch (error) {
      next(error);
    }
  };

  public stopDetection = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const detectionParams:LaunchDetectionDto = req.body;
      const val:boolean = await this.detectionService.cancelDetection(detectionParams.application, detectionParams.language);
      
      res.status(200).send({ data: val, message: "cancelled" });
    } catch (error) {
      next(error);
    }
  };

}

export default DetectionController;
