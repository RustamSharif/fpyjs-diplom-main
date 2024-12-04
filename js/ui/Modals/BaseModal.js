class BaseModal {
  constructor(element) {
    // Сохраняем DOM элемент и семантик элемент
    this.element = element; // semantic элемент
    this.domElement = element[0]; // DOM элемент
  }

  /**
   * Открывает всплывающее окно
   */
  open() {
    this.element.modal('show');
  }

  /**
   * Закрывает всплывающее окно
   */
  close() {
    this.element.modal('hide');
  }
}