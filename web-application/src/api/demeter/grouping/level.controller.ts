import { ApiComUtils, validStatus } from "@/api/ApiComUtils";
import { ApiResponse } from "@/api/interface/ApiResponse.interface";
import { CandidateResults } from "@/api/interface/demeter/ApiCandidateResults.interface";
import { Level5Group } from "@/api/interface/demeter/ApiLevel.interface";
import axios from "axios";

export class LevelController {
  private static API_BASE_URL = ApiComUtils.getUrl();

  /**
   * Group object in a specific application
   * @param application
   */
  public static async executeGrouping(
    applicationName: string
  ): Promise<number> {
    const url =
      LevelController.API_BASE_URL +
      `/api/demeter/levels/${applicationName}/group`;

    try {
      const res = await axios.post(url);
      if (validStatus(res.status)) {
        const apiResponse: ApiResponse = res.data;
        return Number(apiResponse.data);
      } else {
        throw new Error(`Failed to group nodes. Status (${res.status})`);
      }
    } catch (error) {
      console.error(
        `Failed to reach the API : ${url}. Failed to group nodes.`,
        error
      );
      throw error;
    }
  }

  /**
   * Retrieve of the level 5 specific to one application
   * @param applicationName Name of the application
   */
  public static async getCandidates(
    applicationName: string
  ): Promise<CandidateResults[]> {
    const url =
      LevelController.API_BASE_URL +
      `/api/demeter/levels/${applicationName}/candidates`;

    try {
      const res = await axios.get(url);
      if (validStatus(res.status)) {
        const apiResponse: ApiResponse = res.data;
        if (Array.isArray(apiResponse.data)) {
          return apiResponse.data;
        }
      } else {
        throw new Error(`Failed to retrieve level. Status (${res.status})`);
      }
    } catch (error) {
      console.error(
        `Failed to reach the API : ${url}. Failed to retrieve levels .`,
        error
      );
      throw error;
    }
  }

  /**
   * Retrieve of the level 5 specific to one application
   * @param applicationName Name of the application
   */
  public static async getAllLevels(
    applicationName: string
  ): Promise<Level5Group[]> {
    const url =
      LevelController.API_BASE_URL +
      `/api/demeter/levels/${applicationName}/all`;

    try {
      const res = await axios.get(url);
      if (validStatus(res.status)) {
        const apiResponse: ApiResponse = res.data;
        if (Array.isArray(apiResponse.data)) {
          return apiResponse.data;
        }
      } else {
        throw new Error(`Failed to retrieve level. Status (${res.status})`);
      }
    } catch (error) {
      console.error(
        `Failed to reach the API : ${url}. Failed to retrieve levels .`,
        error
      );
      throw error;
    }
  }

  /**
   * Retrieve of the level 5 specific to one application
   * @param applicationName Name of the application
   */
  public static async getDemeterLevels(
    applicationName: string
  ): Promise<Level5Group[]> {
    const url =
      LevelController.API_BASE_URL +
      `/api/demeter/levels/${applicationName}/grouped`;

    try {
      const res = await axios.get(url);
      if (validStatus(res.status)) {
        const apiResponse: ApiResponse = res.data;
        if (Array.isArray(apiResponse.data)) {
          return apiResponse.data;
        }
      } else {
        throw new Error(
          `Failed to retrieve grouped level. Status (${res.status})`
        );
      }
    } catch (error) {
      console.error(
        `Failed to reach the API : ${url}. Failed to retrieve grouped levels.`,
        error
      );
      throw error;
    }
  }

  /**
   * Undo the grouping of a specific level in an application
   * @param applicationName Name of the application targeted by the undo
   * @param groupName Name of the group
   */
  public static async undoGroupedLevel5(
    applicationName: string,
    groupName: string
  ): Promise<boolean> {
    const url =
      LevelController.API_BASE_URL +
      `/api/demeter/levels/${applicationName}/undo`;

    try {
      const res = await axios.post(url, { level: groupName });
      if (validStatus(res.status)) {
        const apiResponse: ApiResponse = res.data;
        return Boolean(apiResponse.data);
      } else {
        throw new Error(
          `Failed to undo a grouped level. Status (${res.status})`
        );
      }
    } catch (error) {
      console.error(
        `Failed to reach the API : ${url}. Failed to undo a grouped level.`,
        error
      );
      throw error;
    }
  }

  /**
   * Rename
   * @param applicationName Name of the application
   * @param groupName Old name of the group
   * @param newName New name of the module
   */
  public static async renameLevel(
    applicationName: string,
    groupName: string,
    newName: string
  ): Promise<boolean> {
    const url =
      LevelController.API_BASE_URL +
      `/api/demeter/levels/${applicationName}/rename`;

    try {
      const res = await axios.post(url, {
        level: groupName,
        newLevel: newName
      });
      if (validStatus(res.status)) {
        const apiResponse: ApiResponse = res.data;
        return Boolean(apiResponse.data);
      } else {
        throw new Error(
          `Failed to rename a grouped level. Status (${res.status})`
        );
      }
    } catch (error) {
      console.error(
        `Failed to reach the API : ${url}. Failed to rename a grouped level.`,
        error
      );
      throw error;
    }
  }
}
