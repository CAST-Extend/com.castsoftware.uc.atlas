import axios from "axios";
import { QueryResult } from "neo4j-driver";
import { ApiComUtils } from "../ApiComUtils";
import { ApiResponse } from "../interface/ApiResponse.interface";
import { Neo4JAccessLayer } from "../Neo4jAccessLayer";

export interface ApplicationRecord {
  name: string;
  countObject: number;
}

export class ApplicationController {
  private static API_BASE_URL = ApiComUtils.getUrl();
  private static neo4jal: Neo4JAccessLayer = Neo4JAccessLayer.getInstance();

  public static async getListApplications(): Promise<string[]> {
    const url =
      ApplicationController.API_BASE_URL + "/api/imaging/applications";

    try {
      const res = await axios.get(url);
      let applications: string[] = [];

      if (res.status == 200) {
        const apiResponse: ApiResponse = res.data;

        if (Array.isArray(apiResponse.data)) {
          applications = apiResponse.data;
        }
      } else {
        console.warn(
          `Failed to retrieve application list. Status (${res.status})`
        );
      }

      return applications;
    } catch (error) {
      console.error(
        `Failed to reach the API : ${url}. Failed to retrieve application list.`,
        error
      );
    }

    const request = "MATCH (n:Application) RETURN n.Name as name";

    const results: QueryResult = await this.neo4jal.execute(request);

    const appNames: string[] = [];
    for (let i = 0; i < results.records.length; i++) {
      const singleRecord = results.records[i];
      const name = singleRecord.get("name");
      appNames.push(name);
    }

    return appNames;
  }

  /**
   * Get a sorted list of Application by the number of objects
   */
  public static async getSortedApplications(): Promise<ApplicationRecord[]> {
    const request =
      "MATCH (n:Application) with n.Name as appName MATCH (o:Object) WHERE appName in LABELS(o) RETURN appName as name, COUNT(o) as numObj ORDER BY numObj DESC";

    const results: QueryResult = await this.neo4jal.execute(request);

    const appNames: ApplicationRecord[] = [];
    for (let i = 0; i < results.records.length; i++) {
      const singleRecord = results.records[i];
      const name = singleRecord.get("name");
      const num = singleRecord.get("numObj");

      appNames.push({ name: name, countObject: num });
    }

    return appNames;
  }
}
