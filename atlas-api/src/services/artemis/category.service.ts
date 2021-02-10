import { logger } from "@shared/logger";
import { Neo4JAccessLayer } from "@database/neo4jAccessLayer";
import HttpException from "@exceptions/HttpException";
import { RegexNode } from "@interfaces/artemis/regexNode.interface";
import { CreateRegexNodeDto } from "@dtos/artemis/regexNode.dto";
import { int } from "neo4j-driver";
import { Category } from "@interfaces/artemis/category.interface";
import { CreateCategoryDto } from "@dtos/artemis/category.dto";

function convertRecordToCategoryNode(record: any): Category {
  const category: Category = {
    id: int(record.get("id")).toNumber(),
    name: record.get("name"),
    iconUrl: record.get("iconUrl"),
  };

  return category;
}

class CategoryService {
  private neo4jAl: Neo4JAccessLayer = Neo4JAccessLayer.getInstance();

  /**
   * Get the list of supported languages
   */
  public async getAllNodes(): Promise<Category[]> {
    const req: string = `CALL artemis.api.category.get.all.nodes()`;

    try {
      const val = await this.neo4jAl.execute(req);
      if (!val.records || val.records.length == 0) return [];

      let nodes: Category[] = [];
      for (let index = 0; index < val.records.length; index++) {
        const element = convertRecordToCategoryNode(val.records[index]);
        nodes.push(element);
      }

      return nodes;
    } catch (err) {
      logger.error(
        "An internal error occurred in CategoryService::getAllNodes ",
        err
      );
      throw new HttpException(500, "Internal error");
    }
  }

  /**
   * Add a category node in the database
   * @param node Node to add
   */
  public async addNode(node: CreateCategoryDto): Promise<Category> {
    const req: string = `CALL artemis.api.category.create.node($name, $iconUrl)`;

    try {
      const val = await this.neo4jAl.executeWithParameters(req, node);
      if (!val.records || val.records.length == 0) return null;

      return convertRecordToCategoryNode(val.records[0]);
    } catch (err) {
      logger.error(
        "An internal error occurred in CategoryService::addNode ",
        err
      );
      throw new HttpException(500, "Internal error");
    }
  }

  /**
   * Update a category node in the database
   * @param node Updated node
   */
  public async updateNode(node: CreateCategoryDto): Promise<Category> {
    const req: string = `CALL artemis.api.category.update.node($id, $name, $iconUrl)`;

    try {
      const val = await this.neo4jAl.executeWithParameters(req, node);
      if (!val.records || val.records.length == 0) return null;

      return convertRecordToCategoryNode(val.records[0]);
    } catch (err) {
      logger.error(
        "An internal error occurred in CategoryService::updateNode ",
        err
      );
      throw new HttpException(500, "Internal error");
    }
  }

  public async removeNode(idNode: number): Promise<boolean> {
    const req: string = `CALL artemis.api.category.remove.node($idNode)`;
    try {
      const val = await this.neo4jAl.executeWithParameters(req, {
        idNode: idNode,
      });
      if (!val.records || val.records.length == 0) return false;
      return Boolean(val.records[0]);
    } catch (err) {
      logger.error(
        "An internal error occurred in RegexNodeService::removeRegexNode ",
        err
      );
      throw new HttpException(500, "Internal error");
    }
  }
}

export default CategoryService;
