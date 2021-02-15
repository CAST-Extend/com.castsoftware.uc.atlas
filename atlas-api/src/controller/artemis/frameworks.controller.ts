import { NextFunction, Request, Response } from 'express';
import { Framework } from '@interfaces/artemis/framework.interface';
import FrameworksService from '@services/artemis/framework.service';
import { CreateFrameworkDto } from '@dtos/artemis/frameworks.dto';

class FrameworksController {
  public frameworksService = new FrameworksService();

  // Get a specific framework by its name
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

  // Search  for a string in the frameworks names
  public searchFrameworkByName = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

      let name = String(req.params.name);
      name = name.replace("+", " ");

      const resultsSearch: Framework[] = await this.frameworksService.searchFrameworkByName(name);
      console.log("Frameworks found :", resultsSearch.length)

      if(resultsSearch.length == 0) {
        res.status(404).send({ data: null, message: 'Not Found' });
      } else {
        res.status(200).json({ data: resultsSearch, message: 'Search' });
      }
      
    } catch (error) {
      next(error);
    }
  };


  // Get the number of frameworks in the database ( Filter on internal type )
  public getNumberFrameworks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let num: number;

      if(req.query.internalType) {
        // Request with internal type
        const internalType: string = String(req.query.internalType).replace("+", " ");
        num = await this.frameworksService.getNumberFrameworksWithInternalType(internalType);
      } else {
        // No internal type specified
        num = await this.frameworksService.getNumberFrameworks();
      }
       
      res.status(200).send({ data: num, message: 'Number of frameworks' });
    } catch (error) {
      next(error);
    }
  }

  // Get the number of frameworks in the database ( Filter on internal type )
  // Req params : start:number, stop: number, internal:type
  public getFrameworksBatch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const start: number = req.query.start ? Number(req.query.start) : 0;
      const stop: number = req.query.stop ? Number(req.query.stop) : 10;
      let frameworks: Framework[];

      if(req.query.internalType) {
        // Request with internal type
        const internalType: string = String(req.query.internalType).replace("+", " ");
        frameworks = await this.frameworksService.getFrameworksBatch(start, stop, internalType);
      } else {
        // No internal type specified
        frameworks = await this.frameworksService.getFrameworksBatch(start, stop);
      }
       
      res.status(200).send({ data: frameworks, message: 'Batch' });
    } catch (error) {
      next(error);
    }
  }

  // To validate frameworks
  public getFrameworksToValidate= async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const frameworks: Framework[] = await this.frameworksService.getToValidateFrameworks();
      res.status(200).send({ data: frameworks, message: 'To validate' });
    } catch (error) {
      next(error);
    }
  }

  // Get internal types
  public getFrameworksInternalTypes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
    
      const types:string[] = await this.frameworksService.getFrameworksInternalTypes();
      res.status(200).send({ data: types, message: 'Internal types' });
    } catch (error) {
      next(error);
    }
  }

  // Update frameworks
  public updateFrameworks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const oldName = String(req.body.oldName);
      const oldInternalType = String(req.body.oldInternalType);
      const frameworkData : CreateFrameworkDto = Object.assign({}, req.body.framework);
      
      const results: boolean = await this.frameworksService.updateFramework(oldName, oldInternalType, frameworkData);
      if(results) {
        res.status(200).send({ data: frameworkData, message: 'Updated' });
      } else {
        res.status(404).send({ data: null, message: 'Updated' });
      }
    } catch (error) {
      next(error);
    }
  }

}

export default FrameworksController;
