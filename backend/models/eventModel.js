import mongoose from 'mongoose';

const eventSchema = mongoose.Schema(
    {
        publisherId: {
            type: String,
            required: true,
        },
        privacy:{
            type: Boolean,
            required: true,
        },
        eventname: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        time: {
            type: String,
            required: true,
        },
        locationText:{
            type: String,
           // required: true,
        },
        location: {
            type: String,
            required: true,
        },
        latitude: {
            type: Number,
            default: 0,
            // required: true,
        },
        longitude: {
            type: Number,
            default: 0,
           // required: true,
        },
        hostid: {
            type: String,
            required: true,
        },
        features: {
            type: [String],
            default: [],
        },
        description: {
            type: String,
            required: true,
        },
        like: {
            type: Number,
            default: 0,
        },
        dislike: {
            type: Number,
            default: 0,
        },

        entrancefee: {
            type: Boolean,
            required: true,
        },
        ticketprice: {
            type: [Number],
            default: [],
        },
        gallery: {
            type: [String],
            default: [],
        },
        goingCount: {
            type: Number,
            default: 0,
        },
        interestedCount: {
            type: Number,
            default: 0,
        },
        post:{
            type: [String],
            default: []
        },
        interestedUsers:{
            type: [String],
            default: []
        },


    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields
    }
);

const Event = mongoose.model('Event', eventSchema);
export default Event;
