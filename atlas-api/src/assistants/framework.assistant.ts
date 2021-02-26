import TagController from "@controller/configurations/tag.controller";
import config from "config";
import { Neo4JAccessLayer } from "@database/neo4jAccessLayer";
import TagService from "@services/configuration/tag.services";
import { logger } from "@shared/logger";
import { QueryResult, Node } from "neo4j-driver";
import {
  FrameworkAssistant,
  DemeterActions,
  IFrameworkAssistant,
} from "./assistant";
import fs from "fs";

export class FrameworkAssistantManager {
  private static INSTANCE: FrameworkAssistantManager;

  private static RESOURCE_DIR = "serialization/";
  private static ASSISTANTS_FILE = "assistants.json";

  private neo4jAl: Neo4JAccessLayer = Neo4JAccessLayer.getInstance();
  private tagService: TagService = new TagService();

  private levelTag: string;
  private moduleTag: string;
  private architectureTag: string;

  private artemisDetectionProperty: string;
  private artemisCategoryProperty: string;

  private assistants: FrameworkAssistant[];

  public getAssistants(): FrameworkAssistant[] {
    return this.assistants;
  }

  /** Tag related function */

  public async getDemeterLevelTag(): Promise<string> {
    return await this.tagService.getCustomLevelTag();
  }

  public async getDemeterArchitectureTag(): Promise<string> {
    return await this.tagService.getCustomArchitectureTag();
  }

  public async getDemeterModuleTag(): Promise<string> {
    return await this.tagService.getCustomModuleTag();
  }

  /** Framework property */

  /**
   * Get the property of the Artemis Category on the nodes
   */
  public async getCategoryProperty(): Promise<string> {
    const req = "CALL artemis.api.configuration.get.category.property()";
    const res: QueryResult = await this.neo4jAl.execute(req);

    if (res.records.length == 0)
      throw new Error("Failed to get Artemis node category property");

    return res.records[0].get(0);
  }

  /**
   * Get the property of the Artemis Detection on the nodes
   */
  public async getDetectionProperty(): Promise<string> {
    const req = "CALL artemis.api.configuration.get.detection.property()";
    const res: QueryResult = await this.neo4jAl.execute(req);

    if (res.records.length == 0)
      throw new Error("Failed to get Artemis node detection property");

    return res.records[0].get(0);
  }

  /** Apply tags on the application ( Remove present tags and ignore nodes already under their groups) */

  /**
   * Apply tags on levels
   * @param category Category to  extract
   */
  public async applyLevelTagOnObjects(category: string) {
    // Check if the group doesn't exist before taking action

    const params = { tag: this.levelTag , category: category };
    const req =
      "MATCH (obj:Object) WHERE obj.ArtemisDetection=$category AND NOT obj.Level CONTAINS obj.ArtemisCategory SET obj.Tags = CASE WHEN obj.Tags IS NULL THEN [$tag] ELSE [ x IN obj.Tags WHERE NOT x CONTAINS obj.ArtemisCategory ] + ( $tag + obj.ArtemisCategory )  END RETURN COUNT(obj) as count;";
    const res :QueryResult = await this.neo4jAl.executeWithParameters(req, params);
    
    if(res.records.length > 0 && res.records[0].get("count") != 0) {
      logger.info(`The assistant regrouped ${res.records[0].get("count")} nodes under their level for category ${category}`);
    }
  }

  /**
   * Apply tags on Modules
   * @param category Category to extract
   */
  public async applyModuleTagOnObjects(category: string) {
    // Check if the group doesn't exist before taking action
    const params = { tag: this.moduleTag + category, category: category };
    const req =
      "MATCH (obj:Object) WHERE obj.ArtemisDetection=$category AND NOT EXISTS { "+ 
        "(obj)<-[:Contains]-(m:Module) WHERE NOT m.Name CONTAINS $category "+
      "} SET obj.Tags = CASE WHEN obj.Tags IS NULL THEN [$tag] ELSE [ x IN obj.Tags WHERE NOT x CONTAINS $category ] + $tag END RETURN COUNT(obj) as count;"
    const res :QueryResult = await this.neo4jAl.executeWithParameters(req, params);
    if(res.records.length > 0 && res.records[0].get("count") != 0) {
      logger.info(`The assistant regrouped ${res.records[0].get("count")} nodes under their module for category ${category}`);
    }
  }

  /**
   * Apply tags on Objects for the architecture / The name of the arhitecture view is the name of the category. 
   * The objects having a relationship to the main subset will also be extracted 
   * @param category Category to extract
   */
  public async applyArchitectureTagOnObjects(category: string) {
    
    // Check if the group doesn't exist before taking action
    const params = { tag: this.architectureTag, prefix: "Framework ", category: category };
    const req = `
    MATCH (obj:Object) WHERE obj.ArtemisDetection=$category AND EXISTS(obj.ArtemisCategory)
    AND NOT EXISTS { 
      MATCH (obj)<-[:Contains]-(m:Subset)<-[]-(a:ArchiModel) 
      WHERE a.Name=$prefix+obj.ArtemisDetection AND m.Name=obj.ArtemisCategory 
      }
    SET obj.Tags = CASE WHEN obj.Tags IS NULL THEN [($tag + $prefix + obj.ArtemisDetection+"$"+obj.ArtemisCategory)] ELSE [ x IN obj.Tags WHERE NOT x CONTAINS obj.ArtemisCategory ] + ($tag + $prefix + obj.ArtemisDetection+"$"+obj.ArtemisCategory) END
    WITH obj as obj, COLLECT(obj) as allFlagged
    MATCH (obj)-[]-(other:Object) 
    WHERE NOT other in allFlagged 
    AND NOT EXISTS {
      MATCH (other)<-[:Contains]-(m:Subset)<-[]-(a:ArchiModel) 
      WHERE a.Name=$prefix+obj.ArtemisCategory AND m.Name=other.Level 
      }
    SET other.Tags = CASE WHEN other.Tags IS NULL THEN [($tag + $prefix + obj.ArtemisDetection+"$"+other.Level)] ELSE [ x IN other.Tags WHERE NOT x CONTAINS other.Level  ] + ($tag + $prefix +obj.ArtemisDetection+ "$" +other.Level) END
    RETURN COUNT(DISTINCT obj) as countObj, COUNT(DISTINCT  other) as countOther;
    `
    const res :QueryResult = await this.neo4jAl.executeWithParameters(req, params);
    if(res.records.length > 0 && res.records[0].get("countObj") != 0) {
      logger.info(`The assistant regrouped ${res.records[0].get("countObj")} nodes under their architecture for category ${category}.\n ${res.records[0].get("countOther")} will also be affected.`);
    }
  }

  /**
   * Check if all the external resources ( tags, property, etc.. ) are instantiated.
   */
  private async fetchResources() {
    // Populate the tags
    if (!this.levelTag || this.levelTag.length == 0)
      this.levelTag = await this.getDemeterLevelTag();
    if (!this.moduleTag || this.moduleTag.length == 0)
      this.moduleTag = await this.getDemeterModuleTag();
    if (!this.architectureTag || this.architectureTag.length == 0)
      this.architectureTag = await this.getDemeterArchitectureTag();

    if (
      !this.artemisDetectionProperty ||
      this.artemisDetectionProperty.length == 0
    )
      this.artemisDetectionProperty = await this.getCategoryProperty();
    if (
      !this.artemisCategoryProperty ||
      this.artemisCategoryProperty.length == 0
    )
      this.artemisCategoryProperty = await this.getDetectionProperty();
  }

  /**
   * Run a n assistant and execute the different actions
   * @param assistant Assistant to run
   */
  public async runAssistant(assistant: FrameworkAssistant) {
    if (!assistant.isRunning()) return; // Ignore if the assistants are not running

    await this.fetchResources();

    // Parse the actions and execute based on the category of the nodes
    const actions = assistant.getActions();
    for (const i in actions) {
      switch (actions[i]) {
        case DemeterActions.groupLevel:
          await this.applyLevelTagOnObjects(assistant.getCategory());
          break;
        case DemeterActions.groupModule:
          await this.applyModuleTagOnObjects(assistant.getCategory());
          break;
        case DemeterActions.groupArchitecture:
          await this.applyArchitectureTagOnObjects(assistant.getCategory());
          break;

        default:
          continue;
      }
    }
  }

  /**
   * Parse the list of assistants and execute the actions
   */
  public async iterateOverAssistants() {
    try {
      for (const i in this.assistants) {
        try {
          await this.runAssistant(this.assistants[i]);
        } catch (err) {
          logger.error(`Failed to execute assistant [${this.assistants[i].serialize().category}]`, err);
        }
      }
    } catch (err) {
      logger.error("Failed to iterate over the assistants.", err);
    }

    const delay = Number(config.get("assistant.reload")) || 10000;
    const that = this;
    setTimeout(function () {
      that.iterateOverAssistants();
    }, delay);
  }

  /**
   * Add a new Assistant to the list
   * @param category Category concerned by the assistant
   * @param actions  Action to execute
   */
  public addAssistant(category: string, actions: DemeterActions[]): void {
    // Find a gap in the id or get the n + 1
    let id: number = null;
    const maxId = Math.max.apply(
      Math,
      this.assistants.map(function (o) {
        return o.getId();
      })
    );
    for (let i = 0; i < maxId; i++) {
      if (this.assistants.find((x) => x.getId() === i) == undefined) {
        id = i;
        break;
      }
    }

    if (!id) id = maxId + 1;

    this.assistants.push(new FrameworkAssistant(id, category, actions));
    this.dumpAssistantList();
  }

  /**
   * Remove the assistant
   * @param id Id of the assistant to remove
   * @returns true if the assistant was removed successfully, false otherwise
   */
  public removeAssistant(id: number) {
    logger.info("Removing assistants with id ", id);
    logger.info("Before", this.assistants);
    this.assistants = this.assistants.filter((x) => x.getId() != id);
    logger.info("After", this.assistants);
    this.dumpAssistantList();
  }

  /**
   * Stop the assistant
   * @param id Id of the assistant to start
   * @returns true if the assistant was stopped successfully, false otherwise.
   */
  public stopAssistantById(id: number): boolean {
    const assistant = this.assistants.find((x) => x.getId() === id);
    if (!assistant) return false;

    assistant.stop();
    return true;
  }

  /**
   * Start the assistant
   * @param id Id of the assistant to start
   * @returns true if the assistant was started successfully, false otherwise.
   */
  public starAssistantById(id: number): boolean {
    const assistant = this.assistants.find((x) => x.getId() === id);
    if (!assistant) return false;

    assistant.start();
    return true;
  }

  /**
   * Get the list of framework categories available
   */
  public async getCategories(): Promise<string[]> {
    const req =
      "CALL artemis.api.configuration.get.detection.property.values()";
    const results: QueryResult = await this.neo4jAl.execute(req);

    const categoryNames: string[] = [];
    for (let i = 0; i < results.records.length; i++) {
      categoryNames.push(String(results.records[i].get(0)));
    }

    return categoryNames;
  }

  /**
   * Get the amiable actions of demeter
   */
  public getDemeterActions(): string[] {
    return Object.keys(DemeterActions);
  }

  private dumpAssistantList() {
    const filePath =
      FrameworkAssistantManager.RESOURCE_DIR +
      FrameworkAssistantManager.ASSISTANTS_FILE;

    try {
      // remove the file and dump the content

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      

      const data: IFrameworkAssistant[] = this.assistants.map(x => x.serialize())

      fs.writeFileSync(filePath, JSON.stringify(data));
    } catch (err) {
      logger.error("Failed to dump the assistants to their file.", err);
    }
  }

  private constructor() {
    this.assistants = [];
    this.fetchResources()

    const filePath =
      FrameworkAssistantManager.RESOURCE_DIR +
      FrameworkAssistantManager.ASSISTANTS_FILE;

    // Import the assistants
    if (!fs.existsSync(FrameworkAssistantManager.RESOURCE_DIR)) {
      fs.mkdirSync(FrameworkAssistantManager.RESOURCE_DIR);
    } else {
      // Load assistants from it
      this.assistants = [];
      try {
        const jsonContent: IFrameworkAssistant[] = JSON.parse(
          fs.readFileSync(filePath, "utf8")
        );
        jsonContent.forEach((x) => {
          this.assistants.push(FrameworkAssistant.fromJson(x));
        });
      } catch (err) {
        logger.error("Failed to load the Assistant file.", err);
      }
    }

    //
    this.iterateOverAssistants();
  }

  public static getInstance() {
    if (FrameworkAssistantManager.INSTANCE == null) {
      FrameworkAssistantManager.INSTANCE = new FrameworkAssistantManager();
    }

    return FrameworkAssistantManager.INSTANCE;
  }
}
