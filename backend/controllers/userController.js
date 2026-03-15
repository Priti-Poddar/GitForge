const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
var ObjectId = require("mongodb").ObjectId;

dotenv.config();
const uri = process.env.MONGODB_URI;

let client; //Will established the connection

async function connectClient() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
} 

const signup = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    await connectClient(); // connection suru korbe
    const db = client.db("GitHub");
    const userCollection = db.collection("users");

    const user = await userCollection.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "User already exists!!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

   const newUser = {
     username,
     password: hashedPassword,
     email,
     name: "", // 
     bio: "",
     location: "",
     website: "",
     avatar: "",
     repositories: [],
     followedUsers: [],
     starRepos: [],
   };

    const result = await userCollection.insertOne(newUser);

    const token = jwt.sign(
      { id: result.insertedId },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" },
    );
    res.json({ token, userId: result.insertedId });
  } catch (err) {
    console.error("Error during signup: ", err.message);
     res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    await connectClient();
    const db = client.db("GitHub");
    const userCollection = db.collection("users");

    const user = await userCollection.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials!!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!!" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    res.json({ token, userId: user._id });
  } catch (err) {
    console.error("Error during login : ", err.message);
    res.status(500).send("Server error");
  }
};

const getAllUsers = async (req, res) => {
  try {
    await connectClient();
    const db = client.db("GitHub");
    const userCollection = db.collection("users");

    const users = await userCollection.find({}).toArray();
    res.json(users);
  } catch (err) {
    console.error("Error during fetching : ", err.message);
    res.status(500).send("Server error");
  }
};

const getUserProfile = async (req, res) => {
  const currentID = req.params.id; //String
  try {
    await connectClient();
    const db = client.db("GitHub");
    const userCollection = db.collection("users");

    const user = await userCollection.findOne({ _id: new ObjectId(currentID) }); //convert currentId into objectId
    if (!user) {
      return res.status(404).json({ message: "User not found!!" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error during fetching : ", err.message);
    res.status(500).send("Server error");
  }
};

async function updateUserProfile(req, res) {
  const currentID = req.params.id;
  const { name, bio, location, website, email } = req.body;

  try {
    if (!ObjectId.isValid(currentID)) {
      return res.status(400).json({ message: "Invalid user ID!" });
    }
    await connectClient();
    const db = client.db("githubclone");
    const usersCollection = db.collection("users");

    // Only update fields that were actually sent
    const updateFields = {};
    if (name !== undefined) updateFields.name = name.trim();
    if (bio !== undefined) updateFields.bio = bio.trim();
    if (location !== undefined) updateFields.location = location.trim();
    if (website !== undefined) updateFields.website = website.trim();
    if (email !== undefined) updateFields.email = email.trim();

    // If email is changing, check it's not taken by someone else
    if (email) {
      const emailTaken = await usersCollection.findOne({
        email: email.trim(),
        _id: { $ne: new ObjectId(currentID) },
      });
      if (emailTaken) {
        return res.status(409).json({ message: "Email already in use!" });
      }
    }

    const result = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(currentID) },
      { $set: updateFields },
      { returnDocument: "after", projection: { password: 0 } }, // ✅ never return password
    );

    if (!result) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.json({ message: "Profile updated successfully!", user: result });
  } catch (err) {
    console.error("Error during updating:", err.message);
    res.status(500).json({ message: "Server error" }); // ✅ JSON not plain text
  }
}

async function deleteUserProfile(req, res) {
  const currentID = req.params.id;

  try {
    await connectClient();
    const db = client.db("githubclone");
    const usersCollection = db.collection("users");

    const result = await usersCollection.deleteOne({
      _id: new ObjectId(currentID),
    });

    if (result.deleteCount == 0) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.json({ message: "User Profile Deleted!" });
  } catch (err) {
    console.error("Error during updating : ", err.message);
    res.status(500).send("Server error!");
  }
}

module.exports = { 
  getAllUsers,
  signup,
  login,
  getUserProfile,
  updateUserProfile, 
  deleteUserProfile,
};
