#!/bin/bash

# Function to print section headers
print_section() {
    echo -e "\n========================================="
    echo "$1"
    echo "=========================================\n"
}

# Function to check if a command succeeded
check_status() {
    if [ $? -eq 0 ]; then
        echo "✅ $1 completed successfully"
    else
        echo "❌ $1 failed"
        exit 1
    fi
}

# Build and test frontend
print_section "Building Frontend"
cd nunchaki-table-manager
npm install
npm run build
check_status "Frontend build"

print_section "Running Frontend Tests"
npm test -- --watch=false
check_status "Frontend tests"

# Run Pact tests
print_section "Running Pact Tests"
npm run pact:test
check_status "Pact tests"

# Return to root directory
cd ..

# Build and test backend
print_section "Building Backend"
cd nunchaki-backend
mvn clean install
check_status "Backend build"

# Return to root directory
cd ..

echo -e "\nBuild and test process completed successfully!" 