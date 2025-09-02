variable "region" {
  description = "Region for S3 bucket (e.g. ap-southeast-1)"
  type        = string
}

variable "bucket_name" {
  description = "Globally unique S3 bucket name"
  type        = string
}

variable "cdn_domain" {
  description = "CNAME domain for CloudFront (e.g. resources.lscc.org.sg)"
  type        = string
}

variable "price_class" {
  description = "CloudFront price class"
  type        = string
  default     = "PriceClass_200" # US, EU, Asia
}
