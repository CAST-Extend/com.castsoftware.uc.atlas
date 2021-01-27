import { Neo4JAccessLayer } from "src/database/neo4jAccessLayer";
import { DemeterGroup } from "src/interfaces/demeter/demeterGroup.interface";
import { CandidateResults } from "src/interfaces/demeter/candidateResults.interface";
import { int, Integer } from "neo4j-driver";

class GroupingService {
    private neo4jAl: Neo4JAccessLayer = Neo4JAccessLayer.getInstance();

    /**
     * Get the Level Candidates for a demeter grouping
     * @param application Name of the application
     */
    public async getCandidatesLevel(application:string)  : Promise<CandidateResults[]> {
        const req = "CALL demeter.api.get.candidate.levels($appName)";
        const params = { appName: application };

        let groups:CandidateResults[] = [];

        const res = await this.neo4jAl.executeWithParameters(req, params);

        for (let index = 0; index < res.records.length; index++) {
            const record = res.records[index];
            groups.push({
                application: record.get("application"),
                tags: record.get("tags"),
                numTags: record.get("numTags")
            });
        }

        return groups;

    } 

    /**
     * Get the candidate modules for a specific application
     * @param application Name of the application
     */
    public async getCandidatesModules(application:string)  : Promise<CandidateResults[]> {
        const req = "CALL demeter.api.get.candidate.modules($appName)";
        const params = { appName: application };

        let groups:CandidateResults[] = [];

        const res = await this.neo4jAl.executeWithParameters(req, params);

        for (let index = 0; index < res.records.length; index++) {
            const record = res.records[index];
            groups.push({
                application: record.get("application"),
                tags: record.get("tags"),
                numTags: record.get("numTags")
            });
        }

        return groups;


    } 

    /**
     * Get the demeter levels in a application
     * @param application Name of the application
     */
    public async getGroupedDemeterLevel(application:string) : Promise<DemeterGroup[]> {
        const req = 'CALL demeter.api.get.demeter.levels($appName)';
        const params = { appName: application };

        let groups:DemeterGroup[] = [];

        const res = await this.neo4jAl.executeWithParameters(req, params);

        for (let index = 0; index < res.records.length; index++) {
            const record = res.records[index];
            groups.push({
                id: int(record.get("id")).toNumber(),
                name: record.get("name"),
                application: record.get("application"),
                numObjects: record.get("numObjects")
            })
        }

        return groups;

    } 

    /**
     * Get the demeter modules in a application
     * @param application Name of the application
     */
    public async getGroupedDemeterModule(application:string) : Promise<DemeterGroup[]> {
        const req = 'CALL demeter.api.get.demeter.modules($appName)';
        const params = { appName: application };

        let groups:DemeterGroup[] = [];

        const res = await this.neo4jAl.executeWithParameters(req, params);

        for (let index = 0; index < res.records.length; index++) {
            const record = res.records[index];
            groups.push({
                id: int(record.get("id")).toNumber(),
                name: record.get("name"),
                application: record.get("application"),
                numObjects: record.get("numObjects")
            })
        }

        return groups;
    } 

} 

export default GroupingService;