import { IUser } from "../models/user.types";

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}
