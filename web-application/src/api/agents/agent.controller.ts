import axios from "axios";
import { ApiResponse } from "../interface/ApiResponse.interface";
import { ApiComUtils } from "../ApiComUtils";

export default class AgentController {
  private static API_BASE_URL = ApiComUtils.getUrl();

  /**
   * Get the status of the agent (Running or stopped)
   * @param agent Name of the agent
   */
  public static async getStatus(agent: string): Promise<boolean> {
    const url =
      AgentController.API_BASE_URL + `/api/atlas/agents/${agent}/status`;
    try {
      // Build the URl ( optional type internalType)
      const res = await axios.get(url);
      let status = false;

      if (res.status == 200) {
        const apiResponse: ApiResponse = res.data;
        status = Boolean(apiResponse.data);
      } else {
        throw new Error(`Status (${res.status})`);
      }

      return status;
    } catch (error) {
      console.error(
        `Something went wrong trying to change the status of agent ${agent}.`,
        error
      );
      throw error;
    }
  }

  public static async getPrefix(agent: string): Promise<string> {
    const url =
      AgentController.API_BASE_URL + `/api/atlas/agents/${agent}/prefix`;
    try {
      // Build the URl ( optional type internalType)
      const res = await axios.get(url);
      if (res.status == 200 || res.status == 304) {
        const apiResponse: ApiResponse = res.data;
        return String(apiResponse.data);
      } else {
        throw new Error(`Status (${res.status})`);
      }
    } catch (error) {
      console.error(
        `Something went wrong trying to get the prefix of agent ${agent}.`,
        error
      );
      throw error;
    }
  }

  /**
   * Stop the Agent
   * @param agent Name of the agent
   */
  public static async stopAgent(agent: string) {
    const url =
      AgentController.API_BASE_URL + `/api/atlas/agents/${agent}/stop`;
    try {
      // Build the URl ( optional type internalType)
      const res = await axios.get(url);
      let status = false;

      if (res.status == 200) {
        const apiResponse: ApiResponse = res.data;
        status = Boolean(apiResponse.data);
      } else {
        throw new Error(`Status (${res.status})`);
      }

      return status;
    } catch (error) {
      console.error(
        `Something went wrong trying to change the status of agent ${agent}.`,
        error
      );
      throw error;
    }
  }

  /**
   * Start an agent
   * @param agent Name of the agent
   */
  public static async startAgent(agent: string) {
    const url =
      AgentController.API_BASE_URL + `/api/atlas/agents/${agent}/start`;
    try {
      // Build the URl ( optional type internalType)
      const res = await axios.get(url);
      let status = false;

      if (res.status == 200) {
        const apiResponse: ApiResponse = res.data;
        status = Boolean(apiResponse.data);
      } else {
        throw new Error(`Status (${res.status})`);
      }

      return status;
    } catch (error) {
      console.error(
        `Something went wrong trying to change the status of agent ${agent}.`,
        error
      );
      throw error;
    }
  }

  public static async forceAgent(agent: string) {
    const url =
      AgentController.API_BASE_URL + `/api/atlas/agents/${agent}/force`;
    try {
      // Build the URl ( optional type internalType)
      const res = await axios.get(url);
      let status = false;

      if (res.status == 200) {
        const apiResponse: ApiResponse = res.data;
        status = Boolean(apiResponse.data);
      } else {
        throw new Error(`Status (${res.status})`);
      }

      return status;
    } catch (error) {
      console.error(
        `Something went wrong trying to force the action of the agent ${agent}.`,
        error
      );
      throw error;
    }
  }
}
