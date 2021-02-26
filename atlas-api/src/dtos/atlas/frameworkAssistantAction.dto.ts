import { IsArray, IsString } from "class-validator";

export class FrameworkAssistantAction {

  @IsString()
  public category: string;

  @IsArray()
  public actions: string[];
}
