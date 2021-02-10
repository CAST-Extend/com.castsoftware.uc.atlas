import { LaunchDetectionDto } from '@dtos/artemis/detection.dto';
import { Artifact } from '@interfaces/artemis/artifact.interface';
import ArtifactService from '@services/artemis/artifact.service';
import { NextFunction, Request, Response } from 'express';


class ArtifactController {
    private artifactService = new ArtifactService();
  
    public getListArtifact= async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const detectionParams:LaunchDetectionDto = req.body;
        const listArtifact: Artifact[] = await this.artifactService.getArtifactsList(detectionParams.application, detectionParams.language);
        res.status(200).json({ data: listArtifact, message: 'Artifact' });
        
      } catch (error) {
        next(error);
      }
    };

    public getArtifactsAsTree= async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const detectionParams:LaunchDetectionDto = req.body;
        const listArtifact: Artifact[] = await this.artifactService.getArtifactAsTree(detectionParams.application, detectionParams.language);
        console.log("Result of tree", listArtifact)
        res.status(200).json({ data: listArtifact, message: 'Artifact Tree' });
        
      } catch (error) {
        next(error);
      }
    };
  }
  
  export default ArtifactController;