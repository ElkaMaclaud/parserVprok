async function captureScreen() {
    try {
        // Запрашиваем доступ к экрану
        const stream = await navigator.mediaDevices.getDisplayMedia({
            video: true
        });

        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();

        // Ждем, пока видео загрузится
        video.onloadedmetadata = () => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0);

            // Преобразуем canvas в изображение
            const imgData = canvas.toDataURL('image/png');

            // Создаем ссылку для скачивания изображения
            const link = document.createElement('a');
            link.href = imgData;
            link.download = 'screenshot.png';
            link.click();

            // Останавливаем поток
            stream.getTracks().forEach(track => track.stop());
        };
    } catch (err) {
        console.error("Ошибка при захвате экрана: ", err);
    }
}

// Вызов функции для захвата экрана
captureScreen();
