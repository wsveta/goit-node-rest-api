import jwt from "jsonwebtoken";
import User from "../models/users.js"
export default function auth(req, res, next) {
    const authorizationHeader = req.headers.authorization;
    
    if (typeof authorizationHeader === "undefined") {
        return res.status(401).send({ "message": "Not authorized" });
    }
    
    const [bearer, token] = authorizationHeader.split(" ", 2);
    if (bearer !== "Bearer") {
        return res.status(401).send({ "message": "Not authorized" });
    }
    jwt.verify(token, process.env.SECRET_KEY, async (error, decode) => {
        if (error) {
            return res.status(401).send({ "message": "Not authorized" });
        }
        try {
            const user = await User.findById(decode.id);

            if (user === null) {
                return res.status(401).send({ "message": "Not authorized" });
            }

            if (user.token !== token) {
                return res.status(401).send({ "message": "Not authorized" });
            }

            req.user = {
                id: user._id,
                email: user.email
            }
            next();


        } catch (error) {
            res.status(400).send({ message: error.message })
            next(error);
        }
    })
}
