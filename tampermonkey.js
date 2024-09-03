// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2024-08-31
// @description  try to take over the world!
// @author       You
// @match        https://www.vprok.ru/product/domik-v-derevne-dom-v-der-moloko-ster-3-2-950g--309202
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  const script = document.createElement("script");
  script.src =
    "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
  script.onload = function () {
    console.log("html2canvas загружен.");
    init();
  };
  document.head.appendChild(script);

  let regionFound = false;

  function init() {
    const region = "Санкт-Петербург и область";
    const regionIcon = document.querySelector(".Region_regionIcon__oZ0Rt");

    if (regionIcon && !sessionStorage.getItem("region")) {
      sessionStorage.setItem("region", true);
      regionIcon.click();
    } else if (regionIcon && sessionStorage.getItem("region")) {
      regionFound = true;
      sessionStorage.removeItem("region");
    } else {
      console.error("Иконка региона не найдена.");
      return;
    }

    if (!regionFound) {
      waitForModal(".Modal_modal__Pja4P")
        .then(async () => {
          const liElements = await waitForRegionElements(
            ".UiRegionListBase_list__cH0fK li"
          );
          for (let li of liElements) {
            const text = li.textContent.trim();
            if (text === region) {
              li.click();
              console.log(`Регион "${region}" выбран.`);
              break;
            }
          }
        })
        .catch((error) => {
          console.error(error.message);
        });
    } else {
      try {
        const updatedData = document
          .querySelector(".Region_region__6OUBn")
          ?.innerText.trim();
        console.log(`Регион: ${updatedData}`, updatedData);
        if (updatedData !== "" && updatedData === region) {
          const output = productData()
          const outputData = `${
            output.oldPrice
              ? "Старая цена: " + output.oldPrice + "\n"
              : ""
          }Цена: ${output.price}\nРейтинг: ${
            output.rating
          }\nОтзывы: ${output.reviews}\n`;
          saveDataToFile(`Регион: ${updatedData}\n${outputData}`);
        }
        takeScreenshot();
      } catch (error) {
        console.error(error.message);
      }
    }
  }

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

      setTimeout(() => {
        modalObserver.disconnect();
        reject(new Error("Таймаут: модальное окно не появилось."));
      }, timeout);
    });
  }

  function waitForRegionElements(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const observer = new MutationObserver(() => {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          observer.disconnect();
          resolve(elements);
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });

      setTimeout(() => {
        observer.disconnect();
        reject(new Error("Таймаут: элементы региона не появились."));
      }, timeout);
    });
  }
  function productData() {
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
  }

  function saveDataToFile(data) {
    const blob = new Blob([data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.txt";
    document.body.appendChild(a);
    setTimeout(() => {
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }

  function takeScreenshot() {
    if (typeof html2canvas === "undefined") {
      console.error("html2canvas не загружен.");
      return;
    }

    html2canvas(document.body)
      .then(function (canvas) {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "screenshot.png";
        link.click();
        console.log("Скриншот страницы сохранен.");
      })
      .catch(function (error) {
        console.error("Ошибка при создании скриншота:", error);
      });
  }
})();
