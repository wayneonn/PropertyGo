const { Document } = require("../../models");

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

module.exports = {
  getDocumentsWithFolderId,
  getDocumentWithPropertyId,
  getDocuments,
};
