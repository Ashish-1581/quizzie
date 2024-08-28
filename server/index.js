const express=require('express');
const env=require('dotenv');
const mongoose=require('mongoose');
const pollRoute = require('./routes/pollRoute');
const cors=require('cors');
const qnaRoute=require('./routes/qnaRoute');
const quizRoute=require('./routes/quizRoute');
const responseRoute=require('./routes/responseRoute');

const userRoute=require('./routes/userRoute');

const app=express();

env.config();

app.get('/',(req,res)=>{
    res.send('Hello World');
}
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/poll',pollRoute);
app.use('/qna',qnaRoute);
app.use('/quiz',quizRoute);
app.use('/response',responseRoute);

app.use('/auth',userRoute);

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})

mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log('Database connected');
}
).catch((err)=>{
    console.log(err);
}
);



