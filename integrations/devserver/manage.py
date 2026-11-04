#!/usr/bin/env python
"""Run the integration locally: ``python integrations/devserver/manage.py <command>``.

Dev/test only. In production the app is installed into the ExpressEarth Django
backend instead (see integrations/apollo_smartlead/README.md).
"""
import os
import sys
from pathlib import Path

# Repo root, so ``integrations.apollo_smartlead`` imports the same way it will
# inside the real backend.
sys.path.insert(0, str(Path(__file__).resolve().parents[2]))


def main():
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "integrations.devserver.settings")
    from django.core.management import execute_from_command_line

    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
