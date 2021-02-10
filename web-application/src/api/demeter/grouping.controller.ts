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
  private static neo4jal: Neo4JAccessLayer = Neo4JAccessLayer.getInstance()
  private static API_BASE_URL = ApiComUtils.getUrl();
  ;
  private static tagPrefix = "$l_";

  /**
   * Return the Demeter groups detected for a specific application
   * @param application Name of the application
   */
  public static async getApplicationGroupingCandidates(
    application: string
  ): Promise<GroupRecord | null> {
    const request = "CALL demeter.api.get.candidates.level($appName)";
    const results: QueryResult = await this.neo4jal.execute(request);

    if (results.records.length == 0) {
      console.log("No result for application with name : " + application);
      return null;
    }

    const singleRecord = results.records[0];

    const appName = singleRecord.get("application");
    const tag = singleRecord.get("tag");
    const countTag = singleRecord.get("numTags");

    return { application: appName, tags: tag, countTag: countTag };
  }


  /**
   * Get Demeter Groups in a specific application present in the Database
   */
  public static async getDemeterGroupedLevels5(
    applicationName: string
  ): Promise<Level5Group[]> {
    const request = `MATCH (app:Application) WHERE app.Name='${applicationName}' 
      WITH [app.Name] as appName  
      MATCH (l:Level5:${applicationName})-[:Aggregates]->(o:Object) WHERE l.FullName=~'.*##Dml_(.*)'
      RETURN ID(l) as id, l.Name as groupName, COUNT(o) as numObjects ;`;

    const results: QueryResult = await this.neo4jal.execute(request);

    const appNames: Level5Group[] = [];
    for (let i = 0; i < results.records.length; i++) {
      const singleRecord = results.records[i];

      const id = int(singleRecord.get("id")).toNumber();
      const groupName = singleRecord.get("groupName");
      const numObjects = singleRecord.get("numObjects");

      appNames.push({
        id: id,
        name: groupName,
        application: applicationName,
        numObjects: numObjects,
        demeterGroup: true
      });
    }

    return appNames;
  }

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
