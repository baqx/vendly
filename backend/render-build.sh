#!/usr/bin/env bash
# exit on error
set -o errexit

# Install python dependencies
pip install -r requirements.txt

# Generate Prisma Client
prisma generate

# Explicitly fetch Prisma binaries
prisma py fetch

echo "Listing Prisma cache content for debugging:"
ls -R /opt/render/.cache/prisma-python || echo "Cache not found"

# Move the binary to the project root (backend/) so it's bundled in the deployment
# Render expects it at: /opt/render/project/src/backend/prisma-query-engine-debian-openssl-3.0.x
# We search for any file containing 'query-engine' and copy it to the root with the exact name the app expects.
find /opt/render/.cache/prisma-python -type f -name "*query-engine*" -exec cp {} ./prisma-query-engine-debian-openssl-3.0.x \;

# Ensure the binary is executable
if [ -f "./prisma-query-engine-debian-openssl-3.0.x" ]; then
    chmod +x ./prisma-query-engine-debian-openssl-3.0.x
    echo "Prisma binary bundled successfully: $(ls -l prisma-query-engine-debian-openssl-3.0.x)"
else
    echo "ERROR: Prisma query engine binary not found in cache!"
    exit 1
fi
