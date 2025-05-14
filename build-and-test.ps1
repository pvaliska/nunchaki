# Build and Test Script for Nunchaki Project

# Function to check if a command was successful
function Check-Command {
    param($Command)
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Command failed with exit code $LASTEXITCODE"
        exit 1
    }
}

# Print section header
function Print-Section {
    param($Title)
    Write-Host "`n=========================================" -ForegroundColor Cyan
    Write-Host $Title -ForegroundColor Cyan
    Write-Host "=========================================`n" -ForegroundColor Cyan
}

# Build and test frontend
Print-Section "Building Frontend"
Set-Location nunchaki-table-manager
npm install
Check-Command "npm install"
npm run build
Check-Command "npm run build"

Print-Section "Running Frontend Tests"
npm test
Check-Command "npm test"

Print-Section "Running Pact Tests"
npm run test:pact
Check-Command "npm run test:pact"

# Build and test backend
Print-Section "Building Backend"
Set-Location ../nunchaki-backend
mvn clean install
Check-Command "mvn clean install"

Print-Section "Running Backend Tests"
mvn test
Check-Command "mvn test"

# Return to root directory
Set-Location ..

Write-Host "`nBuild and test process completed successfully!" -ForegroundColor Green 