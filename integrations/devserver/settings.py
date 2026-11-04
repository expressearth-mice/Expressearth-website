"""Minimal Django project for developing and testing the integration in this repo.

Mirrors the ExpressEarth backend where it matters (Django 5.2, DRF + SimpleJWT
auth, UTC). Not used in production. Configuration comes from the environment,
optionally loaded from ``integrations/.env`` (gitignored; see .env.example).
"""
import os
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

try:
    from dotenv import load_dotenv
except ImportError:  # python-dotenv is optional; plain env vars work too
    load_dotenv = None
# Tests never see the real keys, so a test can't reach a live provider by accident.
RUNNING_TESTS = sys.argv[1:2] == ["test"]
if load_dotenv and not RUNNING_TESTS:
    load_dotenv(BASE_DIR.parent / ".env")

SECRET_KEY = os.getenv("DEVSERVER_SECRET_KEY", "dev-only-insecure-key")
DEBUG = os.getenv("DEBUG", "1").lower() in ("1", "true")
ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "localhost 127.0.0.1").split()

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "rest_framework_simplejwt",
    "integrations.apollo_smartlead",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "integrations.devserver.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# Postgres (like the backend) when DATABASE_HOST is set, otherwise a local SQLite file.
if os.getenv("DATABASE_HOST"):
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": os.getenv("DATABASE_NAME", "leadgen"),
            "USER": os.getenv("DATABASE_USER", "postgres"),
            "PASSWORD": os.getenv("DATABASE_PASSWORD", ""),
            "HOST": os.getenv("DATABASE_HOST"),
            "PORT": os.getenv("DATABASE_PORT", "5432"),
        }
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

# Same API auth as the backend.
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
}

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_TZ = True
STATIC_URL = "static/"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {"console": {"class": "logging.StreamHandler"}},
    "root": {"handlers": ["console"], "level": "INFO"},
}
