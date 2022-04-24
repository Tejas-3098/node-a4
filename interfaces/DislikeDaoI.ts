import Dislike from "../models/Dislikes";

/**
* @file Declares API for dislikes related data access objects
*/
export default interface DislikeDaoI {
    findAllUsersThatDislikedTuit (tid: string): Promise<Dislike[]>;
    findAllTuitsDislikedByUser (uid: string): Promise<Dislike[]>;
    userDislikesTuit (tid: string, uid: string): Promise<Dislike>;
    userUndislikesTuit (tid: string, uid: string): Promise<any>;
}
