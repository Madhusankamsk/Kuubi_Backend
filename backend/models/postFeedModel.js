import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    publisherId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    privacy: {
        type: Boolean,
        //required: true,
    },
    postText: {
        type: String,
        required: true,
    },
    postMedia: {
        type: [String],
        default: [],
    },
    },
    {
        timestamps: true,
    }
)

const Post = mongoose.model('Post', postSchema);
export default Post;