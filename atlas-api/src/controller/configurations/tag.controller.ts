import TagService from "@services/configuration/tag.services";
import { NextFunction, Request, Response } from "express";

class TagController {
  private tagService = new TagService();

  public getFrameworkTag = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tag: string = await this.tagService.getCustomFrameworksTag();
      res.status(200).json({ data: tag, message: "Custom framework tag" });
    } catch (error) {
      next(error);
    }
  };

  public getLevelTag = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tag: string = await this.tagService.getCustomLevelTag();
      res.status(200).json({ data: tag, message: "Custom level tag" });
    } catch (error) {
      next(error);
    }
  };

  public getModuleTag = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tag: string = await this.tagService.getCustomModuleTag();
      res.status(200).json({ data: tag, message: "Custom module tag" });
    } catch (error) {
      next(error);
    }
  };
}

export default TagController;
