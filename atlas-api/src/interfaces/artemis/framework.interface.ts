/*
  Example: 
    "Name": "RATT01"
    "Type": "NotFramework",
    "Location": "No location discovered",
    "Description": "No Description"
    "DiscoveryDate": "2020-21-15 06:21:28",
    "PercentageOfDetection": 0.765347571
*/

export interface Framework {
    id: number;
    name: string;
    description: string;
    type: string;
    category?: string;
    internalType: string[];
    location: string;
    discoveryDate: string;
    percentageOfDetection?: number;
  }
  
