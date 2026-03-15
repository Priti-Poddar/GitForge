const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");

async function createIssue(req, res) {
  const { title, description } = req.body;
  const { id } = req.params; // repoId from /issue/create/:id

  try {
    if (!title) {
      return res.status(400).json({ error: "Title is required!" });
    }
    if (!description) {
      return res.status(400).json({ error: "Description is required!" });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid repository ID!" });
    }

    // Check repo exists
    const repo = await Repository.findById(id);
    if (!repo) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    // Create the issue
    const issue = new Issue({
      title,
      description,
      repository: id,
    });

    await issue.save();

    //  Push issue into the repo's issues array
    repo.issues.push(issue._id);
    await repo.save();
    await Repository.findByIdAndUpdate(id, { $push: { issues: issue._id } });

    res.status(201).json(issue);
  } catch (err) {
    console.error("Error during issue creation:", err.message);
    res.status(500).send("Server error");
  }
}

async function updateIssueById(req, res) {
  const { id } = req.params;
  const { title, description, status } = req.body;
  try {
    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({ error: "Issue not found!" });
    }

    // Only update fields that were actually sent
    if (title !== undefined) issue.title = title;
    if (description !== undefined) issue.description = description;
    if (status !== undefined) issue.status = status;

    await issue.save();

    res.status(200).json({ message: "Issue updated", issue });
  } catch (err) {
    console.error("Error during issue updation : ", err.message);
    res.status(500).send("Server error");
  }
}

async function deleteIssueById(req, res) {
  const { id } = req.params;

  try {
    const issue = await Issue.findByIdAndDelete(id);

    if (!issue) {
      return res.status(404).json({ error: "Issue not found!" });
    }
    res.json({ message: "Issue deleted" });
  } catch (err) {
    console.error("Error during issue deletion : ", err.message);
    res.status(500).send("Server error");
  }
}

async function getAllIssues(req, res) {
  const { id } = req.params;

  try {
    const issues = await Issue.find({ repository: id });

    if (!issues) {
      return res.status(404).json({ error: "Issues not found!" });
    }
    res.status(200).json(issues??[]);
  } catch (err) {
    console.error("Error during issue fetching : ", err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function getIssueById(req, res) {
  const { id } = req.params;
  try {
    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({ error: "Issue not found!" });
    }

    res.json(issue);
  } catch (err) {
    console.error("Error during issue updation : ", err.message);
    res.status(500).send("Server error");
  }
}

module.exports = {
  createIssue, 
  updateIssueById,
  deleteIssueById,
  getAllIssues,
  getIssueById,
};
