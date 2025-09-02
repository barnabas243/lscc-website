############################
# Providers
############################

variable "aws_profile" {
  description = "Optional AWS CLI profile (or leave null to use env vars)"
  type        = string
  default     = null
}

provider "aws" {
  region  = var.region # e.g. ap-southeast-1 (Singapore)
  profile = var.aws_profile
}

# ACM for CloudFront must be us-east-1
provider "aws" {
  alias   = "us_east_1"
  region  = "us-east-1"
  profile = var.aws_profile
}
