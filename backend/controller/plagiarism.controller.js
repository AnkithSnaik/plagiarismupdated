const PlagiarismResult = require('../model/plagiarismResult.model');

const savePlagiarismResult = async (req, res) => {
  try {
    const {
      originalTeamName,
      originalTeamLeader,
      originalTeamEmail,
      message,
      plagiarised,
      avg_similarity_score,
      detailedResults,
    } = req.body;

    const newResult = new PlagiarismResult({
      originalTeamName,
      originalTeamLeader,
      originalTeamEmail,
      message,
      plagiarised,
      avg_similarity_score,
      detailedResults,
    });

    await newResult.save();
    res.status(201).json({ message: 'Plagiarism result saved successfully.' });
  } catch (error) {
    console.error('Error saving plagiarism result:', error);
    res.status(500).json({ message: 'Failed to save result.' });
  }
};

module.exports = {
  savePlagiarismResult,
};
