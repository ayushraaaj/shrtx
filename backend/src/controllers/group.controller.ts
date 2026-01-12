import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { Group } from "../models/group.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { Url } from "../models/url.model";

export const createGroupName = asyncHandler(
    async (req: Request, res: Response) => {
        const { groupName } = req.body;
        const userId = req.user?._id;

        const existingGroup = await Group.findOne({
            groupName: { $regex: `^${groupName}$`, $options: "i" },
            owner: userId,
        });

        if (existingGroup) {
            throw new ApiError(409, `Group with ${groupName} already exists`);
        }

        const group = await Group.create({ groupName, owner: userId });

        return res
            .status(201)
            .json(new ApiResponse("Group created successfully", group));
    }
);

export const getAllGroups = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?._id;

        const groups = await Group.find({ owner: userId }).select("-owner");

        return res
            .status(200)
            .json(
                new ApiResponse("All groups are fetched successfully", groups)
            );
    }
);

export const bulkAssignUrlsToGroup = asyncHandler(
    async (req: Request, res: Response) => {
        const { groupName, urlIds } = req.body;
        const userId = req.user?._id;

        // if (urlIds.length === 0) {
        //     throw new ApiError(400, "Invalid");
        // }

        const group = await Group.findOne({ groupName, owner: userId });

        if (!group) {
            throw new ApiError(404, "Group not found");
        }

        const urlDoc = await Url.updateMany(
            { _id: { $in: urlIds }, owner: userId },
            { $set: { groupId: group._id } }
        );

        return res
            .status(200)
            .json(
                new ApiResponse(
                    `Urls successfully assigned to ${groupName}`,
                    {}
                )
            );
    }
);

export const bulkRemoveUrlsFromGroup = asyncHandler(
    async (req: Request, res: Response) => {
        const { groupName, urlIds } = req.body;
        const userId = req.user?._id;

        const group = await Group.findOne({ groupName, owner: userId });

        if (!group) {
            throw new ApiError(404, "Group not found");
        }

        const urlDoc = await Url.updateMany(
            { _id: { $in: urlIds }, owner: userId },
            { $set: { groupId: null } }
        );

        return res
            .status(200)
            .json(
                new ApiResponse(
                    `Urls successfully removed from ${groupName}`,
                    {}
                )
            );
    }
);

export const deleteGroup = asyncHandler(async (req: Request, res: Response) => {
    const { groupId } = req.params;
    const userId = req.user?._id;

    const group = await Group.findOne({ _id: groupId, owner: userId });

    if (!group) {
        throw new ApiError(404, "Group not found");
    }

    await Url.updateMany(
        { groupId: group._id, owner: userId },
        { $set: { groupId: null } }
    );

    await Group.deleteOne({ _id: groupId });

    return res
        .status(200)
        .json(new ApiResponse("Group deleted successfully", {}));
});

export const updateGroupName = asyncHandler(
    async (req: Request, res: Response) => {
        const { groupId } = req.params;
        const { newGroupName } = req.body;
        const userId = req.user?._id;

        const group = await Group.findOne({ _id: groupId, owner: userId });

        if (!group) {
            throw new ApiError(404, "Group not found");
        }

        const existingGroup = await Group.findOne({
            groupName: { $regex: `^${newGroupName}$`, $options: "i" },
            owner: userId,
        });

        if (existingGroup) {
            throw new ApiError(409, `${newGroupName} alreay exists`);
        }

        group.groupName = newGroupName.trim();
        await group.save({ validateBeforeSave: false });

        return res
            .status(200)
            .json(new ApiResponse("Successfully updated group name", {}));
    }
);
