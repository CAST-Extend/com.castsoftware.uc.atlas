import { Router } from 'express';
import ArtemisRoute from './artemis.route';
import ArtifactRoute from './artifact.route';
import CategoryRoute from './category.route';
import DetectionRoute from './detection.route';
import FrameworksRoute from './frameworks.route';
import LanguageRoute from './language.route';
import RegexNodeRoute from './regexNode.route';

// Init router and path
const router = Router();
const detectionRoute = new DetectionRoute();
const frameworkRoute = new FrameworksRoute();
const languageRoute = new LanguageRoute();
const artemisRoute = new ArtemisRoute();
const regexRoute = new RegexNodeRoute();
const categoryRouter = new CategoryRoute();
const artifactRouter = new ArtifactRoute();

// Add sub-routes
router.use('/frameworks', frameworkRoute.router);
router.use('/detection', detectionRoute.router);
router.use('/languages', languageRoute.router);
router.use('/utils', artemisRoute.router);
router.use('/regexes', regexRoute.router);
router.use('/category', categoryRouter.router);
router.use('/artifacts', artifactRouter.router);

// Export the base-router
export default router;
