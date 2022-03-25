const puppeteer = require('puppeteer');
const fs = require('fs');
let minimist = require("minimist");
let excel = require("xlsx");

let args = minimist(process.argv);
let pin = String(args.pin);
console.log(pin);

// let pin = (process.argv[2]);
// console.log(pin);

(async () => {
    let browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        args: ["--start-maximized"]
    })

    let pages = await browser.pages();
    let page = pages[0];
    await page.goto("https://www.google.com")
    await page.waitForSelector(".gLFyf.gsfi");
    await page.type(".gLFyf.gsfi", "cowin");
    await page.keyboard.press("Enter");
    await page.waitForSelector(".yuRUbf a[href='https://www.cowin.gov.in/']")
    await page.click(".yuRUbf a[href='https://www.cowin.gov.in/']");
    await page.waitForSelector("#mat-tab-label-1-1", { visible: true });
    await page.waitForTimeout(3000);
    await page.evaluate(() => {
        document.querySelector("#mat-tab-label-1-1").click();
    })
    await autoScroll(page);
    await page.waitForSelector("#mat-input-0");
    await page.type("#mat-input-0", pin);
    await page.keyboard.press("Enter")

    
    await page.waitForSelector(".main-slider-wrap.col.col-lg-3.col-md-3.col-sm-3.col-xs-12",{visible:true});
    await page.waitForTimeout(3000);
   let output= await page.evaluate(() => {
        let centerNameData = []
       let output = document.querySelectorAll(".main-slider-wrap.col.col-lg-3.col-md-3.col-sm-3.col-xs-12")
    for(var i =0; i<output.length;i++){
        centerNameData.push(output[i].textContent);
    }
//    let addressData = []
//    let addressDataArr = document.querySelectorAll("p.center-name-text")
//    for( let i = 0; i<addressDataArr.length/2;i++){
//        addressData.push(addressDataArr[i].textContent)
//    }
   let vaccineNameData = []
    let vaccineNameDataArr = document.querySelectorAll("p.vaccine-details");
    for(let i =0; i<vaccineNameDataArr.length; i++){
        vaccineNameData.push(vaccineNameDataArr[i].textContent)
     }
    // let detailsData = [];
    // let detailsDataArr = document.querySelectorAll("p.session-details");
    // for(var i =0; i<detailsDataArr.length; i++){
    //     detailsData.push(detailsDataArr[i].textContent)
    // }

    let date = []
    let dateArr = document.querySelectorAll("li.availability-date")
    for(var j = 0 ; j<7; j++){
        date.push(dateArr[j].textContent)
    }

    let slot = []
    let slotArr = document.querySelectorAll("li.ng-star-inserted .slots-box")
    for(var i = 0 ; i<slotArr.length; i++){
        slot.push(slotArr[i].textContent)
    }

    let allData ={
        centerName : centerNameData,
        vaccineName : vaccineNameData,
        vcDate : date,
        vcSlot : slot
    }
      

        return allData
    })
    console.log(output)


    for (let i = 0; i < 7; i++) {
        let fileNa = output.vcDate[i] + ".txt";
        if (fs.existsSync(fileNa)) {
            fs.unlinkSync(fileNa)
        }
    }
    let newWB = excel.utils.book_new();
        
    let obj_arr =[]
    for (let i = 0; i < 7; i++) {
        // let fileN = output.dates[i] + ".txt";
        // console.log(fileN);
        let obbj=[];
        // fs.appendFileSync(fileN, "Date:- " + output.dates[i], "utf-8")
        for (let j = 0; j < output.centerName.length; j++) {
            // fs.appendFileSync(fileN, "\nCenter:- " + output.city[j], "utf-8");
            let obj = {};

            obj['Date'] = output.vcDate[i]
            obj['Center'] = output.centerName[j]
            obj['VaccineName']=output.vaccineName[j]
            
            for (let k = 1; k < output.vcSlot.length; k++) {
                if (k % 7 == i && Math.floor(k / 7) == j) {
                    if (output.vcSlot[k] == " NA " || output.vcSlot[k]==undefined) {
                        obj['Total'] = 'NA'
                        // fs.appendFileSync(fileN, "\nVaccine Name: -NA\nDose 1:- NA \nDose 2:- NA \nTotal:- NA\n", "utf-8");
                        // fs.appendFileSync(fileN,"\nVaccine Name: -NA\nDose 1:- NA \nDose 2:- NA \nTotal:- NA","utf-8");
                    } else {
                        let arr = output.vcSlot[k].split(" ");
                        arr.splice(10);
                        console.log(arr)
                        obj['Total'] = arr[1]
                        // fs.appendFileSync(fileN, `\nVaccine name:- ${arr[1]}\nDose 1:- ${arr[4]}\nDose 2:- ${arr[9]}\nTotal:- ${arr[6]}\n`, "utf-8")

                        // let somee= JSON.stringify(arr);
                        // fs.appendFileSync(fileN,somee,"utf-8") 
                    }
                }
            }
            obbj.push(obj)
            // console.log(obj)
            obj_arr.push(obj)
        }
        // let content= fs.readFileSync(fileN,"utf-8");
        // let filesN = output.dates[i]+".json";
        // fs.writeFileSync(filesN,content)
        // pdfDoc.pipe(fs.createWriteStream(filesN));
        // pdfDoc.text(content);
        let newWS = excel.utils.json_to_sheet(obbj);
        excel.utils.book_append_sheet(newWB,newWS,output.vcDate[i]);
        
        
        
    }
    fs.appendFileSync("file.json",JSON.stringify(obj_arr));
    browser.close()
     
    excel.writeFile(newWB,'Vaccinate.xlsx')
    // pdfDoc.end()
})();




async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 50;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 50);
        });
    });
}