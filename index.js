const puppeteer = require("puppeteer");
const fs = require("fs");
const { exec } = require("child_process");

async function scrapeProduct(url, region) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
  );

  page.on("console", (msg) => {
    console.log("Браузер:", msg.text());
  });

  await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
  await page.setViewport({ width: 1280, height: 1024 });

  async function waitFor(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
 

  await page.waitForSelector(".Region_regionIcon__oZ0Rt", { visible: true });

  const isClickable = await page.evaluate(() => {
    const element = document.querySelector(".Region_regionIcon__oZ0Rt");
    return element && element.offsetParent !== null;
  });


  if (isClickable) {
    await waitFor(2000); // 2500
    try {
      await page.click(".Region_regionIcon__oZ0Rt");
    } catch (error) {
      console.error("Ошибка при клике или навигации:", error);
    }
  } else {
    console.error("Элемент перекрыт или не доступен для клика.");
    await browser.close();
    return;
  }

  const liElements = await page.$$('.UiRegionListBase_list__cH0fK li', { visible: true });
  let regionFound = false;
  for (let li of liElements) {
    const text = await page.evaluate(el => el.innerText, li);
    if (text.trim() === region) {
      regionFound = true;
      await li.click();
      break;
    }
  }

  if (!regionFound) {
    console.error(`Регион "${region}" не найден.`);
    await browser.close();
    return;
  }

  await page.waitForFunction(
    (region) =>
      document
        .querySelector(".Region_region__6OUBn")
        .innerText.includes(region),
    {},
    region
  );

  const screenshotPath = "screenshot.jpg";
  await page.screenshot({ path: screenshotPath, fullPage: true });

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
  const openCommand =
    process.platform === "win32"
      ? `start ${screenshotPath}`
      : process.platform === "darwin"
      ? `open ${screenshotPath}`
      : `xdg-open ${screenshotPath}`; // Для Linux
  exec(openCommand, (err) => {
    if (err) {
      console.error("Ошибка при открытии скриншота:", err);
    }
  });
}

const [url, region] = process.argv.slice(2);
if (!url || !region) {
  console.error("Необходимо указать URL и регион.");
  process.exit(1);
}

scrapeProduct(url, region).catch(console.error);
