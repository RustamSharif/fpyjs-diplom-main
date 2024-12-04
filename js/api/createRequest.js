/**
 * Основная функция для совершения запросов по Yandex API.
 * */
const createRequest = (options = {}) => {
  const xhr = new XMLHttpRequest();
  xhr.responseType = 'json';

  // Формируем URL с параметрами если есть data
  let url = options.url;
  if (options.data) {
    const params = new URLSearchParams(options.data);
    url += '?' + params.toString();
  }

  try {
    xhr.open(options.method, url);

    // Устанавливаем заголовки
    if (options.headers) {
      Object.keys(options.headers).forEach(key => {
        xhr.setRequestHeader(key, options.headers[key]);
      });
    }

    // Обработка ответа
    xhr.onload = function() {
      if (options.callback) {
        options.callback(null, xhr.response);
      }
    };

    // Обработка ошибки
    xhr.onerror = function() {
      if (options.callback) {
        options.callback(new Error('Network Error'));
      }
    };

    // Отправляем запрос
    xhr.send();

  } catch (err) {
    console.error(err);
    if (options.callback) {
      options.callback(err);
    }
  }
};