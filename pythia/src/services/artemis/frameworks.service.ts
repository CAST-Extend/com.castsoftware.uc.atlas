import bcrypt from 'bcrypt';
import config from 'config';
import { CreateFrameworkDto } from '../../dtos/artemis/frameworks.dto';
import HttpException from '../../exceptions/HttpException';
import { Framework } from '../../interfaces/artemis/framework.interface';
import { logger } from '../../utils/logger';
import { Neo4JAccessLayer } from '../../utils/neo4jAccessLayer';

class FrameworksService {
  private ARTEMIS_LABEL = config.get('artemis.frameworkNode');
  private neo4jAl: Neo4JAccessLayer = Neo4JAccessLayer.getInstance();


  /**
   * Convert a neo4j record to a Framework
   * @param res Record to convert
   */
  private convertRecordToFramework( res : any) :Framework {
    const framework: Framework = {
        name: res.get('name'),
        description: res.get('description'),
        type: res.get('type'),
        category:  res.get('category') || '',
        internalType: res.get('internalType') || '',
        location: res.get('location') || '',
        discoveryDate: res.get('discoveryDate'),
        percentageOfDetection: Number(res.get('percentageOfDetection')) || 0,
      };

      return framework;
  }

  /**
   * Find a framework in the database
   * @param name Name of the Framework to find
   */
  public async findFrameworkbyName(name: string): Promise<Framework> {
    const req: string = `CALL artemis.api.find.framework($name)`;

    try {
      const val = await this.neo4jAl.executeWithParameters(req, { name: name });
      if (!val.records || val.records.length == 0) return null;
    
      const singleRecord = val.records[0];
      return this.convertRecordToFramework(singleRecord);
    } catch (err) {
      logger.error('An internal error occurred in FrameworksServices::findFrameworkbyName ', err);
      throw new HttpException(500, 'Internal error');
    }
  }

  /**
   * Find a framework in the database with the Name and the Type
   * @param name Name of the Framework to find
   */
  public async findFrameworkbyNameAndType(name: string, internalType: string): Promise<Framework> {
    const req: string = `CALL artemis.api.find.framework($name, $internalType)`;

    try {
      const val = await this.neo4jAl.executeWithParameters(req, { name: name, internalType: internalType });
      if (!val.records || val.records.length == 0) return null;
    
      const singleRecord = val.records[0];
      return this.convertRecordToFramework(singleRecord);
    } catch (err) {
      logger.error('An internal error occurred in FrameworksServices::findFrameworkbyName ', err);
      throw new HttpException(500, 'Internal error');
    }
  }

  /**
   * 
   * @param name Update a framework in the database
   * @param frameworkData 
   */
  public async updateFramework(name: string, frameworkData: CreateFrameworkDto): Promise<Framework> {
    // Check if the Framework already exist. Update it, if it has more properties
    const inBase : Framework = await this.findFrameworkbyName(frameworkData.name);

    if(inBase == null) throw new HttpException(404, `Framework with name ${name} does not exist.`);
    const req: string = `CALL artemis.api.update.framework($name, $discoveryDate, $location, $description, $type, $category, $internalType, $numberOfDetection, $percentageOfDetection);`;
    

    try {
        const results = await this.neo4jAl.executeWithParameters(req, frameworkData);

        if (!results.records || results.records.length == 0) return null;
        const singleRecord = results.records[0];

        return this.convertRecordToFramework(singleRecord);
      } catch (err) {
        logger.error('An internal error occurred in FrameworksServices::findFrameworkbyName ', err);
        throw new HttpException(500, 'Internal error');
      }

  }


  public async addFramework(frameworkData: CreateFrameworkDto) : Promise<Framework> {
    // Check if the Framework already exist. Update it, if it has more properties
    logger.info(`Adding Framework with name ${frameworkData.name}`, frameworkData)
    const inBase : Framework = await this.findFrameworkbyNameAndType(frameworkData.name, frameworkData.internalType);

    if(inBase != null) {
        // Merge existing framework
        frameworkData.description = (inBase.description.length!=0) ? inBase.description : frameworkData.description;
        frameworkData.location = (inBase.location.length!=0) ? inBase.location : frameworkData.location;
        frameworkData.category = (inBase.category.length!=0) ? inBase.category : frameworkData.category;
        frameworkData.internalType = (inBase.internalType.length!=0) ? inBase.category : frameworkData.internalType;

        return await this.updateFramework(frameworkData.name, frameworkData);
    } else {
        // Add a new framework
        // API : artemis.api.add.framework(String Name, String DiscoveryDate, String Location, String Description, String Type, String Category, String InternalType)
        const req:string = `CALL artemis.api.add.framework($name, $discoveryDate, $location, $description, $type, $category, $internalType);`;
        const results = await this.neo4jAl.executeWithParameters(req, frameworkData);

        if (!results.records || results.records.length == 0) return null;
  
        const singleRecord = results.records[0];  
        return this.convertRecordToFramework(singleRecord);
    }
  }
}

export default FrameworksService;
