import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const SignUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existEmail = await User.findOne({ email });

        if (existEmail) {
            return res.status(400).json({
                message: "email is already exists!",
            });
        }

        if (!password || password.trim().length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters!",
            });
        }


        // if (password.length < 6) {
        //     return res.status(400).json({
        //         message: "paswwrod must be atleast 6 characters !",
        //     });
        // }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            password: hashedPassword,
            email,
        });


        const token = await genToken(user._id)
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "none",
            secure: true
        })
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: `sign up error ${error}` });

    }
};


export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "email is does not exists!",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "incorrect password!",
            });
        }

        const token = await genToken(user._id)
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "none",
            secure: true
        })
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: `login error ${error}` });

    }
};

export const Logout = async (req, res) => {
    try {
        // Correct method name is clearCookie (capital C)
        res.clearCookie("token", {
            httpOnly: true,
            // secure: true,     // true if you're using HTTPS
            sameSite: "strict"
        }); res.status(200).json({ message: `log out successfully` });

    } catch (error) {
        res.status(500).json({ message: `log out error ${error}` });

    }

}

