const puppeteer = require("puppeteer");
const fs = require("fs");

async function scrapeProduct(url, region) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "networkidle2" });
  await page.setViewport({ width: 1280, height: 1024 });

  // Ожидание, пока элемент с селектором .Region_regionIcon__oZ0Rt станет видимым
  await page.waitForSelector('.Region_regionIcon__oZ0Rt', { visible: true });

  const foo = await page.evaluate(async (region) => {
    function waitForModal(selector, timeout = 10000) {
      return new Promise((resolve, reject) => {
        const modalObserver = new MutationObserver(() => {
          const modal = document.querySelector(selector);
          if (modal) {
            console.log('////////////////////////////////////', modal)
            modalObserver.disconnect();
            resolve(modal);
          }
        });

        modalObserver.observe(document.body, { childList: true, subtree: true });

        // Установка таймаута
        setTimeout(() => {
          modalObserver.disconnect();
          reject(new Error('Таймаут: модальное окно не появилось.'));
        }, timeout);
      });
    }

    // Использование функции ожидания
    try {
      const modal = await waitForModal('.Modal_modal__Pja4P');
      console.log("Модальное окно появилось:", modal);
      const liElements = document.querySelectorAll('.UiRegionListBase_list__cH0fK li');
      console.log('///////////////', liElements)
      let regionFound = false;
      for (let li of liElements) {
        const text = li.textContent.trim();
        if (text === region) {
          li.click();
          regionFound = true;
          break;
        }
      }

      if (!regionFound) {
        console.error(`Регион "${region}" не найден.`);
        return null; // Возвращаем null, если регион не найден
      }

      // Ожидание обновления региона на странице
      const regionElement = document.querySelector('.Region_region__6OUBn');
      if (regionElement && regionElement.innerText.includes(region)) {
        console.log(`Регион "${region}" успешно выбран.`);
        return region; // Возвращаем выбранный регион
      } else {
        console.error(`Регион "${region}" не обновился на странице.`);
        return null; // Возвращаем null, если регион не обновился
      }
    } catch (error) {
      console.error(error.message);
      return null; // Возвращаем null, если произошла ошибка
    }
  }, region); // Передаем регион как аргумент

  // Проверяем, был ли выбран регион
  // if (foo === null) {
  //   console.error("Не удалось выбрать регион. Завершение работы.");
  //   return;
  // }

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
  }\n`;

  fs.writeFileSync("product.txt", output);

  await browser.close();
}

// Вызов функции scrapeProduct
const [url, region] = process.argv.slice(2);
if (!url || !region) {
  console.error("Необходимо указать URL и регион.");
  process.exit(1);
}

// Здесь вызываем функцию
scrapeProduct(url, region).catch(console.error);



const regionIcon = document.querySelector('.Region_regionIcon__oZ0Rt');
regionIcon.click(); 

// Функция для ожидания появления модального окна
function waitForModal(selector, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const modalObserver = new MutationObserver(() => {
      const modal = document.querySelector(selector);
      if (modal) {
        modalObserver.disconnect();
        resolve(modal);
      }
    });


    modalObserver.observe(document.body, { childList: true, subtree: true });

    // Установка таймаута
    setTimeout(() => {
      modalObserver.disconnect();
      
      reject(new Error('Таймаут: модальное окно не появилось.'));
    }, timeout);
  });
}

// Использование функции ожидания
waitForModal('.Modal_modal__Pja4P')
  .then(modal => {
    const liElements = document.querySelectorAll('.UiRegionListBase_list__cH0fK li');

      let regionFound = false;
      for (let li of liElements) {
        const text = li.textContent.trim();
        if (text === region) {
          li.click(); // Кликаем по элементу, если регион найден
          regionFound = true;
          break;
        }
      }
  })
  .catch(error => {
    console.error(error.message);
  });