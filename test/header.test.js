const puppetter = require("puppeteer");

let browser, page;

//  runs before each test describe
beforeEach(async () => {
  browser = await puppetter.launch({
    headless: false
  });
  page = await browser.newPage();
  await page.goto("http://localhost:3000");
});

afterEach(async () => {
  //   await browser.close();
});

test("We can launch a bowser", async () => {
  const text = await page.$eval("a.brand-logo", (el) => el.innerHTML);
  expect(text).toEqual("Blogster");
});

test("click login start oauth flow", async () => {
  await page.click(".right a");
  const url = await page.url();
  console.log("from url ", url);
  expect(url).toMatch(/accounts\.google\.com/);
});

test.only("When signed in,shows logout button", async () => {
  const id = "5ec90baf2d405445ed228ded";

  const Buffer = require("safe-buffer").Buffer;
  const sessionObject = {
    passport: {
      user: id
    }
  };
  const sessionString = Buffer.from(JSON.stringify(sessionObject)).toString(
    "base64"
  );
  const keygrip = require("keygrip");
  const keys = require("../config/keys");
  const keygripObj = new keygrip([keys.cookieKey]);
  const sig = keygripObj.sign("session=" + sessionString);

  //   await page.setCookie({name: "session", value: sessionString});
  //   await page.setCookie({name: "session.sig", value: sig});

  await page.deleteCookie({name: "session"});
  await page.deleteCookie({name: "session.sig"});

  await page.goto("localhost:3000");
});
