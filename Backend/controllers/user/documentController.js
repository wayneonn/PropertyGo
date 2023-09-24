const fs = require("fs");
const { Document } = require("../../models");


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

    // Perform necessary operations with the uploaded files
    // For example, you can move the files to a different directory, save their metadata to a database, etc.

    // I think the Blob is being saved wrongly.
    try {
        for (const file of files) {
            const bufferData = Buffer.from(file.buffer);
            console.log([bufferData]);

            await Document.create({
                title: file.originalname,
                type: file.mimetype,
                size: file.size,
                description: description,
                document: bufferData,
                userId: userId,
                transactionId: transactionId,
                folderId: folderId,
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

exports.getDocumentsMetadata = async (req, res) => {
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
            ],
            where: { deleted: false, userId: req.params.id },
        });
        res.json(documents);
    } catch (error) {
        console.error(error);
        res.status(500).send("Document metadata collection error.");
    }
};

exports.getDocumentData = async (req, res) => {
    try {
        const documentData = await Document.findByPk(req.params.documentId);
        if (documentData) {
            res.json(documentData);
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
