import config from "config";

import neo4j, { Driver, QueryResult, ServerInfo, session, Session } from "neo4j-driver";

export class Neo4JAccessLayer {
  private uri: string;
  private driver: Driver;

  private static INSTANCE: Neo4JAccessLayer;

  public getUri(): string {
    return this.uri;
  }

  /**
   * Execute an async query
   * @param request The request you wan to execute
   */
  public async execute(request: string): Promise<QueryResult> {
    const session: Session = this.driver.session();
    try {
      const results: QueryResult = await session.run(request);
      return results;
    } finally {
      session.close();
      
    }
  }

  /**
   * Get a new session
   */
  public getSession() {
    return this.driver.session();
  }

  /**
   * Execute an async query
   * @param request The request you wan to execute
   * @param params The parameters of the query, as an object
   * @param callback Callback function
   */
  public async executeWithParameters(
    request: string,
    params: any
  ): Promise<QueryResult> {
    const session: Session = this.driver.session();
    try {
      const results: QueryResult = await session.run(request, params);
      return results;
    } finally {
      session.close();
    }
  }

  /**
   * Check the Avaibility of the neo4j server
   */
  public async testConnection(): Promise<ServerInfo> {
    return this.driver.verifyConnectivity();
  }

  /**
   * Get the actual instance of the Neo4J connection
   */
  public static getInstance() {
    if (Neo4JAccessLayer.INSTANCE == null) {
      Neo4JAccessLayer.INSTANCE = new Neo4JAccessLayer();
    }
    return Neo4JAccessLayer.INSTANCE;
  }

  /**
   * Connect to the Neo4j instance
   */
  public static connect(): boolean {
    try {
      Neo4JAccessLayer.INSTANCE = new Neo4JAccessLayer();
      return true;
    } catch (error) {
      return false;
    }
  }

  private constructor() {

    this.uri = config.get("neo4j.uri");
    const token = neo4j.auth.basic(config.get("neo4j.user"), config.get("neo4j.password"));

    try {
      this.driver = neo4j.driver(this.uri, token);
    } catch (error) {
      throw new Error(
        `Cannot connect to the remote Neo4j database o ${this.uri}`
      );
    }
  }
}
