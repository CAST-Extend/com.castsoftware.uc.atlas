import { IsArray, IsDecimal, IsString } from 'class-validator';

export class DetectionCandidate {
  @IsString()
  public application: string;

  @IsArray()
  public languages: string[];


}
