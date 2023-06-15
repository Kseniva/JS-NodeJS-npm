// находим элементы разметки и записываем их в переменные
const block = document.querySelector('.block');
const output = document.querySelector('.output');
const select = document.querySelector('.select');
const input = document.querySelector('.input');


// создаем кнопку
const button = document.createElement('button');
button.classList.add('button');
button.textContent = 'Вперёд!'
block.append(button);

// создаем функцию для определения категории, выбранной пользователем,
// чтобы в дальнейшем название категории добавлялось в шаблонную строку
// для отправки запроса на сервер
const getCategory = () => {
  if (select.value === "people") {
    return "people";
  }
  if (select.value === "planets") {
    return "planets";
  }
  if (select.value === "films") {
    return "films";
  }
};


// создаем функцию displayData
// создаем разметку и записываем ее в переменную name
// для выведения результата поиска и перебираем элементы в массиве
const displayData = (data, category) => {
  if (data.result) {
    data.result.forEach((item) => {
      const name = document.createElement('p');
      name.classList.add('result');
      name.textContent = item.name;
      output.appendChild(name);
    });

  // при выборе пользователем категории "People" - в переменную записывается имя героя
  // при выборе категории "Planets" - название планеты, "Films" - название фильма
  } else {
    const name = document.createElement('p');
    if (category === 'people') {
      name.textContent = data.name;
    } else if (category === 'planets') {
      name.textContent = data.name;
    } else if (category === 'films') {
      name.textContent = data.title;
    }
    output.appendChild(name);
  }
};
// создаем функцию для очищения контейнера перед выведением нового результата
const clear = () => {
  output.innerHTML = '';
};

// добавляем контейнер для выведения ошибки
const error = document.createElement('p');
error.classList.add('error');


// добавляем обработчик события нажатия на кнопку
button.addEventListener('click', () => {
  clear(); // очищаем контейнер перед выведением нового результата
  const loader = document.createElement('div'); // добавляем лоадер перед появлением результата
  loader.classList.add('loader');
  output.appendChild(loader);
  const category = getCategory();
  const number = input.value;
  if (!number) {
    output.innerHTML = 'Please, enter the number'; // выводим данное сообщение, если пользователь не ввел число в инпут
    return;
  }
  // формируем fetch-запрос для получения данных от API
  fetch(`https://swapi.dev/api/${category}/${number}/`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("404 Not Found"); // генерируем ошибку об отсутствии значения в базе
      }
      return response.json();
    })
    .then((data) => {
      displayData(data, category);
      loader.remove(); // убираем лоадер при появлении результата
    })
    // При появлении ошибки выводим сообщение для пользователя
    .catch((err) => {
      console.log('Error' + err);
      if (err.message === "404 Not Found") {
        error.textContent = "Not Found. Please try entering a different number";
      } else {
        error.textContent = "Oops... Something went wrong. Please try again later.";
      }
      loader.remove(); // убираем лоадер при появлении сообщения об ошибке
      output.appendChild(error);
    });
});