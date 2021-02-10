import { NextFunction, Request, Response } from 'express';
import DemeterService from '@services/demeter/demeter.service';


class DemeterController {
    private artemisService = new DemeterService();
  
    public getVersion= async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
  
        const version: string = await this.artemisService.getVersion();
        res.status(200).json({ data: version, message: 'version' });
        
      } catch (error) {
        next(error);
      }
    };
  }
  
  export default DemeterController;