import axios from "axios";
import { ApiComUtils } from "../ApiComUtils";
import { ApiResponse } from "../interface/ApiResponse.interface";

export default class ConfigurationController {
  private static API_BASE_URL = ApiComUtils.getUrl();

  public static async getPythiaURL(): Promise<string> {
    const url =
      ConfigurationController.API_BASE_URL +
      `/api/configuration/parameters/pythia/uri`;

    try {
      const res = await axios.get(url);

      if (res.status == 200 || res.status == 304) {
        const apiResponse: ApiResponse = res.data;
        return String(apiResponse.data);
      } else {
        throw new Error(
          `Failed to retrieve the URI of Pythia. Status (${res.status})`
        );
      }
    } catch (error) {
      console.error(`Failed to reach the API : ${url}.`, error);
      throw error;
    }
  }

  public static async setPythiaURL(newUrl: string): Promise<string> {
    const url =
      ConfigurationController.API_BASE_URL +
      `/api/configuration/parameters/pythia/uri`;

    try {
      const res = await axios.post(url, { url: newUrl });

      if (res.status == 200 || res.status == 304) {
        const apiResponse: ApiResponse = res.data;
        return String(apiResponse.data);
      } else {
        throw new Error(
          `Failed to set the URL of Pythia. Status (${res.status})`
        );
      }
    } catch (error) {
      console.error(`Failed to reach the API : ${url}.`, error);
      throw error;
    }
  }

  public static async setPythiaToken(token: string): Promise<boolean> {
    const url =
      ConfigurationController.API_BASE_URL +
      `/api/configuration/parameters/pythia/uri`;

    try {
      const res = await axios.post(url, { token: token });

      if (res.status == 200 || res.status == 304) {
        const apiResponse: ApiResponse = res.data;
        return Boolean(apiResponse.data);
      } else {
        throw new Error(
          `Failed to set the Token of Pythia. Status (${res.status})`
        );
      }
    } catch (error) {
      console.error(`Failed to reach the API : ${url}.`, error);
      throw error;
    }
  }

  public static async getPythiaTokenPresence(): Promise<boolean> {
    const url =
      ConfigurationController.API_BASE_URL +
      `/api/configuration/parameters/pythia/token`;

    try {
      const res = await axios.get(url);

      if (res.status == 200 || res.status == 304) {
        const apiResponse: ApiResponse = res.data;
        return Boolean(apiResponse.data);
      } else {
        throw new Error(
          `Failed to retrieve the Token presence of Pythia. Status (${res.status})`
        );
      }
    } catch (error) {
      console.error(`Failed to reach the API : ${url}.`, error);
      throw error;
    }
  }

  public static async getArtemisWorkspace(): Promise<string> {
    const url =
      ConfigurationController.API_BASE_URL +
      `/api/configuration/parameters/artemis/workspace`;

    try {
      const res = await axios.get(url);

      if (res.status == 200 || res.status == 304) {
        const apiResponse: ApiResponse = res.data;
        return String(apiResponse.data);
      } else {
        throw new Error(
          `Failed to retrieve the workspace of Artemis. Status (${res.status})`
        );
      }
    } catch (error) {
      console.error(`Failed to reach the API : ${url}.`, error);
      throw error;
    }
  }

  public static async setArtemisWorkspace(
    newWorkspace: string
  ): Promise<string> {
    const url =
      ConfigurationController.API_BASE_URL +
      `/api/configuration/parameters/artemis/workspace`;

    try {
      const res = await axios.post(url, { workspace: newWorkspace });

      if (res.status == 200 || res.status == 304) {
        const apiResponse: ApiResponse = res.data;
        return String(apiResponse.data);
      } else {
        throw new Error(
          `Failed to set the workspace of Artemis. Status (${res.status})`
        );
      }
    } catch (error) {
      console.error(`Failed to reach the API : ${url}.`, error);
      throw error;
    }
  }

  public static async getDemeterWorkspace(): Promise<string> {
    const url =
      ConfigurationController.API_BASE_URL +
      `/api/configuration/demeter/artemis/workspace`;

    try {
      const res = await axios.get(url);

      if (res.status == 200 || res.status == 304) {
        const apiResponse: ApiResponse = res.data;
        return String(apiResponse.data);
      } else {
        throw new Error(
          `Failed to retrieve the workspace of Demeter. Status (${res.status})`
        );
      }
    } catch (error) {
      console.error(`Failed to reach the API : ${url}.`, error);
      throw error;
    }
  }

  public static async setDemeterWorkspace(
    newWorkspace: string
  ): Promise<string> {
    const url =
      ConfigurationController.API_BASE_URL +
      `/api/configuration/demeter/artemis/workspace`;

    try {
      const res = await axios.post(url, { workspace: newWorkspace });

      if (res.status == 200 || res.status == 304) {
        const apiResponse: ApiResponse = res.data;
        return String(apiResponse.data);
      } else {
        throw new Error(
          `Failed to set the workspace of Demeter. Status (${res.status})`
        );
      }
    } catch (error) {
      console.error(`Failed to reach the API : ${url}.`, error);
      throw error;
    }
  }
}
