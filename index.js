const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeProduct(url, region) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle2' });


    const screenWidth = await page.evaluate(() => window.innerWidth);

    if (screenWidth < 1024) {
        await page.click('.UiHeaderHorizontalBase_burger__xPtTl');
        await page.waitForSelector('.FeatureAddressSettingMobile_regionWrapper__PVKLR', { timeout: 10000 });

    } else {

        await page.click('.UiHeaderHorizontalBase_region__2ODCG'); 
        await page.waitForSelector('.Modal_modal__Pja4P ul li', { timeout: 10000 });
        const liElements = await page.$$('.Modal_modal__Pja4P ul li');
    }



    for (let li of liElements) {
        const text = await page.evaluate(el => el.textContent, li);
        if (text.trim() === region) {
            await li.click();
            break;
        }
    }

    await page.waitForFunction(
        (region) => document.querySelector('.Region_region__6OUBn').innerText.includes(region),
        {},
        region
    );


    await page.screenshot({ path: 'screenshot.jpg', fullPage: true });


    const productData = await page.evaluate(() => {
        const oldPriceElements = Array.from(document.querySelectorAll('.Price_price__QzA8L.Price_size_XS__ESEhJ.Price_role_old__r1uT1')); 
        const priceElements = Array.from(document.querySelectorAll('.Price_price__QzA8L.Price_size_XL__MHvC1.Price_role_discount__l_tpE')); 
        const ratingElement = document.querySelector('.ActionsRow_stars__EKt42'); 
        const reviewsElement = document.querySelector('.ActionsRow_reviews__AfSj_'); 

        const oldPrices = oldPriceElements.map(el => el.innerText)[0];
        const prices = priceElements.map(el => el.innerText)[0];
        const rating = ratingElement ? ratingElement.innerText : 'Нет рейтинга';
        const reviews = reviewsElement ? reviewsElement.innerText : 'Нет отзывов';

        return {
            oldPrices,
            prices,
            rating,
            reviews
        };
    });


    const output = `${productData.oldPrices ? "Старая цена: " `${productData.oldPrices}\n` : ""}Цена: ${productData.prices}\nРейтинг: ${productData.rating}\nОтзывы: ${productData.reviews}`;
    fs.writeFileSync('product.txt', output);

    await browser.close();
}


const [url, region] = process.argv.slice(2);
if (!url || !region) {
    console.error('Необходимо указать URL и регион.');
    process.exit(1);
}


scrapeProduct(url, region).catch(console.error);
