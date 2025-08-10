const User = require("../models/user");
const { hashPassword, comparePassword } = require("../helpers/auth");
const jwt = require("jsonwebtoken");
const Website = require("../models/website");
const test = (req, res) => {
    res.json("test is working")
}
const generateRandomString = (maxLength = 15) => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < maxLength; i++) {
        const randomIndex = Math.floor(Math.random() * letters.length);
        result += letters[randomIndex];
    }
    return result;
}
const generateRandomNumberString = (maxLength = 15) => {
    const digits = '0123456789';
    let result = '';
    for (let i = 0; i < maxLength; i++) {
        const randomIndex = Math.floor(Math.random() * digits.length);
        result += digits[randomIndex];
    }
    return result;
}
const registerUser = async (req, res) => {
    generateRandomString(5);
    try {
        const { name, email, password, role, selectedItems } = req.body;
        if (!name) {
            return res.json({ success: false, message: "Name is required" })
        }
        if (!email) {
            return res.json({ success: false, message: "Email is required" })
        }
        if (!password || password.length < 6) {
            return res.json({ success: false, message: "Password is required and should be min 6 characters long" })
        }
        // check for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(500).json({
                success: false,
                message: "Email already Registered!!",
            });
        }

        const hashedPassword = await hashPassword(password);

        const user = await User.create({ name, email, password: hashedPassword, role });

        // console.log(user)
        if (user) {
            if (selectedItems.length > 0) {


                selectedItems.map(async (item) => {
                    for (let i = 0; i < 4; i++) {
                        let objid = user._id.toString();
                        let websiteName = item;
                        let path = `/location`;
                        let subdomain = generateRandomNumberString(7);

                        try {
                            const website = await Website.create({
                                websiteName,
                                path,
                                subdomain,
                                userId: objid,
                                mobileClick: 0,
                                deskstopClick: 0,
                            });
                            // console.log(`Website created: ${website}`);
                        } catch (error) {
                            console.error('Error creating website:', error.message);
                        }
                    }
                    for (let i = 0; i < 4; i++) {
                        let objid = user._id.toString();
                        let websiteName = item;
                        let path = `/location-live`;
                        let subdomain = generateRandomNumberString(7);

                        try {
                            const website = await Website.create({
                                websiteName,
                                path,
                                subdomain,
                                userId: objid,
                                mobileClick: 0,
                                deskstopClick: 0,
                            });
                            // console.log(`Website created: ${website}`);
                        } catch (error) {
                            console.error('Error creating website:', error.message);
                        }
                    }
                   
                })

            }




            // return res.json(user);
            return res.status(200).json({
                success: true,
                message: "Registration successful!",
                data: user

            });
        }




    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong!",
        });
    }

}

// const loginUser = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.json({ error: "Email is not registered" })
//         }
//         const match = await comparePassword(password, user.password);
//         if (match) {
//             jwt.sign({
//                 email: user.email,
//                 id:user._id,
//                 role:user.role,
//                 name:user.name
//             }, process.env.JWT_SECRET,{},(err,token) =>{
//                 if(err) throw err;

//                 res.cookie('token',token).json(user)
//             })
//             // return res.json("Password Matched")
//         }
//         if (!match) {
//             return res.json({error: "Password Incorrect"})
//         }
//         return res.json(user);

//     } catch (error) {
//         console.log(error)
//     }
// }

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        // Check if the user exists in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Email not found!!"
            });
        }

        // Compare the password
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(401).json({
                success: false,
                message: "Password doen't match!"
            });
        }

        if (match) {
            // Generate JWT token
            jwt.sign(
                {
                    email: user.email,
                    id: user._id,
                    role: user.role,
                    name: user.name
                },
                process.env.JWT_SECRET,
                { expiresIn: '5h' }, // Optional: token expiration
                (err, token) => {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: "Failed to generate authentication token.",
                        });
                    }

                    // Set the JWT token in a cookie and send the response
                    res.cookie('token', token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production', // Ensure secure in production
                        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // Needed for cross-origin

                    });
                    return res.status(200).json({
                        success: true,
                        message: "Login successful!",
                        data: {
                            user: {
                                id: user._id,
                                email: user.email,
                                role: user.role,
                                name: user.name
                            },
                            token
                        }
                    });
                }
            );
        }


    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred. Please try again later.",
        });
    }
};


// const getProfile = async (req, res) => {

//     const { token } = req.cookies;
//     if (token) {
//         jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
//             if (err) throw err;
//             res.json(user)
//             // console.log(user)
//         })
//     } else {
//         res.json(null)
//     }

// }


const getProfile = async (req, res) => {
    const { token } = req.cookies;

    if (token) {
        try {
            // Verify the JWT token
            const user = jwt.verify(token, process.env.JWT_SECRET);

            // Send the decoded user data in response
            res.json(user);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                // Handle token expiration error
                return res.status(401).json({ message: 'Token has expired, please log in again' });
            }
            // Other errors (e.g., invalid token)
            console.error('JWT Error:', err);
            return res.status(500).json({ message: 'Failed to verify token' });
        }
    } else {
        // If no token is found in cookies
        res.status(403).json({ message: 'Token is required' });
    }
};


// const logOut = async (req, res) => {
//     res.clearCookie('token');
//     res.send({ success: true, message: "Logged out successfully" });
// };
const logOut = async (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = {
    test,
    registerUser,
    loginUser,
    getProfile,
    logOut
}