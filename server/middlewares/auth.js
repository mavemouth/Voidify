import jwt from "jsonwebtoken";

// Middleware Function to decode jwt token to get clerkId
const authUser = async (req, res, next) => {
    try {
        const { token } = req.headers;
        if (!token || token === "null" || token === "undefined") {
            return res.status(401).json({ success: false, message: "Not Authorized Login Again" })
        }

        const token_decode = jwt.decode(token);
        console.log("Decoded token payload:", token_decode);

        if (!token_decode) {
            return res.status(401).json({ success: false, message: "Invalid Token" })
        }

        req.body = req.body || {};
        req.body.clerkId = token_decode.clerkId || token_decode.sub;

        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

export default authUser;