FROM python:3.10-alpine

RUN apk add --update --no-cache --virtual .tmp-build-deps \
        postgresql-dev gcc musl-dev gdal-dev \
        geos-dev proj-dev postgis libpq-dev python3-dev

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000