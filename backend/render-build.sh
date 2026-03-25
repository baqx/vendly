#!/usr/bin/env bash
# exit on error
set -o errexit

# Install python dependencies
pip install -r requirements.txt

# Generate Prisma Client
prisma generate

# Explicitly fetch Prisma binaries
prisma py fetch

# Move the binary to the project root (backend/) so it's bundled in the deployment
# Render expects it at: /opt/render/project/src/backend/prisma-query-engine-debian-openssl-3.0.x
# We find the one we just fetched in the cache and move it here.
find /opt/render/.cache/prisma-python -name "prisma-query-engine-*" -exec cp {} ./prisma-query-engine-debian-openssl-3.0.x \;

# Ensure the binary is executable
chmod +x ./prisma-query-engine-debian-openssl-3.0.x

echo "Prisma binary bundled successfully: $(ls -l prisma-query-engine-debian-openssl-3.0.x)"
