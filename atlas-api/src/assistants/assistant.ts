export enum DemeterActions {
    groupLevel = "groupLevel",
    groupModule = "groupModule",
    groupArchitecture = "groupArchitecture",
}

export interface IFrameworkAssistant {
    id: number;
    started: boolean;
    category: string;
    actions: DemeterActions[];
}

export class FrameworkAssistant {
    private id: number;
    private started: boolean;
    private category: string;
    private actions: DemeterActions[];

    public getId() : number {
        return this.id;
    }
  
    public setCategory(category : string) {
      this.category = category;
    }
  
    public getCategory() : string {
      return this.category;
    }
  
    public setActions(actions: DemeterActions[]) {
      this.actions = actions;
    }
  
    public getActions() : DemeterActions[] {
      return this.actions;
    }
  
    public isRunning() : boolean {
      return this.started;
    }
  
    public start() {
      this.started = true;
    }
  
    public stop() {
      this.started = false;
    }
  
    constructor(id:number, category : string, actions: DemeterActions[]) {
      this.id = id;
      this.started = true;
      this.category = category;
      this.actions = actions;
    }

    /**
     * Return the JSON 
     */
    public static fromJson(json: IFrameworkAssistant): FrameworkAssistant {
      const assistant : FrameworkAssistant = new FrameworkAssistant(json.id, json.category, json.actions);
      assistant.started = json.started;
      return assistant; 
    }

    /**
     * Serialize the object 
     */
    public serialize() : IFrameworkAssistant{
        return {
            id: this.id,
            started: this.started,
            category: this.category,
            actions: this.actions
        }
    }
  }
  