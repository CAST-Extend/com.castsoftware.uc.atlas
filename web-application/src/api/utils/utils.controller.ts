import axios from "axios";
import { QueryResult } from "neo4j-driver";
import { ApiComUtils } from "../ApiComUtils";
import { ApiResponse } from "../interface/ApiResponse.interface";
import { Neo4JAccessLayer } from "../Neo4jAccessLayer";

export class UtilsController {
  private static neo4jal: Neo4JAccessLayer = Neo4JAccessLayer.getInstance();
  private static API_BASE_URL = ApiComUtils.getUrl();

  /**
   * Get the actual version of the demeter extension
   */
  public static async healthCheck(): Promise<boolean> {
    const url = UtilsController.API_BASE_URL + "/api/utils/healthCheck";

    try {
      const res = await axios.get(url);

      if (res.status == 200) {
        const apiResponse: ApiResponse = res.data;
        return Boolean(apiResponse.data);
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }
}
