import { NextFunction, Request, Response } from 'express';
import SynchronizerService from '@services/synchronizer/synchronizerConfig';
import SynchronizerPullService from '@/services/synchronizer/synchronizerPull';
import { Framework } from '@/interfaces/artemis/framework.interface';
// await SynchronizerService.getInstance().setLastUpdate();

class SynchronizerController {
    // Get the last update
    public getLastUpdate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const lastUpdate : number = await SynchronizerService.getInstance().getLastUpdate()
        res.status(200).send({ data: lastUpdate, message : "Last Update"});
      } catch (error) {
        next(error);
      }
    };

    // Pull the list of frameworks
    public pullFrameworks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
          let lastPullTimestamp : number = Number(req.params.timestamp);
          if(!lastPullTimestamp || isNaN(lastPullTimestamp)) lastPullTimestamp = 0;

          const frameworks : Framework[] = await SynchronizerPullService.pullFrameworks(lastPullTimestamp);

          res.status(200).send({ data: frameworks, message : "Pull"});
        } catch (error) {
          next(error);
        }
      };

      // Pull the list of frameworks
    public pullFrameworksForecast = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        let lastPullTimestamp : number = Number(req.params.timestamp);
        if(!lastPullTimestamp || isNaN(lastPullTimestamp)) lastPullTimestamp = 0;

        const numFramework = await SynchronizerPullService.pullFrameworksForecast(lastPullTimestamp);

        res.status(200).send({ data: numFramework, message : "Pull Forecast"});
      } catch (error) {
        next(error);
      }
    };
  }

  export default SynchronizerController;
  