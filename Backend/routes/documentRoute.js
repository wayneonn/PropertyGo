const express = require("express");
const multer = require("multer");
const cors = require("cors");
const admin = require("firebase-admin");
const { Sequelize, DataTypes } = require("sequelize");
const fs = require("fs");

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

// const storage = multer.diskStorage({
//   destination: "uploads/",
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

// Memory Storage for reading buffer.
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fieldSize: 25 * 1024 * 1024 },
});

// Imma define a testing sequelize model and a testing mySQL table connection.
// Will intergrate it later.
// Create connection
const PASSWORD = "3times5=15";
const sequelize = new Sequelize("database_testing", "root", PASSWORD, {
  host: "127.0.0.1",
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
    type: DataTypes.BLOB("medium"), // binary data
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
  deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
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

// Functions needed or not needed.
const uploadFirebase = async () => {
  const defaultBucket = admin.storage().bucket(); // Get the default Firebase Storage bucket
  const fileUpload = defaultBucket.file(file.originalname);
  await fileUpload.save(file.buffer, {
    metadata: {
      contentType: file.mimetype,
      metadata: {
        customMetadata: {
          originalname: file.originalname,
          // Add more custom metadata if needed
        },
      },
    },
  });
};

const downloadListFirebase = async () => {
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
};

const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const buffer = Buffer.from(blob);
    fs.readFile(buffer, (err, data) => {
      if (err) reject(err);
      else resolve(data.toString("base64"));
    });
  });
};

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
    let description = req.body.description;
    // If description is an array, pick first element
    if (Array.isArray(description)) {
      description = description[0];
    }

    // Perform necessary operations with the uploaded files
    // For example, you can move the files to a different directory, save their metadata to a database, etc.

    // I think the Blob is being saved wrongly.
    // It is not writing the full buffer jajajaajaja. Not suited in a NodeJS backend?
    try {
      for (const file of files) {
        const bufferData = Buffer.from(file.buffer);
        console.log([bufferData]);

        await File.create({
          name: file.originalname,
          type: file.mimetype,
          size: file.size,
          description: description,
          data: bufferData,
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
    const files = await File.findAll({
      where: { deleted: false },
    });
    // This is insanity since we are literally sending all the data over.
    res.json(files);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve document list" });
  }
});

// Delete route
app.delete("/documents/:id", async (req, res) => {
  console.log("Delete API called.");
  const document = await File.findByPk(req.params.id);
  // Soft delete
  await document.update({ deleted: true });
  res.sendStatus(204);
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
