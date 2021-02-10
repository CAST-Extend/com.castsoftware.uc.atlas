import {
  DetectionResult,
  DetectionStatus,
  Framework
} from "../interface/ApiArtemis.interface";

export class DetectionResultDTO implements DetectionResult {
  public application: string;
  public timestampStart: number;
  public timestampFinish = 0;
  public language: string;
  public status: DetectionStatus;
  public data: Framework[] = [];

  static fromRecord(obj: Record<string, any>): DetectionResultDTO {
    return Object.assign(new DetectionResultDTO(), obj);
  }
}
