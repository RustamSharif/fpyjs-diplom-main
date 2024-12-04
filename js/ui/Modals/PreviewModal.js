class PreviewModal extends BaseModal {
  constructor(element) {
    super(element); // Вызываем конструктор родителя
    this.registerEvents();
  }

  registerEvents() {
    // Закрытие по крестику
    this.domElement.querySelector('.close').addEventListener('click', () => this.close());
    
    // Обработка кликов в контенте
    this.domElement.querySelector('.content').addEventListener('click', (e) => {
      // Если клик по кнопке удаления
      if (e.target.closest('.delete')) {
        const button = e.target.closest('.delete');
        const icon = button.querySelector('i');
        
        // Меняем иконку на спиннер
        icon.className = 'icon spinner loading';
        // Блокируем кнопку
        button.classList.add('disabled');
        
        // Отправляем запрос на удаление
        Yandex.removeFile(button.dataset.path, (response) => {
          if (response === null) {
            // Если успешно - удаляем контейнер
            button.closest('.image-preview-container').remove();
          }
        });
      }
      
      // Если клик по кнопке скачивания
      if (e.target.closest('.download')) {
        const button = e.target.closest('.download');
        Yandex.downloadFileByUrl(button.dataset.file);
      }
    });
  }

  showImages(data) {
    const content = this.domElement.querySelector('.content');
    content.innerHTML = data
      .reverse()
      .map(item => this.getImageInfo(item))
      .join('');
  }

  formatDate(date) {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    const dateObj = new Date(date);
    return dateObj.toLocaleString('ru-RU', options).replace('г.,', 'г. в');
  }

  getImageInfo(item) {
    return `
      <div class="image-preview-container">
        <img src='${item.preview}' />
        <table class="ui celled table">
          <thead>
            <tr>
              <th>Имя</th>
              <th>Создано</th>
              <th>Размер</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${item.name}</td>
              <td>${this.formatDate(item.created)}</td>
              <td>${Math.round(item.size/1024)}Кб</td>
            </tr>
          </tbody>
        </table>
        <div class="buttons-wrapper">
          <button class="ui labeled icon red basic button delete" data-path='${item.path}'>
            Удалить
            <i class="trash icon"></i>
          </button>
          <button class="ui labeled icon violet basic button download" data-file='${item.file}'>
            Скачать
            <i class="download icon"></i>
          </button>
        </div>
      </div>
    `;
  }
}