/**
 * Класс VK
 * Управляет изображениями из VK с помощью VK API.
 * */
class VK {
  static ACCESS_TOKEN = '958eb5d439726565e9333aa30e50e0f937ee432e927f0dbd541c541887d919a7c56f95c04217915c32008';
  static lastCallback;

  /**
   * Получает изображения
   * */
  static get(id = '', callback) {
    // Сохраняем callback для дальнейшей обработки
    this.lastCallback = callback;

    // Создаем элемент script для JSONP запроса
    const script = document.createElement('script');
    
    // Формируем URL запроса к VK API
    script.src = `https://api.vk.com/method/photos.get?owner_id=${id}&album_id=profile&access_token=${this.ACCESS_TOKEN}&v=5.131&callback=VK.processData`;
    
    // Добавляем скрипт в документ для выполнения запроса
    document.body.appendChild(script);
  }

  /**
   * Обработчик ответа от сервера VK
   */
  static processData(result) {
    // Находим и удаляем использованный script тег
    const script = document.querySelector('script[src*="photos.get"]');
    if (script) {
      script.remove();
    }

    // Проверяем на наличие ошибки
    if (result.error) {
      alert(`Error ${result.error.error_code}: ${result.error.error_msg}`);
      return;
    }

    // Получаем массив фотографий
    const photos = result.response.items;
    
    // Находим самые большие версии фотографий
    const largestPhotos = photos.map(photo => {
      const sizes = photo.sizes;
      return sizes.reduce((largest, current) => {
        return (current.width > largest.width) ? current : largest;
      });
    });

    // Вызываем сохраненный callback с полученными фотографиями
    this.lastCallback(largestPhotos.map(photo => photo.url));
    
    // Сбрасываем callback
    this.lastCallback = () => {};
  }
}