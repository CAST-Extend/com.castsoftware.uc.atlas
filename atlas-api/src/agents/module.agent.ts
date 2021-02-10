import ModuleService from "@services/demeter/module.service";
import { logger } from "@shared/logger";
import config from "config";
import AAgent from "./agent.abstract";

export default class ModuleAgent extends AAgent {
  getAgentName(): string {
    return "Module";
  }
  getDelay(): number {
    return config.get("agent.reload.moduleAgent");
  }

  private moduleService: ModuleService = new ModuleService();

  async group() {
    try {
      const num: number = await this.moduleService.executeGroupingInAllApplications();

      if (num != 0) {
        logger.info(`${num} modules were discovered and added.`);
      }
    } catch (err) {
      logger.error("The module agent failed to retrieve custom modules.", err);
    }
  }
}
