# Тестовое задание

Создать api приложение на Django с использованием DRF для отрисовки полигонов на карте
<hr>

## Содержание

1. [Требования](#main_requirements)
2. [Стек технологий](#technology_stack)
3. [Требования к проекту со стороны фронтенда](#front_requirements)
4. [Документация по API](#doc_api)
5. [Инструкция по запуску проекта](#instruction_startup)
6. [Страницы приложения](#pages_app)
7. [Особенности](#features)

## Требования <a name="main_requirements"></a>

- Основная функциональность:
  - Web страничка с формой (название, полигон). Например, это можно сделать в виде 2 полей (широта долгота в десятичных 
    градусах) по нажатию на кнопку «Добавить» данные этих полей попадают в поле textarea и поле название полигона.
  - По нажатию на кнопку «Submit» данные формы отправляются на сервер и сохраняются в БД в виде PolygonField
  - Web-табличка в которой есть все сохраненные объекты (Колонки: Название, Полигон в виде списка координат,
    признак пересечения антимеридиана (True/False)). Этот признак можно хранить в БД отдельным полем. Также учесть 
    такую возможность что координаты могут пересекать антимеридиан.
  - С помощью Django REST framework создать несколько endpoint для запросов на удаление, добавление, просмотр и редактирование.
- Дополнительная функциональность:
  - развернуть в Docker
  - использовать gunicorn/daphne для эмуляции развертывания в рабочей среде
  - использовать pgAdmin для визуального отображения PostgreSQL
  - составить мануал для разработчика
  - реализовать отображение полигонов на leaflet.js (или его оболочку для Python - Folium)

## Стэк технологий <a name="technology_stack"></a>

- Backend: [Django](https://django.fun/) + [DRF](https://www.django-rest-framework.org/)
- Authentication: [PyJWT](https://pyjwt.readthedocs.io/en/stable/)
- Database: [PostgreSQL](https://www.postgresql.org/)
- Async: [Celery](https://docs.celeryq.dev/)
- Message broker, caching: [Redis](https://redis.io/)
- Mapping: [Folium](https://python-visualization.github.io/folium/latest/index.html)
- Frontend: [ReactJS](https://react.dev/)
- UI Library: [Chakra UI](https://v2.chakra-ui.com/)
- Testing: [Django Test Framework](https://docs.djangoproject.com/en/5.1/topics/testing/tools/#)

## Требования к проекту со стороны фронтенда <a name="front_requirements"></a>

- NodeJS v20.17.0
- NPM v10.8.2

## Документация по API <a name="doc_api"></a>

- Swagger: http://localhost:8000/swagger/
- Redoc: http://localhost:8000/redoc/

## Инструкция по запуску проекта <a name="instruction_startup"></a>

1. Клонируйте репозиторий
```
git clone https://github.com/VitaliyKozhushko/airspace_restriction_zones.git
```
2. Настройте .env файл:
   - для бэка: в корне репозитория
     - для опр. путей GDAL и GEOS библиотек и выбрать путь к файлам с расширением *.so
       ```shell
        find /usr/lib/ -name "libgdal*"
        find /usr/lib/ -name "libgeos*"
       ```
   - также для бэка создать .env.backend.docker для работы с docker
   - для фронта: в папке frontend/
3. Запустите проект:
   * (суперпользователь будет автоматически создан - login: admin, password - admin)
   - либо в ручном режиме:
        - перейти в папку backend (предварительно активировать виртуальное окружение)
          ```shell
          pip install -r requirements.txt
          python manage.py collectstatic
          python manage.py makemigrations
          python manage.py migrate
          python create_superuser.py
          python manage.py runserver
          celery -A airspace_restriction_zones worker --loglevel=info
          ```
        - перейти в папку frontend
          ```shell
          npm start
          ```
   - либо с помощью docker (в корне репозитория, на уровне docker-compose.yml)
     ```shell
     docker compose up --build -d
     ```
     - после сборки и запуска контейнеров, проверить установку PostGIS
       ```shell
       docker-compose exec db psql -U user_db -d db_name
       ```
     - проверить версию PostGIS
       ```shell
       SELECT PostGIS_Version();
       ```
     - если расширение не установлено, выполнить команду для его создания:
       ```shell
       CREATE EXTENSION postgis;
       ```
     - запустить pgAdmin, вырать "Add New Server"
       - во вкладке "General" в поле "Name" укзать любое название
       - во вкладке "Connection":
         - Host name: host.docker.internal
         - Port:5432
         - Username: ${USER_DB} (значение из .env)
         - Password: ${PASSWD_DB} (значение из .env)
     
4. Доступность:
   - админка: http://localhost:8000/admin
   - фронтенд: http://localhost:3000

## Страницы приложения <a name="pages_app"></a>

- Главная - карта с полигонами (при их наличии)
- Список полигонов - таблица со списком полигоном и возсожностью их редактирования и удаления
- Создание полигона - форма для создания полигонов

## Особенности <a name="features"></a>

- страницы не адаптивны
- форма создания полигона:
  - в целях упрощения регистрации пользователя убрана проверка пароля:
      - на мин.длину
      - на проверку слишком распространенного пароля
      - пароль состоит только из чисел
  - в поля широты и долготы можно вводить только числа
  - редактировать данные в textarea нельзя
  - добавлена валидация широты и долготы:
    - кол-во знаков после запятой не больше 9
    - для широты - значения от -90 до 90
    - для долготы - значения от -180 до 180
  - кнопка сохранить разблокируется после добавления мин. 3-х точек
- расчет признака пересечения координат и опр. координат, пересекающих антимеридиан: Celery + Redis 
- в админке доступен просмотр списка полигонов, без возможности редактирования и создания
- координаты, пересекающие антимеридиан, выделяются красным
- редактировать можно название и координаты прямо в таблице
- при редактировании координат, валидации данных нет
- выделение полигона на карте:
  - обычный: синий
  - пересекающий антимеридиан: красный, делится на 2 части
- список полигонов кэшируется на 15 минут
- создан тест для проверки создания полигона с пересечением / без пересечения антимеридиана
