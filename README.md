# MVNO Integration Service

## Overview
This service aggregates MVNO provider data from multiple sources (SOAP and REST APIs) and transforms it into Telgea's expected format.

## Architecture

### Core Components

```
/code
  /adapters              # API clients returning provider-specific formats
  /mappers               # Transform provider formats to internal format
  /services           
    /aggregation         # Orchestrate data collection from multiple sources
  /config
    mapping-config.ts    # Configurable field mappings
  /types
    mvno-types.ts        # Provider-specific types
    normalizer-types.ts  # Expected format for normalizer
  /mock-data
    soap-responses.ts
    rest-responses.ts
```

### Design Principles

1. **Separation of Concerns**
   - Adapters: Simulate MVNO API calls
   - Mappers: Transformation using configurable mappings
   - Aggregation Service: Orchestrates collection and transformation

2. **Configurable Mappings**
   - Field mappings defined in configuration, not code
   - Support for nested paths, arrays, and transformations
   - Easy to extend for new providers without code changes

3. **Type Safety**
   - Strong typing for MVNO formats (MvnoSoapSmsResponse, MvnoRestUsageResponse)
   - Strong typing for Telgea's internal format
   - Compile-time safety for transformations

### Key Decisions & Trade-offs

**What I Prioritized:**
- Clean, extensible architecture over feature completeness
- Configurable mapping system that scales to new providers
- Type safety throughout the pipeline
- Testability with side-by-side test files

**What I Would Add With More Time:**
- Runtime schema validation
- Error handling strategies for partial data
- Safer decimal handling for charge values

### How It Works

1. Aggregation service receives a request for user data
2. Calls multiple adapters to get data from the MVNO
3. Uses mapper with configuration to transform responses
4. Combines transformed data into format for normalizer

### Extending for New Providers

To add a new provider:
1. Add new adapter(s)
2. Define response format types
3. Add mapping configuration

## Getting Started

### Development

* Devcontainer config is supplied under `.devcontainer` but is not necessary for a development environment
* You can also just run `bun install --frozen-lockfile` for setup
* Tests are run by `bun test`
* You can also run them using `docker compose up` if you don't want to install `bun`
