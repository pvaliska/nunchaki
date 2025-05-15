#!/bin/bash

# Check if we're in the correct directory
if [ ! -f "main.tf" ]; then
    echo "Error: main.tf not found. Please run this script from the infrastructure directory."
    exit 1
fi

# Initialize Terraform if needed
if [ ! -d ".terraform" ]; then
    echo "Initializing Terraform..."
    terraform init
    if [ $? -ne 0 ]; then
        echo "❌ Terraform initialization failed!"
        exit 1
    fi
fi

# Plan the changes
echo "Planning Terraform changes..."
terraform plan -out=tfplan
if [ $? -ne 0 ]; then
    echo "❌ Terraform plan failed!"
    exit 1
fi

# Apply the changes
echo "Applying Terraform changes..."
terraform apply tfplan
if [ $? -eq 0 ]; then
    echo "✅ Terraform apply completed successfully!"
else
    echo "❌ Terraform apply failed!"
    exit 1
fi 