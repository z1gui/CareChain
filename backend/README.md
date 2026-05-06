# CareChain Backend

Spring Boot scaffold for the CareChain backend.

## Requirements

- JDK 17+
- Maven 3.8+

## Run

```bash
mvn spring-boot:run
```

## Build

```bash
mvn clean package
```

## Main Packages

- `com.carechain.backend.common`: shared response and exception handling
- `com.carechain.backend.auth`: wallet auth endpoints
- `com.carechain.backend.facility`: facility and asset endpoints
- `com.carechain.backend.portfolio`: portfolio and holdings endpoints
- `com.carechain.backend.queue`: queue and admission endpoints
- `com.carechain.backend.payment`: check-in payment endpoints

## Current Status

This scaffold provides:

- Maven build
- Spring Boot app bootstrap
- health check
- API versioned controllers
- unified response model
- example DTOs and stub services

Business logic, persistence, and chain integration can be added incrementally on top of this base.
