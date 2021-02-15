import TagController from "@controller/configurations/tag.controller";
import { Neo4JAccessLayer } from "@database/neo4jAccessLayer";
import TagService from "@services/configuration/tag.services";
import { sleep } from "@shared/functions";
import { logger } from "@shared/logger";

export default abstract class AAgent {
    private isRunning = false;
    private stopFlag = false;
    private numRetry = 0;
    protected neo4jAl: Neo4JAccessLayer = Neo4JAccessLayer.getInstance();
    protected tagService = new TagService();
  
    public abstract group() : Promise<void> ;
    abstract getAgentName() : string ;
    abstract getPrefix() : Promise<string> ;

    abstract getDelay() : number;
  
    private async run() {
      this.isRunning = true;
  
      if (!this.stopFlag) {
        try {
          await this.group();
          this.numRetry = 0;
        } catch (err) {
          this.numRetry++;
  
          if(this.numRetry == 1) {
            logger.error(
              `The ${this.getAgentName()} agent failed to query the database on the presence of tags`,
              err
            );
          } else {
            logger.error(`The ${this.getAgentName()} agent failed to query the database on the presence of tags. Retrying in ${this.numRetry * 5} seconds`)
          }
  
          // Max value for retry
          this.numRetry = this.numRetry > 10 ? 10 : this.numRetry;
          
          await sleep(this.getDelay() + this.numRetry * 5000)
        }
      }
  
      const that = this;
      setTimeout(function() { that.run() }, this.getDelay());
    }
  
    public launch() {
      if (!this.isRunning) this.run();
      this.stopFlag = false;
    }
  
    public getStatus(): boolean {
      return this.stopFlag;
    }
  
    public stop(): boolean {
      this.stopFlag = true;
      return this.stopFlag;
    }
}