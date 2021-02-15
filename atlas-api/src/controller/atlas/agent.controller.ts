import { NextFunction, Request, Response } from 'express';
import { AgentManager, Agent } from '@agents/agent.manager';
import {logger} from "@shared/logger"
import HttpException from '@exceptions/HttpException';

class AgentController {
    private agentManager = AgentManager.getInstance();

    private getAgentByName(agent:string): Agent {
        switch(agent) {
            case "framework":
                return Agent.FRAMEWORK_AGENT;
            case "level":
                return Agent.LEVEL_AGENT;
            case "module":
                return Agent.MODULE_AGENT;
            case "architecture":
                return Agent.ARCHITECTURE_AGENT;
            default:
                logger.info("The agent requested does not exist")
                throw new HttpException(500, "Internal error");
                
        }
    }

    public getAgentStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
        
          const name = String(req.params.name);
          const agent = this.getAgentByName(name)

          const status: boolean = this.agentManager.getAgentStatus(agent);
          res.status(200).json({ data: status, message: `${name} status` });
          
        } catch (error) {
          next(error);
        }
      };

      public startAgent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
        
          const name = String(req.params.name);
          const agent = this.getAgentByName(name)

          this.agentManager.startAgent(agent);
          res.status(200).json({ data: true, message: `${name} started` });
          
        } catch (error) {
          next(error);
        }
      };

      public stopAgent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
        
          const name = String(req.params.name);
          const agent = this.getAgentByName(name)

          this.agentManager.stopAgent(agent);
          res.status(200).json({ data: true, message: `${name} stopped` });
          
        } catch (error) {
          next(error);
        }
      };

      public getPrefix  = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
        
          const name = String(req.params.name);
          const agent = this.getAgentByName(name)

          const prefix  = await this.agentManager.getAgentPrefix(agent);
          console.log(`Prefix of ${name} is ${prefix}`)
          res.status(200).json({ data: prefix, message: `${name} prefix` });
          
        } catch (error) {
          next(error);
        }
      };

      public force  = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
        
          const name = String(req.params.name);
          const agent = this.getAgentByName(name)

          await this.agentManager.forceRun(agent);
          res.status(200).json({ data: true, message: `${name} prefix` });
          
        } catch (error) {
          next(error);
        }
      };
  }
  
  export default AgentController;