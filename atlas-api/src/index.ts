import './pre-start'; // Must be the first import
import 'module-alias'
import app from '@server';
import fs from 'fs';
import config from "config";
import {logger} from '@shared/logger';
import { AgentManager } from '@agents/agent.manager';
import { FrameworkAssistantManager } from './assistants/framework.assistant';

// Start the server
const port = Number(process.env.PORT || config.get("atlas.port"));
const hostname = String(config.get("atlas.hotsname") || "localhost");

// Initialize the routines
const frameworkAssistants = FrameworkAssistantManager.getInstance();
const agentManager = AgentManager.getInstance();
agentManager.initialize();

app.listen(port, hostname, () => {
    logger.info('Express server started on port: ' + port);
});
