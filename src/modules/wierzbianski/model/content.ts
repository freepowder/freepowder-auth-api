import * as mongoose from 'mongoose';

const _video = {
    description: {
        type: String
    },
    url: {
        type: String
    },
    title: {
        type: String,
    },
}

const ContentSchema = new mongoose.Schema({
    workReel: _video,
    featured: [
        _video
    ],
    about: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    videos: [
        _video
    ],
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
export default mongoose.model( 'Content', ContentSchema, 'contents');
