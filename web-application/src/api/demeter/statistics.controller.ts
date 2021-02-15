import { QueryResult } from "neo4j-driver";
import { Neo4JAccessLayer } from "../Neo4jAccessLayer";

export interface StatisticResult {
  title: string;
  description: string;
  result: string;
}

export interface StatisticPercentageResult {
  title: string;
  description: string;
  percentage: string;
  inverseResult: boolean;
}

export class StatisticsController {
  private static neo4jal: Neo4JAccessLayer = Neo4JAccessLayer.getInstance();

  /**
   * Get results of the statistics
   * @param configuration Name of the configuration to use
   * @param applicationName Name of the application
   */
  public static async getStatisticResults(
    configuration: string,
    applicationName: string
  ): Promise<StatisticResult[]> {
    const request = `CALL demeter.statistics.getAsList('${configuration}', '${applicationName}')`;
    console.log("Request statstics : " + request);

    const results: QueryResult = await this.neo4jal.execute(request);

    const appNames: StatisticResult[] = [];
    for (let i = 0; i < results.records.length; i++) {
      const singleRecord = results.records[i];

      const title = singleRecord.get("title");
      const description = singleRecord.get("description");

      let result = singleRecord.get("result");
      result = result.replace(" - ", "").replaceAll(" - ", "<br \\><br \\>");

      appNames.push({ title, description, result });
    }

    return appNames;
  }

  /**
   * Get statistics on the quality  of the configuration
   * @param applicationName Name of the application concerned by the statistics
   */
  public static async getConfigurationStatistics(
    applicationName: string
  ): Promise<StatisticPercentageResult[]> {
    if (!applicationName || applicationName.length == 0) return;

    const requests = [
      {
        title: "Internality ",
        description: "Percentage of internal objects in the application",
        request: `MATCH (o:Object:${applicationName}) WITH COUNT(o) as totObj MATCH (obj:Object:${applicationName}) WHERE obj.External=false
        WITH  COUNT(obj) as internal, totObj RETURN toFloat(internal) / totObj as percentage;`,
        inverseResult: false
      },
      {
        title: "In Transaction",
        description: "Percentage of objects in transactions",
        request: `MATCH (o:Object:${applicationName}) WITH COUNT(o) as totObj
        MATCH (obj:Object:${applicationName}) WHERE NOT (:Transaction:${applicationName})-[:Contains]->(obj) WITH  COUNT(DISTINCT obj) as notInTransaction, totObj 
        RETURN toFloat(notInTransaction) / totObj as percentage;`,
        inverseResult: false
      },
      {
        title: "Isolated Levels",
        description: "Percentage of levels with no links in the application",
        request: `MATCH (l:Level5:${applicationName}) WITH COUNT(l) as totLevels
        MATCH (obj:Level5:${applicationName}) WHERE NOT (obj)-[]-(:Level5) WITH  COUNT(obj) as isolated, totLevels 
        RETURN toFloat(isolated) / totLevels as percentage;`,
        inverseResult: true
      }
    ];

    const returnList: StatisticPercentageResult[] = [];

    for (let i = 0; i < requests.length; i++) {
      const results: QueryResult = await this.neo4jal.execute(
        requests[i].request
      );
      if (results.records.length == 0) continue; // Ignore empty results

      const singleRecord = results.records[0];

      const percentage = singleRecord.get("percentage");

      returnList.push({
        title: requests[i].title,
        description: requests[i].description,
        percentage: percentage,
        inverseResult: requests[i].inverseResult
      });
    }

    return returnList;
  }
}
