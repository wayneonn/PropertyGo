// This is the route for the documents.
// Using multer to handle filedata -> may switch to using body-parser if this does not work well.
const express = require("express");
const multer = require("multer");

const app = express();
const upload = multer({ dest: "uploads/" });

app.post("/documents/upload", upload.array("documents"), (req, res) => {
  // Handle the uploaded files
  const files = req.files;

  // Perform necessary operations with the uploaded files
  // For example, you can move the files to a different directory, save their metadata to a database, etc.

  // Sending a response back
  res.json({ message: "File upload successful" });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
