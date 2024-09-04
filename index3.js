const puppeteer = require("puppeteer");
const fs = require("fs");

async function scrapeProduct(url, region) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "networkidle2" });
  await page.setViewport({ width: 1280, height: 1024 });

  const screenWidth = await page.evaluate(() => window.innerWidth);

  let liElements;

  // Функция для клика по элементу
  async function clickElement(selector) {
    await page.evaluate((selector) => {
      const element = document.querySelector(selector);
      if (element) {
        element.click();
      }
    }, selector);
  }

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  if (screenWidth < 1024) {
    await page.waitForSelector(".UiHeaderHorizontalBase_burger__xPtTl", {
      visible: true,
    });
    await clickElement(".UiHeaderHorizontalBase_burger__xPtTl");

    await delay(5000);

    // try {
    //   await page.waitForSelector('.FeatureAddressSettingMobile_regionWrapper__PVKLR', { timeout: 30000 });
    //   console.log("Элемент найден!");
    // } catch (error) {
    //   console.error("Ошибка: элемент не найден в течение 30 секунд", error);
    // }

    // const selector = ".FeatureAddressSettingMobile_regionWrapper__PVKLR";
    // await clickElement(selector);

    // const liElements = await page.$$(".UiRegionListBase_listWrapper__Iqbd5 ul li");
  } else {
    await page.waitForSelector(".UiHeaderHorizontalBase_region__2ODCG", {
      visible: true,
    });
    await clickElement(".UiHeaderHorizontalBase_region__2ODCG");

    await delay(5000);
    await page.waitForSelector(".Modal_modal__Pja4P ul li", { timeout: 10000 });
    liElements = await page.$$(".Modal_modal__Pja4P ul li");
  }

  // for (let li of liElements) {
  //   const text = await page.evaluate((el) => el.textContent, li);
  //   if (text.trim() === region) {
  //     await li.click();
  //     break;
  //   }
  // }

  // await page.waitForFunction(
  //   (region) =>
  //     document
  //       .querySelector(".Region_region__6OUBn")
  //       .innerText.includes(region),
  //   {},
  //   region
  // );

  // await page.waitForFunction(
  //     (region) => document.querySelector('.Region_region__6OUBn').innerText.includes(region),
  //     {},
  //     region
  // );
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


 