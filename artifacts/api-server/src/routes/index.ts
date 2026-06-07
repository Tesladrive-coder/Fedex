import { Router, type IRouter } from "express";
import healthRouter from "./health";
import trackingRouter from "./tracking";
import shipmentsRouter from "./shipments";
import servicesRouter from "./services";
import contactRouter from "./contact";
import dashboardRouter from "./dashboard";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(trackingRouter);
router.use(shipmentsRouter);
router.use(servicesRouter);
router.use(contactRouter);
router.use(dashboardRouter);
router.use(adminRouter);

export default router;
