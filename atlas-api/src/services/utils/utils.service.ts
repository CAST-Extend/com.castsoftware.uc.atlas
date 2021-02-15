import { logger } from "@shared/logger";
import { QueryResult } from "neo4j-driver";
import { Neo4JAccessLayer } from "@database/neo4jAccessLayer";
import HttpException from "@exceptions/HttpException";

class UtilsService {
    private neo4jAl: Neo4JAccessLayer = Neo4JAccessLayer.getInstance();
  
    /**
     * Get the version of Artemis
     */
    public async healthCheck(): Promise<boolean> {    
        try {
            const request = "Match () Return 1 Limit 1";

            const results: QueryResult = await this.neo4jAl.execute(request);
            if(!results.records[0]) return false;
            return true;
        } catch (err) {
          return false;
        }
      }
}


export default UtilsService;