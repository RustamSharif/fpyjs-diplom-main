class FileUploaderModal extends BaseModal {
  constructor(element) {
    super(element); // Вызываем конструктор родителя
    this.registerEvents();
    this.imageContainers = this.domElement.getElementsByClassName('image-preview-container');
  }

  registerEvents() {
    // Закрытие по крестику
    this.domElement.querySelector('.close').addEventListener('click', () => this.close());
    
    // Закрытие по кнопке "Закрыть"
    this.domElement.querySelector('.ui.button.close').addEventListener('click', () => this.close());
    
    // Отправка всех файлов
    this.domElement.querySelector('.ui.button.send-all').addEventListener('click', () => this.sendAllImages());
    
    // Обработка кликов в контенте
    this.domElement.querySelector('.content').addEventListener('click', (e) => {
      // Если клик по полю ввода - убираем ошибку
      if (e.target.classList.contains('input')) {
        e.target.classList.remove('error');
      }
      
      // Если клик по кнопке отправки - отправляем изображение
      if (e.target.closest('button') && !e.target.closest('button').classList.contains('close')) {
        const container = e.target.closest('.image-preview-container');
        this.sendImage(container);
      }
    });
  }

  showImages(images) {
    const content = this.domElement.querySelector('.content');
    content.innerHTML = images
      .reverse()
      .map(image => this.getImageHTML(image))
      .join('');
  }

  getImageHTML(item) {
    return `
      <div class="image-preview-container">
        <img src='${item}' />
        <div class="ui action input">
          <input type="text" placeholder="Путь к файлу">
          <button class="ui button">
            <i class="upload icon"></i>
          </button>
        </div>
      </div>
    `;
  }

  sendAllImages() {
    Array.from(this.imageContainers).forEach(container => {
      this.sendImage(container);
    });
  }

  sendImage(imageContainer) {
    const input = imageContainer.querySelector('input');
    const inputBlock = imageContainer.querySelector('.input');
    const path = input.value.trim();

    // Валидация пути
    if (!path) {
      inputBlock.classList.add('error');
      return;
    }

    // Блокируем поле ввода
    inputBlock.classList.add('disabled');

    // Получаем путь изображения
    const imageSrc = imageContainer.querySelector('img').getAttribute('src');

    // Отправляем файл
    Yandex.uploadFile(path, imageSrc, () => {
      // Удаляем контейнер после успешной загрузки
      imageContainer.remove();
      
      // Если не осталось изображений - закрываем окно
      if (this.imageContainers.length === 0) {
        this.close();
      }
    });
  }
}