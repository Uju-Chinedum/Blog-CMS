const { Unauthorized } = require("../errors");

const checkPermissions = (requestUser, resourceUserId) => {
  if (requestUser.role === "admin") return;
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new Unauthorized(
    "Permission Denied",
    "Not authorized to to do this operation"
  );
};

module.exports = checkPermissions;
