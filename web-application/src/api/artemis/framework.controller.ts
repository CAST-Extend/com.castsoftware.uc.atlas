import axios from "axios";
import { ApiComUtils } from "../ApiComUtils";
import { DetectionResult, Framework } from "../interface/ApiArtemis.interface";
import { ApiResponse } from "../interface/ApiResponse.interface";

export class FrameworkController {
  private static API_BASE_URL = ApiComUtils.getUrl();

  // Find frameworks by name
  public static async findFramework(
    name: string,
    internalType?: string
  ): Promise<DetectionResult[]> {
    let url =
      FrameworkController.API_BASE_URL + "/api/artemis/frameworks/find/";

    try {
      // Build the URl ( optional type internalType)
      const sanitizedName = name.replace(" ", "+");
      url += sanitizedName;

      if (internalType && internalType != "") {
        const sanitizedInternal = internalType.replace(" ", "+");
        url += "?internalType=" + sanitizedInternal;
      }

      const res = await axios.get(url);
      let detectionList: DetectionResult[] = [];

      if (res.status == 200) {
        const apiResponse: ApiResponse = res.data;
        if (Array.isArray(apiResponse.data)) {
          detectionList = apiResponse.data;
        }
      } else {
        console.warn(
          `Failed to retrieve frameworks by its name. Status (${res.status})`
        );
      }

      return detectionList;
    } catch (error) {
      console.error(
        `Failed to reach the API : ${url}. Failed to retrieve frameworks by its name.`,
        error
      );
      throw error;
    }
  }

  // Get the number of Frameworks
  public static async getTotalFramework(
    internalType?: string
  ): Promise<number> {
    let url =
      FrameworkController.API_BASE_URL + "/api/artemis/frameworks/total";

    try {
      // Build the URl ( optional type internalType)
      if (internalType && internalType != "") {
        const sanitizedInternal = internalType.replace(" ", "+");
        url += "?internalType=" + sanitizedInternal;
      }

      const res = await axios.get(url);
      let num: number;
      if (res.status == 200) {
        const apiResponse: ApiResponse = res.data;
        num = Number(apiResponse.data);
      } else {
        console.warn(
          `Failed to retrieve number of frameworks by internalType. Status (${res.status})`
        );
      }

      return num;
    } catch (error) {
      console.error(
        `Failed to reach the API : ${url}. Failed to retrieve frameworks by internalType.`,
        error
      );
      throw error;
    }
  }

  /**
   * Search for a framework where the name contains a specific string
   * @param toSearch String to search
   */
  public static async searchFramework(toSearch: string) {
    const url =
      FrameworkController.API_BASE_URL + "/api/artemis/frameworks/search/";
    try {
      // Build the URl ( optional type internalType)
      const res = await axios.get(url + toSearch);
      let typeList: Framework[] = [];

      if (res.status == 200) {
        const apiResponse: ApiResponse = res.data;
        if (Array.isArray(apiResponse.data)) {
          typeList = apiResponse.data;
        }
      } else {
        console.warn(`Failed to search the frameworks. Status (${res.status})`);
      }

      return typeList;
    } catch (error) {
      console.error(
        `Failed to reach the API : ${url}. Failed to search the frameworks.`,
        error
      );
      throw error;
    }
  }

  /**
   * Get the list of internal type for the frameworks
   */
  public static async getInternalTypes() {
    const url =
      FrameworkController.API_BASE_URL +
      "/api/artemis/frameworks/internalTypes";
    try {
      // Build the URl ( optional type internalType)
      const res = await axios.get(url);
      let typeList: string[] = [];

      if (res.status == 200) {
        const apiResponse: ApiResponse = res.data;
        if (Array.isArray(apiResponse.data)) {
          typeList = apiResponse.data;
        }
      } else {
        console.warn(
          `Failed to retrieve list of internal type. Status (${res.status})`
        );
      }

      return typeList;
    } catch (error) {
      console.error(
        `Failed to reach the API : ${url}. Failed to retrieve list of internal type.`,
        error
      );
      throw error;
    }
  }

  // Get the list of Framework to validate
  public static async getToValidateFrameworks(): Promise<Framework[]> {
    const url =
      FrameworkController.API_BASE_URL + "/api/artemis/frameworks/toValidate";
    try {
      const res = await axios.get(url);

      if (res.status == 200 || res.status == 304) {
        const apiResponse: ApiResponse = res.data;
        if (Array.isArray(apiResponse.data)) {
          return apiResponse.data;
        }
      } else {
        throw new Error(
          ` Bad status. Status (${res.status}). Query-Content : ${res.data}`
        );
      }
    } catch (err) {
      console.error(
        `Failed to reach the API : ${url}. Failed to retrieve a the list of frameworks to validate.`,
        err
      );
      throw err;
    }
  }

  // Get the list of Framework to validate
  public static async getDuplicatesFrameworks(): Promise<Framework[]> {
    const url =
      FrameworkController.API_BASE_URL + "/api/artemis/frameworks/duplicates";
    try {
      const res = await axios.get(url);

      if (res.status == 200 || res.status == 304) {
        const apiResponse: ApiResponse = res.data;
        if (Array.isArray(apiResponse.data)) {
          return apiResponse.data;
        }
      } else {
        throw new Error(
          ` Bad status. Status (${res.status}). Query-Content : ${res.data}`
        );
      }
    } catch (err) {
      console.error(
        `Failed to reach the API : ${url}. Failed to retrieve a the list of duplicates frameworks.`,
        err
      );
      throw err;
    }
  }

    // Get the list of Framework to validate
    public static async launchAutoCleaning(): Promise<number> {
      const url =
        FrameworkController.API_BASE_URL + "/api/artemis/frameworks/autoClean";
      try {
        const res = await axios.get(url);
  
        if (res.status == 200 || res.status == 304) {
          const apiResponse: ApiResponse = res.data;
          return Number(apiResponse.data);
        } else {
          throw new Error(
            ` Bad status. Status (${res.status}). Query-Content : ${res.data}`
          );
        }
      } catch (err) {
        console.error(
          `Failed to reach the API : ${url}. Failed to retrieve execute the auto cleaning on the server.`,
          err
        );
        throw err;
      }
    }

  // Get a batch of framework ( filter by internal type possible )
  public static async getFrameworkBatch(
    start: number,
    stop: number,
    internalType?: string
  ): Promise<Framework[]> {
    let url =
      FrameworkController.API_BASE_URL + "/api/artemis/frameworks/batch";

    try {
      // Build the URl ( optional type internalType)
      url += "?start=" + start;
      url += "&stop=" + stop;

      if (internalType && internalType != "") {
        const sanitizedInternal = internalType.replace(" ", "+");
        url += "&internalType=" + sanitizedInternal;
      }

      const res = await axios.get(url);
      let detectionList: Framework[] = [];

      if (res.status == 200) {
        const apiResponse: ApiResponse = res.data;
        if (Array.isArray(apiResponse.data)) {
          detectionList = apiResponse.data;
          console.log(detectionList);
        }
      } else {
        console.warn(
          `Failed to retrieve a batch of frameworks by internalType. Status (${res.status})`
        );
      }

      return detectionList;
    } catch (error) {
      console.error(
        `Failed to reach the API : ${url}. Failed to retrieve a batch frameworks by internalType.`,
        error
      );
      throw error;
    }
  }

  /**
   * Update a framework ( the name will be used
   * @param framework Framework updated
   */
  public static async updateFrameworks(
    oldName: string,
    oldInternalType: string,
    framework: Framework
  ): Promise<boolean> {
    const url =
      FrameworkController.API_BASE_URL + "/api/artemis/frameworks/update";

    try {
      const body: any = {};
      body.oldName = oldName;
      body.oldInternalType = oldInternalType;
      body.framework = framework;

      const res = await axios.post(url, body);
      let updateResutls = false;

      if (res.status == 200) {
        const apiResponse: ApiResponse = res.data;
        updateResutls = Boolean(apiResponse.data);
      } else {
        console.warn(
          `Failed to retrieve a batch of frameworks by internalType. Status (${res.status})`
        );
      }

      return updateResutls;
    } catch (error) {
      console.error(
        `Failed to reach the API : ${url}. Failed to retrieve a batch frameworks by internalType.`,
        error
      );
      throw error;
    }
  }

  public static async updateFrameworksById(
    framework: Framework
  ): Promise<boolean> {
    const url =
      FrameworkController.API_BASE_URL + "/api/artemis/frameworks/updateByID";

    try {
      const body: any = {};
      body.framework = framework;

      const res = await axios.post(url, body);
      let updateResutls = false;

      if (res.status == 200) {
        const apiResponse: ApiResponse = res.data;
        updateResutls = Boolean(apiResponse.data);
      } else {
        console.warn(
          `Failed to update a framework by its Id. Status (${res.status})`
        );
      }

      return updateResutls;
    } catch (error) {
      console.error(
        `Failed to reach the API : ${url}. Failed to update a framework by its Id.`,
        error
      );
      throw error;
    }
  }

  public static async addFramework(framework: Framework): Promise<boolean> {
    const url =
      FrameworkController.API_BASE_URL + "/api/artemis/frameworks/add";

    try {
      const body: any = {};
      body.framework = framework;

      const res = await axios.post(url, body);
      let updateResutls = false;

      if (res.status == 200) {
        const apiResponse: ApiResponse = res.data;
        updateResutls = Boolean(apiResponse.data);
      } else {
        console.warn(
          `Failed to add a framework by its Id. Status (${res.status})`
        );
      }

      return updateResutls;
    } catch (error) {
      console.error(
        `Failed to reach the API : ${url}. Failed to add a framework.`,
        error
      );
      throw error;
    }
  }

  /**
   * Delete the framework by its id
   * @param id Id of the Framework to delete
   */
  public static async deleteFramework(id: number): Promise<boolean> {
    const url =
      FrameworkController.API_BASE_URL + "/api/artemis/frameworks/delete";

    try {
      const body: any = { id: id };

      const res = await axios.post(url, body);
      let result = false;

      if (res.status == 200) {
        const apiResponse: ApiResponse = res.data;
        result = Boolean(apiResponse.data);
      } else {
        console.warn(
          `Failed to delete a framework by its Id. Status (${res.status})`
        );
      }

      return result;
    } catch (error) {
      console.error(
        `Failed to reach the API : ${url}. Failed to delete a framework.`,
        error
      );
      throw error;
    }
  }

  /**
   * Toggle the type of the framework by its id
   * @param id Id of the Framework to toggle
   */
  public static async toggleFramework(id: number): Promise<boolean> {
    const url =
      FrameworkController.API_BASE_URL +
      "/api/artemis/frameworks/toggle/validation";

    try {
      const body: any = { id: id };

      const res = await axios.post(url, body);
      let result = false;

      if (res.status == 200) {
        const apiResponse: ApiResponse = res.data;
        result = Boolean(apiResponse.data);
      } else {
        console.warn(
          `Failed to toggle the type of a framework by its Id. Status (${res.status})`
        );
      }

      return result;
    } catch (error) {
      console.error(
        `Failed to toggle the type of the API : ${url}. Failed to toggle a framework.`,
        error
      );
      throw error;
    }
  }
}
