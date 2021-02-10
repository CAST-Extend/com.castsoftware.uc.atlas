export interface RegexNode {
    id: number;
    name : string;
    regexes: string[];
    internalTypes: string[];
    framework: string;
    category: string;
    parentId: number;
    children?: RegexNode[];
  }
