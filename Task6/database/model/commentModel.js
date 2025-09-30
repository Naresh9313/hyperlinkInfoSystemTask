import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    news: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "News",
        required: true
    },
    // user: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User",
    //     required: true
    // },
    text: {
        type: String,
        required: true,
        trim: true
    },
}, { timestamps: true });

export default mongoose.model("Comment", commentSchema);
