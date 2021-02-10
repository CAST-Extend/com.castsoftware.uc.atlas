import axios from "axios";
import { ApiResponse } from "../interface/ApiResponse.interface";
import { DetectionResultDTO } from "../dto/ApiArtemis.dto";
import { DetectionResult } from "../interface/ApiArtemis.interface";
import { ApiComUtils } from "../ApiComUtils";

export default class DetectionController {
  private static API_BASE_URL = ApiComUtils.getUrl();

  /**
   * Launch the detection for an application
   * @param application Name of the application
   * @param language Language for the detection
   */
  public static async launchDetection(
    application: string,
    language: string
  ): Promise<boolean> {
    const url =
      DetectionController.API_BASE_URL + "/api/artemis/detection/launch";

    const data = {
      application: application,
      language: language
    };
    try {
      const res = await axios.post(url, data);

      if (res.status == 200) {
        const apiResponse: ApiResponse = res.data;
        return Boolean(apiResponse.data);
      } else {
        console.warn(`Failed to launch the detection. Status (${res.status})`);
        return false;
      }
    } catch (error) {
      console.error(
        `Failed to reach the API : ${url}. The detection was not launched.`,
        error
      );
      throw error;
    }
  }

  /**
   * Stop a pending detection for an application
   * @param application Name of the application
   * @param language Language of the detection
   */
  public static async cancelDetection(
    application: string,
    language: string
  ): Promise<boolean> {
    const url =
      DetectionController.API_BASE_URL + "/api/artemis/detection/stop";

    const data = {
      application: application,
      language: language
    };
    try {
      const res = await axios.post(url, data);

      if (res.status == 200) {
        const apiResponse: ApiResponse = res.data;
        return Boolean(apiResponse.data);
      } else {
        console.warn(`Failed to stop the detection. Status (${res.status})`);
        return false;
      }
    } catch (error) {
      console.error(
        `Failed to reach the API : ${url}. The detection was not stopped.`,
        error
      );
      throw error;
    }
  }

  /**
   * Get pending detection operations
   */
  public static async getPendingDetections(): Promise<DetectionResult[]> {
    const url =
      DetectionController.API_BASE_URL + "/api/artemis/detection/pending";

    try {
      const res = await axios.get(url);
      let detectionList: DetectionResult[] = [];

      if (res.status == 200) {
        const apiResponse: ApiResponse = res.data;
        if (Array.isArray(apiResponse.data)) {
          detectionList = apiResponse.data;
        }
      } else {
        console.warn(
          `Failed to retrieve pending operations. Status (${res.status})`
        );
      }

      return detectionList;
    } catch (error) {
      console.error(
        `Failed to reach the API : ${url}. Failed to retrieve pending operations.`,
        error
      );
      throw error;
    }
  }

  /**
   * Get successful detection operations
   */
  public static async getSuccessfulDetections(): Promise<DetectionResult[]> {
    const url =
      DetectionController.API_BASE_URL + "/api/artemis/detection/successes";

    try {
      const res = await axios.get(url);
      let detectionList: DetectionResult[] = [];

      if (res.status == 200) {
        const apiResponse: ApiResponse = res.data;
        if (Array.isArray(apiResponse.data)) {
          detectionList = apiResponse.data;
        }
      } else {
        console.warn(
          `Failed to retrieve successful operations. Status (${res.status})`
        );
      }

      return detectionList;
    } catch (error) {
      console.error(
        `Failed to reach the API : ${url}. Failed to retrieve successful operations.`,
        error
      );
      throw error;
    }
  }

  /**
   * Get failed detection operations
   */
  public static async getFailedDetections(): Promise<DetectionResult[]> {
    const url =
      DetectionController.API_BASE_URL + "/api/artemis/detection/failed";

    try {
      const res = await axios.get(url);
      let detectionList: DetectionResult[] = [];

      if (res.status == 200) {
        const apiResponse: ApiResponse = res.data;
        if (Array.isArray(apiResponse.data)) {
          detectionList = apiResponse.data;
        }
      } else {
        console.warn(
          `Failed to retrieve failed operations. Status (${res.status})`
        );
      }

      return detectionList;
    } catch (error) {
      console.error(
        `Failed to reach the API : ${url}. Failed to retrieve failed operations.`,
        error
      );
      throw error;
    }
  }

  public static async getApplicationStatus(
    application: string
  ): Promise<DetectionResult> {
    const url =
      DetectionController.API_BASE_URL +
      "/api/artemis/detection/status/" +
      application;

    try {
      const res = await axios.get(url);

      if (res.status == 200) {
        const apiResponse: ApiResponse = res.data;
        if (apiResponse == null) return null; // No status

        const appStatus: DetectionResultDTO = DetectionResultDTO.fromRecord(
          apiResponse.data
        );
        return appStatus;
      } else {
        console.warn(`Failed to launch the detection. Status (${res.status})`);
        return null;
      }
    } catch (error) {
      console.error(
        `Failed to reach the API : ${url}. Failed to retrieve pending operations.`,
        error
      );
      throw error;
    }
  }
}

// Launch routines
