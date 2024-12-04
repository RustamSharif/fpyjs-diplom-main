class SearchBlock {
  constructor(element) {
    this.element = element;
    this.registerEvents();
  }

  registerEvents() {
    // Обработка кликов по кнопкам
    this.element.addEventListener('click', (e) => {
      // Получаем поле ввода ID
      const input = this.element.querySelector('input');
      
      // Проверяем что поле не пустое
      if (!input.value.trim()) {
        return;
      }

      // Если клик по кнопке "Заменить"
      if (e.target.classList.contains('replace')) {
        // Получаем изображения и очищаем текущие
        VK.get(input.value, (images) => {
          App.imageViewer.clear();
          App.imageViewer.drawImages(images);
        });
      }
      
      // Если клик по кнопке "Добавить" 
      if (e.target.classList.contains('add')) {
        // Получаем изображения и добавляем к текущим
        VK.get(input.value, (images) => {
          App.imageViewer.drawImages(images);
        });
      }
    });
  }
}