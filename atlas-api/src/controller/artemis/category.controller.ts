

import { NextFunction, Request, Response } from "express";
import CategoryService from "@services/artemis/category.service";
import { Category } from "@interfaces/artemis/category.interface";
import { CreateCategoryDto } from "@dtos/artemis/category.dto";

class CategoryController {
  private categoryService = new CategoryService();

  public getAllNodes = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const results: Category[] = await this.categoryService.getAllNodes();
      res.status(200).json({ data: results, message: "Category nodes" });
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
      const body: CreateCategoryDto = req.body;
      const results: Category = await this.categoryService.addNode(body);
      res.status(200).json({ data: results, message: "Created category node" });
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
      const body: CreateCategoryDto = req.body;
      const result: Category = await this.categoryService.updateNode(
        body
      );
      res.status(200).json({ data: result, message: "Update category node" });
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
      const result: boolean = await this.categoryService.removeNode(id);
      res.status(200).json({ data: result, message: "Remove category node" });
    } catch (error) {
      next(error);
    }
  };


}

export default CategoryController;