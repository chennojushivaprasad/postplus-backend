const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const app = express();
dotenv.config();


const connectDB = require('./config/mongoDBConfig');

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const whitelist = ['http://localhost:3005',process.env.BASE_URL];

const corsOptions = function (req, callback) {
    let corsOptions;
    if (whitelist.indexOf(req.headers.origin) !== -1) {
        corsOptions = { origin: true };
    } else {
        corsOptions = { origin: false };
    }

    callback(null, corsOptions);
};

app.use(cors(corsOptions));


const authRouter = require('./Routes/authRoutes');
const userRouter = require('./Routes/userRoutes');
const postRouter = require('./Routes/postRoutes');

app.use('/api/v1', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/posts', postRouter);


connectDB();

const PORT = process.env.PORT || 3004;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
