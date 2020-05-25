const puppetter = require("puppeteer");
const sessionFactory = require("./factories/sessionFactory");
const userFactory = require("./factories/userFactory");

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
  // await browser.close();
});

test("We can launch a bowser", async () => {
  const text = await page.$eval("a.brand-logo", (el) => el.innerHTML);
  expect(text).toEqual("Blogster");
});

test("click login start oauth flow", async () => {
  await page.click(".right a");
  const url = await page.url();
  expect(url).toMatch(/accounts\.google\.com/);
});

test.only("When signed in,shows logout button", async () => {
  const user = await userFactory();
  const { session, sig } = sessionFactory(user);
  console.log(session, "---", sig);
  await page.setCookie({ name: "express:sess", value: session });
  await page.setCookie({
    name: "express:sess.sig",
    value: sig
  });
  await page.goto("localhost:3000");

  page.waitFor('a[href="/auth/logout"]');

  const text = await page.$eval('a[href="/auth/logout"]', (el) => el.innerHTML);

  expect(text).toEqual("Logout");
});
