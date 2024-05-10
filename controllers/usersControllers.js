import User from "../models/users.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { registerUserSchema } from "../schemas/usersSchemas.js";

export const registerUser = async (req, res, next) => {
    const { password, email } = req.body;
    try {
        await registerUserSchema.validateAsync({ password, email });

        const processedPas = password.trim();
        const processedEmail = email.toLowerCase().trim();

        const user = await User.findOne({ email: processedEmail });

        if (user !== null) {
            return res.status(409).send({ message: "Email in use" })
        }

        const passwordHash = await bcrypt.hash(processedPas, 10);

        const data = await User.create({ password: passwordHash, email: processedEmail });

        res.status(201).send(data);
    } catch (error) {
        res.send({ message: error.message });
        next(error);
    }
}

export const loginUser = async (req, res, next) => {
    const { password, email } = req.body;

    try {
        await registerUserSchema.validateAsync({ password, email });

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

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.SECRET_KEY, { expiresIn: "1h" });

        await User.findByIdAndUpdate(user._id, { token });

        res.status(200).send({ token, user: { email: user.email, subscription: user.subscription } });

    } catch (error) {
        res.send({ message: error.message });
        next(error);
    }
}

export const logoutUser = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, { token: null });
        res.status(204).end();
    } catch (error) {
        res.status(401).send({ message: "Not authorized" });
        next(error);
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
        next(error);
    }
}