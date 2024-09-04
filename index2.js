const puppeteer = require("puppeteer");
const fs = require("fs");

async function scrapeProduct(url, reg) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.goto(url, { waitUntil: "networkidle2" });
  await page.evaluate(async (reg) => {
    const response = await fetch('https://www.vprok.ru/web/api/v1/changeRegion', {
      method: 'POST',
      headers: {
        'X-Xsrf-Token': 'eyJpdiI6Ind2SXVHTndlblJWQm5rYytFbVlRZ3c9PSIsInZhbHVlIjoiMjJLeU9qaUpFMDl2SXhxaEZaSWpDcTFhT3NTQlFVd21WeDhrQzFzRzNkQmhyZ0lrQUFYMzFYOStRMkJyZnNJMEFVNnAyYVFvUGVmYW9MNEFOXC9seWlBPT0iLCJtYWMiOiIzNzI4MmU3MzA1MjI5ZDI3ZmJkZDMzNjhlMTJhM2Y4Y2ZhMmU5ZDNlNzQzMDBlYTUyOTQzODdmYmM5Y2EyODYxIn0=',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ isBold: true, name: reg, regionId: 78 })
    });
    if (!response.ok) {
      throw new Error('Network response was not ok: ' + response.status);
    }
    const text = await response.text(); 
  
    const data = JSON.parse(text); 
    return data; 
  });


  await page.waitForFunction(() => {
    return window.fetch && window.fetch.toString().includes('Promise');
  });

  await page.waitForSelector(".Region_region__6OUBn");

  const regionValue = await page.evaluate(() => {
    const element = document.querySelector(".Region_region__6OUBn");
    return element ? element.innerText : null; 
  });

  console.log("Значение региона:", regionValue);

  await page.screenshot({ path: "screenshot.jpg", fullPage: true });

  const productData = await page.evaluate(() => {
    const oldPriceElements = document.querySelector(
      ".Price_price__QzA8L.Price_size_XS__ESEhJ.Price_role_old__r1uT1"
    );
    const priceElements = document.querySelector(
      ".Price_price__QzA8L.Price_size_XL__MHvC1.Price_role_discount__l_tpE"
    );
    const ratingElement = document.querySelector(".ActionsRow_stars__EKt42");
    const reviewsElement = document.querySelector(".ActionsRow_reviews__AfSj_");

    const oldPrice = oldPriceElements ? oldPriceElements.textContent : "";
    const price = priceElements ? priceElements.textContent : "";
    const rating = ratingElement ? ratingElement.innerText : "Нет рейтинга";
    const reviews = reviewsElement ? reviewsElement.innerText : "Нет отзывов";

    return {
      oldPrice,
      price,
      rating,
      reviews,
    };
  });

  const output = `${
    productData.oldPrice ? "Старая цена: " + productData.oldPrice + "\n" : ""
  }Цена: ${productData.price}\nРейтинг: ${productData.rating}\nОтзывы: ${
    productData.reviews
  }
`;
  fs.writeFileSync("product.txt", output);

  await browser.close();
}

// const [url, region] = process.argv.slice(2);
// if (!url || !region) {
//   console.error("Необходимо указать URL и регион.");
//   process.exit(1);
// }

// scrapeProduct(url, region).catch(console.error);






const puppeteer = require("puppeteer");
const fs = require("fs");

async function scrapeProduct(url, region) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "networkidle2" });
  await page.setViewport({ width: 1280, height: 1024 });

  const screenWidth = await page.evaluate(() => window.innerWidth);

  async function clicked() {
    await page.evaluate(() => {
      const regionIcon = document.querySelector('.Region_regionIcon__oZ0Rt');
      if (regionIcon) {
        regionIcon.click();
      }
    });
    

    await page.waitForSelector('.Modal_modal__Pja4P', { visible: true });
    const regionValue = await page.evaluate(() => {
      const element = document.querySelector(".Region_region__6OUBn");
      return element ? element.innerText : null;
    });
    console.log("Значение региона:", regionValue);
  
    await page.screenshot({ path: "screenshot.jpg", fullPage: true });
  
    const productData = await page.evaluate(() => {
      const oldPriceElements = document.querySelector(
        ".Price_price__QzA8L.Price_size_XS__ESEhJ.Price_role_old__r1uT1"
      );
      const priceElements = document.querySelector(
        ".Price_price__QzA8L.Price_size_XL__MHvC1.Price_role_discount__l_tpE"
      );
      const ratingElement = document.querySelector(".ActionsRow_stars__EKt42");
      const reviewsElement = document.querySelector(".ActionsRow_reviews__AfSj_");
  
      const oldPrice = oldPriceElements ? oldPriceElements.textContent : "";
      const price = priceElements ? priceElements.textContent : "";
      const rating = ratingElement ? ratingElement.innerText : "Нет рейтинга";
      const reviews = reviewsElement ? reviewsElement.innerText : "Нет отзывов";
  
      return {
        oldPrice,
        price,
        rating,
        reviews,
      };
    });
  
    const output = `${
      productData.oldPrice ? "Старая цена: " + productData.oldPrice + "\n" : ""
    }Цена: ${productData.price}\nРейтинг: ${productData.rating}\nОтзывы: ${
      productData.reviews
    }
    `;
    fs.writeFileSync("product.txt", output);
  
  }
  clicked()
  // function delay(ms) {
  //   return new Promise((resolve) => setTimeout(resolve, ms));
  // }

  //   await delay(5000);
    
      // await page.waitForSelector(".UiHeaderHorizontalBase_region__2ODCG", {
      //   visible: true,
      // });
    
  // try { 
  //     await page.waitForSelector('.Modal_modal__Pja4P', { timeout: 3000 });
  //   } catch (error) {
  //     console.error('Ошибка при ожидании элемента:', error);
  //   }
    
  //   liElements = await page.$$(".Modal_modal__Pja4P ul li");

  // for (let li of liElements) {
  //   const text = await page.evaluate((el) => el.textContent, li);
  //   if (text.trim() === region) {
  //     await li.click();
  //     break;
  //   }
  // }

  const regionValue = await page.evaluate(() => {
    const element = document.querySelector(".Region_region__6OUBn");
    return element ? element.innerText : null;
  });
  console.log("Значение региона:", regionValue);

  await page.screenshot({ path: "screenshot.jpg", fullPage: true });

  const productData = await page.evaluate(() => {
    const oldPriceElements = document.querySelector(
      ".Price_price__QzA8L.Price_size_XS__ESEhJ.Price_role_old__r1uT1"
    );
    const priceElements = document.querySelector(
      ".Price_price__QzA8L.Price_size_XL__MHvC1.Price_role_discount__l_tpE"
    );
    const ratingElement = document.querySelector(".ActionsRow_stars__EKt42");
    const reviewsElement = document.querySelector(".ActionsRow_reviews__AfSj_");

    const oldPrice = oldPriceElements ? oldPriceElements.textContent : "";
    const price = priceElements ? priceElements.textContent : "";
    const rating = ratingElement ? ratingElement.innerText : "Нет рейтинга";
    const reviews = reviewsElement ? reviewsElement.innerText : "Нет отзывов";

    return {
      oldPrice,
      price,
      rating,
      reviews,
    };
  });

  const output = `${
    productData.oldPrice ? "Старая цена: " + productData.oldPrice + "\n" : ""
  }Цена: ${productData.price}\nРейтинг: ${productData.rating}\nОтзывы: ${
    productData.reviews
  }
  `;
  fs.writeFileSync("product.txt", output);

  await browser.close();
}

const [url, region] = process.argv.slice(2);
if (!url || !region) {
  console.error("Необходимо указать URL и регион.");
  process.exit(1);
}

scrapeProduct(url, region).catch(console.error);



// Возможности получения li

  // await page.waitForFunction(() => {
  //   const element = document.querySelector('.SomeContentSelector');
  //   return element !== null;
  // }, { timeout: 10000 });

  // const regions = await Promise.all(liElements.map(async (li) => {
  //   const text = await page.evaluate(el => el.innerText, li);
  //   return { text: text.trim(), element: li };
  // }));

  // let regionFound = false;
  // for (const regionObj of regions) {
  //   if (regionObj.text === region) {
  //     await regionObj.element.click();
  //     regionFound = true;
  //     break;
  //   }
  // }

  
  // const getLiElements = async () => {
  //   return await page.evaluate(() => {
  //     const items = Array.from(
  //       document.querySelectorAll(".UiRegionListBase_list__cH0fK li")
  //     );
  //     return items.map((item) => item.innerText.trim());
  //   });
  // };
  // const liTexts = await getLiElements(); 
  // let regionFound = false;
  // for (let i = 0; i < liTexts.length; i++) {
  //   if (liTexts[i] === region) {
  //     regionFound = true;
  //     const li = await page.$$(".UiRegionListBase_list__cH0fK li");
  //     await li[i].click();
  //     console.log(`Кликнули по региону: ${region}`);
  //     break;
  //   }
  // }


  //   const texts = await Promise.all(liElements.map(li => page.evaluate(el => el.innerText, li)));
  // let regionFound = false;
  // for (let i = 0; i < texts.length; i++) {
  //   if (texts[i].trim() === region) {
  //     await liElements[i].click();
  //     regionFound = true;
  //     break;
  //   }
  // }



  // ОЖИДАНИЕ ПОЯВЛЕНИЯ ЭЛЕМЕНТА - ЭТИ ВАРИАНТЫ ДОЛГИЕ ИЛИ НЕРАБОЧИЕ

   //   const timeoutPromise = new Promise((_, reject) =>
  //     setTimeout(() => reject(new Error("Timeout: элемент не найден")), 5000)
  // );

    // await Promise.race([elementPromise, timeoutPromise]);
  //   isClickable = await page.evaluate(() => {
  //       const element = document.querySelector(".Region_regionIcon__oZ0Rt");
  //       return element && element.offsetParent !== null;
  //   });
  // if (isClickable) {
  //   await waitFor(2500);
  //   try {
      //   await page.waitForFunction(selector => {
      //     const element = document.querySelector(selector);
      //     return element && element.offsetParent !== null;
      // }, {}, ".Region_regionIcon__oZ0Rt");
      //await page.click(".Region_regionIcon__oZ0Rt");

      // либо
      // await Promise.all([
      //     page.click('.Region_regionIcon__oZ0Rt'),
      //     page.waitForNavigation({ waitUntil: 'networkidle0' }),
      // ]);
  //   } catch (error) {
  //     console.error("Ошибка при клике или навигации:", error);
  //   }
  // } else {
  //   console.error("Элемент перекрыт или не доступен для клика.");
  //   await browser.close();
  //   return;
  // }