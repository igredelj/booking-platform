# Customization Boundaries

This project supports customer-specific booking experiences through named, testable surfaces. Do not add customer-specific branches in page components or provider-neutral contracts unless a new extension point has been accepted first.

## Profile Config

Use customer experience profiles for values:

- Identity and display names.
- Brand names, logo paths, theme tokens, and content locale/currency.
- Approved feature flags.
- Composition id selection.
- Provider id and non-secret runtime hints.

Profiles must not contain component code, provider wire payloads, route guard logic, or raw secrets.

## Assets

Use public customer asset folders for static brand assets such as logos. Assets should be referenced from profile config and should not change booking behavior.

## Composition

Use product compositions for experience building blocks:

- Route graph and route components.
- Step labels, step order, and shell layout flags.
- Flow guard rules for route availability.

Composition changes require focused tests because they change navigation behavior.

## Provider Adapters

Use BFF provider adapters for backend and provider differences:

- Route, calendar, availability, ancillary, and booking calls.
- Mapping external provider responses into platform contracts.
- Preserving opaque provider references needed for later provider calls.
- Normalizing provider failures into stable platform errors.

Provider-specific request or response shapes must not leak into React page components.

## Extensions

Use named extensions when a customer needs behavior beyond config, composition, or provider mapping. An extension must have:

- A named boundary and owner.
- Input and output contracts.
- Tests for the variant behavior.
- A default behavior that keeps existing customers unchanged.

## Last-Resort Overrides

Use last-resort overrides only when the behavior cannot be expressed safely through the surfaces above. Overrides need an explicit rationale, tests, and documentation showing why a named extension was not sufficient.
