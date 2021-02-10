import { NextFunction, Request, Response } from 'express';
import { CreateFrameworkDto } from '../../dtos/artemis/frameworks.dto';
import { Framework } from '../../interfaces/artemis/framework.interface';
import FrameworksService from '../../services/artemis/frameworks.service';
import SynchronizerService from '../../services/synchronizer/synchronizerConfig';
import { logger } from '../../utils/logger';

class FrameworksController {
  public frameworksService = new FrameworksService();

  public getFrameworkByName = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

      const name = String(req.params.name);
      let findFramework: Framework

      if(req.query.internalType) {
        // Request with internal
        const internalType: string = String(req.query.internalType).replace("+", " ");
        findFramework = await this.frameworksService.findFrameworkbyNameAndType(name, internalType);
      } else {
        // No internal type specified
        findFramework = await this.frameworksService.findFrameworkbyName(name);
      }
       
      if(findFramework == null) {
        res.status(404).send({ data: null, message: 'Not Found' });
      } else {
        res.status(200).json({ data: findFramework, message: 'findByName' });
      }
      
    } catch (error) {
      next(error);
    }
  };

  public addFramework = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const frameworksData: CreateFrameworkDto = req.body;
      logger.info("Incoming framework : ", req.body)
      const addedFramework: Framework = await this.frameworksService.addFramework(frameworksData);
      await SynchronizerService.getInstance().setLastUpdate();

      res.status(201).json({ data: addedFramework, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateFramework = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const name = String(req.params.name);
      const frameworksData: CreateFrameworkDto = req.body;

      const updatedFramework: Framework = await this.frameworksService.updateFramework(name, frameworksData);
      await SynchronizerService.getInstance().setLastUpdate();

      res.status(201).json({ data: updatedFramework, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };
}

export default FrameworksController;
