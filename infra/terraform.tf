terraform {
  cloud {

    organization = "lscc-sg"

    workspaces {
      name = "cdn-dev"
    }
  }
}
