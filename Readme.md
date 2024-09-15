## Стэк технологий <a name="technology_stack"></a>

- Backend: [Django](https://django.fun/) + [DRF](https://www.django-rest-framework.org/)
- Authentication: [PyJWT](https://pyjwt.readthedocs.io/en/stable/)
- Database: [PostgreSQL](https://www.postgresql.org/)
- Mapping: [Folium](https://python-visualization.github.io/folium/latest/index.html)
- Frontend: [ReactJS](https://react.dev/)
- UI Library: [Chakra UI](https://v2.chakra-ui.com/)
- State management: [Redux](https://redux.js.org/)

## Команды

- локально
```shell
docker compose up --build -d
```
- поиск расширений GDAL и GEOS
```shell
find /usr/lib/ -name "libgdal*"
find /usr/lib/ -name "libgeos*"
```

## Прочее

- .env.frontend.copy - жесткая ссылка на файл .env в папке фронтенд
- в целях упрощения регистрации пользователя, поскольку это не является обязательным в рамках тестового задания,
  убрана проверка пароля:
    - на мин.длину
    - на проверку слишком распространенного пароля
    - пароль состоит только из чисел
- страница не адаптивна
- в поля широты и долготы можно вводить только числа
- редактировать данные в textarea нельзя
- добавлена валидация:
  - для полей широты и долготы - максимум 5 знаков после запятой
  - для широты - значения от -90 до 90
  - для долготы - значения от -180 до 180
- кнопка сохранить разблокируется после добавления 1-ой точки