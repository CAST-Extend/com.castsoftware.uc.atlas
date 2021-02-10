import { NextFunction, Request, Response } from 'express';
import ExtensionService from "@services/atlas/extension.service";

class ExtensionController {
    private extensionService = new ExtensionService();
  
    public getValidityDemeter= async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
  
        const valid: boolean = await this.extensionService.verifyDemeterVersion();
        res.status(200).json({ data: valid, message: 'Demeter validity' });
        
      } catch (error) {
        next(error);
      }
    };

    public getValidityArtemis= async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
    
          const valid: boolean = await this.extensionService.verifyDemeterVersion();
          res.status(200).json({ data: valid, message: 'Artemis validity' });
          
        } catch (error) {
          next(error);
        }
      };
  }
  
  export default ExtensionController;