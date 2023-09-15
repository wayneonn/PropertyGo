const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors");

const app = express();
app.use(cors());

// Set up multer to handle file uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

app.use(bodyParser.urlencoded({ extended: true }));

app.post("/documents/upload", upload.array("documents[]"), (req, res) => {
  // Handle the uploaded files
  const files = req.files;

  // Perform necessary operations with the uploaded files
  // For example, you can move the files to a different directory, save their metadata to a database, etc.

  // Sending a response back
  console.log(req.files);
  res.json({ message: "File upload successful" });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
