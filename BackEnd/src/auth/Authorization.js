function Authorization(AccessUser) {
  return (req, res, next) => {
    const userRole = req.userType;
    const isAuthorized = AccessUser.includes(userRole);

    if (isAuthorized) {
      next();
    } else if (userRole === "parent" && AccessUser.includes("student")) {
      next();
    } else {
      res.status(403).json({
        success: false,
        code: 403,
        message: "cannot access this route",
      });
    }
  };
}

export default Authorization;
