import { QueryResult } from "neo4j-driver";
import { Neo4JAccessLayer } from "../Neo4jAccessLayer";

export class UtilsController {
  private static neo4jal: Neo4JAccessLayer = Neo4JAccessLayer.getInstance();

  /**
   * Get the actual version of the demeter extension
   */
  public static async getDemeterVersion(): Promise<string | null> {
    const request = "CALL demeter.getVersion();";

    try {
      const results: QueryResult = await this.neo4jal.execute(request);
      // Get the version
      return results.records[0].get(0);
    } catch (error) {
      console.log(
        "Unable to call the demeter extension. Make sure it's installed."
      );
      return null;
    }
  }
}
