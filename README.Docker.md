# Docker Setup for TourScape AI

This document provides instructions for running the TourScape AI application using Docker.

## Prerequisites

- Docker installed (version 20.10+)
- Docker Compose installed (version 2.0+)
- `.env` file with required environment variables

## Quick Start

### Production Build

Build and run the production-ready container:

```bash
# Build the image
docker-compose build

# Start the container
docker-compose up -d

# View logs
docker-compose logs -f
```

The application will be available at `http://localhost:80`

### Development Mode

Run the application in development mode with hot-reload:

```bash
# Using the dev profile in main docker-compose.yml
docker-compose --profile dev up tourscape-dev

# OR using the dedicated dev compose file
docker-compose -f docker-compose.dev.yml up
```

The development server will be available at `http://localhost:5173`

## Available Commands

### Production

```bash
# Build the production image
docker-compose build

# Start containers in detached mode
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f tourscape-ai

# Restart the application
docker-compose restart

# Remove containers and volumes
docker-compose down -v
```

### Development

```bash
# Start dev environment
docker-compose -f docker-compose.dev.yml up

# Stop dev environment
docker-compose -f docker-compose.dev.yml down

# Rebuild and start
docker-compose -f docker-compose.dev.yml up --build
```

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
VITE_SUPABASE_PROJECT_ID=your_project_id
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
VITE_SUPABASE_URL=your_supabase_url
```

## Docker Files Structure

- `Dockerfile` - Multi-stage production build
- `docker-compose.yml` - Main orchestration file (production + dev profile)
- `docker-compose.dev.yml` - Development-specific configuration
- `nginx.conf` - Nginx web server configuration
- `.dockerignore` - Files to exclude from Docker builds

## Port Mapping

- **Production**: Port 80 (HTTP) and 443 (HTTPS)
- **Development**: Port 5173 (Vite dev server)

## Health Checks

The production container includes a health check that monitors the application status:

```bash
# Check container health
docker inspect --format='{{.State.Health.Status}}' tourscape-ai
```

## SSL/HTTPS Setup

To enable HTTPS:

1. Place your SSL certificates in the `ssl/` directory:
   - `ssl/fullchain.pem`
   - `ssl/privkey.pem`

2. Uncomment the HTTPS server block in `nginx.conf`

3. Rebuild and restart the container

## Troubleshooting

### Container won't start

```bash
# Check logs
docker-compose logs tourscape-ai

# Check container status
docker ps -a
```

### Build failures

```bash
# Clean build without cache
docker-compose build --no-cache

# Remove all containers and images
docker-compose down --rmi all
```

### Permission issues

```bash
# Fix node_modules permissions
docker-compose run --rm tourscape-dev chown -R node:node /app
```

## Performance Tips

1. **Use BuildKit** for faster builds:
   ```bash
   DOCKER_BUILDKIT=1 docker-compose build
   ```

2. **Prune unused resources** regularly:
   ```bash
   docker system prune -a
   ```

3. **Monitor resource usage**:
   ```bash
   docker stats tourscape-ai
   ```

## Production Deployment

For production deployment:

1. Set appropriate environment variables
2. Configure SSL certificates
3. Update `nginx.conf` with your domain name
4. Use Docker secrets for sensitive data
5. Set up proper logging and monitoring
6. Configure automatic restarts
7. Implement backup strategies

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nginx Documentation](https://nginx.org/en/docs/)
