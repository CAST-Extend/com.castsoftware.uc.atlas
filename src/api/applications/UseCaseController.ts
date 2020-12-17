import { int, QueryResult } from "neo4j-driver";
import { use } from "vue/types/umd";
import { Neo4JAccessLayer } from "../Neo4jAccessLayer";
import { TagController, TagResult } from "./TagController";

export interface UseCaseResult {
  name: string;
  parentName: string;
  active: boolean;
  id: number;
  children: (UseCaseResult|TagResult)[];
}

export class UseCaseController {
  private static neo4jal: Neo4JAccessLayer = Neo4JAccessLayer.getInstance();

  /**
   * Get results of the statistics
   * @param configuration Name of the configuration to use
   * @param applicationName Name of the application
   */
  public static async getUseCases(): Promise<UseCaseResult[]> {
    const request = `CALL demeter.useCases.list()`;
    
    const results: QueryResult = await this.neo4jal.execute(request);
    
    const useCases: UseCaseResult[] = [];
    for (let i = 0; i < results.records.length; i++) {
      const singleRecord = results.records[i];

      const name = singleRecord.get("name");
      const parentName = singleRecord.get("parentName");
      const active = singleRecord.get("active");
      const id = int(singleRecord.get("id")).toNumber();


      useCases.push({ name, parentName, active, id , children:[] });
    }

    return useCases;
  }

  private static recTree(useCase:UseCaseResult, candidates:UseCaseResult[], tags:TagResult[]):UseCaseResult {
    const index = candidates.indexOf(useCase);
    if(index != -1) {
        candidates.splice(index, 1);
    }

    for(let i = 0; i < candidates.length; i++) {
        for(let y=0; y < tags.length; y++) {
            if(useCase.name == tags[y].useCase) {
                const toAdd = tags[y];
                useCase.children.push(toAdd);
                tags.splice(y, 1);
            }
        }

        if(useCase.name == candidates[i].parentName) {
            const toAdd = this.recTree(candidates[i], candidates, tags);
            useCase.children.push(toAdd);
        }
    }

    return useCase;
  }

  public static async getUseCaseAsTree(appName:string) {
    const useCases:UseCaseResult[] = await UseCaseController.getUseCases();
    let returnList:UseCaseResult[] = [];


    const tags:TagResult[]  = await TagController.getTagResults("Configuration_1",appName);

    // Get root elements and add them to return list    
    // From root implement
    returnList = useCases.filter(x=>x.parentName=="ROOT").map(x=> UseCaseController.recTree(x, useCases, tags))
    console.log("Tree detected", returnList)
    
    return returnList;
  }
}
