import { Router } from "express";
const router = Router();
import * as controller from "../controllers/destination.controller.js"



router.post("/", controller.createDestination)
router.put("/", controller.updateDestination)
router.get("/", controller.listDestinations)
router.get("/by-account", controller.getDesignationsByAccount)
router.get("/:id", controller.getDestinationById)
router.delete("/:id", controller.deleteDestination)



export default router;