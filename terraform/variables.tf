#Variables
variable "infrastructure_version" {
  default = "1"
}
variable "region" {
  default = "us-west-2"
}
variable "vpc_cidr" {
  description = "The CIDR Block for the SiteSeer VPC"
  default     = "10.0.0.0/16"
}

variable "rt_wide_route" {
  description = "Route in the SiteSeer Route Table"
  default     = "0.0.0.0/0"
}
variable "subnet_count" {
  description = "no of subnets"
  default     = 2
}
variable "availability_zones" {
  description = "availability zone to create subnet"
  default = [
    "us-west-2a",
    "us-west-2b"
  ]
}
variable "postgres_db_port" {
  description = "Port exposed by the RDS instance"
  default     = 5432
}
variable "rds_instance_type" {
  description = "Instance type for the RDS database"
  default     = "db.t3.xlarge"
}
# Change database-1 to postgres
variable "rds_identifier" {
  description = "db identifier"
  default     = "sosol-database-1"
}
variable "rds_storage_type" {
  description = "db storage type"
  default     = "gp2"
}
# Change 20 to 5
variable "rds_allocated_storage" {
  description = "db allocated storage"
  default     = 20
}
variable "rds_engine" {
  description = "type of db engine"
  default     = "postgres"
}
variable "rds_engine_version" {
  description = "db engine version"
  default     = "12.7"
}
variable "rds_database_name" {
  description = "db worker name"
  default     = "sosol_postgresdb_prod"
}
variable "rds_username" {
  description = "Database administrator username"
  type        = string
  sensitive   = true
}
variable "rds_password" {
  description = "Database administrator password"
  type        = string
  sensitive   = true
}
variable "rds_final_snapshot_identifier" {
  description = "db final snapshot identifier"
  default     = "worker-final"
}
variable "sosol_app_port" {
  description = "Port exposed by the sosol application"
  default     = 7777
}
variable "sosol_app_image" {
  description = "Dockerhub image for sosol-app"
  default     = "docker.io/sosol/terraform-sosol-backend:latest"
}
variable "sosol_app" {
  description = "sosol APP variable"
  default     = "app"
}
variable "sosol_env" {
  description = "sosol ENV variable"
  default     = "production"
}
variable "sosol_app_home" {
  description = "APP HOME variable"
  default     = "/usr/src/app/"
}
variable "sosol_app_name" {
  description = "Sosol app name"
  type        = string
  default     = "sosol-app"
}
variable "health_check_path" {
  description = "Http path for task health check"
  default     = "/.well-known/apollo/server-health"
}
variable "aws_key" {
  description = "AWS key for sosol"
  type        = string
  sensitive   = true
}
variable "aws_secret_key" {
  description = "AWS secret key for sosol"
  type        = string
  sensitive   = true
}
variable "aws_bucket" {
  description = "S3 bucket for content"
  default     = "sosol-prod"
}
variable "domain" {
  type        = string
  description = "The domain name to use for the sosol static site"
  default     = "sosol.app"
}
variable "cloudflare_email" {
  type        = string
  description = "The email associated with the Cloudflare account"
  sensitive   = true
}
variable "cloudflare_api_token" {
  type        = string
  description = "The Cloudflare API Token"
  sensitive   = true
}
variable "cloudflare_api_key" {
  type        = string
  description = "The Cloudflare API Key"
  sensitive   = true
}