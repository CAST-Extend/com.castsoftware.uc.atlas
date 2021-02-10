import { QueryResult } from 'neo4j-driver';
import { Neo4JAccessLayer } from '@utils/neo4jAccessLayer';
import { Framework } from '@/interfaces/artemis/framework.interface';
import { convertRecordToFramework } from '@/utils/util';

class SynchronizerPullService {
  private static neo4jAL: Neo4JAccessLayer = Neo4JAccessLayer.getInstance();

  /**
   * Pull the latest frameworks added
   */
  public static async pullFrameworks(lastPullTimestamp: number): Promise<Framework[]> {
    const req = `CALL artemis.api.get.framework.youngerThan($timeStamp)`;
    const results: QueryResult = await this.neo4jAL.executeWithParameters(req, { timeStamp: lastPullTimestamp });

    let frameworks: Framework[] = [];
    for (let index = 0; index < results.records.length; index++) {
      const f: Framework = convertRecordToFramework(results.records[index]);
      frameworks.push(f);
    }

    return frameworks;
  }

  /**
   * Get the number of frameworks added sinc a certain timestamp
   */
  public static async pullFrameworksForecast(lastPullTimestamp: number): Promise<number> {
    const req = `CALL artemis.api.get.framework.youngerThan.forecast($timeStamp)`;
    const results: QueryResult = await this.neo4jAL.executeWithParameters(req, { timeStamp: lastPullTimestamp });

    if(!results.records || results.records.length == 0) return 0;

    return Number(results.records[0].get(0));
  }
}

export default SynchronizerPullService;
