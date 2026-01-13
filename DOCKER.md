# Docker Setup Guide

This guide explains how to run the E-commerce API using Docker.

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)

## Quick Start

### 1. Build and Run with Docker Compose

The easiest way to run the application is using Docker Compose, which will start both the API and PostgreSQL database:

```bash
docker-compose up -d
```

This will:
- Build the application Docker image
- Start a PostgreSQL database container
- Start the API container
- Create a network for the containers to communicate

### 2. View Logs

```bash
# View all logs
docker-compose logs -f

# View API logs only
docker-compose logs -f app

# View database logs only
docker-compose logs -f postgres
```

### 3. Stop the Application

```bash
docker-compose down
```

To also remove the database volume:

```bash
docker-compose down -v
```

## Environment Variables

The default environment variables are configured in `docker-compose.yml`. For production, you should:

1. Change the `JWT_SECRET` to a secure random string
2. Update the database credentials
3. Consider using a `.env` file for sensitive data

### Using a .env File

Create a `.env` file in the project root:

```env
PORT=3000
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your-secure-password
DATABASE_NAME=ecommerce
JWT_SECRET=your-secure-secret-key
JWT_EXPIRES_IN=7d
```

Then update `docker-compose.yml` to use `env_file`:

```yaml
app:
  # ... other config
  env_file:
    - .env
```

## Building the Docker Image Standalone

If you want to build just the Docker image without using Docker Compose:

```bash
docker build -t ecommerce-api .
```

## Running Individual Containers

### Run PostgreSQL Only

```bash
docker run -d \
  --name ecommerce-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=ecommerce \
  -p 5432:5432 \
  postgres:16-alpine
```

### Run the API (requires running database)

```bash
docker run -d \
  --name ecommerce-api \
  -p 3000:3000 \
  -e PORT=3000 \
  -e DATABASE_HOST=host.docker.internal \
  -e DATABASE_PORT=5432 \
  -e DATABASE_USERNAME=postgres \
  -e DATABASE_PASSWORD=postgres \
  -e DATABASE_NAME=ecommerce \
  -e JWT_SECRET=your-secret-key \
  -e JWT_EXPIRES_IN=7d \
  ecommerce-api
```

## Accessing the Application

Once running, the API will be available at:

- API: http://localhost:3000
- PostgreSQL: localhost:5432

## Troubleshooting

### Container Won't Start

Check the logs:
```bash
docker-compose logs app
```

### Database Connection Issues

Ensure PostgreSQL is healthy:
```bash
docker-compose ps
```

The postgres service should show as "healthy".

### Port Already in Use

If port 3000 or 5432 is already in use, change the port mapping in `docker-compose.yml`:

```yaml
ports:
  - "3001:3000"  # Use port 3001 on host instead
```

## Production Considerations

For production deployments:

1. **Use secrets management**: Don't hardcode sensitive values
2. **Disable synchronize**: Set `synchronize: false` in `data-source.ts` and use migrations
3. **Use volume backups**: Regularly backup the PostgreSQL volume
4. **Health checks**: Consider adding health check endpoints to the API
5. **Logging**: Configure proper logging and log aggregation
6. **Resource limits**: Add CPU and memory limits in docker-compose.yml
7. **Security**: Run containers as non-root user, scan images for vulnerabilities

### Example Production docker-compose.yml Snippet

```yaml
app:
  # ... other config
  deploy:
    resources:
      limits:
        cpus: '1'
        memory: 512M
      reservations:
        cpus: '0.5'
        memory: 256M
  restart: always
```
