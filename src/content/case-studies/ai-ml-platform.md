---
title: AI-Powered Risk Platform
client: FinTech Platform
industry: Fintech
tag: AI/ML
excerpt: Built a real-time ML risk scoring engine that cut fraudulent transactions by 42% while dropping false positives to under 2%.
date: "2026-02-15"
outcomes:
  - 42% reduction in fraudulent transactions
  - False positive rate dropped from 12% to 1.8%
  - Sub-10ms average scoring latency
  - Significant annual savings in prevented fraud losses
kpi: "42%"
kpiLabel: "fraud reduction"
tech:
  - Python
  - PyTorch
  - Kubernetes
  - Apache Kafka
  - PostgreSQL
---

## Challenge

A growing fintech platform was relying on a rule-based risk engine that generated too many false positives — blocking legitimate transactions and frustrating users. The team needed a smarter, lower-latency solution without rebuilding the entire stack.

## What We Built

We designed and built a real-time ML risk scoring service that evaluates every transaction in under 10ms using a gradient-boosted ensemble model trained on historical behavioral data.

Transaction events are ingested via Apache Kafka, inference runs in a low-latency Python service backed by TorchServe, and every decision is written to PostgreSQL with a full audit trail.

## Outcome

- Fraudulent transactions down 42% within the first 90 days
- False positive rate dropped from 12% to 1.8%
- Sub-10ms scoring latency maintained under full production load
- The platform now handles peak traffic without manual intervention
