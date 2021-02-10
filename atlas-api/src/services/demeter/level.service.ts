import { Neo4JAccessLayer } from "@database/neo4jAccessLayer";
import { CandidateResults } from "@interfaces/demeter/candidateResults.interface";
import { Level5Group } from "@interfaces/demeter/level.interface";
import { int, QueryResult } from "neo4j-driver";

export default class LevelService {
  private neo4jAl: Neo4JAccessLayer = Neo4JAccessLayer.getInstance();


    /**
     * Get the Level Candidates for a demeter grouping
     * @param application Name of the application
     */
    public async getCandidatesLevel(application:string)  : Promise<CandidateResults[]> {
      const req = "CALL demeter.api.get.candidate.levels($appName)";
      const params = { appName: application };

      let groups:CandidateResults[] = [];

      const res = await this.neo4jAl.executeWithParameters(req, params);

      for (let index = 0; index < res.records.length; index++) {
          const record = res.records[index];
          groups.push({
              application: record.get("application"),
              tags: record.get("tags"),
              numTags: record.get("numTags")
          });
      }

      return groups;

  } 

  /**
   * Get the demeter levels in a application
   * @param application Name of the application
   */
  public async getGroupedDemeterLevel(application:string) : Promise<Level5Group[]> {
      const req = 'CALL demeter.api.get.demeter.levels($appName)';
      const params = { appName: application };

      let groups:Level5Group[] = [];

      const res = await this.neo4jAl.executeWithParameters(req, params);

      for (let index = 0; index < res.records.length; index++) {
          const record = res.records[index];
          groups.push({
              id: int(record.get("id")).toNumber(),
              name: record.get("name"),
              application: record.get("application"),
              numObjects: record.get("numObjects"),
              demeterGroup: true
          })
      }

      return groups;

  } 

  /**
   * Group object in a specific application
   * @param application
   */
  public async executeGrouping(application: string): Promise<number> {
    const request = `CALL demeter.group.levels("${application}")`;

    const results: QueryResult = await this.neo4jAl.execute(request);
    return results.records.length || 0;
  }

    /**
   * Group object in a specific application
   * @param application
   */
  public async executeGroupingInAllApplications(): Promise<number> {
    const request = `CALL demeter.api.group.levels.all()`;

    const results: QueryResult = await this.neo4jAl.execute(request);
    return results.records.length || 0;
  }


  /**
   * Retrieve of the level 5 specific to one application
   * @param applicationName Name of the application
   */
  public async getAllLevels(applicationName: string): Promise<Level5Group[]> {
    const request = `MATCH (app:Application) WHERE app.Name='${applicationName}' 
      WITH [app.Name] as appName  
      MATCH (l:Level5:${applicationName})-[:Aggregates]->(o:Object) 
      RETURN ID(l) as id, l.Name as groupName, l.FullName as fullName, COUNT(o) as numObjects ;`;

    const results: QueryResult = await this.neo4jAl.execute(request);

    const appNames: Level5Group[] = [];
    for (let i = 0; i < results.records.length; i++) {
      const singleRecord = results.records[i];

      const id = int(singleRecord.get("id")).toNumber();
      const groupName = singleRecord.get("groupName");
      const numObjects = int(singleRecord.get("numObjects")).toNumber();
      const fullName: string = singleRecord.get("fullName");

      const isDemeterGroup = fullName.includes("##Dml_");

      appNames.push({
        id: id,
        name: groupName,
        application: applicationName,
        numObjects: numObjects,
        demeterGroup: isDemeterGroup,
      });
    }

    return appNames;
  }

  /**
   * Undo the grouping of a specific level in an application
   * @param applicationName Name of the application targeted by the undo
   * @param groupName Name of the group
   */
  public async undoGroupedLevel5(
    applicationName: string,
    groupName: string
  ): Promise<boolean> {
    const request = `CALL demeter.undo.oneLevel('${applicationName}', '${groupName}');`;

    const results: QueryResult = await this.neo4jAl.execute(request);

    return (results.records && results.records.length != 0);
  }

  /**
   * Rename
   * @param applicationName Name of the application
   * @param groupName Old name of the group
   * @param newName New name of the module
   */
  public async renameLevel(
    applicationName: string,
    groupName: string,
    newName: string
  ): Promise<boolean> {
    const request = `CALL demeter.rename.level('${applicationName}', '${groupName}', '${newName}');`;

    const results: QueryResult = await this.neo4jAl.execute(request);
    return (results.records && results.records.length != 0);
  }
}
