# Django API. GDAL and GEOS are required by django.contrib.gis (PostGIS support).
FROM python:3.12-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

RUN apt-get update \
 && apt-get install -y --no-install-recommends gdal-bin libgdal-dev libgeos-dev libproj-dev \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Dev builds pass REQUIREMENTS=dev.txt. Production images keep the default.
ARG REQUIREMENTS=prod.txt
COPY requirements/ requirements/
RUN pip install -r requirements/${REQUIREMENTS}

COPY . .

RUN useradd --create-home --uid 10001 app \
 && mkdir -p /app/media /app/staticfiles \
 && chown -R app:app /app/media /app/staticfiles
USER app

EXPOSE 8000
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3", "--access-logfile", "-"]
