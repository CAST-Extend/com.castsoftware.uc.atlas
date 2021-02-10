import { Neo4JAccessLayer } from "@database/neo4jAccessLayer";
import { QueryResult } from "neo4j-driver";

export default class ArchitectureService {
  private neo4jAl: Neo4JAccessLayer = Neo4JAccessLayer.getInstance();

  /**
   * Group object in a specific application
   * @param application
   */
  public async executeGroupingInAllApplications(): Promise<number> {
    const request = `CALL demeter.api.group.architectures.views.all()`;

    const results: QueryResult = await this.neo4jAl.execute(request);
    return results.records.length || 0;
  }
}
