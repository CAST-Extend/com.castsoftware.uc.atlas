import cookieParser from 'cookie-parser';
import cors from 'cors';
import config from 'config';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import Routes from './interfaces/routes.interface';
import errorMiddleware from './middlewares/error.middleware';
import { logger, stream } from './utils/logger';
import { Neo4JAccessLayer } from './utils/neo4jAccessLayer';
import { QueryResult, ServerInfo } from 'neo4j-driver';
import TokenService from './services/token.service';

class App {
  public app: express.Application;
  public port: string | number;
  public env: string;

  constructor(routes: Routes[]) {
    this.app = express();
    this.port = config.get("configuration.port") || 3003;
    this.env = process.env.NODE_ENV || 'development';

    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
    this.connectNeo4j();
  }

  public initServices() {
    const tokenService:TokenService = TokenService.getInstance();
  }

  public connectArtemis() {
    const nal:Neo4JAccessLayer = Neo4JAccessLayer.getInstance();
    const req = "CALL artemis.version()";

    nal.execute(req).then((res:QueryResult) => {
      const singleRecord = res.records[0];
      const version = singleRecord.get(0);
      logger.info(`✔ Artemis is connected. Version : ${version}`);
    }).catch(err => {
      logger.error(`⚠ Artemis extension not present on neo4j server at ${nal.getUri()} .`);
      logger.error("Aborting...");
      process.exit(1);
    })
  }

  public connectNeo4j() {
    if(Neo4JAccessLayer.connect()) {
      const nal:Neo4JAccessLayer = Neo4JAccessLayer.getInstance();
      nal.testConnection().then((val:ServerInfo) => {
        logger.info("✔ Neo4j server is online and reachable !");
        this.connectArtemis();
        this.initServices();
      }).catch(() => {
        logger.error(`⚠ The Neo4j server at ${nal.getUri()} is unreachable. Make sure your security parameters are compliants.`);
        logger.error("Aborting...");
        process.exit(1);
      })
    } else {
      logger.error("⚠ Could not connect to the Neo4j server. Please check the connection parameters.");
      logger.error("Aborting...");
      process.exit(1);
    }

  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`✔ App listening on the port ${this.port}`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    if (this.env === 'production') {
      this.app.use(morgan('combined', { stream }));
      this.app.use(cors({ origin: 'your.domain.com', credentials: true }));
    } else if (this.env === 'development') {
      this.app.use(morgan('dev', { stream }));
      this.app.use(cors({ origin: true, credentials: true }));
    }

    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Example docs',
        },
      },
      apis: ['swagger.yaml'],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
