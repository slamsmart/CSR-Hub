import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import usersRouter from "./users";
import organizationsRouter from "./organizations";
import proposalsRouter from "./proposals";
import projectsRouter from "./projects";
import cofundingRouter from "./cofunding";
import notificationsRouter from "./notifications";
import dashboardRouter from "./dashboard";
import auditRouter from "./audit";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(usersRouter);
router.use(organizationsRouter);
router.use(proposalsRouter);
router.use(projectsRouter);
router.use(cofundingRouter);
router.use(notificationsRouter);
router.use(dashboardRouter);
router.use(auditRouter);

export default router;
