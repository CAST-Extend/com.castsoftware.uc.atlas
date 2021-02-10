import { Neo4JAccessLayer } from "@database/neo4jAccessLayer";
import config from "config";
import fs from "fs";
import path from "path";

class Options {
    internet:string;
    repository: string;
    oracle: string;

    constructor(json:string) {
        const jsonObj:any = JSON.parse(json);
        this.internet = jsonObj["internet"];
        this.repository = jsonObj["repository"];
        this.oracle = jsonObj["oracle"];
    }
}

class Profil {
    name: string;
    description: string;
    options: Options

    constructor(json:string) {
        const jsonObj:any = JSON.parse(json);
        this.name = jsonObj["name"];
        this.description = jsonObj["description"];
        this.options = new Options(jsonObj["options"]);
    }
}

class ProfilService {
    private static neo4jAl: Neo4JAccessLayer = Neo4JAccessLayer.getInstance();
    private static PROFILE_DIRECTORY:string = String(config.get("workspace.profiles"));


    /**
     * Get the list of profiles in the profile directory
     */
    public static getProfileList() : string[] {
        const directoryPath = path.join(__dirname, ProfilService.PROFILE_DIRECTORY);

        try {
            const files:string[] = fs.readdirSync(directoryPath);
            return files.filter(x => x.endsWith(".json"));
        } catch (err) {
            if (err) {
                console.error('Unable to retrieve the list of profiles', err);
                return [];
            }    
        }
    }

    /**
     * Get a profil stored on the server
     * @param profil Name of the profil to get
     */
    public static getProfile(profil:string) : Profil {
        const profiles = this.getProfileList();
        const indexProfil = profiles.indexOf(profil); // Avoid FileTraversal
        if(indexProfil != -1) {
            const fileName = profiles[indexProfil] + ".json";
            const profilAsString = fs.readFileSync(ProfilService.PROFILE_DIRECTORY + fileName, 'utf8');

            return new Profil(profilAsString);
        } else {
            throw new Error(`The profil with name ${profil} does not exist on the server`);
        }
    }


    public static setCastProfile() {
        const profil: Profil = this.getProfile("cast_internal");
        
    }
    
    public static setExternalProfile() {
        const profil: Profil = this.getProfile("cast_external");
    }

}


export default ProfilService;