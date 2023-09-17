const express = require("express");
const multer = require("multer");
const cors = require("cors");
const admin = require("firebase-admin");
const { Sequelize, DataTypes } = require("sequelize");

// Setting up a MySQL connection since we are using MySQL.

//Setup for the server + Firebase connection.
var serviceAccount = require("../config/service-account.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://propertygo-b6e58.appspot.com",
});
const app = express();
app.use(cors());

// Temporary Disk Storage for Testing.
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// Imma define a testing sequelize model and a testing mySQL table connection.
// Will intergrate it later.
// Create connection
const sequelize = new Sequelize("database_testing", "root", "3times5=15", {
  host: "localhost",
  dialect: "mysql",
});
// Define File model
const File = sequelize.define("File", {
  name: {
    type: DataTypes.STRING,
  },
  type: {
    type: DataTypes.STRING,
  },
  data: {
    type: DataTypes.BLOB, // binary data
  },
  size: {
    type: DataTypes.INTEGER,
  },
  description: {
    type: DataTypes.TEXT,
  },
  uploadedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Sync all models to the database
sequelize
  .sync()
  .then(() => {
    console.log("Database synced");
  })
  .catch((err) => {
    console.error("Error syncing database: ", err);
  });

// Functions needed

const upload = multer({ storage, limits: { fieldSize: 25 * 1024 * 1024 } });
// API works when tested with Insomnia.
// Works with one more more then one.
// TODO: Append UserID to the file so we can grab it by UserID in the giant bucket.
// TODO: Or add more folders to it so each user gets a unique folder.
app.post(
  "/documents/upload",
  upload.fields([
    {
      name: "documents",
    },
    {
      name: "description",
      maxCount: 1,
    },
  ]),
  async (req, res) => {
    // Handle the uploaded files
    const files = req.files["documents"];
    const description = req.body["description"];

    // Perform necessary operations with the uploaded files
    // For example, you can move the files to a different directory, save their metadata to a database, etc.

    try {
      // Upload each file to Firebase Storage
      // This works now, nowwe just need to get the pull function down.
      for (const file of files) {
        // const defaultBucket = admin.storage().bucket(); // Get the default Firebase Storage bucket
        // const fileUpload = defaultBucket.file(file.originalname);
        // await fileUpload.save(file.buffer, {
        //   metadata: {
        //     contentType: file.mimetype,
        //     metadata: {
        //       customMetadata: {
        //         originalname: file.originalname,
        //         // Add more custom metadata if needed
        //       },
        //     },
        //   },
        // });

        // Convert Blob to Buffer
        const buffer = file.buffer;

        await File.create({
          name: file.originalname,
          type: file.mimetype,
          size: file.size,
          description: description,
          data: buffer,
        });
      }

      res.json({ message: "File upload successful" });
    } catch (error) {
      // Handle any errors
      console.error(error);
      res.status(500).json({ message: "File upload to Firebase failed" });
    }

    // Check the data received.
    // Generally the data is sent over the right way.
    console.log(files);
    console.log(description);
  }
);

// Give us the whole list of the documents.
app.get("/documents/list", async (req, res) => {
  try {
    const bucket = admin.storage().bucket(); // Get the default Firebase Storage bucket
    const [files] = await bucket.getFiles();
    const documentList = files.map((file) => file.name);
    res.json(documentList);
  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve the document list" });
  }
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
