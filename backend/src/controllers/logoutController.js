const logoutController = {};

logoutController.logout = async (req, res) => {
  res.clearCookie("authToken");

  return res.json({ message: "Se cerró sesión" });
  //Holacls
};

export default logoutController;
  