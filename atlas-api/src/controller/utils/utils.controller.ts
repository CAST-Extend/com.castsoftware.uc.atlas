import { NextFunction, Request, Response } from 'express';
import UtilsService from '@services/utils/utils.service';

class UtilsController {
    private utilService = new UtilsService();
  
    public healthCheck= async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        res.set('Cache-Control', 'no-store')
        const status = this.utilService.healthCheck();
        res.status(200).json({ data: status, message: 'Status' });
        
      } catch (error) {
        next(error);
      }
    };
  }
  
  export default UtilsController;