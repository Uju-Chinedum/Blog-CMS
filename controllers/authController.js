// Register User with Email and Password
const register = async (req, res) => {
  res.send("register");
};

// Register User with Google
const google = async (req, res) => {
  res.send("google");
};

// Register User with GitHub
const github = async (req, res) => {
  res.send("github");
};

// Register User with Twitter
const twitter = async (req, res) => {
  res.send("twitter");
};

// Login User
const login = async (req, res) => {
  res.send("login");
};

// Logout User
const logout = async (req, res) => {
  res.send("logout");
};

// Export
module.exports = {
  register,
  google,
  github,
  twitter,
  login,
  logout,
};
