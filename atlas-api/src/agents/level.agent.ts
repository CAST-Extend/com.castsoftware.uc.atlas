import LevelService from "@services/demeter/level.service";
import { logger } from "@shared/logger";
import config from "config";
import AAgent from "./agent.abstract";

export default class LevelAgent extends AAgent {
  getAgentName(): string {
    return "Level";
  }
  getDelay(): number {
    return config.get("agent.reload.levelAgent");
  }

  private levelService: LevelService = new LevelService();

  async group() {
    try {
      const num: number = await this.levelService.executeGroupingInAllApplications();

      if (num != 0) {
        logger.info(`${num} levels were discovered and added.`);
      }
    } catch (err) {
      logger.error("The level agent failed to retrieve custom levels.", err);
    }
  }
}
