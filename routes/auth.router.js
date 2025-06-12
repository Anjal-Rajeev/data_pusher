import { Router } from "express";
const router = Router();
import * as controller from "../controllers/account.controller.js"



router.post("/", controller.createAccount)



export default router;