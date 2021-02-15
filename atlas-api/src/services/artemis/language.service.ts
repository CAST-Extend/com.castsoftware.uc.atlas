import { logger } from "@shared/logger";
import { Neo4JAccessLayer } from "@database/neo4jAccessLayer";
import HttpException from "@exceptions/HttpException";

class LanguageService {
    private neo4jAl: Neo4JAccessLayer = Neo4JAccessLayer.getInstance();
  
    /**
     * Get the list of supported languages 
     */
    public async getLanguages(): Promise<string[]> {
        const req = `CALL artemis.get.supported.languages()`;
    
        try {
          const val = await this.neo4jAl.execute(req);
          if (!val.records || val.records.length == 0) return [];
    
          const languages: string[] = [];
          for (let index = 0; index < val.records.length; index++) {
              const element = String(val.records[index].get(0));
              languages.push(element);
          }

          return languages;
        } catch (err) {
          logger.error(
            "An internal error occurred in LanguageService::getLanguages ",
            err
          );
          throw new HttpException(500, "Internal error");
        }
      }
}


export default LanguageService;