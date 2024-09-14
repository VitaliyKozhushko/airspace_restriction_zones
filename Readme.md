## Стэк технологий <a name="technology_stack"></a>

- Backend: [Django](https://django.fun/) + [DRF](https://www.django-rest-framework.org/)
- Authentication: [PyJWT](https://pyjwt.readthedocs.io/en/stable/)
- Database: [PostgreSQL](https://www.postgresql.org/)
- Mapping: [Folium](https://python-visualization.github.io/folium/latest/index.html)
- Frontend: [ReactJS](https://react.dev/)
- UI Library: [Chakra UI](https://v2.chakra-ui.com/)
- State management: [Redux](https://redux.js.org/)

## Запуск

- локально
```shell
docker compose up --build -d
```

## Прочее

- .env.frontend.copy - жесткая ссылка на файл .env в папке фронтенд
- в целях упрощения регистрации пользователя, поскольку это не является обязательным в рамках тестового задания,
  убрана проверка пароля:
    - на мин.длину
    - на проверку слишком распространенного пароля
    - пароль состоит только из чисел