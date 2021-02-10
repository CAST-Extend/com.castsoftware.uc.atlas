import axios from "axios";
import { ApiComUtils } from "../ApiComUtils";
import PrefixController from "../configuration/prefix.controller";
import { ApiResponse } from "../interface/ApiResponse.interface";

export default class PythiaController {
  private static API_BASE_URL = ApiComUtils.getUrl();

  /**
   * Get the timestamp of the last local database update
   */
  public static async getLocalLastUpdate(): Promise<number> {
    const url =
      PythiaController.API_BASE_URL + `/api/pythia/artemis/local/lastUpdate`;

    try {
      const res = await axios.get(url);

      if (res.status == 200) {
        const apiResponse: ApiResponse = res.data;
        return Number(apiResponse.data);
      } else {
        throw new Error(`Failed to retrieve version. Status (${res.status})`);
      }
    } catch (error) {
      console.error(
        `Failed to reach the API : ${url}. Failed to retrieve tag ${name}.`,
        error
      );
      throw error;
    }
  }

  /**
   * Get the timestamp of the last update on the pythia remote database
   */
  public static async getRemoteLastUpdate(): Promise<number> {
    const url =
      PythiaController.API_BASE_URL + `/api/pythia/artemis/remote/lastUpdate`;

    try {
      const res = await axios.get(url);

      if (res.status == 200) {
        const apiResponse: ApiResponse = res.data;
        return Number(apiResponse.data);
      } else {
        throw new Error(`Failed to retrieve version. Status (${res.status})`);
      }
    } catch (error) {
      console.error(
        `Failed to reach the API : ${url}. Failed to retrieve tag ${name}.`,
        error
      );
      throw error;
    }
  }

  /**
   * Get the forecast of pull the nex request (Number of framework pulled )
   */
  public static async getPullForecast(): Promise<number> {
    const url =
      PythiaController.API_BASE_URL +
      `/api/pythia/artemis/remote/forecast/pull`;

    try {
      const res = await axios.get(url);
      if (res.status == 200) {
        console.log("Response of pull forecast :", res.data);
        const apiResponse: ApiResponse = res.data;
        return Number(apiResponse.data);
      } else {
        throw new Error(
          `Failed to retrieve the last pull forecast. Status (${res.status})`
        );
      }
    } catch (error) {
      console.error(
        `Failed to reach the API : ${url}. Failed to last pull forecast.`,
        error
      );
      throw error;
    }
  }

  /**
   * Get the forecast of pull the nex request (Number of framework pulled )
   */
  public static async pullFromPythia(): Promise<number> {
    const url =
      PythiaController.API_BASE_URL + `/api/pythia/artemis/remote/pull`;

    try {
      const res = await axios.get(url);
      if (res.status == 200) {
        const apiResponse: ApiResponse = res.data;
        return Number(apiResponse.data);
      } else {
        throw new Error(`Failed to retrieve version. Status (${res.status})`);
      }
    } catch (error) {
      console.error(
        `Failed to reach the API : ${url}. Failed to retrieve tag ${name}.`,
        error
      );
      throw error;
    }
  }
}
