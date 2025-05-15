terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {
  host = "npipe:////./pipe/docker_engine"
}

# Create a network for the application
resource "docker_network" "nunchaki_network" {
  name = "nunchaki-network"
}

# Backend image
resource "docker_image" "backend" {
  name = "nunchaki-backend:v6"
  build {
    context = abspath("../nunchaki-backend")
    dockerfile = "Dockerfile"
  }
}

# Backend container
resource "docker_container" "backend" {
  name  = "nunchaki-backend"
  image = docker_image.backend.name
  ports {
    internal = 8080
    external = 8080
  }
  networks_advanced {
    name = docker_network.nunchaki_network.name
  }
  env = [
    "SPRING_PROFILES_ACTIVE=prod",
    "SPRING_DATASOURCE_URL=jdbc:postgresql://${docker_container.database.name}:5432/nunchaki",
    "SPRING_DATASOURCE_USERNAME=postgres",
    "SPRING_DATASOURCE_PASSWORD=postgres",
    "SPRING_DATASOURCE_DRIVER_CLASS_NAME=org.postgresql.Driver"
  ]
  depends_on = [docker_container.database, docker_image.backend]
  log_driver = "json-file"
  log_opts = {
    max-size = "10m"
    max-file = "3"
  }
}

# Database container
resource "docker_container" "database" {
  name  = "nunchaki-db"
  image = "postgres:15-alpine"
  env = [
    "POSTGRES_DB=nunchaki",
    "POSTGRES_USER=postgres",
    "POSTGRES_PASSWORD=postgres"
  ]
  ports {
    internal = 5432
    external = 5432
  }
  networks_advanced {
    name = docker_network.nunchaki_network.name
  }
  log_driver = "json-file"
  log_opts = {
    max-size = "10m"
    max-file = "3"
  }
}
