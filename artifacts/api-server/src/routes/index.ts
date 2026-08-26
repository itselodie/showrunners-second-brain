import { Router, type IRouter } from "express";
import healthRouter from "./health";
import sceneAnalysisRouter from "./scene-analysis";

const router: IRouter = Router();

router.use(healthRouter);
router.use(sceneAnalysisRouter);

export default router;
