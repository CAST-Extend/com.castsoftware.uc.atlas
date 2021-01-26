import { NextFunction, Request, Response } from 'express';
import { CandidateResults } from 'src/interfaces/demeter/candidateResults.interface';
import { DemeterGroup } from 'src/interfaces/demeter/demeterGroup.interface';
import GroupingService from 'src/services/demeter/grouping.service';

class GroupingController {
  public groupingService = new GroupingService();

  /*
  * Level Section
  */

  public getCandidateLevelsApplication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const application = String(req.params.name);
      const results:CandidateResults[] = await this.groupingService.getCandidatesLevel(application);
      res.status(200).json({ data: results, message: 'candidates' });
    } catch (error) {
      next(error);
    }
  };

  public getDemeterLevelsApplication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const application = String(req.params.name);
      const results:DemeterGroup[] = await this.groupingService.getGroupedDemeterLevel(application);
      res.status(200).json({ data: results, message: 'grouped' });
    } catch (error) {
      next(error);
    }
  };


  /*
   * Module Section
   *
   */

  // Get Module candidates  
  public getCandidateModulesApplication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const application = String(req.params.name);
      const results:CandidateResults[] = await this.groupingService.getCandidatesModules(application);
      res.status(200).json({ data: results, message: 'candidates' });
    } catch (error) {
      next(error);
    }
  };

  // Get Demeter Modules
  public getDemeterModulesApplication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const application = String(req.params.name);
      const results:DemeterGroup[] = await this.groupingService.getGroupedDemeterModule(application);
      res.status(200).json({ data: results, message: 'grouped' });      
    } catch (error) {
      next(error);
    }
  };
}

export default GroupingController;
