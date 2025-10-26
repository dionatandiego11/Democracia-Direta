# Infraestrutura

Planejamento inicial para provisionamento via Terraform (fase pós-MVP):
- `modules/network`: VPC, sub-redes públicas/privadas, gateways.
- `modules/compute`: ECS Fargate ou EKS para workloads da API e web.
- `modules/database`: Postgres gerenciado (RDS) + Redis (ElastiCache).
- `modules/observability`: Prometheus, Grafana, OpenTelemetry Collector.
- `modules/storage`: Buckets S3 para anexos e artefatos.

Scripts serão adicionados conforme roadmap descrito em `docs/plano-tecnico.md`.
