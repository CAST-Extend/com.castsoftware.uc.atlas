import axios from "axios";
import { ApiComUtils } from "../ApiComUtils";
import { ApiResponse } from "../interface/ApiResponse.interface";

export class AtlasController {
  private static API_BASE_URL = ApiComUtils.getUrl();

  /**
   * Get the version of the Demeter extension.
   * Throw an error if the extension is not installed
   */
  public static async getDemeterVersion(): Promise<string> {
    const url =
      AtlasController.API_BASE_URL + "/api/atlas/extensions/demeter/version";

    try {
      const res = await axios.get(url);
      let version: string;

      if (res.status == 200) {
        const apiResponse: ApiResponse = res.data;
        version = String(apiResponse.data);
      } else {
        console.warn(`Failed to retrieve version. Status (${res.status})`);
      }

      return version;
    } catch (error) {
      console.error(
        `Failed to reach the API : ${url}. Failed to retrieve Artemis version.`,
        error
      );
      throw error;
    }
  }

  /**
   * Get the version of the Artemis extension.
   * Throw an error if the extension is not installed
   */
  public static async getArtemisVersion(): Promise<string> {
    const url =
      AtlasController.API_BASE_URL + "/api/atlas/extensions/artemis/version";

    try {
      const res = await axios.get(url);
      let version: string;

      if (res.status == 200) {
        const apiResponse: ApiResponse = res.data;
        version = String(apiResponse.data);
      } else {
        console.warn(`Failed to retrieve version. Status (${res.status})`);
      }

      return version;
    } catch (error) {
      console.error(
        `Failed to reach the API : ${url}. Failed to retrieve Artemis version.`,
        error
      );
      throw error;
    }
  }
}
