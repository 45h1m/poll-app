const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 80;
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const PollRoutes = require("./routes/PollRoutes");
const UserRoutes = require("./routes/UserRoutes");
const path = require("path");
app.use(express.static(path.join(__dirname, "../../client/dist")));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(morgan("tiny"));

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, "../../client/dist/index.html"));
  });

app.use("/api", UserRoutes);
app.use("/api", PollRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
