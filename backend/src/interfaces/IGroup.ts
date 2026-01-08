import { Types, Document } from "mongoose";

export interface IGroup extends Document {
    groupName: string;
    owner: Types.ObjectId;
}
