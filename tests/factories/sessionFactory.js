const Buffer = require("safe-buffer").Buffer;
const keygrip = require("keygrip");
const keys = require("../../config/keys");
const keygripObj = new keygrip([keys.cookieKey]);

module.exports = (user) => {
  const sessionObject = {
    passport: {
      user: user._id.toString()
    }
  };
  const session = Buffer.from(JSON.stringify(sessionObject)).toString("base64");
  const sig = keygripObj.sign("session=" + session);
  return { session, sig };
};
