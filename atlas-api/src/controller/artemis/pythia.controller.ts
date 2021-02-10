import PythiaService from '@services/artemis/pythias.service';
import { NextFunction, Request, Response } from 'express';

class PythiaController {
    private pythiaService = new PythiaService();
  
    public getLastUpdateBase = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
  
        const results: number = await this.pythiaService.getLastUpdateBase();
        res.status(200).json({ data: results, message: 'Last base update' });
        
      } catch (error) {
        next(error);
      }
    };

    public getLastUpdatePythia = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
    
          const results: number = await this.pythiaService.getLastUpdatePythia();
          res.status(200).json({ data: results, message: 'Last pythia update' });
          
        } catch (error) {
          next(error);
        }
      };

      public pullFramworks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
    
          const results: number = await this.pythiaService.pullFramworks();
          res.status(200).json({ data: results, message: 'Pull Framework' });
          
        } catch (error) {
          next(error);
        }
      };

      public getPullForecast = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
    
          const results: number = await this.pythiaService.getPullForecast();
          res.status(200).json({ data: results, message: 'Pull Framework Forecast' });
          
        } catch (error) {
          next(error);
        }
      };
  }
  
  export default PythiaController;