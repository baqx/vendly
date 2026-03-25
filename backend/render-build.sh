#!/usr/bin/env bash
# exit on error
set -o errexit

# Install python dependencies
pip install -r requirements.txt

# Generate Prisma Client
prisma generate

# Explicitly fetch Prisma binaries (required for some Render environments)
prisma py fetch
