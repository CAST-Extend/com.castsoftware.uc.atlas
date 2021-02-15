import ArchitectureService from "@services/demeter/architecture.service";
import { logger } from "@shared/logger";
import config from "config";
import AAgent from "./agent.abstract";

export default class ArchitectureAgent extends AAgent {
  async getPrefix(): Promise<string> {
    return this.tagService.getCustomArchitectureTag();
  }

  getAgentName(): string {
    return "Level";
  }
  getDelay(): number {
    return config.get("agent.reload.architectureAgent");
  }

  private architectureService: ArchitectureService = new ArchitectureService();

  async group() {
    try {
      const num: number = await this.architectureService.executeGroupingInAllApplications();

      if (num != 0) {
        logger.info(`${num} architecture were discovered and added.`);
      }
    } catch (err) {
      logger.error("The architecture agent failed to retrieve custom levels.", err);
    }
  }
}