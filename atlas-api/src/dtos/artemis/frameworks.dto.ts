import { IsArray, IsDecimal, IsNumber, IsString } from "class-validator";

export class CreateFrameworkDto {
  @IsNumber()
  public id = -1;

  @IsString()
  public name: string;

  @IsString()
  public description: string;
  
  @IsString()
  public type: string;

  @IsString()
  public category: string;

  @IsArray()
  public internalType: string[];

  @IsString()
  public location: string;

  @IsString()
  public discoveryDate: string;

  @IsDecimal()
  public percentageOfDetection: string;

  @IsDecimal()
  public numberOfDetection = 0;
  
  
}
