import { IsArray, IsDecimal, IsString } from "class-validator";

export class CreateRegexNodeDto {
  @IsDecimal()
  public id : number;

  @IsString()
  public name: string;

  @IsArray()
  public regexes: string[];
  
  @IsArray()
  public internalType: string[];
  
  @IsString()
  public framework: string;

  @IsString()
  public category: string;

  @IsDecimal()
  public parentId: number;

  @IsArray()
  public children: CreateRegexNodeDto[];

}
