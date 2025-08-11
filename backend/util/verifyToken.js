const verifyToken = (req, res, next) => {
  // 🔓 Skipping real auth for now
  req.user = { id: "dummyUserId" }; // Simple string ID - will be converted to ObjectId in controller
  next();
};

module.exports = { verifyToken };
