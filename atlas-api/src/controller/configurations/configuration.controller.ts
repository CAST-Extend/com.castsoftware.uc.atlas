import ConfigurationService from "@services/configuration/configuration.service";
import { NextFunction, Request, Response } from "express";

class ConfigurationController {
  private configurationService = new ConfigurationService();

  public getPythiaURI = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const uri: string = await this.configurationService.getPythiaURI();
      res.status(200).json({ data: uri, message: "Pythia URI" });
    } catch (error) {
      next(error);
    }
  };

  public setPythiaURI = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const token = String(req.body.token);
      if(!token || token.length == 0) {
          res.status(400).send({ data: null, message: "The token cannot be empty." })
      }

      const changed: boolean = await this.configurationService.setPythiaToken(token);
      res.status(200).json({ data: changed, message: "Pythia URI" });
    } catch (error) {
      next(error);
    }
  };

  public getPythiaTokenPresence = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const presence: boolean = await this.configurationService.getPythiaTokenPresence();
      res.status(200).json({ data: presence, message: "Pythia Token" });
    } catch (error) {
      next(error);
    }
  };

  public getArtemisWorkspace = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const uri: string = await this.configurationService.getArtemisWorkspace();
      res.status(200).json({ data: uri, message: "Artemis workspace" });
    } catch (error) {
      next(error);
    }
  };

  public setArtemisWorkspace = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const workspace = String(req.body.workspace);
      if(!workspace || workspace.length == 0) {
          res.status(400).send({ data: null, message: "The workspace cannot be empty." })
      }
      const uri: string = await this.configurationService.setArtemisWorkspace(workspace);
      res.status(200).json({ data: uri, message: "Artemis workspace" });
    } catch (error) {
      next(error);
    }
  };

  public getDemeterWorkspace = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const uri: string = await this.configurationService.getDemeterWorkspace();
      res.status(200).json({ data: uri, message: "Demeter workspace" });
    } catch (error) {
      next(error);
    }
  };

  public setDemeterWorkspace = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const workspace = String(req.body.workspace);
      if(!workspace || workspace.length == 0) {
          res.status(400).send({ data: null, message: "The workspace cannot be empty." })
      }
      const uri: string = await this.configurationService.setDemeterWorkspace(workspace);
      res.status(200).json({ data: uri, message: "Demeter workspace" });
    } catch (error) {
      next(error);
    }
  };
}

export default ConfigurationController;