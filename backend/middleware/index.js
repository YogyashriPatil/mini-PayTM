import jwt from "jsonwebtoken";

const JWT_SECRET = "abc";

const authHeader = (req, res, next) => {
  const authorization = req.headers.authorization;

  // Check header
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(403).json({
      message: "Token not found in Authorization header",
    });
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded.userId) {
      return res.status(403).json({
        message: "Invalid token payload",
      });
    }

    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorized: Invalid or expired token",
    });
  }
};

export default authHeader;
