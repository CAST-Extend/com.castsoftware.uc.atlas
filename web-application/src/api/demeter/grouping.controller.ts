import { int, QueryResult } from "neo4j-driver";
import { ApiComUtils } from "../ApiComUtils";
import { Neo4JAccessLayer } from "../Neo4jAccessLayer";

export interface GroupRecord {
  application: string;
  tags: string[];
  countTag: number;
}

export interface Level5Group {
  id: number;
  name: string;
  application: string;
  numObjects: number;
  demeterGroup: boolean;
}

export interface ModuleGroup {
  id: number;
  name: string;
  application: string;
  numObjects: number;
  demeterGroup: boolean;
}

/**
 * Controller managing the Demeter Groups in the database
 */
export class GroupingController {
  private static neo4jal: Neo4JAccessLayer = Neo4JAccessLayer.getInstance();
  private static API_BASE_URL = ApiComUtils.getUrl();
  private static tagPrefix = "$l_";

  /**
   * Get Demeter Module in a specific application present in the Database
   */
  public static async getDemeterModules(
    applicationName: string
  ): Promise<ModuleGroup[]> {
    const request = `MATCH (app:Application) WHERE app.Name='${applicationName}' 
      WITH [app.Name] as appName  
      MATCH (l:Module:${applicationName}) WHERE l.AipId="-1" OR l.AipId="9999999" 
      RETURN ID(l) as id, l.Name as groupName, l.Count as numObjects ;`;

    const results: QueryResult = await this.neo4jal.execute(request);

    const modules: ModuleGroup[] = [];
    for (let i = 0; i < results.records.length; i++) {
      const singleRecord = results.records[i];

      const id = int(singleRecord.get("id")).toNumber();
      const groupName = singleRecord.get("groupName");
      const numObjects = singleRecord.get("numObjects");

      modules.push({
        id: id,
        name: groupName,
        application: applicationName,
        numObjects: numObjects,
        demeterGroup: true
      });
    }

    return modules;
  }
}
