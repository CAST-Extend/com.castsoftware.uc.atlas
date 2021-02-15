import { logger } from "@shared/logger";
import { QueryResult } from "neo4j-driver";
import { Neo4JAccessLayer } from "@database/neo4jAccessLayer";
import HttpException from "@exceptions/HttpException";

class ConfigurationService {

  private neo4jAl: Neo4JAccessLayer = Neo4JAccessLayer.getInstance();

  public async getPythiaURI(): Promise<string> {
    try {
      const request = "CALL artemis.api.configuration.get.pythia.uri()";

      const results: QueryResult = await this.neo4jAl.execute(request);
      if (!results.records || results.records.length == 0)
        throw new Error("Results not correctly formatted");

      const uri = String(results.records[0].get(0));
      return uri;
    } catch (err) {
      logger.error("Failed to retrieve the URI of Pythia ...", err);
      throw new HttpException(500, "Internal error");
    }
  }

  public async setPythiaURI(url:string): Promise<string> {
    try {
      const request = "CALL artemis.api.configuration.set.pythia.uri($url)";

      const results: QueryResult = await this.neo4jAl.executeWithParameters(request, {url : url});
      if (!results.records || results.records.length == 0)
        throw new Error("Results not correctly formatted");

      const uri = String(results.records[0].get(0));
      return uri;
    } catch (err) {
      logger.error("Failed to change the URI of Pythia ...", err);
      throw new HttpException(500, "Internal error");
    }
  }

  public async getPythiaTokenPresence(): Promise<boolean> {
    try {
      const request = "CALL artemis.api.configuration.get.pythia.token()";

      const results: QueryResult = await this.neo4jAl.execute(request);
      if (!results.records || results.records.length == 0)
        throw new Error("Results not correctly formatted");

      return Boolean(results.records[0].get(0));
    } catch (err) {
      logger.error("Failed to retrieve the Token presence of Pythia ...", err);
      throw new HttpException(500, "Internal error");
    }
  }

  /**
   * Set the token of the Pythia
   * @param token New Token
   */
  public async setPythiaToken(token:string): Promise<boolean> {
    try {
      const request = "CALL artemis.api.configuration.set.pythia.token($token)";

      const results: QueryResult = await this.neo4jAl.executeWithParameters(request, {token : token});
      if (!results.records || results.records.length == 0)
        throw new Error("Results not correctly formatted");

      return Boolean(results.records[0].get(0));
    } catch (err) {
      logger.error("Failed to change the Token of Pythia ...", err);
      throw new HttpException(500, "Internal error");
    }
  }

  /**
   * Get the Path of the artemis workspace
   */
  public async getArtemisWorkspace(): Promise<string> {
    try {
      const request = "CALL artemis.get.workspace()";

      const results: QueryResult = await this.neo4jAl.execute(request);
      if (!results.records || results.records.length == 0)
        throw new Error("Results not correctly formatted");

      return String(results.records[0].get(0));
    } catch (err) {
      logger.error("Failed to retrieve the workspace path of Artemis ...", err);
      throw new HttpException(500, "Internal error");
    }
  }

  /**
   * Set the path of the artemis workspace
   * @param newPath New path of the workspace
   */
  public async setArtemisWorkspace(newPath:string): Promise<string> {
    try {
      const request = "CALL artemis.set.workspace($path)";

      const results: QueryResult = await this.neo4jAl.executeWithParameters(request, { path: newPath });
      if (!results.records || results.records.length == 0)
        throw new Error("Results not correctly formatted");

      return String(results.records[0].get(0));
    } catch (err) {
      logger.error("Failed to set the workspace path of Artemis ...", err);
      throw new HttpException(500, "Internal error");
    }
  }

    /**
   * Get the Path of the demeter workspace
   */
  public async getDemeterWorkspace(): Promise<string> {
    try {
      const request = "CALL demeter.get.workspace()";

      const results: QueryResult = await this.neo4jAl.execute(request);
      if (!results.records || results.records.length == 0)
        throw new Error("Results not correctly formatted");

      return String(results.records[0].get(0));
    } catch (err) {
      logger.error("Failed to retrieve the workspace path of Demeter ...", err);
      throw new HttpException(500, "Internal error");
    }
  }

  /**
   * Set the path of the demeter workspace
   * @param newPath New path of the workspace
   */
  public async setDemeterWorkspace(newPath:string): Promise<string> {
    try {
      const request = "CALL demeter.set.workspace($path)";

      const results: QueryResult = await this.neo4jAl.executeWithParameters(request, { path: newPath });
      if (!results.records || results.records.length == 0)
        throw new Error("Results not correctly formatted");

      return String(results.records[0].get(0));
    } catch (err) {
      logger.error("Failed to set the workspace path of Demeter ...", err);
      throw new HttpException(500, "Internal error");
    }
  }
  
}

export default ConfigurationService;