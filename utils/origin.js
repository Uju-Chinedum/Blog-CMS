const origin = (req) => {
  const protocol = req.protocol || req.headers["x-forwarded-proto"]; // protocol of the url
  const host = req.get("host") || req.headers["x-forwarded-host"]; // host url
  const clientOrigin = `${protocol}://${host}`;

  return origin;
};

module.exports = origin;
