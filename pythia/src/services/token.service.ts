import config from "config";
import { QueryResult } from 'neo4j-driver';
import { logger } from '@utils/logger';
import { Neo4JAccessLayer } from '@utils/neo4jAccessLayer';
import { uuidv4, wait } from "@utils/util";

class TokenService {

  private static INSTANCE:TokenService = new TokenService()

  private neo4jAL: Neo4JAccessLayer;
  private inBaseToken: string[];

  

  /**
   * Create a new token
   */
  private async createToken() : Promise<string> {

    const token: string = uuidv4();
    const req = "CREATE (o:PythiaToken) SET o.Token=$token SET o.Creation=$creationDate";
    
    // Insert the token
    await this.neo4jAL.executeWithParameters(req, { token : token, creationDate : new Date() });

    this.inBaseToken.push(token);

    return token;
  }

  /**
   * Verify the validity of a Token in the database
   * @param token Token to verify
   */
  public static isValidToken(token:string) : boolean {
      return ( TokenService.INSTANCE.inBaseToken.indexOf(token) != -1); 
  }

  /**
   * Load the token in the database
   */
  private async loadTokens() : Promise<void>{
      try {
        const req = "MATCH (o:PythiaToken) RETURN o.Token as token";
        const results: QueryResult = await this.neo4jAL.execute(req);
  
        this.inBaseToken = [];
  
        let record;
        let token;
        for(let i = 0; i < results.records.length; i++ ) {
          record = results.records[i];
          token = record.get("token");
  
          this.inBaseToken.push(token);
        }

        // Create a admin token if no token is present 
        if(this.inBaseToken.length == 0) {
          token = await this.createToken();
          logger.info(`[Admin] No token was detected in the database. Key : [${token}].`)
        }
  
        logger.info(`🔃 ${this.inBaseToken.length} token were loaded in the database.`)
      } catch (err) {
          logger.error("Failed to retrieve token from the database.", err);
      }

      // Reload token every 10 seconds
      const delay: number = config.get("authentication.reloadDelay");
      await wait(delay);

      this.loadTokens();

  }

  /**
   * Constructor  of the Token service
   */
  private constructor() {
      this.neo4jAL = Neo4JAccessLayer.getInstance();
      this.inBaseToken = []

      // Launch routine 
      this.loadTokens()
  }

  /**
   * The actual instance of the service
   */
  public static getInstance() : TokenService {
      if(TokenService.INSTANCE == null) {
        TokenService.INSTANCE = new TokenService();
      }
      return TokenService.INSTANCE;
  }
}

export default TokenService;
