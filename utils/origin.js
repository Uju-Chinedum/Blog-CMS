const origin = (req) => {
  const forwardedProtocol = req.get("x-forwarded-proto"); // protocol of the url
  const forwardedHost = req.get("x-forwarded-host"); // host url
  console.log(forwardedProtocol, forwardedHost);
  const origin = `${forwardedProtocol}://${forwardedHost}`;

  return origin;
};

module.exports = origin;
