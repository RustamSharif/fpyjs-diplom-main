
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

  /**
   * Метод для отрисовки изображений
   * @param {Array} images - массив объектов с данными изображений
   */
  static drawImages(images) {
    if (!images || !images.length) {
      console.warn('No images to display');
      return;
    }
    
    // Обработка и отображение изображений
    const processedImages = images.map(image => ({
      ...image,
      displayUrl: image.url,
      displayDate: new Date(image.date).toLocaleDateString(),
      displayLikes: `${image.likes} likes`
    }));
    
    // Передача обработанных данных в callback
    this.lastCallback(processedImages);
  }


  static get(id = '', callback) {
    this.lastCallback = callback;
    const script = document.createElement('script');
    script.src = `https://api.vk.com/method/photos.get?owner_id=${id}&album_id=profile&access_token=${this.ACCESS_TOKEN}&v=5.131&callback=VK.processData`;
    document.body.appendChild(script);
  }

  /**
   * Обработчик ответа от сервера VK
   */
  static processData(result) {
    const script = document.querySelector('script[src*="photos.get"]');
    if (script) {
      script.remove();
    }

    if (result.error) {
      alert(`Error ${result.error.error_code}: ${result.error.error_msg}`);
      return;
    }

    if (result && result.response && result.response.items) {
      const images = result.response.items.map(item => {
        if (!item.sizes || !item.sizes.length) return null;
        const largestSize = item.sizes.reduce((a, b) => (a.width > b.width) ? a : b);
        return {
          url: largestSize.url,
          likes: item.likes ? item.likes.count : 0,
          date: new Date(item.date * 1000).toLocaleDateString()
        };
      }).filter(img => img !== null);
      
      if (this.drawImages) {
        this.drawImages(images);
      } else {
        console.warn("drawImages method not found. Using default callback");
        this.lastCallback(images);
      }
    } else {
      console.error("Unexpected response format:", result);
    }
    this.lastCallback = () => {};
  }
}
