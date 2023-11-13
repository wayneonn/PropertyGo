const { Document, Transaction } = require("../../models");

const getDocumentsWithFolderId = async (req, res) => {
  const { id: folderId } = req.params;

  try {
    const documents = await Document.findAll({
      where: {
        folderId,
      },
    });

    res.status(200).json({ documents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getDocumentWithPropertyId = async (req, res) => {
  const { propertyId, userId } = req.query;
  const formattedDocuments = [];

  try {
    const documents = await Document.findAll({
      where: {
        propertyId,
      },
    });

    documents.filter((document) => document.userId == userId);

    for (let document of documents) {
      if (document) {
        const base64Data = document.document.toString("base64");
        document.document = base64Data;
        // res.json({
        //   documentId: document.documentId,
        //   title: document.title,
        //   timestamp: document.timestamp,
        //   deleted: document.deleted,
        //   description: document.description,
        //   type: document.type,
        //   size: document.size,
        //   document: base64Data,
        // });
      }
      formattedDocuments.push(document);
    }

    res.status(200).json({ formattedDocuments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getDocuments = async (req, res) => {
  const formattedDocuments = [];

  try {
    const documents = await Document.findAll({});

    for (let document of documents) {
      if (document) {
        const base64Data = document.document.toString("base64");
        document.document = base64Data;
        // res.json({
        //   documentId: document.documentId,
        //   title: document.title,
        //   timestamp: document.timestamp,
        //   deleted: document.deleted,
        //   description: document.description,
        //   type: document.type,
        //   size: document.size,
        //   document: base64Data,
        // });
      }
      formattedDocuments.push(document);
    }

    res.status(200).json({ data: formattedDocuments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateDocument = async (req, res) => {
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

    const transaction = await Transaction.findByPk(transactionId);
    transaction.reimbursed = 1;
    transaction.optionFeeStatusEnum = "ADMIN_SIGNED";

    await transaction.save();

    res.json({
      message: "Document updated successfully",
      documentId: documentToUpdate.documentId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update document" });
  }
};

module.exports = {
  getDocumentsWithFolderId,
  getDocumentWithPropertyId,
  getDocuments,
  updateDocument,
};
