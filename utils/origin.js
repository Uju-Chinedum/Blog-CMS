const origin = (req) => {
  const clientProtocol = req.protocol; // protocol of the url
  const clientHost = req.get("host"); // host url
  const origin = `${clientProtocol}://${clientHost}`;

  return origin;
};

module.exports = origin;
