import * as mongoose from 'mongoose';

const VideoSchema = new mongoose.Schema({
    description: {
        type: String
    },
    url: {
        type: String
    },
    title: {
        type: String,
    },
    isActive: {
        type: Boolean,
    },
    updated: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    }
});
export default mongoose.model( 'Video', VideoSchema, 'videos');
