import { Module } from "module";
import AAgent from "./agent.abstract";
import ArchitectureAgent from "./architecture.agent";
import FrameworkAgent from "./framework.agent";
import LevelAgent from "./level.agent";
import ModuleAgent from "./module.agent";

export enum Agent {
    FRAMEWORK_AGENT,
    LEVEL_AGENT,
    MODULE_AGENT,
    ARCHITECTURE_AGENT
}

/**
 * Manager of the different agent in charge of their lifecycle
 */
export class AgentManager {

    private frameworkAgent: FrameworkAgent;
    private levelAgent: LevelAgent;
    private moduleAgent: ModuleAgent;
    private architectureAgent: ArchitectureAgent;

    public static INSTANCE: AgentManager;

    private getAgent(agent: Agent|string) : AAgent {
        switch(agent) {
            case Agent.FRAMEWORK_AGENT : 
                return this.frameworkAgent;
            case "framework": 
                return this.frameworkAgent;
            case Agent.LEVEL_AGENT : 
                return this.levelAgent;
            case "level": 
                return this.levelAgent;
            case Agent.MODULE_AGENT : 
                return this.moduleAgent;
            case "module": 
                return this.moduleAgent;
            case "architecture":
                return this.architectureAgent;
            case Agent.ARCHITECTURE_AGENT:
                return this.architectureAgent;
            default:
                return null;
        }
    }

    /**
     * Stop a specific agent in the database
     * @param agent Name of the agent
     */
    public stopAgent(agent:Agent) {
        this.getAgent(agent).stop();
    }

    /**
     * Start a specific agent in the database
     * @param agent Name of the agent
     */
    public startAgent(agent:Agent) {
        this.getAgent(agent).launch();
    }

    /**
     * Get the status of a specific agent
     * @param agent Name of the agent
     */
    public getAgentStatus(agent:Agent) : boolean {
        return this.getAgent(agent).getStatus();
    }

    /**
     * Initialize the different agents
     */
    public initialize() {
        this.frameworkAgent.launch();
    }

    /**
     * Get the current instance of the local manager
     */
    public static getInstance() {
        if(this.INSTANCE == null) {
            this.INSTANCE = new AgentManager();
        }

        return this.INSTANCE;
    }

    private constructor() {
        this.frameworkAgent = new FrameworkAgent();
        this.levelAgent = new LevelAgent();
        this.moduleAgent = new ModuleAgent();
        this.architectureAgent = new ArchitectureAgent();
    }

}