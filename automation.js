const puppeteer = require('puppeteer');


// const browser = puppeteer.launch({
//     headless:false
// }).then((browser)=>{
//    const page =  browser.newPage().then((page)=>{
//        page.goto('https://google.com');
//    })
      
// })


// (async () => {
//   const browser = await puppeteer.launch({
//       headless:false
//   });
//   const page = await browser.newPage();
//   await page.goto('https://google.com');
  
// })();




(async () => {
    const browser = await puppeteer.launch({headless:false,
        defaultViewport: null,
    args:["--start-maximized"]
    });

    let pages = await browser.pages();
    const page = pages[0];
    
  
    await page.goto('https://google.com');

    await page.waitForSelector("input[type='text']");

    await page.type("input[type='text']", "Amazon");
    await page.keyboard.press("Enter");

    await page.waitForSelector("a[href='https://www.amazon.in/']");
    await page.click("a[href='https://www.amazon.in/']")
    await page.waitForSelector("#twotabsearchtextbox")
    await page.type('#twotabsearchtextbox', 'boat headphone')
    await page.waitForSelector("#nav-search .nav-search-submit .nav-input");
    await page.click("#nav-search .nav-search-submit .nav-input")
   

    // await page.$eval('input[name=search]', el => el.value = 'Adenosine triphosphate');

    // await page.click('input[type="submit"]');
    // await page.waitForSelector('#mw-content-text');
    // const text = await page.evaluate(() => {
    //     const anchor = document.querySelector('#mw-content-text');
    //     return anchor.textContent;
    
   
    
})();