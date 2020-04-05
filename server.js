const express =require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');


require('dotenv').config();
const local_path = process.env.LOCAL_PATH;
const app = express();
const port =process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

const uri = process.env.ATLAS_YURI;
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
.catch(error => console.log(error));
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

const lectureitemsRouter = require('./routes/LectureItems');
const CodeReviewRouter = require('./routes/CodeReview');
const UserRouter = require('./routes/Users');
const EmailRouter = require('./routes/EmailSend');
const CourseRouter = require('./routes/CourseList');
const LectureRouter = require('./routes/Lectures');
const AdminRouter = require('./routes/admin');
const EventRouter = require('./routes/Events');
const PaymentRouter = require('./routes/Payment');
const DoubtChatRouter = require('./routes/DoubtChatting');
const CommentRouter = require('./routes/CourseComment');
const FeedBackRouter = require('./routes/Feedback');
const SupportChat = require('./routes/SupportChat.js');
const PaymentListRouter = require('./routes/PaymentList.js');
const Invoice = require('./routes/Html_PDF.js');
const Blog = require('./routes/Blog.js');
const PushNotiRouter = require('./routes/PushNotification.js');
const test = require('./routes/test');

app.use('/admin', AdminRouter);
app.use('/lectureitem', lectureitemsRouter);
app.use('/codereview', CodeReviewRouter);
app.use('/user', UserRouter);
app.use('/emailsend', EmailRouter);
app.use('/course', CourseRouter);
app.use('/lecture', LectureRouter);
app.use('/event', EventRouter);
app.use('/payment', PaymentRouter);
app.use('/doubtchat', DoubtChatRouter);
app.use('/supportchat', SupportChat);
app.use('/comment', CommentRouter);
app.use('/feedback', FeedBackRouter);
app.use('/paymentlist', PaymentListRouter);
app.use('/invoice', Invoice);
app.use('/blog', Blog);
app.use('/pushnoti', PushNotiRouter);
app.use('/test', test);
app.get('/now_time_get', function(req, res){
    var data = new Date();
    res.send(data);
});
app.get('/audio_file_get/:filename', function(req, res){
    res.sendFile(local_path+'audio/'+req.params.filename);
});
app.get('/logo_image', function(req, res){
    res.sendFile(local_path+'logo.png');
})

app.listen(port, () => {
    console.log('Server is running on port: '+port)
})