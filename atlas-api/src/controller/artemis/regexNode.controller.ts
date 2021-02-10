import { NextFunction, Request, Response } from "express";
import RegexNodesService from "@services/artemis/regexNodes.service";
import { RegexNode } from "@interfaces/artemis/regexNode.interface";
import { CreateRegexNodeDto } from "@dtos/artemis/regexNode.dto";

class RegexNodeController {
  private regexNodeService = new RegexNodesService();

  public getAllNodes = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const results: RegexNode[] = await this.regexNodeService.getAllNodesAsTree();
      res.status(200).json({ data: results, message: "Regex nodes" });
    } catch (error) {
      next(error);
    }
  };

  public addNode = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const body: CreateRegexNodeDto = req.body;
      const results: RegexNode = await this.regexNodeService.addRegexNode(body);
      res.status(200).json({ data: results, message: "Regex node" });
    } catch (error) {
      next(error);
    }
  };

  public updateNode = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const body: CreateRegexNodeDto = req.body;
      const results: RegexNode = await this.regexNodeService.updateRegexNode(
        body
      );
      res.status(200).json({ data: results, message: "Regex node" });
    } catch (error) {
      next(error);
    }
  };

  public deleteNode = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const result: boolean = await this.regexNodeService.removeRegexNode(id);
      res.status(200).json({ data: result, message: "Remove Node" });
    } catch (error) {
      next(error);
    }
  };

  public testNode = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const result: number = await this.regexNodeService.testRegexNode(id);
      res.status(200).json({ data: result, message: "Result test" });
    } catch (error) {
      next(error);
    }
  };

  public getRegexRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const result: string = await this.regexNodeService.getRegexRequest(id);
      res.status(200).json({ data: result, message: "Regex request" });
    } catch (error) {
      next(error);
    }
  };
  
}

export default RegexNodeController;
