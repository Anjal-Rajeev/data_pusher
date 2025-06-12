import { Router } from "express";
const router = Router();
import * as controller from "../controllers/account.controller.js"



router.post("/", controller.createAccount)
router.put("/", controller.updateAccount)
router.get("/", controller.listAllAccounts)
router.get("/:id", controller.listOneAccount)
router.delete("/:id", controller.deleteAccount)



export default router;