import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
    bulkAssignUrlsToGroup,
    bulkRemoveUrlsFromGroup,
    createGroupName,
    deleteGroup,
    getAllGroups,
    updateGroupName,
} from "../controllers/group.controller";

const router = Router();

router.use(verifyJWT);

router.route("/create").post(createGroupName);
router.route("/get-all").get(getAllGroups);
router.route("/assign-bulk").post(bulkAssignUrlsToGroup);
router.route("/remove-bulk").post(bulkRemoveUrlsFromGroup);
router.route("/:groupId/delete").delete(deleteGroup);
router.route("/:groupId/update").patch(updateGroupName);

export default router;
