const { default: mongoose } = require("mongoose");
const UserModel = require("../models/user");
const WebsiteModel = require("../models/website");
const InformationModel = require("../models/information");


// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({ role: 'user' }); // Fetch all users
    if (users.length === 0) {
      // If no users are found, send a 404 response with a custom message
      return res.status(200).json({
        success: false,
        message: "No user found!",
        data: []

      });
    }

    // Send the list of users if found
    // res.status(200).json(users);
    return res.status(200).json({
      success: true,
      message: "Users fetched successful!",
      data: users

    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};
const deleteUser = async (req, res) => {
  const { id } = req.params; // Extract the object ID from params
  try {
    // Start a transaction to ensure both delete operations are atomic
    const session = await mongoose.startSession();
    session.startTransaction();

    // Find and delete the user by objectId
    const result = await UserModel.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) }).session(session);

    // If no user is found, return a 404 response
    if (!result) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    // Delete websites related to the user from the websiteCollection
    const deletedWebsites = await WebsiteModel.deleteMany({ userId: new mongoose.Types.ObjectId(id) }).session(session);

    // If no websites are deleted, handle it
    if (deletedWebsites.deletedCount === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "No websites found for this user!",
      });
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Send success response
    return res.status(200).json({
      success: true,
      message: "User and related websites deleted successfully!",
      data: result,
    });
  } catch (error) {
    console.error('Error deleting User and related websites:', error);

    // Handle server errors
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};
const getAllStatistics = async (req, res) => {
  try {
    const { id, role } = req.query;

    let informations;
    let totalInformations;
    let websites;
    let totalWebsites;
    let totalMobileClicks = 0;
    let totalDesktopClicks = 0;

    // Handle InformationModel
    if (role === "admin") {
      // For admin, get all information
      informations = await InformationModel.find().populate('userId').sort({ createdAt: -1 });
      // Count total number of documents for admin
      totalInformations = await InformationModel.countDocuments();
    } else {
      // For user, get information specific to the user
      informations = await InformationModel.find({ userId: id }).populate('userId').sort({ createdAt: -1 });
      // Count total number of documents for user
      totalInformations = await InformationModel.countDocuments({ userId: id });
    }

    // Handle WebsiteModel
    if (role === "admin") {
      // For admin, get all websites
      websites = await WebsiteModel.find().populate('userId').sort({ createdAt: -1 });
      // Count total number of websites for admin
      totalWebsites = await WebsiteModel.countDocuments();
    } else {
      // For user, get websites specific to the user
      websites = await WebsiteModel.find({ userId: id }).populate('userId').sort({ createdAt: -1 });
      // Count total number of websites for user
      totalWebsites = await WebsiteModel.countDocuments({ userId: id });
    }

    // Sum up mobileClick and desktopClick across all websites
    if (websites.length > 0) {
      websites.forEach(website => {
        totalMobileClicks += website.mobileClick || 0;
        totalDesktopClicks += website.deskstopClick || 0;
      });
    }

    // If no informations found, return a 404
    if (informations.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No informations found!!!",
        data: []
      });
    }

    // Send statistics data including information counts, website counts, and click counts
    return res.status(200).json({
      success: true,
      message: "Statistics fetched successfully!",
      data: [
        { name: "Total Informations", value: totalInformations },
        { name: "Total Websites", value: totalWebsites },
        { name: "Total Mobile Clicks", value: totalMobileClicks },
        { name: "Total Desktop Clicks", value: totalDesktopClicks }
      ]
    });

  } catch (error) {
    console.error('Error fetching statistics:', error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};


module.exports = {
  getAllStatistics,
  getAllUsers,
  deleteUser
};
