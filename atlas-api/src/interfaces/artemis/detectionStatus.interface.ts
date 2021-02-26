import { logger } from "@shared/logger";
import { Transaction } from "neo4j-driver";
import { Framework } from "./framework.interface";

export enum DetectionStatus {
    Pending,
    Success,
    Failure,
    Unknown
}

export class Detection {
  public application:string;
  public timestampStart:number;
  public timestampFinish = 0;
  public language:string;
  public status: DetectionStatus;
  public data: Framework[] = [];


  public markAsSuccess(data: Framework[]) {
    this.timestampFinish = Date.now();
    this.status = DetectionStatus.Success;
    this.data = data;
  }

  public markAsFailed() {
    this.timestampFinish = Date.now();
    this.status = DetectionStatus.Failure;
  }

  public markAsPending() {
    this.status = DetectionStatus.Pending;
  }
  
  constructor(application:string, language:string) {
    this.application = application;
    this.language = language;
    this.status = DetectionStatus.Unknown;
    this.timestampStart = Date.now();
  }
}

export class CancellablePromise<T> {
  public cancel:CallableFunction;
  public promise: Promise<T>;
  public application: string; 
  public language: string;
  public transaction: Transaction;
  public isFinished: boolean;

  public isDone() :boolean {
    return this.isFinished;
  }

  constructor(application:string, language:string, transaction: Transaction, wrappedPromise:Promise<T>) {
    this.transaction = transaction;
    this.application = application;
    this.language = language;
    this.isFinished = false;
    this.promise = new Promise((resolve, reject) => {
        this.cancel = reject;
        wrappedPromise.then((res:T) => {
          this.transaction.commit();
          resolve(res);
        }).catch((err) => {
          this.transaction.rollback();
          logger.info(`The promise for application ${this.application} was cancelled.`);
        }).finally(() => {
          this.isFinished = true;
        })
    })
  }
}