import { NextFunction, Request, Response } from 'express';
import { LaunchDetectionDto } from '@dtos/artemis/detection.dto';
import { CancellablePromise, Detection, DetectionStatus } from '@interfaces/artemis/detectionStatus.interface';
import { Framework } from '@interfaces/artemis/framework.interface';
import { DetectionQueueAssistant } from 'src/assistants/detectionQueue.assistant';
import { DetectionCandidate } from '@dtos/artemis/detectionCandidate.dto';
import { logger } from '@shared/logger';

class DetectionQueueController {
  public detectionQueueAssistant:DetectionQueueAssistant = DetectionQueueAssistant.getInstance();

  public addCandidates = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let toAdd: DetectionCandidate[];
      if(req.body.candidates && Array.isArray(req.body.candidates)) {
        toAdd = req.body.candidates;
      }
        
      for(const can in toAdd) {
          this.detectionQueueAssistant.addCandidate(toAdd[can]);
      }

      res.status(200).send({ data: toAdd.length, message: "status" });
      
    } catch (error) {
      next(error);
    }
  };

  public flush = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

    this.detectionQueueAssistant.flushCandidates()
    res.status(200).send({ data: true, message: "Flushed" });
      
    } catch (error) {
      next(error);
    }
  };

  public getCurrent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

    const current = this.detectionQueueAssistant.getCurrent()
    res.status(200).send({ data: current, message: "Current" });
      
    } catch (error) {
      next(error);
    }
  };

  public getQueue = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

      const results:DetectionCandidate[] = this.detectionQueueAssistant.getQueue();
      
      res.status(200).send({ data: results, message: "Queue" });
      
    } catch (error) {
      next(error);
    }
  };


}

export default DetectionQueueController;
