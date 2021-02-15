import { logger } from "@shared/logger";
import { QueryResult } from "neo4j-driver";
import { Neo4JAccessLayer } from "@database/neo4jAccessLayer";
import HttpException from "@exceptions/HttpException";

class ApplicationService {
    private neo4jAl: Neo4JAccessLayer = Neo4JAccessLayer.getInstance();
  
    /**
     * Get the version of Artemis
     */
    public async getApplications(): Promise<string[]> {    
        try {
            const request = "MATCH (n:Application) RETURN n.Name as name";

            const results: QueryResult = await this.neo4jAl.execute(request);
        
            const appNames: string[] = [];
            for (let i = 0; i < results.records.length; i++) {
              const singleRecord = results.records[i];
              const name = singleRecord.get("name");
              appNames.push(name);
            }
        
            return appNames;
        } catch (err) {
          logger.error(
            "Failed to verify the installation of artemis...",
            err
          );
          throw new HttpException(500, "Internal error");
        }
      }
}


export default ApplicationService;