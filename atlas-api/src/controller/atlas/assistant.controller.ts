import { DetectionCandidate } from "@dtos/artemis/detectionCandidate.dto";
import { CandidateResults } from "@interfaces/demeter/candidateResults.interface";
import { ArtemisCandidates } from "@services/artemis/artemisCandidates.service";
import { NextFunction, Request, Response } from "express";
import {
  FrameworkAssistant,
  DemeterActions,
} from "src/assistants/assistant";
import { FrameworkAssistantManager } from "src/assistants/framework.assistant";
import { serialize } from "v8";
import * as fs from 'fs';
import * as path from 'path';



class AssistantController {
  private candidateService = new ArtemisCandidates();
  private fAssistantManager = FrameworkAssistantManager.getInstance();

  public getCandidateList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const candidateResults: DetectionCandidate[] = await this.candidateService.getCandidateList();
      res.status(200).json({
        data: candidateResults,
        message: "Framework detection candidate",
      });
    } catch (error) {
      next(error);
    }
  };

  public createNew = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const category: string = String(req.body.category);
      let actions: string[] = [];

      if (Array.isArray(req.body.actions)) {
        actions = req.body.actions;
      }

      FrameworkAssistantManager.getInstance()
        .addAssistant(
          category,
          actions.map((x) => x as DemeterActions)
        );
        
        res.status(200)
        .json({
          data: true,
          message: "Created",
        });
    } catch (error) {
      next(error);
    }
  };

  /** Get the list of assistants running on the server */
  public getAssistants = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const assistants: FrameworkAssistant[] = FrameworkAssistantManager.getInstance()
        .getAssistants();
        
        res.status(200)
        .json({
          data: assistants.map(x => x.serialize()),
          message: "Assistants",
        });
    } catch (error) {
      next(error);
    }
  };


  /** Start the assistant */
  public startWithId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id: number = Number(req.params.id);


      const status = FrameworkAssistantManager.getInstance()
        .starAssistantById(id);
        
        res.status(200)
        .json({
          data: status,
          message: "Status",
        });
    } catch (error) {
      next(error);
    }
  };

  public deleteWithId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id: number = Number(req.params.id);
   
      FrameworkAssistantManager.getInstance()
        .removeAssistant(id)
        
        res.status(200)
        .json({
          data: true,
          message: "Deleted",
        });
    } catch (error) {
      next(error);
    }
  };

  public getFrameworkCategories = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const categories: string[] = await this.fAssistantManager.getCategories();
      res.status(200).json({
        data: categories,
        message: "Categories",
      });
    } catch (error) {
      next(error);
    }
  };

  public getDemeterActions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const categories: string[] = await this.fAssistantManager.getDemeterActions();
      res.status(200).json({
        data: categories,
        message: "Actions",
      });
    } catch (error) {
      next(error);
    }
  };
}

export default AssistantController;
