const express = require("express");
const multer = require("multer");
const { MongoClient, ObjectId } = require("mongodb");
const { GridFSBucket } = require("mongodb");
const { Readable } = require("stream");
const axios = require("axios");
const cors = require("cors");

const app = express();
const upload = multer(); // for multipart/form-data
const PORT = 4002;
const MONGO_URI = "mongodb://localhost:27017";
const DB_NAME = "myplagiarismapp";

// Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Connect to MongoDB
MongoClient.connect(MONGO_URI, { useUnifiedTopology: true })
  .then(client => {
    const db = client.db(DB_NAME);
    app.locals.db = db;
    console.log("✅ Connected to MongoDB");

    // Endpoint to check for duplicates
    // ... your existing imports and setup ...

// Add this route BEFORE your /upload route

app.get("/check-duplicate", async (req, res) => {
  const { teamNumber, projectTitle } = req.query;

  if (!teamNumber && !projectTitle) {
    return res.status(400).json({ error: "Provide teamNumber and/or projectTitle" });
  }

  try {
    const db = app.locals.db;
    const filesCollection = db.collection("fileupload.files");

    let teamNumberExists = false;
    let projectTitleExists = false;

    if (teamNumber) {
      const teamDup = await filesCollection.findOne({
        "metadata.teamNumber": { $regex: `^${teamNumber}$`, $options: "i" },
      });
      teamNumberExists = !!teamDup;
    }

    if (projectTitle) {
      const titleDup = await filesCollection.findOne({
        "metadata.projectTitle": { $regex: `^${projectTitle}$`, $options: "i" },
      });
      projectTitleExists = !!titleDup;
    }

    res.json({
      duplicateTeamNumber: teamNumberExists,
      duplicateProjectTitle: projectTitleExists,
    });

  } catch (error) {
    console.error("Error checking duplicates:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



    // Upload route
    app.post("/upload", upload.single("file"), async (req, res) => {
      const file = req.file;
      const { teamNumber, projectTitle } = req.body;

      if (!file) return res.status(400).send("No file uploaded");
      if (!teamNumber || !projectTitle) return res.status(400).send("Missing metadata");

      try {
        const duplicate = await db.collection("fileupload.files").findOne({
          "metadata.teamNumber": teamNumber,
          "metadata.projectTitle": projectTitle
        });

        if (duplicate) {
          return res.status(409).json({ message: "Duplicate team number and project title" });
        }

        const bucket = new GridFSBucket(db, { bucketName: "fileupload" });
        const readableStream = Readable.from(file.buffer);

        const uploadStream = bucket.openUploadStream(file.originalname, {
          contentType: file.mimetype,
          metadata: {
            originalname: file.originalname,
            teamNumber,
            projectTitle
          }
        });

        readableStream.pipe(uploadStream)
          .on("error", (err) => {
            console.error("Upload error:", err);
            res.status(500).send("Upload error");
          })
          .on("finish", async () => {
            const uploadedFileId = uploadStream.id.toString();

            try {
              const response = await axios.get(`http://localhost:5000/nlp-check/${uploadedFileId}`);
              const { plagiarised, avg_similarity_score, detailedResults, message } = response.data;

              res.status(200).json({
                message,
                fileId: uploadedFileId,
                avg_similarity_score,
                plagiarised,
                plagiarismResults: detailedResults
              });
            } catch (err) {
              console.error("Error calling NLP API:", err.message);
              res.status(500).json({ message: "Upload successful, but plagiarism check failed" });
            }
          });

      } catch (err) {
        console.error("Unexpected error during upload:", err);
        res.status(500).send("Internal Server Error");
      }
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });

  })
  .catch(error => {
    console.error("❌ Failed to connect to MongoDB:", error);
  });
