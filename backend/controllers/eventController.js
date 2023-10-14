import asyncHandler from "express-async-handler";
import Event from "../models/eventModel.js";
import User from "../models/userModel.js";
import jwt from 'jsonwebtoken';
import Post from "../models/postFeedModel.js";

const addMoment = asyncHandler(async (req, res) => {

    const {
        privacy,
        eventname,
        category,
        date,
        time,
        locationText,
        location,
        latitude,
        longitude,
        hostid,
        description,
        entrancefee,
        features,
        ticketprice,
        gallery
    } = req.body;

    // console.log(req.body);

    const token = req.header('Authorization').replace('Bearer ', '');
    // console.log(token);
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decoded);
        console.log(decoded.userId);
        // Create a new event using the Event model
        const newEvent = await Event.create({
            privacy,
            publisherId: decoded.userId,
            eventname,
            category,
            date,
            time,
            locationText,
            location,
            latitude,
            longitude,
            hostid,
            description,
            entrancefee,
            features,
            ticketprice,
            gallery
        });

        console.log(newEvent);

        // Update the user's addedMoments array
        const user = await User.findById(decoded.userId);
        if (user) {
            user.addedMoments.push(newEvent._id); // Assuming newEvent._id is the ObjectId of the newly created event
            await user.save();
        } else {
            console.log("User not found");
        }

        res.status(201).json({
            success: true,
            message: "Event added successfully",
            data: newEvent
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Event creation failed",
            error: error.message
        });
    }
});
// const getMoments = asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     const { latitude,longitude,longitudeDelta,latitudeDelta } = req.body;
//     console.log(latitude,longitude,longitudeDelta,latitudeDelta);

//     try {
//         let events;

//         if (id) {
//             if (id == 0) {
//                 events = await Event.find({});
//             } else {
//                 events = await Event.find({ category: id });
//             }
//         } else {
//             events = await Event.find({});
//         }

//         res.status(200).json({
//             success: true,
//             message: "Events fetched successfully",
//             data: events
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Events fetching failed",
//             error: error.message
//         });
//     }
// });

const getMoments = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { latitude, longitude, longitudeDelta, latitudeDelta } = req.body;

    try {
        let events;

        const minLatitude = latitude - latitudeDelta;
        const maxLatitude = latitude + latitudeDelta;
        const minLongitude = longitude - longitudeDelta;
        const maxLongitude = longitude + longitudeDelta;

        if (id) {
            if (id === '0') {
                events = await Event.find({
                    latitude: { $gte: minLatitude, $lte: maxLatitude },
                    longitude: { $gte: minLongitude, $lte: maxLongitude },
                });
                console.log(events);
            } else {
                events = await Event.find({
                    category: id,
                    latitude: { $gte: minLatitude, $lte: maxLatitude },
                    longitude: { $gte: minLongitude, $lte: maxLongitude },
                });
            }
        } else {
            events = await Event.find({
                latitude: { $gte: minLatitude, $lte: maxLatitude },
                longitude: { $gte: minLongitude, $lte: maxLongitude },
            });
            console.log(events);
        }

        res.status(200).json({
            success: true,
            message: 'Events fetched successfully',
            data: events,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Events fetching failed',
            error: error.message,
        });
    }
});

const getEachMoment = asyncHandler(async (req, res) => {
    // console.log("cgsffgffgf")
    const { id,userId } = req.body;
    try {
        //whole events list fetch
        const event = await Event.findById(id)
        const user = await User.findById(userId);
        res.status(200).json({
            success: true,
            message: "Event fetched successfully",
            data: { event, like: event.like.includes(userId), dislike: event.dislike.includes(userId),user:user}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Event fetching failed",
            error: error.message
        });
    }
});
const getPost = asyncHandler(async (req, res) => {
    try {
        //whole events list fetch
        const event = await Event.find({}).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: "Event fetched successfully",
            data: event
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Event fetching failed",
            error: error.message
        });
    }
})
const likeUpdate = asyncHandler(async (req, res) => {
    const { id, userId } = req.body;
    try {
        const event = await Event.findById(id);
        if (event) {
            if (event.like.includes(userId)) {
                // User already liked the event, so remove the like
                event.like.pull(userId);
            } else {
                // User is liking the event
                event.like.push(userId);
            }

            // Save the updated event
            await event.save();

            res.status(200).json({
                success: true,
                message: "Event like updated successfully",
                data: { event, like: event.like.includes(userId) }
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Event not found",
                error: "Event not found with the provided ID"
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Event like update failed",
            error: error.message
        });
    }
});

const disLikeUpdate = asyncHandler(async (req, res) => {
    const { id, userId } = req.body;
    try {
        const event = await Event.findById(id);
        if (event) {
            if (event.dislike.includes(userId)) {
                // User already disliked the event, so remove the dislike
                event.dislike.pull(userId);
            } else {
                // User is disliking the event
                event.dislike.push(userId);
            }

            // Save the updated event
            await event.save();

            res.status(200).json({
                success: true,
                message: "Event dislike updated successfully",
                data: { event, dislike: event.dislike.includes(userId) }
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Event not found",
                error: "Event not found with the provided ID"
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Event dislike update failed",
            error: error.message
        });
    }
})

const getMyMoments = asyncHandler(async (req, res) => {
    const { id } = req.body;
    try {
        //whole events list fetch
        const events = await Event.find({ publisherId: id })
        res.status(200).json({
            success: true,
            message: "Events fetched successfully",
            data: events
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Events fetching failed",
            error: error.message
        });
    }
});


const deleteEvent = asyncHandler(async (req, res) => {
    const { id } = req.params;  // Assuming the event ID is in the URL parameters
    console.log(id);
    try {
        // Find the event by ID and delete it
        await Event.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Event deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Event deletion failed",
            error: error.message
        });
    }
});

const createPost = asyncHandler(async (req, res) => {
    const { eventId, postText, postImages, userId } = req.body;
    try {
        // Create a new post
        const newPost = await Post.create({
            publisherId: userId,
            postText: postText,
            postMedia: postImages,
        });

        // Update the event's post array with the new post id
        await Event.findByIdAndUpdate(eventId, {
            $push: { post: newPost._id }, // Corrected 'posts' to 'post'
        });

        res.status(201).json({
            success: true,
            message: "Post added successfully",
            data: newPost
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Post creation failed",
            error: error.message
        });
    }
});

const getPostFeed = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const event = await Event.findById(id).populate('post');
        console.log(event.post);
        res.status(200).json({
            success: true,
            message: "Event fetched successfully",
            data: event.post
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Event fetching failed",
            error: error.message
        });
    } 
});


export { addMoment, getMoments, getEachMoment, getPost, likeUpdate, disLikeUpdate, getMyMoments, deleteEvent, createPost, getPostFeed};
