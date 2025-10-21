#!/bin/bash

# Comprehensive Test Runner for Intersul Backend
# This script runs all types of tests with proper setup and reporting

set -e

echo "🧪 Starting Comprehensive Test Suite for Intersul Backend"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    print_warning "node_modules not found. Installing dependencies..."
    npm install
fi

# Create coverage directory
mkdir -p coverage

print_status "Running Unit Tests..."
npm run test:unit
if [ $? -eq 0 ]; then
    print_success "Unit tests passed!"
else
    print_error "Unit tests failed!"
    exit 1
fi

echo ""

print_status "Running Integration Tests..."
npm run test:integration
if [ $? -eq 0 ]; then
    print_success "Integration tests passed!"
else
    print_error "Integration tests failed!"
    exit 1
fi

echo ""

print_status "Running End-to-End Tests..."
npm run test:e2e
if [ $? -eq 0 ]; then
    print_success "E2E tests passed!"
else
    print_error "E2E tests failed!"
    exit 1
fi

echo ""

print_status "Generating Coverage Report..."
npm run test:cov
if [ $? -eq 0 ]; then
    print_success "Coverage report generated!"
    print_status "Coverage report available at: coverage/lcov-report/index.html"
else
    print_error "Coverage generation failed!"
    exit 1
fi

echo ""
echo "🎉 All tests completed successfully!"
echo "=================================================="
echo "📊 Test Summary:"
echo "  ✅ Unit Tests: PASSED"
echo "  ✅ Integration Tests: PASSED"
echo "  ✅ End-to-End Tests: PASSED"
echo "  ✅ Coverage Report: GENERATED"
echo ""
echo "📁 Coverage report: coverage/lcov-report/index.html"
echo "📁 Coverage data: coverage/lcov.info"
echo ""
echo "🚀 Ready for production deployment!"
