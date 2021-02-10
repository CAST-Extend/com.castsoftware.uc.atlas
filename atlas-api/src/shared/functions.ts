import {logger} from './logger';

export const pErr = (err: Error) => {
    if (err) {
        logger.error(err);
    }
};

export const getRandomInt = () => {
    return Math.floor(Math.random() * 1_000_000_000_000);
};

export function sleep(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }