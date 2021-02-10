import { Configuration } from "@/Configuration";
import { QueryResult } from "neo4j-driver";
import { Neo4JAccessLayer } from "../Neo4jAccessLayer";
import Store from "@/store";

const DEMETER_GROUP_PREFIX = "$l_";
const DEMETER_MODULE_PREFIX = "$m_";

export class DaemonController {
  private static INSTANCE = new DaemonController();

  private neo4jal: Neo4JAccessLayer = Neo4JAccessLayer.getInstance();
  private running = true;
  private refreshRate = 500;

  /**
   * Check if demeters groups are present in the database, and merge them
   */
  private async checkGrouping() {
    const forgedRequest = `MATCH (o:Object) WHERE EXISTS(o.Tags) AND any( x IN o.Tags WHERE x CONTAINS '${DEMETER_GROUP_PREFIX}' ) RETURN DISTINCT [ x IN LABELS(o) WHERE NOT (x='Object' OR x='SubObject')] as application;`;
    const results: QueryResult = await this.neo4jal.execute(forgedRequest);

    const appNames: string[] = [];
    for (let i = 0; i < results.records.length; i++) {
      const singleRecord = results.records[i];
      const appName = singleRecord.get("application");
      appNames.push(appName);
    }

    if (appNames.length > 0) {
      console.log(`${appNames.length} applications to group.`, appNames);
      // Merge groups in application
      let groupRequest: string;
      for (const index in appNames) {
        try {
          groupRequest = `CALL demeter.group.levels('${appNames[index]}');`;
          await this.neo4jal.execute(groupRequest);
        } catch (error) {
          console.error(
            `Daemon :: Grouping Levels failed for application with name : ${name}`,
            error
          );
        }
      }
    }
  }

  /**
   * Check if demeter groups are present in the database, and merge them
   */
  private async checkModules() {
    const forgedRequest = `MATCH (o:Object) WHERE EXISTS(o.Tags) AND any( x IN o.Tags WHERE x CONTAINS '${DEMETER_MODULE_PREFIX}' ) RETURN DISTINCT [ x IN LABELS(o) WHERE NOT (x='Object' OR x='SubObject')] as application;`;
    const results: QueryResult = await this.neo4jal.execute(forgedRequest);

    const appNames: string[] = [];
    for (let i = 0; i < results.records.length; i++) {
      const singleRecord = results.records[i];
      const appName = singleRecord.get("application");
      appNames.push(appName);
    }

    if (appNames.length > 0) {
      console.log(`${appNames.length} applications to group.`, appNames);
      // Merge groups in application
      let groupRequest: string;
      for (const index in appNames) {
        try {
          groupRequest = `CALL demeter.group.modules('${appNames[index]}');`;
          await this.neo4jal.execute(groupRequest);
        } catch (error) {
          console.error(
            `Daemon :: Grouping Modules failed for application with name : ${name}`,
            error
          );
        }
      }
    }
  }

  /**
   * Change the refresh Rate of the Daemon. The current interval will be resetted
   * @param time new refresh rate
   */
  public setRefreshRate(time: number) {
    if (time < 500) time = 500;
    this.refreshRate = time;
  }

  /**
   * Stop the Daemon
   */
  public stop() {
    this.running = false;
  }

  /**
   * Start the Daemon, check if grouping is allowed
   */
  public async run() {
    // If the Daemon is active
    if (Store.state.daemonLevelState) {
      await this.checkGrouping();
    }

    if (Store.state.daemonModuleState) {
      await this.checkModules();
    }

    let timeout = this.refreshRate;
    if (!Store.state.daemonLevelState && !Store.state.daemonModuleState) {
      timeout = 1500;
    }

    // Timeout and relaunch the daemon's actions
    setTimeout(() => {
      this.run();
    }, timeout);
  }

  /**
   * Get the current instance of the Daemon
   */
  public static getInstance() {
    return DaemonController.INSTANCE;
  }

  /**
   * Constructor
   */
  private DaemonController() {
    this.running = true;
    this.neo4jal = Neo4JAccessLayer.getInstance();
    this.refreshRate = Configuration.getProperties().refreshRate;
  }
}
