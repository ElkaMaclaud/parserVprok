const regionIcon = document.querySelector('.Region_regionIcon__oZ0Rt');
regionIcon.click(); 
const region = "Санкт-Петербург и область"
let data = ""
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
      //await new Promise(resolve => setTimeout(resolve, 10000)); 

      const regionElement = document.querySelector('.Region_region__6OUBn');
      if (regionElement) {
        // fs.writeFile('data.txt', `Регион ${region}`);
        data = document.querySelector('.Region_region__6OUBn').innerText
        console.log(`Регион: ${region}`, data);
        saveDataToFile(data)
        // takeScreenshot();
        // return region; // Возвращаем выбранный регион
      } else {
        console.error(`Регион region не обновился на странице.`);
        // return null;
      }
    } else {
      console.error(`Регион region не найден.`);
      return null; 
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

  function takeScreenshot() {
    const element = document.querySelector('.Region_region__6OUBn'); // Замените на ваш селектор, если нужно
    
    html2canvas(element).then(canvas => {
        // Создаем изображение из canvas
        const imgData = canvas.toDataURL('image/png');
        
        // Создаем ссылку для скачивания
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'screenshot.png'; // Имя файла
        link.click(); // Имитируем клик для скачивания
    });
}


//   <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js"></script>
//   function takeScreenshot() {
//     const element = document.querySelector('#elementToCapture'); // Замените на ваш селектор
    
//     html2canvas(element).then(canvas => {
//       // Создаем изображение из canvas
//       const imgData = canvas.toDataURL('image/png');
      
//       // Создаем ссылку для скачивания
//       const link = document.createElement('a');
//       link.href = imgData;
//       link.download = 'screenshot.png'; // Имя файла
//       link.click(); // Имитируем клик для скачивания
//     });
//   }
// <button onclick="takeScreenshot()">Сделать скриншот</button>
// <div id="elementToCapture">
//   <!-- Содержимое, которое вы хотите захватить -->
// </div>

// const dataObserver = new MutationObserver((mutationsList, observer) => {
//   for (let mutation of mutationsList) {
//       if (mutation.type === 'childList') {
//           console.log('A child node has been added or removed.');
//       } else if (mutation.type === 'attributes') {
//           console.log('The ' + mutation.attributeName + ' attribute was modified.');
//       } else if (mutation.type === 'characterData') {
//           console.log('Character data has been modified.');
//       }
//   }
// });

// // Находим элемент span внутри .Region_regionIcon__oZ0Rt
// const targetNode = document.querySelector('.Region_region__6OUBn');
// if (targetNode) {
//   dataObserver.observe(targetNode, { 
//       childList: true, 
//       characterData: true, 
//       subtree: true 
//   });
//   console.log("Observer is set up.");
// } else {
//   console.log("Target node not found");
// }
