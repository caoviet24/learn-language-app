#!/bin/bash

# Build script for LearnLanguage application
set -e

echo "🚀 Starting build process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .NET is installed
if ! command -v dotnet &> /dev/null; then
    print_error ".NET is not installed or not in PATH"
    exit 1
fi

print_status "Using .NET version: $(dotnet --version)"

# Clean previous builds
print_status "Cleaning previous builds..."
dotnet clean

# Restore dependencies
print_status "Restoring NuGet packages..."
dotnet restore

# Build the solution
print_status "Building solution..."
dotnet build --no-restore --configuration Release

# Run tests
print_status "Running tests..."
dotnet test --no-build --configuration Release --verbosity normal

# Check code formatting
print_status "Checking code formatting..."
if dotnet format --verify-no-changes --verbosity normal; then
    print_status "Code formatting is correct"
else
    print_warning "Code formatting issues found. Run 'dotnet format' to fix them."
fi

# Security scan
print_status "Running security scan..."
dotnet list package --vulnerable --include-transitive || print_warning "Some packages may have vulnerabilities"

print_status "✅ Build completed successfully!"