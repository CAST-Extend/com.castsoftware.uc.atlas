import PrefixController from "../configuration/prefix.controller";
import { Neo4JAccessLayer } from "../Neo4jAccessLayer";

export interface GroupAction {
  title: string;
  category: string;
  description: string;
  request: string;
  tag: string;
  returnVal?: string;
}

export class GroupActionController {
  private static neo4jal: Neo4JAccessLayer = Neo4JAccessLayer.getInstance();
  private static contextAnchor = "%%CONTEXT_LABEL%%";

  /**
   * Split application, and merge external nodes aside it
   */
  public static async getConfigurationActions(
    applicationName: string
  ): Promise<GroupAction[]> {
    const levelPrefix = await PrefixController.getLevelTag();
    const tempReqTable: GroupAction[] = [
      {
        title: "Merge group",
        category: "Configuration",
        description:
          "Merge to a new level 5 the objects prefixed by '${levelPrefix}' in CAST Imaging",
        request: `CALL demeter.group.levels('%%CONTEXT_LABEL%%');`,
        tag: ""
      },
      {
        title: "Split external objects",
        category: "Configuration",
        description:
          "Split all the external objects in the application and regroup them under they own Level5 nodes",
        request: `MATCH (l:Level5:%%CONTEXT_LABEL%%)-[:Aggregates]->(obj:Object:%%CONTEXT_LABEL%%) WHERE obj.External=true SET obj.Tags = CASE WHEN obj.Tags IS NULL THEN ['${levelPrefix}External '+l.Name] ELSE obj.Tags + '${levelPrefix}External '+l.Name END`,
        tag: ""
      },
      {
        title: "Group in external / internal objects",
        category: "Configuration",
        description:
          "Regroup ALL the object in your application in 2 categories : externals and internal. (Configuration checker)",
        request: `MATCH (l:Level5:%%CONTEXT_LABEL%%)-[:Aggregates]->(obj:Object:%%CONTEXT_LABEL%%) WHERE obj.External=true SET obj.Tags = CASE WHEN obj.Tags IS NULL THEN ['${levelPrefix}External '+l.Name] ELSE obj.Tags + '${levelPrefix}External '+l.Name END`,
        tag: ""
      },
      {
        title: "Split not in transaction objects",
        category: "Configuration",
        description:
          "Split all the objects not in transactions and regroup them under they own Level5 nodes",
        request: `MATCH (n:ObjectProperty) 
          WITH MAX(n.Id)+1 as maxId 
          MERGE (oc:ObjectProperty { Description: "Prefix_List of transactions going through the object:", Id: maxId }) 
          WITH oc 
          MATCH (o:Object:%%CONTEXT_LABEL%%)<-[:Contains]-(tx:Transaction) 
          WITH oc, o, COLLECT(DISTINCT tx.Name) as transactionList 
          WITH oc, o, REDUCE(s = "", n IN transactionList | s + ', ' + n) as stringTransactions 
          MERGE (o)-[:Property { value: RIGHT(stringTransactions,SIZE(stringTransactions)-2) }]->(oc)`,
        tag: ""
      }
    ];

    // Replace application anchor, by the provided one
    return tempReqTable.map(x => {
      x.request = x.request.replaceAll(this.contextAnchor, applicationName);
      return x;
    });
  }

  public static async getModernizationActions(
    applicationName: string
  ): Promise<GroupAction[]> {
    const levelPrefix = await PrefixController.getLevelTag();
    const tempReqTable: GroupAction[] = [
      {
        title: "Spring Dao Objects",
        category: "Spring MVC",
        description:
          "Group, under a new level 5 nodes, all the Spring Dao Objects",
        request: `MATCH (op:ObjectProperty)-[r:Property]-(n:Object:\`${applicationName}\`) WHERE op.Description='Annotation:' AND r.value CONTAINS '@Entity' %%SET_TAG(n)%%`,
        tag: levelPrefix + "Spring Servlets",
        returnVal: "n"
      },
      {
        title: "Spring Controllers",
        category: "Spring MVC",
        description: "Group, under a new level 5 nodes,  Spring Controllers",
        request: `MATCH (op:ObjectProperty)-[r:Property]-(n:Object:\`${applicationName}\`) WHERE op.Description='Annotation:' AND r.value CONTAINS '@Stateless' OPTIONAL MATCH (n)-[]->(o:Object) WHERE NOT (o:Object)-[]->(:Object) WITH DISTINCT (COLLECT(n) + COLLECT(o)) as serviceObj UNWIND serviceObj as obj %%SET_TAG(obj)%%`,
        tag: levelPrefix + "Spring Controllers",
        returnVal: "obj"
      },
      {
        title: "Spring Dao Objects",
        category: "Spring MVC",
        description: "Group, under a new level 5 nodes,  Spring Dao Objects",
        request: `MATCH (op:ObjectProperty)-[r:Property]-(n:Object:\`${applicationName}\`) WHERE op.Description='Annotation:' AND r.value CONTAINS '@Entity' %%SET_TAG(n)%%`,
        tag: levelPrefix + "Spring DAO",
        returnVal: "n"
      },
      {
        title: "Spring Dao Class",
        category: "Spring MVC",
        description:
          "Group, under a new level 5 nodes,  all the objects with type JAVA CLASS DAO",
        request: `MATCH (o:Object:\`${applicationName}\`) WHERE o.Type='Java Class DAO' %%SET_TAG(o)%% `,
        tag: levelPrefix + "Spring DAO",
        returnVal: "o"
      },
      {
        title: `Static Objects : Utilities`,
        category: `Spring MVC`,
        description: `Group, under a new level 5 nodes, all the objects only having static methods`,
        request: `MATCH p=(o:Object:\`${applicationName}\`)-[:BELONGTO]-(so:SubObject)-[r:Property]-(sp:ObjectProperty) WHERE o.Name CONTAINS 'Util' AND so.Type CONTAINS 'Method' AND sp.Description='Extended Type' WITH o as obj, COLLECT(DISTINCT r) as links WHERE all(x in links WHERE x.value CONTAINS 'static') %%SET_TAG(obj)%%`,
        tag: levelPrefix + `Utils`,
        returnVal: `obj`
      },
      {
        title: `Spring Java Persistence`,
        category: `Spring MVC`,
        description: `Group, under a new level 5 nodes,  All the objects part of the Java persistence Framework`,
        request: `MATCH (n:Object:\`${applicationName}\`) WHERE n.Type CONTAINS 'JPA' OR n.FullName CONTAINS 'javax.persistence' %%SET_TAG(n)%%`,
        tag: levelPrefix + `JAVA Persistence`,
        returnVal: `n`
      },
      {
        title: `Links to DAO`,
        category: `Spring MVC`,
        description: `Group, under a new level 5 nodes, all the logic linked to the DAO objects`,
        request: `MATCH (op:ObjectProperty)-[r:Property]-(n:Object:\`${applicationName}\`) WHERE op.Description='Annotation:' AND r.value CONTAINS '@Entity' WITH n as DAOobjects MATCH (o:Object:\`${applicationName}\`)-[r]->(DAOobjects) WHERE o.Type='Java Class' WITH DAOobjects,  COLLECT(TYPE(r)) as numRel, o WHERE all(x in numRel WHERE x='MENTION') %%SET_TAG(o)%% `,
        tag: levelPrefix + `Spring DAO`,
        returnVal: `o`
      },
      {
        title: `Presentation Layer `,
        category: `Spring MVC`,
        description: `Group, under a new level 5 nodes,  all the objects displaying web information to the user, as JSP and HTML pages`,
        request: `MATCH (op:Object:\`${applicationName}\`) WHERE op.Type IN ['JSP Pages', 'eFile'] %%SET_TAG(op)%%`,
        tag: levelPrefix + `View Layer`,
        returnVal: `op`
      }
    ];

    // Replace application anchor, by the provided one
    return tempReqTable.map(x => {
      // Replace context
      x.request = x.request.replaceAll(this.contextAnchor, applicationName);
      // Replace the tag anchor
      let toInsert = `SET @.Tags = CASE WHEN @.Tags IS NULL THEN ['${x.tag}'] ELSE @.Tags + '${x.tag}' END`;
      toInsert = toInsert.replaceAll("@", x.returnVal);
      x.request = x.request.replace(/%%SET_TAG\(([A-Za-z]*)\)%%/, toInsert);
      // Replace tag
      return x;
    });
  }

  public static async executeAction(action: GroupAction): Promise<void> {
    await this.neo4jal.execute(action.request);
  }

  public static async replicateModuleView(
    applicationName: string
  ): Promise<void> {
    const cleanModules = `
    MATCH (m:Module:${applicationName})-[]->(obj:Object)
    SET obj.Module =""
    DETACH DELETE m;`;

    const createModules = `
    MATCH(l:Level5:\`${applicationName}\`)-[]->(obj:Object)
    WITH l.Name as levelName, COLLECT(obj) as objectList, COUNT(obj) as numObj
    MERGE (m:\`${applicationName}\`:Module{ AipId:"-1", Color:'rgb(34, 199, 214)', Type:'module', Name:levelName, Count: numObj})
    WITH m as module, objectList
    UNWIND objectList as obj 
    MERGE (module)-[:Contains]->(obj)
    SET obj.Module=module.Name;`;

    const linkModules = `
    MATCH (n:Module:${applicationName})-[:Contains]->(:Object)-->(:Object)<-[:Contains]-(l:Module) WHERE n.Name<>l.Name 
    MERGE (n)-[:References]->(l);`;

    await this.neo4jal.execute(cleanModules);
    await this.neo4jal.execute(createModules);
    await this.neo4jal.execute(linkModules);
  }
}
