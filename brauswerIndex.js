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
    let isExecuted = false;
  
    if (isExecuted) return;
    isExecuted = true;
  
    const regionIcon = document.querySelector('.Region_regionIcon__oZ0Rt');
    if (regionIcon) {
        regionIcon.click();
    } else {
        console.error('Иконка региона не найдена.');
        return;
    }
  
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
  
            // Установка таймаута
            setTimeout(() => {
                observer.disconnect();
                reject(new Error('Таймаут: элементы региона не появились.'));
            }, timeout);
        });
    }
  
    waitForModal('.Modal_modal__Pja4P')
        .then(async () => {
            // Ожидаем появления элементов региона
            try {
                const liElements = await waitForRegionElements('.UiRegionListBase_list__cH0fK li');
                let regionFound = false;
                for (let li of liElements) {
                    const text = li.textContent.trim();
                    if (text === region) {
                        li.click();
                        regionFound = true;
                        console.log(`Регион "${region}" выбран.`);
                        break;
                    }
                }
                if (regionFound) {
                    const regionElement = document.querySelector('.Region_region__6OUBn');
                    const oldValue = regionElement ? regionElement.innerText.trim() : "";
  
                    try {
                        const updatedData = document.querySelector('.Region_region__6OUBn').innerText.trim()
                        console.log(`Регион: ${region}`, updatedData);
                        if (sessionStorage.getItem('pageReloaded')) {
                            saveDataToFile(updatedData);
                           sessionStorage.removeItem('pageReloaded');}else {
                               console.log('Первая загрузка страницы.');
                               sessionStorage.setItem('pageReloaded', 'true');
                           }
                    } catch (error) {
                        console.error(error.message);
                    }
                } else {
                    console.log(`Регион не найден.`);
                    console.error(`Регион не найден.`);
                }
            } catch (error) {
                console.error(error.message);
            }
        })
        .catch(error => {
            console.error(error.message);
        });
  
    function saveDataToFile(data) {
        console.log(`Сохранение данных: ${data}`); // Отладочное сообщение
        const blob = new Blob([data], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.txt';
        document.body.appendChild(a);
        setTimeout(() => {
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100); // Задержка в 100 мс
    }
  })();
  