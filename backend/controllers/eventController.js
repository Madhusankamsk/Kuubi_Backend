import asyncHandler from "express-async-handler";
import Event from "../models/eventModel.js";
import User from "../models/userModel.js";
import jwt from 'jsonwebtoken';

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

    const token = req.header('Authorization').replace('Bearer ', '');
    //console.log(token);
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
       // console.log(decoded);
       // console.log(decoded.userId);
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


const getMoments = asyncHandler(async (req, res) => {
    //const { id } = req.params;
    try {
        //whole events list fetch
        const events = await Event.find({})
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
})

const getEachMoment = asyncHandler(async (req, res) => {
    const {id} = req.body;
    try {
        //whole events list fetch
        const event = await Event.findById(id)
        res.status(200).json({
            success: true,
            message: "Event fetched successfully",
            data: event
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: "Event fetching failed",
            error: error.message
        });
    }
});


export {addMoment,getMoments,getEachMoment};