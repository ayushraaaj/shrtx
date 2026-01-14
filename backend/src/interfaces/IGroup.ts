import { Types, Document, ObjectId } from "mongoose";

export interface IGroup extends Document {
    groupName: string;
    owner: Types.ObjectId;
}
