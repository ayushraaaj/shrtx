import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
    bulkAssignUrlsToGroup,
    bulkRemoveUrlsFromGroup,
    createGroupName,
    getAllGroups,
} from "../controllers/group.controller";

const router = Router();

router.use(verifyJWT);

router.route("/create").post(createGroupName);
router.route("/get-all").get(getAllGroups);
router.route("/assign-bulk").post(bulkAssignUrlsToGroup);
router.route("/remove-bulk").post(bulkRemoveUrlsFromGroup);

export default router;
