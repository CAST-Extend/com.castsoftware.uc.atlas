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
    if (obj == null) {
      return null;
    }

    const dto = new DetectionResultDTO();
    dto.application = String(obj["application"]) || "No Application";
    dto.timestampStart = Number(obj["timestampStart"]) || 0;
    dto.timestampFinish = Number(obj["timestampFinish"]) || 0;
    dto.language = String(obj["language"]) || "No language";
    dto.status = obj["status"];
    dto.data = obj["data"] || [];

    return dto;
  }
}
