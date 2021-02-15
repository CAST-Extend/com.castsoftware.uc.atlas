export interface GroupRecord {
  application: string;
  tags: string[];
  countTag: number;
}

export interface Level5Group {
  id: number;
  name: string;
  application: string;
  numObjects: number;
  demeterGroup: boolean;
}
