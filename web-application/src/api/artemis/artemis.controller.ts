import axios from "axios";
import { QueryResult } from "neo4j-driver";
import { ApiComUtils } from "../ApiComUtils";
import { ApiResponse } from "../interface/ApiResponse.interface";
import { Neo4JAccessLayer } from "../Neo4jAccessLayer";

export class ArtemisFrameworkResult {
  name: string;
  description: string;
  category: string;
  detectedAs: string;
}

export class ArtemisController {
  private static API_BASE_URL = ApiComUtils.getUrl();
  private static neo4jal: Neo4JAccessLayer = Neo4JAccessLayer.getInstance();

  /**
   * Get the list of languages supported by Artemis
   */
  public static async getSupportedLanguages(): Promise<string[]> {
    const url = ArtemisController.API_BASE_URL + "/api/artemis/languages";

    try {
      const res = await axios.get(url);
      let languageList: string[] = [];

      if (res.status == 200) {
        const apiResponse: ApiResponse = res.data;
        if (Array.isArray(apiResponse.data)) {
          languageList = apiResponse.data;
        }
        console.info(
          `${languageList.length} languages were retrieved. ${languageList}`
        );
      } else {
        console.warn(`Failed to retrieve languages. Status (${res.status})`);
      }

      return languageList;
    } catch (error) {
      console.error(
        `Failed to reach the API : ${url}. Failed to retrieve pending operations.`,
        error
      );
    }
  }

  /**
   * Set the workspace of artemis
   */
  public static async setWorkspace(workspacePath: string): Promise<string> {
    try {
      const request = `CALL artemis.set.workspace(${workspacePath});`;

      const results: QueryResult = await this.neo4jal.execute(request);
      const newPath: string = results.records[0].get(0);

      console.log(`Artemis workspace was successfully changed to ${newPath}.`);

      return (
        "The path of artemis was successfully changed to : " + workspacePath
      );
    } catch (error) {
      console.error("Something went wrong during the workspace change.", error);
      throw error;
    }
  }

  /**
   * Get the workspace of artemis
   */
  public static async getWorkspace(): Promise<string> {
    const request = `CALL artemis.get.workspace();`;

    const results: QueryResult = await this.neo4jal.execute(request);
    const newPath: string = results.records[0].get(0);

    return newPath;
  }

  /**
   * Set the Online mode of artemis
   */
  public static async setOnlineMode(value: boolean): Promise<boolean> {
    try {
      const request = `CALL artemis.set.onlineMode(${value});`;

      const results: QueryResult = await this.neo4jal.execute(request);
      const newValue: string = results.records[0].get(0);

      return Boolean(newValue);
    } catch (error) {
      console.error(
        "Something went wrong trying to change the online mode parameter.",
        error
      );
      throw error;
    }
  }

  /**
   * Get the Online mode of artemis
   */
  public static async getOnlineMode(): Promise<boolean> {
    const request = `CALL artemis.get.onlineMode();`;

    const results: QueryResult = await this.neo4jal.execute(request);
    const newValue: string = results.records[0].get(0);
    return Boolean(newValue);
  }

  /**
   * Set the Repository mode of artemis
   */
  public static async setRepositoryMode(value: boolean): Promise<boolean> {
    try {
      const request = `CALL artemis.set.repositoryMode(${value});`;

      const results: QueryResult = await this.neo4jal.execute(request);
      const newValue: string = results.records[0].get(0);

      return Boolean(newValue);
    } catch (error) {
      console.error(
        "Something went wrong trying to change the Repository mode parameter.",
        error
      );
      throw error;
    }
  }

  /**
   * Get the Repository mode of artemis
   */
  public static async getRepositoryMode(): Promise<boolean> {
    const request = `CALL artemis.get.repositoryMode();`;

    const results: QueryResult = await this.neo4jal.execute(request);
    const newValue: string = results.records[0].get(0);
    return Boolean(newValue);
  }

  /**
   * Set the Repository mode of artemis
   */
  public static async setMailsRecipients(
    listRecipients: string
  ): Promise<boolean> {
    try {
      const request = `CALL artemis.set.mailsRecipients(${listRecipients});`;

      const results: QueryResult = await this.neo4jal.execute(request);

      const newValue: string = results.records[0].get(0);

      return Boolean(newValue);
    } catch (error) {
      console.error(
        "Something went wrong trying to change the Mail recipients list.",
        error
      );
      throw error;
    }
  }

  /**
   * Get the Repository mode of artemis
   */
  public static async getMailsRecipients(): Promise<string[]> {
    const request = `CALL artemis.get.mailsRecipients();`;

    const results: QueryResult = await this.neo4jal.execute(request);
    const newValue: string = results.records[0].get(0);
    return newValue.split(",");
  }
}
