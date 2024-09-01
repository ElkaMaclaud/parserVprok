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

(function() {
    'use strict';
const region = "Санкт-Петербург и область";

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

    // Функция для ожидания обновления данных
    async function waitForDataUpdate(selector, oldValue, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const dataElement = document.querySelector(selector);
            if (!dataElement) {
                return reject(new Error('Элемент не найден.'));
            }

            const dataObserver = new MutationObserver(() => {
                const newValue = dataElement.innerText.trim();
                if (newValue !== "" && newValue !== oldValue) {
                    dataObserver.disconnect();
                    saveDataToFile(newValue);
                    resolve(newValue);
                }
            });

            dataObserver.observe(dataElement, { characterData: true, childList: true, subtree: true });

            // Установка таймаута
            setTimeout(() => {
                dataObserver.disconnect();
                reject(new Error('Таймаут: данные не обновились.'));
            }, timeout);
        });
    }

    // Основная логика
    waitForModal('.Modal_modal__Pja4P')
        .then(async () => {
            const liElements = document.querySelectorAll('.UiRegionListBase_list__cH0fK li');

            let regionFound = false;
            for (let li of liElements) {
                const text = li.textContent.trim();
                if (text === region) {
                    li.click();
                    regionFound = true;
                    break;
                }
            }

            if (regionFound) {
                const regionElement = document.querySelector('.Region_region__6OUBn');
                const oldValue = regionElement ? regionElement.innerText.trim() : "";

                // Ожидаем обновления данных
                try {
                    const updatedData = await waitForDataUpdate('.Region_region__6OUBn', oldValue);
                    console.log(`Регион: ${region}`, updatedData);
                } catch (error) {
                    console.error(error.message);
                }
            } else {
                console.error(`Регион не найден.`);
            }
        })
        .catch(error => {
            console.log(error.message);
        });

    function saveDataToFile(data) {
        const blob = new Blob([data], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.txt'; 
        document.body.appendChild(a);
        a.click(); 
        document.body.removeChild(a); 
        URL.revokeObjectURL(url);
    }
    // Your code here...
})();

//Greasemonkey