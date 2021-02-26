import axios from "axios";
import { ApiComUtils } from "../ApiComUtils";
import { ApiResponse } from "../interface/ApiResponse.interface";
import { IFrameworkAssistant } from "../interface/atlas/FrameworkAssistant.interface";

export class FrameworkAssistants {
  private static API_BASE_URL = ApiComUtils.getUrl();

  public static async getPossibleActions(): Promise<string[]> {
    const url =
      FrameworkAssistants.API_BASE_URL +
      "/api/assistants/frameworks/options/actions";

    try {
      const res = await axios.get(url);

      let actions: string[] = [];

      if (res.status == 200) {
        const apiResponse: ApiResponse = res.data;
        if (Array.isArray(apiResponse.data)) {
          actions = apiResponse.data;
        }
      } else {
        console.warn(`Failed to get the actions. Status (${res.status})`);
      }
      console.log("Action retrieved", actions);
      return actions;
    } catch (error) {
      console.error(
        `Failed to reach the API : ${url}. Failed to get the list of actions .`,
        error
      );
      throw error;
    }
  }

  public static async getFrameworksCategories(): Promise<string[]> {
    const url =
      FrameworkAssistants.API_BASE_URL +
      "/api/assistants/frameworks/options/categories";

    try {
      const res = await axios.get(url);

      let categories: string[] = [];

      if (res.status == 200) {
        const apiResponse: ApiResponse = res.data;
        if (Array.isArray(apiResponse.data)) {
          categories = apiResponse.data;
        }
      } else {
        console.warn(`Failed to get the categories. Status (${res.status})`);
      }

      return categories;
    } catch (error) {
      console.error(
        `Failed to reach the API : ${url}. Failed to get the list of categories .`,
        error
      );
      throw error;
    }
  }

  public static async getAllAssistants(): Promise<IFrameworkAssistant[]> {
    const url =
      FrameworkAssistants.API_BASE_URL +
      "/api/assistants/frameworks/all";

    try {
      const res = await axios.get(url);

      let assistants: IFrameworkAssistant[] = [];

      if (res.status == 200) {
        const apiResponse: ApiResponse = res.data;
        if (Array.isArray(apiResponse.data)) {
          assistants = apiResponse.data;
        }
      } else {
        console.warn(`Failed to get all the assistants. Status (${res.status})`);
      }

      return assistants;
    } catch (error) {
      console.error(
        `Failed to reach the API : ${url}. Failed to all the assistants.`,
        error
      );
      throw error;
    }
  }

  public static async newAssistant(category : string, actions: string[]): Promise<boolean> {
    const url =
      FrameworkAssistants.API_BASE_URL +
      "/api/assistants/frameworks/new";

    try {
      const body = { category : category, actions : actions }
      const res = await axios.post(url, body);

      if (res.status == 200) {
        return true;
      } else {
        console.warn(`Failed to create the assistant. Status (${res.status})`);
      }

      return false;
    } catch (error) {
      console.error(
        `Failed to reach the API : ${url}. Failed to create the assistant.`,
        error
      );
      throw error;
    }
  }

  public static async removeAssistant(id:number): Promise<boolean> {
    const url =
      FrameworkAssistants.API_BASE_URL +
      "/api/assistants/frameworks/remove/"+id;

    try {
      const res = await axios.delete(url);

      if (res.status == 200) {
        return true;
      } else {
        console.warn(`Failed to delete the assistant. Status (${res.status})`);
      }

      return false;
    } catch (error) {
      console.error(
        `Failed to reach the API : ${url}. Failed to delete the assistant.`,
        error
      );
      throw error;
    }
  }

}
