const express = require("express");
const app = express();
const config = require("config");
const client = require("./db");

const PORT = config.get("PORT") || 8080;

//middleware
app.use(express.json({ extended: true }));

//routes
app.use("/api/comment", require("./routes/comments.routes"));

const start = async () => {
  try {
    await client.connect();
    app.listen(PORT, () => {
      console.log(`Server has been started on ${PORT} port...`);
    });
  } catch (err) {
    console.log("Server error: ", err);
    process.exit(1);
  }
};

start()