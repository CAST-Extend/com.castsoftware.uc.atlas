import axios from "axios";
import { ApiComUtils } from "../ApiComUtils";
import { ApiResponse } from "../interface/ApiResponse.interface";

export default class PrefixController {
  private static API_BASE_URL = ApiComUtils.getUrl();

  private static async getTag(name: string): Promise<string> {
    const url =
      PrefixController.API_BASE_URL + `/api/configuration/tags/${name}`;

    try {
      const res = await axios.get(url);
      let tag: string;

      if (res.status == 200) {
        const apiResponse: ApiResponse = res.data;
        tag = String(apiResponse.data);
      } else {
        console.warn(`Failed to retrieve version. Status (${res.status})`);
      }

      return tag;
    } catch (error) {
      console.error(
        `Failed to reach the API : ${url}. Failed to retrieve tag ${name}.`,
        error
      );
      throw error;
    }
  }

  /**
   * Get the tag related to the Framework grouping
   */
  public static async getFrameworkTag(): Promise<string> {
    return this.getTag("framework");
  }

  /**
   * Get the tag related to the Level grouping
   */
  public static async getLevelTag(): Promise<string> {
    return this.getTag("level");
  }

  /**
   * Get the tag related to the module grouping
   */
  public static async getModuleTag(): Promise<string> {
    return this.getTag("module");
  }
}
