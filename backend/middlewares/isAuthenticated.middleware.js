import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    req.id = decoded.userId;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to authenticate user" });
  }
};

export default isAuthenticated;
