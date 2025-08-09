const WebsiteModel = require("../models/website");



// Get all users
const getAllWebsites = async (req, res) => {
  try {
    const { id, role } = req.query;
    // console.log(req.query);
    let websites;
    if(role === "admin"){
      websites = await WebsiteModel.find({}).populate('userId').sort({ createdAt: -1 }); // Fetch all users
    }else{
      websites = await WebsiteModel.find({ userId: id }).populate('userId').sort({ createdAt: -1 });
    }

    if (websites.length === 0) {
      // If no users are found, send a 404 response with a custom message
      return res.status(200).json({
        success: false,
        message: "No website found!",
        data: []
  
      });
    }

    // Send the list of users if found
    // res.status(200).json(users);
    return res.status(200).json({
      success: true,
      message: "Websites fetched successful!",
      data: websites

    });
  } catch (error) {
    console.error('Error fetching websites:', error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

const updateClick = async (req, res) => {
  const { id } = req.params; // Extract the subdomain ID from params
  const { type } = req.body; // Extract the type (desktop or mobile) from the request body

  try {
    // Build the update object based on the type
    const update = type === "desktop" 
      ? { $inc: { deskstopClick: 1 } } 
      : { $inc: { mobileClick: 1 } };

    // Find and update the document
    const result = await WebsiteModel.findOneAndUpdate(
      { subdomain: id }, // Filter by subdomain
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



module.exports = {
    getAllWebsites,
    updateClick
};
