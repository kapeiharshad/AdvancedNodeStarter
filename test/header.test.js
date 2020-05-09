const puppetter = require("puppeteer")

test("Add two number",()=>{
    const sum =1+2;
    expect(sum).toEqual(3);
});

test("We can launch a bowser",async ()=>{
        const browser = await puppetter.launch({
            headless:false
        })
        const page = await browser.newPage();
        await page.goto("http://localhost:3000")

        const text= await page.$eval("a.brand-logo",el=> el.innerHTML)
        expect(text).toEqual("Blogster")
});