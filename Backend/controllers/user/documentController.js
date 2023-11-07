const fs = require("fs");
const { Document, User, Notification } = require("../../models");

exports.uploadDocuments = async (req, res) => {
  // Handle the uploaded files
  const files = req.files["documents"];
  let description = req.body.description;
  console.log(req.body);
  // If description is an array, pick first element
  if (Array.isArray(description)) {
    description = description[0];
  }
  // All the ID to input into the document.
  let userId = req.body.userId;
  let transactionId = req.body.transactionId;
  let folderId = req.body.folderId;
  let partnerApplicationId = req.body.partnerApplicationId;
  let propertyId = req.body.propertyId;
  // If userId is an array, pick first element
  if (Array.isArray(userId)) {
    userId = userId[0];
  }
  // If transactionId is an array, pick first element
  if (Array.isArray(transactionId)) {
    transactionId = transactionId[0];
  }
  // If folderId is an array, pick first element
  if (Array.isArray(folderId)) {
    folderId = folderId[0];
  }

  // If partnerApplicationId is an array, pick first element
  if (Array.isArray(partnerApplicationId)) {
    partnerApplicationId = partnerApplicationId[0];
  }

  if (Array.isArray(propertyId)) {
    propertyId = propertyId[0];
  }

  // Perform necessary operations with the uploaded files
  // For example, you can move the files to a different directory, save their metadata to a database, etc.

  // I think the Blob is being saved wrongly.
  try {
    const documentIds = []; // Array to store the created document IDs

    for (const file of files) {
      const bufferData = Buffer.from(file.buffer);

      const createdDocument = await Document.create({
        title: file.originalname,
        type: file.mimetype,
        size: file.size,
        description: description,
        document: bufferData,
        userId: userId,
        transactionId: transactionId,
        folderId: folderId,
        partnerApplicationId: partnerApplicationId,
        propertyId: propertyId,
      });

      documentIds.push(createdDocument.documentId); // Store the created document's ID
    }

    // Check if there are any partner application notifications to create
    if (partnerApplicationId != null) {
      const user = await User.findByPk(userId);

      req.body = {
        content: `A new Partner Application has been created by ${user.userName.charAt(0).toUpperCase() + user.userName.slice(1)
          }`,
        isRecent: false,
        isPending: true,
        isCompleted: false,
        hasRead: false,
        userId: userId,
      };

      await Notification.create(req.body);

      req.io.emit("newPartnerApplicationNotification", req.body.content);
    }

    // Return the document IDs along with the success message as JSON
    console.log("documentIds: ", documentIds);
    res.json({ message: "File upload successful", documentIds });
  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).json({ message: "File upload to Firebase failed" });
  }
};

exports.updateDocument = async (req, res) => {
  // Handle the uploaded files
  const files = req.files["documents"];
  const { documentId } = req.params;
  let description = req.body.description;
  console.log(req.body);
  // If description is an array, pick first element
  if (Array.isArray(description)) {
    description = description[0];
  }
  // All the ID to input into the document.
  let userId = req.body.userId;
  let transactionId = req.body.transactionId;
  let folderId = req.body.folderId;
  let partnerApplicationId = req.body.partnerApplicationId;
  let propertyId = req.body.propertyId;
  // If userId is an array, pick first element
  if (Array.isArray(userId)) {
    userId = userId[0];
  }
  // If transactionId is an array, pick first element
  if (Array.isArray(transactionId)) {
    transactionId = transactionId[0];
  }
  // If folderId is an array, pick first element
  if (Array.isArray(folderId)) {
    folderId = folderId[0];
  }

  // If partnerApplicationId is an array, pick first element
  if (Array.isArray(partnerApplicationId)) {
    partnerApplicationId = partnerApplicationId[0];
  }

  if (Array.isArray(propertyId)) {
    propertyId = propertyId[0];
  }

  try {
    // Find the document by its documentId
    const documentToUpdate = await Document.findByPk(documentId);

    if (!documentToUpdate) {
      return res.status(404).json({ message: "Document not found" });
    }
    console.log("documentToUpdate:", documentToUpdate);

    const documentIds = []; // Array to store the created document IDs

    for (const file of files) {
      const bufferData = Buffer.from(file.buffer);

      documentToUpdate.title = file.originalname;
      documentToUpdate.type = file.mimetype;
      documentToUpdate.size = file.size;
      documentToUpdate.description = description;
      documentToUpdate.document = bufferData;
      documentToUpdate.userId = userId;
      documentToUpdate.transactionId = transactionId;
      documentToUpdate.folderId = folderId;
      documentToUpdate.partnerApplicationId = partnerApplicationId;
      documentToUpdate.propertyId = propertyId;

      documentIds.push(documentToUpdate.documentId); // Store the created document's ID
    }

    // Save the updated document
    await documentToUpdate.save();

    res.json({ message: "Document updated successfully", documentId: documentToUpdate.documentId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update document" });
  }
};

exports.getDocumentsMetadata = async (req, res) => {
  try {
    const documents = await Document.findAll({
      attributes: [
        "documentId",
        "folderId",
        "userId",
        "transactionId",
        "partnerApplicationId",
        "title",
        "createdAt",
        "updatedAt",
        "description",
      ],
      where: { deleted: false, userId: req.params.id },
    });
    res.json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).send("Document metadata collection error.");
  }
};

exports.getDocumentMetadataByAppId = async (req, res) => {
  try {
    const documents = await Document.findAll({
      attributes: [
        "documentId",
        "folderId",
        "userId",
        "transactionId",
        "title",
        "createdAt",
        "updatedAt",
        "description",
      ],
      where: { deleted: false, partnerApplicationId: req.params.id },
    });
    res.json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).send("Document metadata by partner application error.");
  }
};

exports.getDocumentData = async (req, res) => {
  try {
    const documentData = await Document.findByPk(req.params.documentId);
    if (documentData) {
      const base64Data = documentData.document.toString("base64");
      res.json({
        documentId: documentData.documentId,
        title: documentData.title,
        timestamp: documentData.timestamp,
        deleted: documentData.deleted,
        description: documentData.description,
        type: documentData.type,
        size: documentData.size,
        document: base64Data,
      });
    } else {
      res.status(404).send("Document not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findByPk(req.params.id);
    if (!document) {
      return res.status(404).send("Document not found");
    }
    await document.update({ deleted: true });
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};
