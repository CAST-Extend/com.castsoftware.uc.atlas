export interface RegexNode {
    id: number;
    name : string;
    regexes: string[];
    internalType: string[];
    framework: string;
    category: string;
    parentId: number;
    children?: RegexNode[];
  }
