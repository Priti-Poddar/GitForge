
async function followUser(req, res) {
  const { id } = req.params; // user being followed
  const { followerId } = req.body; // user doing the following

  try {
    if (!ObjectId.isValid(id) || !ObjectId.isValid(followerId)) {
      return res.status(400).json({ message: "Invalid user ID!" });
    }

    if (id === followerId) {
      return res.status(400).json({ message: "You cannot follow yourself!" });
    }

    const userCollection = await getUsersCollection();

    // Add followerId to the target user's followers array (no duplicates)
    await userCollection.updateOne(
      { _id: new ObjectId(id) },
      { $addToSet: { followers: new ObjectId(followerId) } },
    );

    // Add target user's id to the follower's followedUsers array
    await userCollection.updateOne(
      { _id: new ObjectId(followerId) },
      { $addToSet: { followedUsers: new ObjectId(id) } },
    );

    // Return updated follower count
    const updated = await userCollection.findOne(
      { _id: new ObjectId(id) },
      { projection: { followers: 1 } },
    );

    res.json({
      message: "Followed successfully!",
      followerCount: updated.followers?.length ?? 0,
    });
  } catch (err) {
    console.error("Error following user:", err.message);
    res.status(500).send("Server error");
  }
}

async function unfollowUser(req, res) {
  const { id } = req.params;
  const { followerId } = req.body;

  try {
    if (!ObjectId.isValid(id) || !ObjectId.isValid(followerId)) {
      return res.status(400).json({ message: "Invalid user ID!" });
    }

    const userCollection = await getUsersCollection();

    // Remove followerId from target user's followers
    await userCollection.updateOne(
      { _id: new ObjectId(id) },
      { $pull: { followers: new ObjectId(followerId) } },
    );

    // Remove target user's id from follower's followedUsers
    await userCollection.updateOne(
      { _id: new ObjectId(followerId) },
      { $pull: { followedUsers: new ObjectId(id) } },
    );

    const updated = await userCollection.findOne(
      { _id: new ObjectId(id) },
      { projection: { followers: 1 } },
    );

    res.json({
      message: "Unfollowed successfully!",
      followerCount: updated.followers?.length ?? 0,
    });
  } catch (err) {
    console.error("Error unfollowing user:", err.message);
    res.status(500).send("Server error");
  }
}

module.exports = {
  followUser,
  unfollowUser,
};
