import { Neo4JAccessLayer } from "@database/neo4jAccessLayer";
import HttpException from "@exceptions/HttpException";
import { logger } from "@shared/logger";

class DemeterService {
    private neo4jAl: Neo4JAccessLayer = Neo4JAccessLayer.getInstance();
  
    /**
     * Get the version of Artemis
     */
    public async getVersion(): Promise<string> {
        const req: string = `CALL demeter.version()`;
    
        try {
          const val = await this.neo4jAl.execute(req);
          if (!val.records || val.records.length == 0) {
                logger.error(
                "No version of Artemis was sent"
              );
              throw new HttpException(500, "Internal error");
          }
    
          return String(val.records[0].get(0));
        } catch (err) {
          logger.error(
            "Failed to verify the installation of artemis...",
            err
          );
          throw new HttpException(500, "Internal error");
        }
      }
}


export default DemeterService;