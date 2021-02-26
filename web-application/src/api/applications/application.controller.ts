import axios from "axios";
import { QueryResult } from "neo4j-driver";
import { ApiComUtils } from "../ApiComUtils";
import { ApiResponse } from "../interface/ApiResponse.interface";
import { Neo4JAccessLayer } from "../Neo4jAccessLayer";

export interface ApplicationRecord {
  name: string;
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
  }
}
