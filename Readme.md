## Стэк технологий <a name="technology_stack"></a>

- Backend: [Django](https://django.fun/) + [DRF](https://www.django-rest-framework.org/)
- Authentication: [PyJWT](https://pyjwt.readthedocs.io/en/stable/)
- Database: [PostgreSQL](https://www.postgresql.org/)
- Асинхронность: [Celery](https://docs.celeryq.dev/)
- Брокер сообщений: [Redis](https://redis.io/)
- Mapping: [Folium](https://python-visualization.github.io/folium/latest/index.html)
- Frontend: [ReactJS](https://react.dev/)
- UI Library: [Chakra UI](https://v2.chakra-ui.com/)
- State management: [Redux](https://redux.js.org/)
- Testing: [Django Test Framework](https://docs.djangoproject.com/en/5.1/topics/testing/tools/#)

## Команды

- локально
```shell
docker compose up --build -d
celery -A airspace_restriction_zones worker --loglevel=info
```
- поиск расширений GDAL и GEOS
```shell
find /usr/lib/ -name "libgdal*"
find /usr/lib/ -name "libgeos*"
```

## Прочее

- в целях упрощения регистрации пользователя, поскольку это не является обязательным в рамках тестового задания,
  убрана проверка пароля:
    - на мин.длину
    - на проверку слишком распространенного пароля
    - пароль состоит только из чисел
- страница не адаптивна
- в поля широты и долготы можно вводить только числа
- редактировать данные в textarea нельзя
- добавлена валидация:
  - кол-во знаков после запятой не больше 9
  - для широты - значения от -90 до 90
  - для долготы - значения от -180 до 180
- кнопка сохранить разблокируется после добавления мин. 3-х точек
- расчет признака пересечения координат и опр. координат, пересекающие антимеридиан, исп. Celery + Redis 
- в админке доступен просмотр списка полигонов, без возможности редактирования и создания
- координаты, пересекающие антимеридиан, выделяются красным
- редактировать можно название и координаты прямо в таблице
- при редактировании координат, валидации данных нет
- обычный полигон выделяется синим
- если полигон пересекает антимеридиан, то он разделяется на 2 части и выделяется красным
- список полигонов кэшируется на 15 минут
- создан тест для проверки создания полигона с пересечением / без пересечения антимеридиана