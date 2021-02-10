import { Neo4JAccessLayer } from "@database/neo4jAccessLayer";
import HttpException from "@exceptions/HttpException";
import { Artifact } from "@interfaces/artemis/artifact.interface";
import { logger } from "@shared/logger";
import { int } from "neo4j-driver";

export default class ArtifactService {
  private neo4jAl: Neo4JAccessLayer = Neo4JAccessLayer.getInstance();

  private convertRecordToArtifact(res: any): Artifact {
    const artifact: Artifact = {
      id: int(res.get("id")).toNumber(),
      name: res.get("name"),
      parentId: int(res.get("parentId")).toNumber(),
      delimiter: res.get("delimiter"),
      children: []
    };

    return artifact;
  }

  public async getArtifactsList(
    appName: string,
    language: string
  ): Promise<Artifact[]> {
    const req: string = `CALL artemis.api.breakdown.get($appName, $language)`;
    try {
      const val = await this.neo4jAl.executeWithParameters(req, {
        appName: appName,
        language: language,
      });
      if (!val.records || val.records.length == 0) return [];

      const artifacts = [];
      for (const it in val.records) {
        if (Object.prototype.hasOwnProperty.call(val.records, it)) {
          artifacts.push(this.convertRecordToArtifact(val.records[it]));
        }
      }
      return artifacts;
    } catch (err) {
      logger.error(
        "An internal error occurred in RegexNodeService::getRegexRequest ",
        err
      );
      throw new HttpException(500, "Internal error");
    }
  }


  private static recursiveInsert(root: Artifact, listArtifact: Artifact[]): Artifact {
    for(const index in listArtifact) {
      if(listArtifact[index].parentId == root.id) {
        root.children.push(ArtifactService.recursiveInsert(listArtifact[index], listArtifact));
      }
    }

    return root;
  }

  // Get Artifacts as a Tree
  public async getArtifactAsTree(
    appName: string,
    language: string
  ): Promise<Artifact[]> {

    const allArtifacts : Artifact[] = await this.getArtifactsList(appName, language);
    let tree : Artifact[] = [];

    for (const key in allArtifacts) {
      let elem = allArtifacts[key];
      if(elem.parentId < 0) {
        tree.push(ArtifactService.recursiveInsert(elem, allArtifacts))
      }
    }

    return tree;
  }
}
