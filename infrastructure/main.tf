terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

variable "backend_server" {
  description = "Full backend server address (including port)"
  type        = string
  default     = "nunchaki-backend-green:8080"
}

locals {
  timestamp = formatdate("YYYYMMDDhhmmss", timestamp())
}

provider "docker" {
  host = "npipe:////./pipe/docker_engine"
}

# Create a network for the application
resource "docker_network" "nunchaki_network" {
  name = "nunchaki-network"
}

# Load Balancer image
resource "docker_image" "load_balancer" {
  name = "nginx:alpine"
}

# Generate nginx configuration from template
resource "local_file" "nginx_conf" {
  content = templatefile("${path.module}/nginx.conf.tpl", {
    BACKEND_SERVER = var.backend_server
  })
  filename = "${path.module}/nginx.conf"
}

# Load Balancer container
resource "docker_container" "load_balancer" {
  name  = "nunchaki-lb"
  image = docker_image.load_balancer.name
  ports {
    internal = 80
    external = 80
  }
  networks_advanced {
    name = docker_network.nunchaki_network.name
  }
  volumes {
    host_path      = abspath("./nginx.conf")
    container_path = "/etc/nginx/nginx.conf"
  }
  depends_on = [
    local_file.nginx_conf
  ]
  log_driver = "json-file"
  log_opts = {
    max-size = "10m"
    max-file = "3"
  }
  restart = "unless-stopped"
}

# Reload nginx configuration without downtime
resource "null_resource" "reload_nginx" {
  triggers = {
    backend_server = var.backend_server
    timestamp     = timestamp()
  }

  provisioner "local-exec" {
    command = "sleep 2 && docker exec nunchaki-lb nginx -s reload"
  }

  depends_on = [
    docker_container.load_balancer,
    local_file.nginx_conf
  ]
}

# Backend image
resource "docker_image" "backend_blue" {
  name = "nunchaki-backend:v10"
  build {
    context = abspath("../nunchaki-backend")
    dockerfile = "Dockerfile"
  }
}

# Backend container
resource "docker_container" "backend_blue" {
  name  = "nunchaki-backend-blue"
  image = docker_image.backend_blue.name
  ports {
    internal = 8080
  }
  networks_advanced {
    name = docker_network.nunchaki_network.name
  }
  env = [
    "SPRING_PROFILES_ACTIVE=prod",
    "SPRING_DATASOURCE_URL=jdbc:postgresql://${docker_container.database.name}:5432/nunchaki",
    "SPRING_DATASOURCE_USERNAME=postgres",
    "SPRING_DATASOURCE_PASSWORD=postgres",
    "SPRING_DATASOURCE_DRIVER_CLASS_NAME=org.postgresql.Driver",
    "SPRING_KAFKA_BOOTSTRAP_SERVERS=nunchaki-kafka:9092"
  ]
  depends_on = [docker_container.database, docker_image.backend_blue, docker_container.kafka]
  log_driver = "json-file"
  log_opts = {
    max-size = "10m"
    max-file = "3"
  }
}

# Backend image
resource "docker_image" "backend_green" {
  name = "nunchaki-backend:v10"
  build {
    context = abspath("../nunchaki-backend")
    dockerfile = "Dockerfile"
  }
}

# Backend container
resource "docker_container" "backend_green" {
  name  = "nunchaki-backend-green"
  image = docker_image.backend_green.name
  ports {
    internal = 8080
  }
  networks_advanced {
    name = docker_network.nunchaki_network.name
  }
  env = [
    "SPRING_PROFILES_ACTIVE=prod",
    "SPRING_DATASOURCE_URL=jdbc:postgresql://${docker_container.database.name}:5432/nunchaki",
    "SPRING_DATASOURCE_USERNAME=postgres",
    "SPRING_DATASOURCE_PASSWORD=postgres",
    "SPRING_DATASOURCE_DRIVER_CLASS_NAME=org.postgresql.Driver",
    "SPRING_KAFKA_BOOTSTRAP_SERVERS=nunchaki-kafka:9092"
  ]
  depends_on = [docker_container.database, docker_image.backend_green, docker_container.kafka]
  log_driver = "json-file"
  log_opts = {
    max-size = "10m"
    max-file = "3"
  }
}

# Database container
resource "docker_container" "database" {
  name  = "nunchaki-db"
  image = "postgres:11-alpine"
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

# Zookeeper container
resource "docker_container" "zookeeper" {
  name  = "nunchaki-zookeeper"
  image = "confluentinc/cp-zookeeper:7.3.0"
  env = [
    "ZOOKEEPER_CLIENT_PORT=2181",
    "ZOOKEEPER_TICK_TIME=2000"
  ]
  networks_advanced {
    name = docker_network.nunchaki_network.name
  }
  log_driver = "json-file"
  log_opts = {
    max-size = "10m"
    max-file = "3"
  }
  restart = "unless-stopped"
}

# Kafka container
resource "docker_container" "kafka" {
  name  = "nunchaki-kafka"
  image = "confluentinc/cp-kafka:7.3.0"
  env = [
    "KAFKA_BROKER_ID=1",
    "KAFKA_ZOOKEEPER_CONNECT=nunchaki-zookeeper:2181",
    "KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://nunchaki-kafka:9092",
    "KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1",
    "KAFKA_AUTO_CREATE_TOPICS_ENABLE=true"
  ]
  ports {
    internal = 9092
    external = 9092
  }
  networks_advanced {
    name = docker_network.nunchaki_network.name
  }
  depends_on = [docker_container.zookeeper]
  log_driver = "json-file"
  log_opts = {
    max-size = "10m"
    max-file = "3"
  }
  restart = "unless-stopped"
}
