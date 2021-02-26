//CALL artemis.api.application.get.all.candidate.languages()

import { Neo4JAccessLayer } from "@database/neo4jAccessLayer";
import { DetectionCandidate } from "@dtos/artemis/detectionCandidate.dto";
import HttpException from "@exceptions/HttpException";
import { logger } from "@shared/logger";

export class ArtemisCandidates {

  private neo4jAl: Neo4JAccessLayer = Neo4JAccessLayer.getInstance();

  private convertRecordToDetectionCandidate(res: any): DetectionCandidate {
    const candidate: DetectionCandidate = {
      application: res.get("application"),
      languages: res.get("languages")
    };

    return candidate;
  }

  public async getCandidateList(
  ): Promise<DetectionCandidate[]> {
    const req = `CALL artemis.api.application.get.all.candidate.languages()`;
    try {
      const val = await this.neo4jAl.execute(req);

      if (!val.records || val.records.length == 0) return [];

      const candidates = [];
      for (const it in val.records) {
        if (Object.prototype.hasOwnProperty.call(val.records, it)) {
            candidates.push(this.convertRecordToDetectionCandidate(val.records[it]));
        }
      }
      return candidates;
    } catch (err) {
      logger.error(
        "An internal error occurred in RegexNodeService::getRegexRequest ",
        err
      );
      throw new HttpException(500, "Internal error");
    }
  }

  
}