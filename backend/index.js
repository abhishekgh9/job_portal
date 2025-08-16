import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connnectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import path from "path";

dotenv.config({});
const app = express();

const __dirname = path.resolve();

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: "https://job-portal-stey.onrender.com",
  credentials: true,
}
app.use(cors(corsOptions));

const port = process.env.PORT || 3000;

//api's
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
// "http://localhost:8000/api/v1/user/register"
// "http://localhost:8000/api/v1/user/login"
// "http://localhost:8000/api/v1/user/profile/update"

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get(/.*/, (_, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});




app.listen(port, () => {
    connnectDB();
  console.log(`Server is running on http://localhost:${port}`);
});