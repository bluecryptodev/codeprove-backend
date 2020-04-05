const express =require('express');

const app = express();

const UsersRouter = require('./AdminUsers.js');
const CourseRouter = require('./Courses.js');
const LectureRouter = require('./Lectures.js');
const LectureItemRouter =  require('./LectureItems.js');
const EventRouter = require('./Events.js');
const Blog = require('./Blog.js');

app.use("/user", UsersRouter);
app.use('/course', CourseRouter);
app.use('/lecture', LectureRouter);
app.use('/lectureitem', LectureItemRouter);
app.use('/event', EventRouter);
app.use('/blog', Blog);

module.exports = app;