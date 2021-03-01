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
  
  /**
   * Turn on or off all the parameters related to online communication
   * @param value Value of the internal mode
   */
  public async setInternalMode(value: boolean) : Promise<boolean> {
    try {
      const requestOnline = "CALL artemis.set.onlineMode($value)";
      const requestPythia = "CALL artemis.set.pythiaMode($value)";

      await this.neo4jAl.executeWithParameters(requestOnline, { value: value });
      await this.neo4jAl.executeWithParameters(requestPythia, { value: value });
     

      return this.getInternalMode();
    } catch (err) {
      logger.error("Failed to set internal mode ...", err);
      throw new HttpException(500, "Internal error");
    }
  }

  /**
   * Get the value of the current internal mode
   */  
  public async getInternalMode() : Promise<boolean> {
    try {
      const requestOnline = "CALL artemis.get.onlineMode()";
      const requestPythia = "CALL artemis.get.pythiaMode()";

      const results = await this.neo4jAl.execute(requestOnline);
      if (!results.records || results.records.length == 0)
        throw new Error("Results not correctly formatted for CALL artemis.get.onlineMode()");

      if(Boolean(results.records[0].get(0))) return false; 

      const results2 = await this.neo4jAl.execute(requestPythia);
      if (!results2.records || results2.records.length == 0)
        throw new Error("Results not correctly formatted for CALL artemis.get.pythiaMode()");

      if(Boolean(results2.records[0].get(0))) return false; 
     

      return true; // All the parameters are turned off
    } catch (err) {
      logger.error("Failed to set internal mode ...", err);
      throw new HttpException(500, "Internal error");
    }
  }
}

export default ConfigurationService;