import axios from "axios";
import { ApiComUtils } from "../ApiComUtils";
import { DemeterController } from "../demeter/demeter.controller";
import { ApiRegexNode } from "../interface/ApiRegexNode.interface";
import { ApiResponse } from "../interface/ApiResponse.interface";

export class RegexNodeController {
  private static API_BASE_URL = ApiComUtils.getUrl();

  public static async addRegexNode(item: ApiRegexNode): Promise<ApiRegexNode> {
    const url = RegexNodeController.API_BASE_URL + "/api/artemis/regexes/add";

    try {
      const res = await axios.post(url, item);

      if (res.status == 200) {
        const apiResponse: ApiResponse = res.data;
        return apiResponse.data as ApiRegexNode;
      } else {
        throw new Error(
          `Failed to add a Regex Node. Status (${res.status}) : Error : ${res.data}`
        );
      }
    } catch (error) {
      console.error(
        `Failed to reach the API : ${url}. Failed to add a Regex Node..`,
        error
      );
      throw error;
    }
  }

  public static async updateRegexNode(
    item: ApiRegexNode
  ): Promise<ApiRegexNode> {
    const url =
      RegexNodeController.API_BASE_URL + "/api/artemis/regexes/update";

    try {
      const res = await axios.put(url, item);

      if (res.status == 200) {
        const apiResponse: ApiResponse = res.data;
        return apiResponse.data as ApiRegexNode;
      } else {
        throw new Error(
          `Failed to update a Regex Node. Status (${res.status}) : Error : ${res.data}`
        );
      }
    } catch (error) {
      console.error(
        `Failed to reach the API : ${url}. Failed to update a Regex Node..`,
        error
      );
      throw error;
    }
  }

  public static async getAllNode(): Promise<ApiRegexNode[]> {
    const url = RegexNodeController.API_BASE_URL + "/api/artemis/regexes/all";

    try {
      const res = await axios.get(url);

      let results: ApiRegexNode[] = [];
      if (res.status == 200) {
        const apiResponse: ApiResponse = res.data;
        if (Array.isArray(apiResponse.data)) {
          results = apiResponse.data;
        }
        return results;
      } else {
        throw new Error(
          `Failed to retrieve the list of Regex Nodes. Status (${res.status}) : Error : ${res.data}`
        );
      }
    } catch (error) {
      console.error(
        `Failed to reach the API : ${url}. Failed to retrieve the list of Regex Nodes..`,
        error
      );
      throw error;
    }
  }

  /**
   * Test a regex node
   * @param id Id of the regex node to test
   */
  public static async testRegex(id: number): Promise<number> {
    const url =
      RegexNodeController.API_BASE_URL + `/api/artemis/regexes/${id}/test`;

    try {
      const res = await axios.get(url);
      if (res.status == 200) {
        const apiResponse: ApiResponse = res.data;
        return Number(apiResponse.data);
      } else {
        throw new Error(
          `Failed to test the Regex Node. Status (${res.status}) : Error : ${res.data}`
        );
      }
    } catch (error) {
      console.error(
        `Failed to reach the API : ${url}. Failed to test the Regex Node..`,
        error
      );
      throw error;
    }
  }

  /**
   * Test a regex node
   * @param id Id of the regex node to test
   */
  public static async getRegexRequest(id: number): Promise<string> {
    const url =
      RegexNodeController.API_BASE_URL + `/api/artemis/regexes/${id}/request`;

    try {
      const res = await axios.get(url);
      if (res.status == 200) {
        const apiResponse: ApiResponse = res.data;
        return String(apiResponse.data);
      } else {
        throw new Error(
          `Failed to get the request the Regex Node. Status (${res.status}) : Error : ${res.data}`
        );
      }
    } catch (error) {
      console.error(
        `Failed to reach the API : ${url}. Failed to get the request the Regex Node..`,
        error
      );
      throw error;
    }
  }

  /**
   * Delete a regex node
   * @param id Id of the regex node to delete
   */
  public static async deleteRegexNode(id: number): Promise<boolean> {
    const url = RegexNodeController.API_BASE_URL + `/api/artemis/regexes/${id}`;

    try {
      const res = await axios.delete(url);
      if (res.status == 200) {
        const apiResponse: ApiResponse = res.data;
        return Boolean(apiResponse.data);
      } else {
        throw new Error(
          `Failed to delete the Regex Node. Status (${res.status}) : Error : ${res.data}`
        );
      }
    } catch (error) {
      console.error(
        `Failed to reach the API : ${url}. Failed to delete the Regex Node..`,
        error
      );
      throw error;
    }
  }

  public static async getAllNodesAsTree(): Promise<ApiRegexNode[]> {
    const nodes: ApiRegexNode[] = await RegexNodeController.getAllNode();
    const resultTree = nodes.filter(x => x.parentId == -1); // Init the tree

    const toVisit: ApiRegexNode[] = nodes.filter(x => x.parentId == -1);
    const visited: ApiRegexNode[] = [];

    for (let index = 0; index < toVisit.length; index++) {
      const v = toVisit[index];

      for (const n in nodes) {
        if (v.id == nodes[n].parentId) {
          if (!v.children) v.children = []; // Init the list
          v.children.push(nodes[n]); // Push the node to the children

          // Add the node to visit
          toVisit.push(nodes[n]);
        }
      }

      visited.push(v);
      toVisit.splice(index, 1);
    }

    return resultTree;
  }
}
