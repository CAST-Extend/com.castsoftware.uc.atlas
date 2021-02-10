import { NextFunction, Request, Response } from 'express';
import { CandidateResults } from "@interfaces/demeter/candidateResults.interface";
import LevelService from "@services/demeter/level.service";
import { DemeterGroup } from '@interfaces/demeter/demeterGroup.interface';
import { Level5Group } from '@interfaces/demeter/level.interface';

export default class LevelController {
    public levelService = new LevelService();

    
  /*
  * Level Section
  */

  public getCandidateLevelsApplication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const application = String(req.params.name);
      const results:CandidateResults[] = await this.levelService.getCandidatesLevel(application);
      res.status(200).json({ data: results, message: 'Level Candidates' });
    } catch (error) {
      next(error);
    }
  };

  public getDemeterLevelsApplication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const application = String(req.params.name);
      const results:Level5Group[] = await this.levelService.getGroupedDemeterLevel(application);
      res.status(200).json({ data: results, message: 'Grouped Levels' });
    } catch (error) {
      next(error);
    }
  };

  // Execute the level  grouping
  public executeLevelGrouping = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const application = String(req.params.name);
      const numGrouped:number = await this.levelService.executeGrouping(application);
      res.status(200).json({ data: numGrouped, message: 'Grouped' });
    } catch (error) {
      next(error);
    }
  };

  // Retrieve the list of all Levels 5
  public getAllLevels5 = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const application = String(req.params.name);
      const level5Groups:Level5Group[] = await this.levelService.getAllLevels(application);
      res.status(200).json({ data: level5Groups, message: 'All Level 5' });
    } catch (error) {
      next(error);
    }
  };

  // Undo a demeter level
  public undoOneLevel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const application = String(req.params.name);
      const levelName = String(req.body.level);
      const result:boolean = await this.levelService.undoGroupedLevel5(application, levelName);
      res.status(200).json({ data: result, message: 'Undo level' });
    } catch (error) {
      next(error);
    }
  };

  // Rename one level
  public renameLevel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const application = String(req.params.name);
      const levelName = String(req.body.level);
      const newName = String(req.body.newLevel);

      const result:boolean = await this.levelService.renameLevel(application, levelName, newName);
      res.status(200).json({ data: result, message: 'Undo level' });
    } catch (error) {
      next(error);
    }
  };


}