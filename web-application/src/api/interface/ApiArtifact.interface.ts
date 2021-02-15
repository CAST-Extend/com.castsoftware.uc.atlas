export interface Artifact {
  id: number;
  name: string;
  parentId: number;
  delimiter: string;
  children?: Artifact[];
}
