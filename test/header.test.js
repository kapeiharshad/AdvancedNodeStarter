const puppetter = require("puppeteer")

let browser,page;

//  runs before each test describe
beforeEach(async() =>{
        browser = await puppetter.launch({
        headless:false
        })
         page = await browser.newPage();
        await page.goto("http://localhost:3000")
})

afterEach(async()=>{
    await browser.close();
})

test("We can launch a bowser",async ()=>{
    const text= await page.$eval("a.brand-logo",el=> el.innerHTML)
    expect(text).toEqual("Blogster")
});

test("click login start oauth flow",async ()=>{
    await page.click(".right a");
    const url =await page.url();
    console.log("from url ",url)
})