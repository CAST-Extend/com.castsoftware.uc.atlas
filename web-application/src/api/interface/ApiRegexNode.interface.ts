export interface ApiRegexNode {
    id: number;
    name : string;
    regexes: string[];
    internalTypes: string[];
    framework: string;
    category: string;
    parentId: number;
    children?: ApiRegexNode[];
  }
