import { logger } from "@shared/logger";
import { Neo4JAccessLayer } from "@database/neo4jAccessLayer";
import HttpException from "@exceptions/HttpException";
import { RegexNode } from "@interfaces/artemis/regexNode.interface";
import { CreateRegexNodeDto } from "@dtos/artemis/regexNode.dto";
import { int } from "neo4j-driver";

function convertRecordToRegexNode(record: any): RegexNode {
  const regex: RegexNode = {
    id: int(record.get("id")).toNumber(),
    name: record.get("name"),
    regexes: record.get("regexes") || [],
    internalTypes: record.get("internalTypes") || [],
    framework: record.get("framework") || "",
    category: record.get("category") || "",
    parentId:
      record.get("parentId") != null
        ? int(record.get("parentId")).toNumber()
        : -1,
  };

  return regex;
}

class RegexNodesService {
  private neo4jAl: Neo4JAccessLayer = Neo4JAccessLayer.getInstance();

  /**
   * Get the list of supported languages
   */
  public async getAllNodesAsTree(): Promise<RegexNode[]> {
    const req = `CALL artemis.api.regex.get.all.nodes()`;

    try {
      const val = await this.neo4jAl.execute(req);
      if (!val.records || val.records.length == 0) return [];

      const nodes: RegexNode[] = [];
      for (let index = 0; index < val.records.length; index++) {
        const element = convertRecordToRegexNode(val.records[index]);
        nodes.push(element);
      }

      return nodes;
    } catch (err) {
      logger.error(
        "An internal error occurred in RegexNodeService::getAllNodesAsTree ",
        err
      );
      throw new HttpException(500, "Internal error");
    }
  }

  /**
   * Add a regex node in the database
   * @param node Node to add
   */
  public async addRegexNode(node: CreateRegexNodeDto): Promise<RegexNode> {
    const req = `CALL artemis.api.regex.create.node($name, $regexes, $internalTypes, $framework, $category, $parentId)`;

    try {
      console.log("Adding item :", node);
      const val = await this.neo4jAl.executeWithParameters(req, node);
      if (!val.records || val.records.length == 0) return null;

      const element = convertRecordToRegexNode(val.records[0]);
      return element;
    } catch (err) {
      logger.error(
        "An internal error occurred in RegexNodeService::addRegexNode ",
        err
      );
      throw new HttpException(500, "Internal error");
    }
  }

  /**
   * Update a Regex node in the database
   * @param node Updated node
   */
  public async updateRegexNode(node: CreateRegexNodeDto): Promise<RegexNode> {
    console.log("Updating with parent : ", node);
    const req = `CALL artemis.api.regex.update.node($id, $name, $regexes, $internalTypes, $framework, $category, $parentId)`;

    try {
      const val = await this.neo4jAl.executeWithParameters(req, node);
      if (!val.records || val.records.length == 0) return null;

      const element = convertRecordToRegexNode(val.records[0]);
      return element;
    } catch (err) {
      logger.error(
        "An internal error occurred in RegexNodeService::updateRegexNode ",
        err
      );
      throw new HttpException(500, "Internal error");
    }
  }

  public async removeRegexNode(idNode: number): Promise<boolean> {
    const req = `CALL artemis.api.regex.remove.node.byId($idNode)`;
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

  public async testRegexNode(idNode: number): Promise<number> {
    const req = `CALL artemis.api.regex.test($idNode)`;
    try {
      const val = await this.neo4jAl.executeWithParameters(req, {
        idNode: idNode,
      });
      if (!val.records || val.records.length == 0) return 0;
      return int(val.records[0].get(0)).toNumber();
    } catch (err) {
      logger.error(
        "An internal error occurred in RegexNodeService::removeRegexNode ",
        err
      );
      throw new HttpException(500, "Internal error");
    }
  }

  public async getRegexRequest(idNode: number): Promise<string> {
    const req = `CALL artemis.api.regex.get.request($idNode)`;
    try {
      const val = await this.neo4jAl.executeWithParameters(req, {
        idNode: idNode,
      });
      if (!val.records || val.records.length == 0) return "";
      return String(val.records[0].get(0));
    } catch (err) {
      logger.error(
        "An internal error occurred in RegexNodeService::getRegexRequest ",
        err
      );
      throw new HttpException(500, "Internal error");
    }
  }

  //artemis.api.regex.test
}

export default RegexNodesService;
