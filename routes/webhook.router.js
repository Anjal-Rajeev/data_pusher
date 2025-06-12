import { Router } from "express";
const router = Router();
import * as controller from "../controllers/webhook.controller.js"



router.post("/incoming_data", controller.incomingDataHandler)



export default router;