# MVNO Integration Service

## Overview
This service aggregates MVNO provider data from multiple sources (SOAP and REST APIs) and transforms it into Telgea's expected format.

## Architecture

### Core Components

```
/code
  /adapters              # API clients returning provider-specific formats
  /collectors            # Collect data from multiple adapters for a provider
  /mapper                # Transform provider formats to internal format
  /normalizer.ts         # Interfaces representing an API with Telgea's normalizer
  /aggregator            # Aggregates data from collectors into a Telgea's normalizer type
  /database              # Mock database
```

### Design Principles

1. **Separation of Concerns**
   - Adapters: Return provider-specific data
   - Collectors: Coordinate calls to multiple adapters for a specific provider
   - Mappers: Transform provider-specific formats using configurable mappings
   - Normalizers: Combine and validate partial data into complete objects
   - Database: Manage user-to-service mappings
   - Aggregator: Orchestrate the entire data collection and transformation process

2. **Configurable Mappings**
   - Field mappings defined in configuration, not code
   - Support for nested paths and transformations
   - Easy to extend for new providers without code changes

3. **Type Safety**
   - Strong typing for MVNO formats (MvnoSmsChargeResponse, MvnoDataUsageResponse)
   - Strong typing for Telgea's internal format (NormalizedUserData)
   - Compile-time safety for transformations

### Key Decisions & Trade-offs

**What I Prioritized:**
- Clean, extensible architecture over feature completeness
- Configurable mapping system that scales to new providers
- Type safety throughout the pipeline
- Testability with side-by-side test files
- Clear separation between data collection, transformation, and aggregation

**What I Would Add With More Time:**
- Runtime schema validation
- Error handling strategies for partial data
- Safer decimal handling for charge values
- Full dependency injection pattern

### How It Works

1. Aggregator receives a request for user data by user ID
2. Determines which service the user belongs to using UserDatabase
3. Gets the appropriate collector for that service using CollectorFactory
4. Collector calls multiple adapters to fetch different data types from the provider
5. Each response is mapped to a partial NormalizedUserData format
6. Normalizer combines the partial results and validates the complete object
7. Aggregator returns the complete normalized user data

### Extending for New Providers

To add a new provider:
1. Create new adapter(s) for the provider's APIs
2. Create a collector that coordinates the adapters
3. Define response format types
4. Add mapping configuration
5. Register the collector with the factory

## Getting Started

### Development

* Devcontainer config is supplied under `.devcontainer` but is not necessary for a development environment
* You can also just run `bun install --frozen-lockfile` for setup
* Tests are run by `bun test`
* You can also run them using `docker compose up` if you don't want to install `bun`
* There isn't a main program per se, the main test case described in the assignment is implemented in `code/aggregator/aggregator.test.ts`
