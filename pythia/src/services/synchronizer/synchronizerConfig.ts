import { QueryResult } from 'neo4j-driver';
import { Neo4JAccessLayer } from '@utils/neo4jAccessLayer';

class SynchronizerService {
  private static INSTANCE: SynchronizerService = new SynchronizerService();
  private static SYNC_NODE_LABEL = 'PythiaSynchronizerConf';

  private neo4jAL: Neo4JAccessLayer;
  private inBaseToken: string[];

  private async deleteAndCreate():  Promise<number> {
    const req = `MATCH (o:${SynchronizerService.SYNC_NODE_LABEL}) DETACH DELETE o;`;

    // Insert the token
    await this.neo4jAL.execute(req);
    return await this.createConfig();
  }

  /**
   * Create a new token
   */
  private async createConfig(): Promise<number> {
    const dateTime = Number(new Date());
    const req = `CREATE (o:${SynchronizerService.SYNC_NODE_LABEL}) SET o.LastUpdate=$date`;

    // Insert the token
    await this.neo4jAL.executeWithParameters(req, { date: dateTime });

    return dateTime;
  }

  /**
   * Get the config in the database
   */
  public async getLastUpdate(): Promise<number> {
    let lastUpdate: number;

    const req = `MATCH (o:${SynchronizerService.SYNC_NODE_LABEL}) RETURN o.LastUpdate as lastDate LIMIT 1`;

    // Insert the token
    const res: QueryResult = await this.neo4jAL.execute(req);

    if (!res.records || res.records.length == 0) {
      lastUpdate = await this.createConfig();
    } else {
        lastUpdate = Number(res.records[0].get(0));
        if(lastUpdate == null || isNaN(lastUpdate)) {
          lastUpdate = await this.deleteAndCreate();
        }
    }

    console.log("Got last update :" + lastUpdate)

    return lastUpdate;
  }

  /**
   * Update the timestamp of the last update in the last config
   */
  public async setLastUpdate() : Promise<number> {
    let lastUpdate: number;

    const req = `MATCH (o:${SynchronizerService.SYNC_NODE_LABEL}) SET o.LastUpdate=$date RETURN o.LastUpdate as lastDate LIMIT 1`;

    // Insert the token
    const res: QueryResult = await this.neo4jAL.executeWithParameters(req, { date: Number(new Date()) });

    if (!res.records || res.records.length == 0) {
      lastUpdate = await this.createConfig();
    } else {
        lastUpdate = Number(res.records[0].get(0));
    }

    return lastUpdate;
  }

  

  /**
   * Constructor  of the Token service
   */
  private constructor() {
    this.neo4jAL = Neo4JAccessLayer.getInstance();
  }

  /**
   * The actual instance of the service
   */
  public static getInstance(): SynchronizerService {
    if (SynchronizerService.INSTANCE == null) {
      SynchronizerService.INSTANCE = new SynchronizerService();
    }
    return SynchronizerService.INSTANCE;
  }
}

export default SynchronizerService;
