import { Neo4JAccessLayer } from "@database/neo4jAccessLayer";
import { DetectionCandidate } from "@dtos/artemis/detectionCandidate.dto";
import { CancellablePromise } from "@interfaces/artemis/detectionStatus.interface";
import { Framework } from "@interfaces/artemis/framework.interface";
import app from "@server";
import DetectionService from "@services/artemis/detection.service";
import { logger } from "@shared/logger";




export class DetectionQueueAssistant {
  private static INSTANCE: DetectionQueueAssistant;

  private neo4jAl: Neo4JAccessLayer = Neo4JAccessLayer.getInstance();
  private detectionService: DetectionService = DetectionService.getInstance();

  private onGoingDetection: CancellablePromise<Framework[]>;
  private candidateList: DetectionCandidate[];

  public getCurrent() : DetectionCandidate {
    if(this.onGoingDetection == null) return null;
    
    return { application : this.onGoingDetection.application, languages : [this.onGoingDetection.language]}
  }

  public addCandidate(candidate: DetectionCandidate) : void {

    var i : number;
    // Search and merge
    for (i = 0; i < this.candidateList.length; i++) {
        if (this.candidateList[i].application === candidate.application) {
            candidate.languages.forEach(x => {
                if(this.candidateList[i].languages.indexOf(x) == -1) {
                    this.candidateList[i].languages.push(x)
                }
            })
            
            return;
        }
    }

    // the candidate is not in the pipeline
    this.candidateList.push(candidate);
    
  }

  public removeCandidateByName(name: string) : void {
    this.candidateList = this.candidateList.filter((x) => {
      return x.application == name;
    });
  }

  public getQueue() :  DetectionCandidate[] {
    return this.candidateList;
  }

  /**
   * Flush the entire list and cancel the current detection
   */
  public flushCandidates() :void {
    logger.info("Flush applications")
    try {
      if (this.onGoingDetection) this.onGoingDetection.cancel(); // cancel the current detection
      logger.info(this.onGoingDetection.isDone())
    } catch(ignore) {}
    this.candidateList = [];
  }

  /**
   * Check the queue and the current detection running. If the detection is done, it will process the next one.
   */
  private checkQueue() {
    // If the detection is finished or empty launch the next candidate
    if (
      this.candidateList.length > 0 &&
      (this.onGoingDetection == null || this.onGoingDetection.isDone())
    ) {
      let appName = "";
      let language = "";

      try {
        // Process the next one

        if (this.candidateList[0].languages.length > 1) {
          appName = this.candidateList[0].application;
          language = this.candidateList[0].languages.pop();
        } else {
          const element = this.candidateList.shift();
          appName = element.application;
          language = element.languages[0];
        }

        this.onGoingDetection = this.detectionService.launchDetection(
          appName,
          language
        );
      } catch (err) {
        logger.error(
          `Failed to launch the detection on application ${appName}. Reason : ${err}`
        );
      }
    }
    const that = this;
    setTimeout(
      function () {
        that.checkQueue();
      }.bind(this),
      5000
    );
  }

  constructor() {
    this.candidateList = [];
    this.checkQueue();
  }

  public static getInstance(): DetectionQueueAssistant {
    if (DetectionQueueAssistant.INSTANCE == null) {
      DetectionQueueAssistant.INSTANCE = new DetectionQueueAssistant();
    }

    return DetectionQueueAssistant.INSTANCE;
  }
}
