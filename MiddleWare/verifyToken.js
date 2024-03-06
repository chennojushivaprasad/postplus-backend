const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  const authorization = req.headers["authorization"];
  const token = authorization.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "Unauthorized token present" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });
    req.user = decoded.user;
    next();
  });
};

module.exports.verifyToken = verifyToken;
