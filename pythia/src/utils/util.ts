import { Framework } from '@/interfaces/artemis/framework.interface';

export const isEmpty = (value: any): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (value === 'undefined' || value === undefined) {
    return true;
  } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
    return true;
  } else {
    return false;
  }
};

export const wait = (ms): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Generate a pseudo-unique token
 */
export const uuidv4 = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Convert a neo4j record to a Framework
 * @param res Record to convert
 */
export const convertRecordToFramework = (res: any): Framework => {
  const framework: Framework = {
    name: res.get('name'),
    description: res.get('description'),
    type: res.get('type'),
    category: res.get('category') || '',
    internalType: res.get('internalType') || '',
    location: res.get('location') || '',
    discoveryDate: res.get('discoveryDate'),
    percentageOfDetection: Number(res.get('percentageOfDetection')) || 0,
  };

  return framework;
};
