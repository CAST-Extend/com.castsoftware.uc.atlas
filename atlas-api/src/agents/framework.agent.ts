import AAgent from "@agents/agent.abstract";
import { Neo4JAccessLayer } from "@database/neo4jAccessLayer";
import { sleep } from "@shared/functions";
import { logger } from "@shared/logger";
import config from "config";
import { QueryResult } from "neo4j-driver";

/**
 * Agent in charge of the automatic adding of user's frameworks
 */
export default class FrameworkAgent extends AAgent {

  getAgentName(): string {
    return "Framework"
  }
  getDelay(): number {
    return config.get("agent.reload.frameworkAgent")
  }

  async group() : Promise<void> {
    try {
      const reqPresence = "CALL artemis.get.framework.tags.presence()";
      const resPresence: QueryResult = await this.neo4jAl.execute(reqPresence);

      const isPresent = Boolean(resPresence.records[0].get(0));

      if (isPresent) {
        const req = "CALL artemis.launch.custom.framework.discovery()";
        const res: QueryResult = await this.neo4jAl.execute(req);
  
        logger.info(
          `${res.records.length} frameworks were discovered and added.`
        );
      }

    } catch (err) {
      logger.error(
        "The framework agent failed to retrieve custom frameworks.",
        err
      );
    }
  }

}
