import { IsDecimal, IsString } from 'class-validator';

export class CreateFrameworkDto {
  @IsString()
  public name: string;

  @IsString()
  public description: string;
  
  @IsString()
  public type: string;

  @IsString()
  public category: string;

  @IsString()
  public internalType: string;

  @IsString()
  public location: string;

  @IsString()
  public discoveryDate: string;

  @IsDecimal()
  public percentageOfDetection: string;

  @IsDecimal()
  public numberOfDetection: string;
  
  
}
