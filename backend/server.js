import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import addMomentRoutes from './routes/addMomentRoutes.js'; // Import event routes
import { CronJob } from 'cron';
import User from './models/userModel.js';
import Event from './models/eventModel.js';
import {Expo} from "expo-server-sdk";
import e from 'express';


const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use("/api/events", addMomentRoutes); // Use event routes

new CronJob('0 8 * * *', async function() {
//new CronJob('* * * * *', async function() {
  // send notification for tomorrow's events to all going users with event name and time
  console.log('You will see this message every minute');
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  const tomorrow = new Date(new Date().setDate(new Date().getDate() + 2));
  const formattedDate = formatDate(tomorrow);
  
  console.log(formattedDate);
  
  const events = await Event.find({date: formattedDate});
  events.forEach(async (event) => {
    event.going.forEach(async (user) => {
      //get user notification token of each user
      const userNotificationToken = await User.findById(user).select('notificationtoken');
      console.log(userNotificationToken.notificationtoken);
      //send notification to each user
      let messages = [];
      let expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });
      messages.push({
        to: userNotificationToken.notificationtoken,
        sound: 'default',
        body: `You have an event tomorrow! ${event.eventname} at ${event.time}`,
        data: { withSome: 'data' },
      });
      let chunks = expo.chunkPushNotifications(messages);
      let tickets = [];
      (async () => {
        for (let chunk of chunks) {
          try {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            console.log(ticketChunk);
            tickets.push(...ticketChunk);
          } catch (error) {
            console.error(error);
          }
        }
      })();
    });
    event.interested.forEach(async (user) => {
      //get user notification token of each user
      const userNotificationToken = await User.findById(user).select('notificationtoken');
      console.log(userNotificationToken.notificationtoken);
      //send notification to each user
      let messages = [];
      let expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });
      messages.push({
        to: userNotificationToken.notificationtoken,
        sound: 'default',
        body: `You have an interested event tomorrow! ${event.eventname} at ${event.time}`,
        data: { withSome: 'data' },
      });
      let chunks = expo.chunkPushNotifications(messages);
      let tickets = [];
      (async () => {
        for (let chunk of chunks) {
          try {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            console.log(ticketChunk);
            tickets.push(...ticketChunk);
          } catch (error) {
            console.error(error);
          }
        }
      })();
    });
  });

}, null, true, 'America/Los_Angeles');


if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, '/frontend/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
