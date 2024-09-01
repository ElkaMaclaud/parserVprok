# parserVprok.

  //   const screenWidth = await page.evaluate(() => window.innerWidth);

  //   let liElements;

  //   // Функция для клика по элементу
  // async function clickElement(selector) {
  //     await page.evaluate((selector) => {
  //         const element = document.querySelector(selector);
  //         if (element) {
  //             element.click();
  //         }
  //     }, selector);
  // }

  // // Функция для задержки
  // function delay(ms) {
  //     return new Promise(resolve => setTimeout(resolve, ms));
  // }
  // if (screenWidth < 1024) {
  //     await page.waitForSelector(".UiHeaderHorizontalBase_burger__xPtTl", {
  //         timeout: 10000,
  //         visible: true,
  //     });
  //     await clickElement(".UiHeaderHorizontalBase_burger__xPtTl");
  //     console.log("||||||||||||||||||||||||||||||||||||||||||||||||||||||")

  //     // await delay(500); // Задержка для загрузки меню

  //     // Увеличьте время ожидания или проверьте с помощью XPath
  //     await page.waitForSelector(
  //         ".FeatureAddressSettingMobile_regionWrapper__PVKLR",
  //         { timeout: 10000, visible: true }
  //     );

  //     console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")

  //     // Обработка клика по элементу
  //     const selector = ".FeatureAddressSettingMobile_regionWrapper__PVKLR";
  //     await clickElement(selector);

  //     // Получение элементов списка
  //     const liElements = await page.$$(".UiRegionListBase_listWrapper__Iqbd5 ul li");
  // }

  //  else {
  //     await page.click(".UiHeaderHorizontalBase_region__2ODCG");
  //     await page.waitForSelector(".Modal_modal__Pja4P ul li", { timeout: 10000 });
  //     liElements = await page.$$(".Modal_modal__Pja4P ul li");
  //   }

  //   for (let li of liElements) {
  //     const text = await page.evaluate((el) => el.textContent, li);
  //     if (text.trim() === region) {
  //       await li.click();
  //       break;
  //     }
  //   }

  // await page.waitForFunction(
  //   (region) =>
  //     document
  //       .querySelector(".Region_region__6OUBn")
  //       .innerText.includes(region),
  //   {},
  //   region
  // );

  // Дождитесь загрузки элемента








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