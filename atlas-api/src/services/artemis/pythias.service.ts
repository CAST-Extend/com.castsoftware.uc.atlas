import { logger } from "@shared/logger";
import { Neo4JAccessLayer } from "@database/neo4jAccessLayer";
import HttpException from "@exceptions/HttpException";

class PythiaService {
    private neo4jAl: Neo4JAccessLayer = Neo4JAccessLayer.getInstance();
  
    /**
     * Get the last update of the local database ( as a Timestamp )
     */
    public async getLastUpdateBase() {
        const req: string = `CALL artemis.api.get.last.update()`;
    
        try {
          const val = await this.neo4jAl.execute(req);
          if (!val.records || val.records.length == 0) return 0;

          return Number(val.records[0].get(0));
        } catch (err) {
          logger.error(
            "Failed to get a forecast of the next pull.",
            err
          );
          throw new HttpException(500, "Internal error");
        }
    }

    /**
     * Get the last update of the Pytha ( as a Timestamp )
     */
    public async getLastUpdatePythia() : Promise<number> {
        const req: string = `CALL artemis.api.pythia.get.lastUpdate()`;
    
        try {
          const val = await this.neo4jAl.execute(req);
          if (!val.records || val.records.length == 0) return 0;

          return Number(val.records[0].get(0));
        } catch (err) {
          logger.error(
            "Failed to get a forecast of the next pull.",
            err
          );
          throw new HttpException(500, "Internal error");
        }
    }

    /**
     * Pull the frameworks from Pythia
     */
    public async pullFramworks() : Promise<number> {
        
        const req: string = `CALL artemis.api.pythia.pull.frameworks()`;
    
        try {
          const val = await this.neo4jAl.execute(req);
          if (!val.records || val.records.length == 0) return 0;
          return val.records.length;
        } catch (err) {
          logger.error(
            "Failed to pull frameworks from the Pythia",
            err
          );
          throw new HttpException(500, "Internal error");
        }
    }


    /**
     * Get the list of supported languages 
     */
    public async getPullForecast(): Promise<number> {
      const req: string = `CALL artemis.api.pythia.pull.frameworks.forecast()`;
    
        try {
          const val = await this.neo4jAl.execute(req);
          if (!val.records || val.records.length == 0) return 0;
          console.log("Forecast pull : " + req);

          return Number(val.records[0].get(0));
        } catch (err) {
          logger.error(
            "Failed to get a forecast of the next pull.",
            err
          );
          throw new HttpException(500, "Internal error");
        }
      }
}


export default PythiaService;