/**
 * Класс Yandex для управления облачным хранилищем
 */
class Yandex {
  static HOST = 'https://cloud-api.yandex.net/v1/disk';

  /**
   * Получение токена авторизации
   */
  static getToken() {
    const token = localStorage.getItem('yandex_token');
    if (token) {
      return token;
    }
    
    const newToken = prompt('Введите токен Яндекс.Диска:');
    if (newToken) {
      localStorage.setItem('yandex_token', newToken);
      return newToken;
    }
    return null;
  }

  /**
   * Загрузка файла в облако
   */
  static uploadFile(path, url, callback) {
    const token = this.getToken();
    createRequest({
      method: 'POST',
      url: `${this.HOST}/resources/upload`,
      headers: {
        'Authorization': `OAuth ${token}`
      },
      data: {
        path: path,
        url: url
      },
      callback: callback
    });
  }

  /**
   * Удаление файла из облака
   */
  static removeFile(path, callback) {
    const token = this.getToken();
    createRequest({
      method: 'DELETE',
      url: `${this.HOST}/resources`,
      headers: {
        'Authorization': `OAuth ${token}`
      },
      data: {
        path: path
      },
      callback: callback
    });
  }

  /**
   * Получение списка загруженных файлов
   */
  static getUploadedFiles(callback) {
    const token = this.getToken();
    createRequest({
      method: 'GET',
      url: `${this.HOST}/resources/files`,
      headers: {
        'Authorization': `OAuth ${token}`
      },
      callback: callback
    });
  }

  /**
   * Скачивание файла по URL
   */
  static downloadFileByUrl(url) {
    const link = document.createElement('a');
    link.href = url;
    link.click();
  }
}