import { IsDecimal, IsString } from "class-validator";

export class CreateCategoryDto {
  @IsDecimal()
  public id : number;

  @IsString()
  public name: string;

  @IsString()
  public iconUrl: string;
}
