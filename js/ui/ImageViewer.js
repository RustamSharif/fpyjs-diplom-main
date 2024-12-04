class ImageViewer {
  constructor(element) {
    this.element = element;
    this.previewBlock = element.querySelector('.image-preview');
    this.imagesList = element.querySelector('.images-list .grid .row');
    this.registerEvents();
  }

  registerEvents() {
    // Обработка двойного клика для предпросмотра
    this.imagesList.addEventListener('dblclick', (e) => {
      if (e.target.tagName === 'IMG') {
        this.previewBlock.innerHTML = `<img src="${e.target.src}" />`;
      }
    });

    // Обработка одиночного клика для выделения
    this.imagesList.addEventListener('click', (e) => {
      if (e.target.tagName === 'IMG') {
        e.target.classList.toggle('selected');
        this.checkButtonText();
      }
    });

    // Кнопка "Выбрать все/Снять выделение"
    this.element.querySelector('.select-all').addEventListener('click', () => {
      const images = this.imagesList.querySelectorAll('img');
      const hasSelected = Array.from(images).some(img => img.classList.contains('selected'));
      
      images.forEach(img => {
        if (hasSelected) {
          img.classList.remove('selected');
        } else {
          img.classList.add('selected');
        }
      });
      
      this.checkButtonText();
    });

    // Кнопка "Посмотреть загруженные файлы"
    this.element.querySelector('.view-files').addEventListener('click', () => {
      const modal = App.getModal('filePreviewer');
      modal.setContent('<i class="asterisk loading icon massive"></i>');
      modal.open();
      
      Yandex.getUploadedFiles((files) => {
        modal.showImages(files);
      });
    });

    // Кнопка "Отправить на диск"
    this.element.querySelector('.send').addEventListener('click', () => {
      const modal = App.getModal('fileUploader');
      const selectedImages = Array.from(this.imagesList.querySelectorAll('img.selected'));
      modal.open();
      modal.showImages(selectedImages);
    });
  }

  clear() {
    this.imagesList.innerHTML = '';
  }

  drawImages(images) {
    if (images && images.length > 0) {
      this.element.querySelector('.select-all').classList.remove('disabled');
    } else {
      this.element.querySelector('.select-all').classList.add('disabled');
    }

    const imagesHTML = images.map(image => 
      `<div class='four wide column ui medium image-wrapper'>
        <img src='${image}' />
      </div>`
    ).join('');

    this.imagesList.innerHTML += imagesHTML;
  }

  checkButtonText() {
    const images = this.imagesList.querySelectorAll('img');
    const selectAllBtn = this.element.querySelector('.select-all');
    const sendBtn = this.element.querySelector('.send');
    
    const allSelected = Array.from(images).every(img => 
      img.classList.contains('selected')
    );
    
    const anySelected = Array.from(images).some(img => 
      img.classList.contains('selected')
    );

    selectAllBtn.textContent = allSelected ? "Снять выделение" : "Выбрать всё";
    
    if (anySelected) {
      sendBtn.classList.remove('disabled');
    } else {
      sendBtn.classList.add('disabled');
    }
  }
}