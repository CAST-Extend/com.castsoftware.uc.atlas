import { Neo4JAccessLayer } from "@database/neo4jAccessLayer";
import { CandidateResults } from "@interfaces/demeter/candidateResults.interface";
import { Level5Group } from "@interfaces/demeter/level.interface";
import { int, QueryResult } from "neo4j-driver";

export default class ModuleService {
  private neo4jAl: Neo4JAccessLayer = Neo4JAccessLayer.getInstance();

  /**
   * Group object in a specific application
   * @param application
   */
  public async executeGrouping(application: string): Promise<number> {
    const request = `CALL demeter.group.modules("${application}")`;

    const results: QueryResult = await this.neo4jAl.execute(request);
    return results.records.length || 0;
  }

  /**
   * Group object in a specific application
   * @param application
   */
  public async executeGroupingInAllApplications(): Promise<number> {
    const request = `CALL demeter.api.group.modules.all()`;

    const results: QueryResult = await this.neo4jAl.execute(request);
    return results.records.length || 0;
  }
}
