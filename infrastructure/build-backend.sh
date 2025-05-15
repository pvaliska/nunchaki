#!/bin/bash

# Check if version argument is provided
if [ -z "$1" ]; then
    echo "Error: Version argument is required"
    echo "Usage: $0 <version>"
    exit 1
fi

# Define variables
VERSION=$1
IMAGE_NAME="nunchaki-backend"
FULL_IMAGE_NAME="${IMAGE_NAME}:${VERSION}"
LATEST_TAG="${IMAGE_NAME}:latest"

# Build the image
echo "Building backend image..."
docker build -t ${FULL_IMAGE_NAME} -t ${LATEST_TAG} ../nunchaki-backend

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Backend image build completed successfully!"
    echo "Image: ${FULL_IMAGE_NAME}"
    echo "Latest: ${LATEST_TAG}"
else
    echo "❌ Backend image build failed!"
    exit 1
fi 