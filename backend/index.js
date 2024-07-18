import express from "express";
import dotenv from "dotenv";
import databaseConnection from "./utils/database.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import cors from 'cors';



dotenv.config({
    path: ".env"
   }); 

databaseConnection();

const app = express(); 

//middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
    origin : process.env.FRONTEND_URL,
    credentials:true
}
app.use(cors(corsOptions));

//api
app.use("/api/v1/user",userRoute);


app.listen(process.env.PORT, () => {
    console.log(`Server listening at port ${process.env.PORT}`);
});
