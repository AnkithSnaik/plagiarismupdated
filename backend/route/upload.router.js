// PLAGARISM/backend/route/upload.router.js
import express from "express";
import crypto from "crypto"; // Still needed for randomBytes for filename, not hashing
import { Readable } from "stream";
import axios from "axios";
import path from "path";
// Removed: import { calculateHash } from "../utils/hash.js";

const router = express.Router();

router.post("/upload", (req, res, next) => {
  if (!req.upload) {
      console.error("Multer upload middleware not available on req.upload.");
      return res.status(500).json({ error: "Server error: File upload system not ready." });
  }
  req.upload.single("file")(req, res, (err) => {
    if (err) {
      console.error("Multer error during file upload:", err);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: 'File size too large.' });
      }
      return res.status(400).json({ error: err.message || "File upload failed." });
    }
    next();
  });
}, async (req, res) => {
  const file = req.file;
  const { teamName, teamLeader, teamEmail } = req.body; 

  if (!file || !teamName || !teamLeader || !teamEmail) {
    return res.status(400).json({ error: "Missing file or metadata (Team Name, Team Leader, or Email Address)." });
  }

  if (file.mimetype !== "application/pdf") {
    return res.status(400).json({ error: "Only PDF files are allowed." });
  }

  const bucket = req.bucket;
  if (!bucket) {
    console.error("GridFSBucket not available on req.bucket.");
    return res.status(500).json({ error: "Server error: GridFS is not ready. Please try again later." });
  }

  // Hashing logic removed here
  const filename = crypto.randomBytes(16).toString("hex") + path.extname(file.originalname);
  const readableStream = Readable.from(file.buffer);

  const uploadStream = bucket.openUploadStream(filename, {
    contentType: file.mimetype,
    metadata: {
      originalname: file.originalname,
      teamName,
      teamLeader,
      teamEmail,
      // Removed: fileHash,
    },
  });

  readableStream.pipe(uploadStream)
    .on("error", (err) => {
      console.error("GridFS upload error:", err);
      res.status(500).json({ error: "File upload to database failed." });
    })
    .on("finish", async () => {
      const uploadedFileId = uploadStream.id.toString();
      console.log("File uploaded to GridFS. ID:", uploadedFileId);

      try {
        console.log(`Calling Flask NLP service at http://localhost:5000/nlp-check/${uploadedFileId}`);
        const nlpResponse = await axios.get(`http://localhost:5000/nlp-check/${uploadedFileId}`);

        return res.status(200).json({
          message: "Upload successful and plagiarism check initiated.",
          fileId: uploadedFileId,
          plagiarismReport: nlpResponse.data,
        });
      } catch (nlpErr) {
        console.error("Error contacting Flask NLP service:", nlpErr.message);
        if (nlpErr.response) {
            console.error("NLP Service Response Data:", nlpErr.response.data);
            console.error("NLP Service Response Status:", nlpErr.response.status);
        } else if (nlpErr.request) {
            console.error("NLP Service No Response Received:", nlpErr.request);
        }

        return res.status(200).json({
          fileId: uploadedFileId,
          message: "File uploaded successfully, but plagiarism check failed.",
          plagiarismReport: { error: nlpErr.response?.data?.error || nlpErr.message || "Failed to reach NLP service." },
        });
      }
    });
});

export default router;