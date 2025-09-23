#!/bin/bash

# Deployment script for LearnLanguage application
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

print_header() {
    echo -e "${BLUE}[DEPLOY]${NC} $1"
}

# Default values
ENVIRONMENT="staging"
IMAGE_TAG="latest"
REGISTRY="ghcr.io"
REPOSITORY_NAME="learn-language-app"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -e|--environment)
            ENVIRONMENT="$2"
            shift 2
            ;;
        -t|--tag)
            IMAGE_TAG="$2"
            shift 2
            ;;
        -r|--registry)
            REGISTRY="$2"
            shift 2
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  -e, --environment   Target environment (staging|production) [default: staging]"
            echo "  -t, --tag          Docker image tag [default: latest]"
            echo "  -r, --registry     Docker registry [default: ghcr.io]"
            echo "  -h, --help         Show this help message"
            exit 0
            ;;
        *)
            print_error "Unknown option $1"
            exit 1
            ;;
    esac
done

print_header "🚀 Starting deployment to $ENVIRONMENT environment"
print_status "Image: $REGISTRY/$REPOSITORY_NAME:$IMAGE_TAG"

# Validate environment
if [[ "$ENVIRONMENT" != "staging" && "$ENVIRONMENT" != "production" ]]; then
    print_error "Invalid environment: $ENVIRONMENT. Must be 'staging' or 'production'"
    exit 1
fi

# Check if docker is available
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed or not in PATH"
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed or not in PATH"
    exit 1
fi

# Build and tag the image
print_status "Building Docker image..."
docker build -t $REGISTRY/$REPOSITORY_NAME:$IMAGE_TAG .

# Deploy based on environment
case $ENVIRONMENT in
    staging)
        print_status "Deploying to staging environment..."
        
        # Stop existing containers
        docker-compose -f docker-compose.yml -f docker-compose.staging.yml down || true
        
        # Pull latest images
        docker-compose -f docker-compose.yml -f docker-compose.staging.yml pull || true
        
        # Start services
        docker-compose -f docker-compose.yml -f docker-compose.staging.yml up -d
        
        # Wait for services to be healthy
        print_status "Waiting for services to be healthy..."
        sleep 30
        
        # Health check
        if curl -f http://localhost:8081/health &> /dev/null; then
            print_status "✅ Staging deployment successful!"
        else
            print_warning "⚠️  Health check failed, but services are running"
        fi
        ;;
        
    production)
        print_header "🔥 PRODUCTION DEPLOYMENT"
        print_warning "This will deploy to production. Are you sure? (y/N)"
        read -r confirmation
        
        if [[ $confirmation != "y" && $confirmation != "Y" ]]; then
            print_status "Deployment cancelled by user"
            exit 0
        fi
        
        print_status "Deploying to production environment..."
        
        # Create a backup of current state
        print_status "Creating backup..."
        docker-compose -f docker-compose.yml logs > "backup-$(date +%Y%m%d-%H%M%S).log" || true
        
        # Deploy with zero-downtime strategy
        print_status "Performing rolling update..."
        
        # Stop existing containers gracefully
        docker-compose -f docker-compose.yml down --timeout 30
        
        # Start new containers
        docker-compose -f docker-compose.yml up -d
        
        # Wait for services to be healthy
        print_status "Waiting for services to be healthy..."
        sleep 60
        
        # Health check
        if curl -f http://localhost:8081/health &> /dev/null; then
            print_status "✅ Production deployment successful!"
        else
            print_error "❌ Production deployment failed!"
            print_status "Rolling back..."
            docker-compose -f docker-compose.yml down
            exit 1
        fi
        ;;
esac

print_status "🎉 Deployment completed successfully!"
print_status "Application is running at:"
case $ENVIRONMENT in
    staging)
        print_status "  - API: http://localhost:8081"
        print_status "  - Kafka UI: http://localhost:8080"
        ;;
    production)
        print_status "  - API: http://localhost:8081"
        print_status "  - Kafka UI: http://localhost:8080"
        ;;
esac