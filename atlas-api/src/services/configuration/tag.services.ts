import { logger } from "@shared/logger";
import { QueryResult } from "neo4j-driver";
import { Neo4JAccessLayer } from "@database/neo4jAccessLayer";
import HttpException from "@exceptions/HttpException";

class TagService {
  private neo4jAl: Neo4JAccessLayer = Neo4JAccessLayer.getInstance();

  /**
   * Get the prefix of Custom tags
   */
  public async getCustomFrameworksTag(): Promise<string> {
    try {
      const request = "CALL artemis.get.framework.tag()";

      const results: QueryResult = await this.neo4jAl.execute(request);
      if (!results.records || results.records.length == 0)
        throw new Error("Results not correctly formatted");

      return String(results.records[0].get(0));
    } catch (err) {
      logger.error("Failed to retrieve the custom frameworks tag...", err);
      throw new HttpException(500, "Internal error");
    }
  }

  /**
   * Get the version of Artemis
   */
  public async getCustomLevelTag(): Promise<string> {
    try {
      const request = "CALL demeter.api.get.prefix.level()";

      const results: QueryResult = await this.neo4jAl.execute(request);
      if (!results.records || results.records.length == 0)
        throw new Error("Results not correctly formatted");

      return String(results.records[0].get(0));
    } catch (err) {
      logger.error("Failed to retrieve the custom level tag...", err);
      throw new HttpException(500, "Internal error");
    }
  }

  /**
   * Get the tag prefix of the modules
   */
  public async getCustomModuleTag(): Promise<string> {
    try {
      const request = "CALL demeter.api.get.prefix.module()";

      const results: QueryResult = await this.neo4jAl.execute(request);
      if (!results.records || results.records.length == 0)
        throw new Error("Results not correctly formatted");

      return String(results.records[0].get(0));
    } catch (err) {
      logger.error("Failed to retrieve the custom module tag...", err);
      throw new HttpException(500, "Internal error");
    }
  }

    /**
   * Get the tag prefix of the Architecture
   */
  public async getCustomArchitectureTag(): Promise<string> {
    try {
      const request = "CALL demeter.api.get.prefix.architecture()";

      const results: QueryResult = await this.neo4jAl.execute(request);
      if (!results.records || results.records.length == 0)
        throw new Error("Results not correctly formatted");
      return String(results.records[0].get(0));
    } catch (err) {
      logger.error("Failed to retrieve the custom architecture tag...", err);
      throw new HttpException(500, "Internal error");
    }
  }
}

export default TagService;
