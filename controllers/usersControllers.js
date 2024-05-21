import User from "../models/users.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { updateSubscriptionSchema, userSchema, emailSchema } from "../schemas/usersSchemas.js";
import gravatar from "gravatar";
import Jimp from "jimp";
import fs from "fs/promises";
import path from "path";
import { v4 } from "uuid";
import nodemailer from 'nodemailer';
import { config } from "dotenv";

config();

const transport = nodemailer.createTransport({
    host: "smtp.zoho.eu",
    port: 465,
    secure: true,
    auth: {
        user: process.env.ZOHO_USER,
        pass: process.env.ZOHO_PASSWORD
    }
});

export const registerUser = async (req, res, next) => {
    const { password, email } = req.body;
    try {
        await userSchema.validateAsync({ password, email });
        const processedPas = password.trim();
        const processedEmail = email.toLowerCase().trim();

        const user = await User.findOne({ email: processedEmail });

        if (user !== null) {
            return res.status(409).send({ message: "Email in use" })
        }

        const passwordHash = await bcrypt.hash(processedPas, 10);
        const verificationToken = v4();

        await transport.sendMail({
            to: email,
            from: 'phone-book@zohomail.eu',
            subject: "Welcome to Phone Book! Quick email check to start",
            html: `To confirm you registration please click on the <a href="http://localhost:3000/api/users/verify/${verificationToken}">link</a>`,
            text: `To confirm you registration please open the link http://localhost:3000/api/auth/verify/${verificationToken}`,
        });

        const data = await User.create({
            password: passwordHash, email: processedEmail, avatarURL: gravatar.url(email),
            verificationToken
        });

        res.status(201).send({ user: { email: data.email, subscription: data.subscription } });

    } catch (error) {
        res.send({ message: error.message });
    }
}

export const loginUser = async (req, res, next) => {
    const { password, email } = req.body;

    try {
        await userSchema.validateAsync({ password, email });

        const processedPas = password.trim();
        const processedEmail = email.toLowerCase().trim();

        const user = await User.findOne({ email: processedEmail });

        if (user === null) {
            return res.status(401).send({ "message": "Email or password is wrong" })
        }

        const isMatch = await bcrypt.compare(processedPas, user.password)

        if (!isMatch) {
            return res.status(401).send({ "message": "Email or password is wrong" })
        }

        if (user.verify === false) {
            return res.status(401).send({ message: "Your account is not verified yet" });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.SECRET_KEY, { expiresIn: "1h" });

        await User.findByIdAndUpdate(user._id, { token });

        res.status(200).send({ token, user: { email: user.email, subscription: user.subscription } });

    } catch (error) {
        res.send({ message: error.message });
    }
}

export const logoutUser = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, { token: null });
        res.status(204).end();
    } catch (error) {
        res.status(401).send({ message: "Not authorized" });
    }

}

export const getUserInfo = async (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;
        const [bearer, token] = authorizationHeader.split(" ", 2);

        const user = await User.findOne({ token: token });
        if (user === null) {
            return res.status(401).send({ message: "Not authorized" });
        }
        res.status(200).send({ email: user.email, subscription: user.subscription });

    } catch (error) {
        res.send({ message: error.message });
    }
}

export const updateSubscription = async (req, res, next) => {
    const subscription = req.body.subscription;

    try {
        await updateSubscriptionSchema.validateAsync({ subscription });

        const user = await User.findByIdAndUpdate(req.user.id, { subscription }, { new: true });

        if (user === null) {
            return res.status(404).send({ message: "Not found" });
        }

        res.status(200).send({ email: user.email, subscription: user.subscription });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
}

export const updateAvatar = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).send({ message: "No image uploaded" });
        }
        const file = await Jimp.read(req.file.path);
        file.resize(250, 250).write(req.file.path);
        await fs.rename(req.file.path,
            path.resolve("public/avatars/", req.file.filename)
        );

        const user = await User.findByIdAndUpdate(req.user.id, { avatarURL: "/avatars/" + req.file.filename }, { new: true });

        if (user === null) {
            return res.status(404).send({ message: "Not found" });
        }
        res.status(200).send({ avatarURL: "/avatars/" + req.file.filename });
    } catch (error) {
        res.status(401).send({ message: error.message });
    }
}

export const verifyUser = async (req, res, next) => {
    try {
        const { verificationToken } = req.params;
        const user = await User.findOne({ verificationToken });

        if (user === null) {
            return res.status(404).send({ message: 'User not found' });
        }

        await User.findOneAndUpdate({ verificationToken }, { verify: true, verificationToken: null });

        res.status(200).send({ message: "Verification successful" })
    } catch (error) {
        res.status(404).send({ message: error.message });
    }
}

export const resendVerificationEmail = async (req, res, next) => {
    const { email } = req.body;

    try {
        await emailSchema.validateAsync({ email });
        const processedEmail = email.toLowerCase().trim();

        if (!processedEmail) {
            return res.status(400).send({ message: "Missing required field email" });
        }

        const user = await User.findOne({ email: processedEmail });

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        if (user.verify === true) {
            return res.status(400).send({ message: "Verification has already been passed" });
        }

        const verificationToken = v4();

        await transport.sendMail({
            to: email,
            from: 'phone-book@zohomail.eu',
            subject: "Welcome to Phone Book! Quick email check to start",
            html: `To confirm you registration please click on the <a href="http://localhost:3000/api/users/verify/${verificationToken}">link</a>`,
            text: `To confirm you registration please open the link http://localhost:3000/api/auth/verify/${verificationToken}`,
        })

        await User.findOneAndUpdate({ email: processedEmail }, { verificationToken });

        res.status(200).send({ message: "Verification email send" });
    } catch (error) {
        res.status(404).send({ message: error.message });
    }

}