const { Unauthorized } = require("../errors");

const checkPermissions = (requestUser, resourceUserId) => {
  // Check if the user id matches the user id of the resource
  if (requestUser.userId === resourceUserId.toString()) return;
  
  throw new Unauthorized(
    "Permission Denied",
    "Not authorized to to do this operation"
  );
};

module.exports = checkPermissions;
