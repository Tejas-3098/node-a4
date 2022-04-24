/**
 * @file Implements DAO managing data storage of dislikes. Uses mongoose DislikeModel
 * to integrate with MongoDB
 */
import DislikeDaoI from "../interfaces/DislikeDaoI"
import DislikeModel from "../mongoose/DislikeModel";
import Dislikes from "../models/Dislikes";

/**
 * @class DislikeDao Implements Data Access Object managing data storage
 * of dislikes
 * @property {DislikeDao} dislikeDao Private single instance of DislikeDao
 */
export default class DislikeDao implements DislikeDaoI {
    private static dislikeDao: DislikeDao | null = null;
    
     /**
     * Creates singleton DAO instance
     * @returns DislikeDao
     */
    public static getInstance = (): DislikeDao => {
        if(DislikeDao.dislikeDao === null) {
            DislikeDao.dislikeDao = new DislikeDao();
        }
        return DislikeDao.dislikeDao;
    }
    private constructor() {}
    
    /**
     * Inserts dislike instance into the database
     * @param {string} uid Primary key of the user that dislikes the tuit
     * @param {string} tid Primary key of the tuit that is disliked by the user
     * @returns Promise To be notified when dislike instance is inserted into the database
     */
    userDislikesTuit = aysnc (uid: string, tid: string): Promise<any> =>
        DislikeModel.create({tuit: tid, dislikedBy: uid});

    /**
     * Uses DislikeModel to retrieve all dislike documents and eventually the tuits that are disliked by a
     * particular user from the dislikes collection
     * @param {string} uid Primary key of the user
     * @returns Promise To be notified when dislike instances are retrieved from the database
     */
    findAllTuitsDislikedByUser = aysnc (uid: string): Promise<Dislikes[]> =>
        DislikeModel
            .find({dislikedBy: uid})
            .populate({
                path: "tuit",
                populate: {
                    path: "postedBy"
                }
            })
            .exec();

    /**
     * Uses DislikeModel to retrieve all dislike documents and eventually the users that disliked a
     * particular tuit from the dislikes collection
     * @param {string} tid Primary key of the tuit
     * @returns Promise To be notified when dislike instances are retrieved from the database
     */
    findAllUsersThatDislikedTuit = async (tid: string): Promise<Dislikes[]> =>
        DislikeModel
            .find({tuit:tid})
            .populate("dislikedBy")
            .exec();
    
    /**
     * Removes a dislike instance from the database.
     * @param {string} uid Primary key of user that undislikes the tuit
     * @param {string} tid Primary key of tuit being undisliked
     * @returns Promise To be notified when the dislike instance is removed from the database
     */
    userUndislikesTuit = async (uid: string, tid: string): Promise<any> =>
        DislikeModel.deleteOne({tuit: tid, dislikedBy: uid});

    /**
     * Uses DislikeModel to retrieve a dislike instance based on the disliked tuit and
     * the user who disliked it from the dislikes collection
     * @param {string} tid Primary key of the tuit
     * @param {string} tid Primary key of the user
     * @returns Promise To be notified when dislike instance is retrieved from the database
     */
    findUserWhoDislikedTuit = aysnc (uid: string, tid: string): Promise<any> =>
        DislikeModel.findOne({tuit: tid, dislikedBy: uid});

    /**
     * Counts the number of dislike instances that contain the specified tuit
     * and returns a number. In other words, it counts the number of dislikes a tuit received
     * @param {string} tid Primary key of the tuit
     * @returns number number of dislikes on the tuit
     */
    countOfDislikedTuits = aysnc (tid: string): Promise<any> =>
        DislikeModel.count({tuit:tid});
}
