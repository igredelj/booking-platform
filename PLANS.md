# Implementation Plan: Bravo IBE PoC Smart Trip Builder

## Overview

Build the first Bravo IBE PoC as a focused Smart Trip Builder vertical slice: search, low-fare calendar, priced availability, outbound-first flight and fare selection, return selection for round trips, trip summary, review trip, and a passenger-details placeholder. The PoC should demonstrate a modern white-label airline retail experience on top of the Laravel BFF, while keeping full passenger details, seats, bags, payment, confirmation, MMB, CKI, and multi-city out of scope unless separately requested.

## Sources Reviewed

- `/Users/igor/Downloads/bravo-ibe-poc-ai-implementation-spec-v2.md`
- `/Users/igor/Downloads/Bravo PSS - IBE PoC - UX Direction & Product Concept.docx.pdf`
- `/Users/igor/Downloads/bravo-platform-hardening-plan.md`
- `/Users/igor/Desktop/springdocDefault.json`
- Existing repo context in `AGENTS.md`, `docs/ai-context.md`, `docs/architecture.md`, `apps/web`, `apps/bff`, `packages/config-schema`, and `mock-data`.
- Figma file `SAnyvhT0Quua2cXFzzBuci`, node `4003:1118`, page/canvas `07 Screen Design`.

Figma access is verified through the connector as `figma@2e-systems.com`. The implementation spec remains the behavioral source of truth; Figma is now the visual/component source of truth for the listed screen blueprints.

## Figma Screen Blueprint

Figma page/canvas: `07 Screen Design`, node `4003:1118`.

Primary screen frames:

- `Screen/FlightSearch/Desktop` at `1378 x 1327.67`
- `Screen/FlightSearch/Mobile` at `425 x 1885.67`
- `Modal/Calendar/PaxSelect` at `1378 x 350`
- `Calendar/Mobile` at `425 x 861`
- `Screen/Availability/Desktop` at `1378 x 1567`
- `Screen/Availability/Mobile` at `425 x 2346`
- `Modal/CompareFareBundles` at `1378 x 996`
- `Screen/ReviewTripDesktop` at `1378 x 1139`
- `Modal/ReviewTrip/FlightDetails` at `1378 x 996`

Key component patterns observed:

- Search uses `Booking/Header`, `Booking/SearchCard`, `Primitve/TripType`, `Primitive/Select`, `Primitive/IconButton`, `Primitive/Chip`, `Primitive/Input`, `Primitive/Button`, `Booking/QuickActionCard`, and `Primitive/Footer`.
- Desktop search card has a brand accent, title/subtitle, trip type control, route row with swap action, date row, passenger/fare row, flexible/direct chips, promo code expansion, full-width CTA, and quick actions below.
- Mobile search stacks route, date, passenger/fare, options, promo code, and CTA inside a `393px` card, with quick actions below and a mobile header.
- Calendar desktop uses a modal/backdrop with `LowFareCalendar / desktop round trip`, selected departure/return summaries, month navigation, fare-aware day cells, legend, and apply button. Mobile uses a dedicated `Booking/LowFareCalendar` screen/sheet.
- Availability desktop uses `Availability/SearchSummaryBar`, `Availability/FareStrip`, `Availability/FilterBar`, a results column, expandable/collapsed `Availability/FlightCard/Desktop`, sticky `Checkout/TripSummary`, and footer.
- Availability mobile uses mobile search summary, fare strip, filter bar, stacked flight cards, expanded mobile fare stack, compare fares trigger, and `Checkout/MobileBottomBar`.
- Fare comparison uses `Availability/FareComparison/Dialog` over a backdrop.
- Review desktop uses search summary, `Checkout/BookingStepper / current step 1`, `Checkout/ReviewTrip / roundTrip desktop`, sticky `Checkout/TripSummary`, and a flight details modal pattern.

Implementation note: use Figma for visual hierarchy, sizing, component inventory, and responsive behavior. Use the spec/PDF for state-machine rules and scope boundaries when Figma shows hidden variants or exploratory frames.

## Product Scope

In scope:

- Search screen with round trip and one way.
- Origin/destination filtering backed first by routes data or mock route map.
- Low-fare calendar/date picker with fare hints and unavailable dates.
- Priced availability with outbound-first, then return selection.
- Collapsed flight cards that expand one at a time.
- Basic / Smart / Plus fare bundles, with Smart recommended.
- Fare comparison modal/sheet.
- Persistent desktop trip summary.
- Mobile bottom summary bar and summary sheet.
- Review trip screen before passenger placeholder.
- API route/model layer for routes, low-fare calendar, and flight offers.
- Mock mode that can develop without live provider access.

Out of scope for this first plan:

- Full passenger details implementation.
- Seat map, bags, extras, meals, insurance, and priority purchase pages.
- Payment and confirmation.
- Manage My Booking and Check-in.
- Multi-city as primary UI.
- Production-grade repricing/session handling beyond visible placeholder notes.

## Platform Hardening Assessment

The hardening plan is relevant and should change the implementation order. The current repo is a useful seed, but several areas are still demo-shaped rather than platform-shaped:

- Runtime configuration is still named and modeled as `tenantConfig`, with files in `mock-data/tenants/**`.
- The frontend route graph and step labels are hard-coded in `apps/web/src/app/App.tsx` and `apps/web/src/app/steps.ts`.
- Route guarding is one global booking-flow selector, not composition-owned flow rules.
- The BFF exposes mock booking behavior through `MockBookingApi` instead of a provider interface.
- Frontend/BFF contracts live as local ad hoc TypeScript/PHP shapes, not as a shared provider-neutral contract.
- Booking state currently reflects the broader scaffold, including later funnel concepts, instead of a minimal provider-neutral trip-builder state.

Architecture updates needed before heavy UI work:

- Rename the conceptual runtime model from tenant config to customer experience/profile. Keep `tenant` only where it is a deployment or compatibility concern.
- Split profile config into identity, brand, theme, content, features, composition, provider, and runtime sections.
- Introduce a product composition registry that owns route graph, step labels, step order, shell metadata, and flow guards.
- Define frontend-facing BFF contracts before integrating Encore/provider payloads.
- Put mock and external provider behavior behind the same BFF provider adapter interface.
- Keep config for values and approved capability selection only; use named extension points for behavior.
- Normalize app error/loading contracts and keep durable Redux state provider-neutral and free of raw provider payloads or sensitive payment data.

This means the first milestone should be structural: one default Bravo customer experience can run the mocked Smart Trip Builder flow through a composition registry, using provider-neutral BFF contracts and a mock provider adapter.

## Core Architecture Decisions

- Build the frontend around a trip-building state machine: `search -> select_outbound -> select_return -> review_trip -> passenger_placeholder`.
- Use one availability route with bound state, for example `/availability?bound=outbound` and `/availability?bound=return`, rather than separate flight and fare pages.
- Keep frontend models domain-focused. Do not expose the raw provider OpenAPI response shape directly to React.
- Put external API integration behind Laravel service interfaces. The BFF should translate provider request/response DTOs into frontend-ready route, calendar, flight, fare, and summary models.
- Keep `BOOKING_API_MODE=mock` available. External integration should be selectable through config, not required for local UI work.
- Treat customer branding and fare bundle presentation as white-label configuration where practical, but keep the first PoC simple and demo-ready.
- Follow the hardening rule: config chooses values, composition chooses building blocks, extensions customize approved behavior, and provider adapters isolate API quirks.
- Do not introduce broad per-customer page/module copies as the default customization mechanism.

## External API Contract Summary

Swagger source: `/Users/igor/Desktop/springdocDefault.json`.

Provider media type: `application/vnd.2e.air.web.v1+json`.

Provider endpoints:

- `GET /offers/flights/routes`
  - Operation: `getFlightOfferRoutes`
  - Query: optional `language`, pattern `^[a-z]{2}([_-][A-Z]{2})?$`
  - Response schema: `FlightRoutesRSDTO`
  - Main data: `routes[]`, with `originCity`, `destinationCity`, `originAirports[]`, `destinationAirports[]`, and `dataList.richContents`.

- `POST /offers/flights/calendar`
  - Operation: `getLowFaresCalendar`
  - Request schema: `LowFareCalendarOffersRQDTO`
  - Response schema: `LowFareCalendarOffersRSDTO`
  - Main data: `lowFareOffers[]`, `dataList.bounds`, `dataList.flights`, `dataList.fareFamilies`, `dataList.prices`.

- `POST /offers/flights`
  - Operation: `getFlightOffers`
  - Request schema: `FlightOfferRQDTO`
  - Response schema: `FlightOfferRSDTO`
  - Main data: `itineraryOffers[]`, `boundOffers[]`, `serviceAllowances[]`, `richContents[]`, `dataList.bounds`, `dataList.flights`, `dataList.passengers`, `dataList.fareFamilies`, `dataList.prices`, `dataList.conditions`, and optional `selectionTree`.

Important provider request DTOs:

- `DistributionChannelDTO`: sale phase, language, channel, offers owner, provider sources, point of sale, agency.
- `BoundRequirementsDTO`: origin, destination, departure date, before/after date ranges, fare family reference.
- `FlightOfferPreferencesDTO`: currency, fare type, direct flights, include selection tree, preferred fare families/RBDs.
- `LowFaresPreferencesDTO`: currency, fare type, direct flights, preferred fare families/RBDs, use one-way fare, number of solutions.
- `PassengerDTO`: id, passenger type, optional birth date, loyalty account references.

Provider-to-domain mapping targets:

- `RouteOption`: origin/destination city and airport codes.
- `FareDate`: date, price, currency, availability, selected/cheapest/best-value flags.
- `FlightOption`: bound, carrier, flight number, airports, departure/arrival, duration, stops, badges, baggage headline, fare bundles.
- `FareBundle`: Basic / Smart / Plus domain bundle with provider references preserved for later booking.
- `TripOfferReference`: transaction id, itinerary offer id, bound offer ids, fare family references, price references, and passenger references needed for future booking/selection calls.

## Task List

### Phase -1: Platform Hardening Prerequisites

## Task H1: Rename Tenant Config to Customer Experience Profile

**Description:** Replace the conceptual `tenantConfig` model with an experience/customer profile model. Keep query-param switching for local demos, but make it resolve an experience profile rather than implying arbitrary tenant-specific behavior.

**Acceptance criteria:**

- [ ] Frontend config loader and schema use experience/profile terminology.
- [ ] BFF config endpoint returns a customer experience profile.
- [ ] Local query-param switching still works.
- [ ] Remaining `tenant` references are explicitly deployment-specific or compatibility aliases.
- [ ] No frontend behavior branches on a customer/tenant code.

**Verification:**

- [ ] Frontend config tests cover profile loading and invalid profile failure.
- [ ] BFF tests cover default profile resolution and unknown profile handling.
- [ ] `rg "tenant|Tenant" apps packages mock-data docs` is reviewed and remaining uses are classified.

**Dependencies:** None.

**Files likely touched:**

- `packages/config-schema/src/index.ts`
- `apps/web/src/features/config/tenant.ts`
- `apps/bff/app/Http/Controllers/Api/TenantConfigController.php`
- `mock-data/tenants/**`
- `docs/**`

**Estimated scope:** M.

## Task H2: Split Experience Profile Responsibilities

**Description:** Replace the single broad config shape with typed sections for identity, brand, theme, content, features, composition, provider, and runtime values.

**Acceptance criteria:**

- [ ] Profile schema separates `identity`, `brand`, `theme`, `content`, `features`, `composition`, `provider`, and `runtime`.
- [ ] Composition selection is an ID/reference, not arbitrary page code in JSON.
- [ ] Provider selection is represented as a BFF concern and not exposed as a frontend wire detail.
- [ ] Frontend code reads profile data through named helpers instead of broad raw config access.

**Verification:**

- [ ] Schema tests reject unknown or malformed profile fields.
- [ ] Example profiles validate.
- [ ] Profile load smoke works for the default Bravo demo profile.

**Dependencies:** Task H1.

**Files likely touched:**

- `packages/config-schema/src/index.ts`
- `mock-data/customers/**` or renamed `mock-data/tenants/**`
- `apps/web/src/features/config/**`
- `apps/bff/app/Http/Controllers/Api/*Config*`

**Estimated scope:** M.

## Task H3: Introduce Product Composition Registry

**Description:** Move route/page/flow assembly out of hard-coded app routes into a typed composition registry. The default Bravo composition should own the Smart Trip Builder route graph and be selected by the resolved experience profile.

**Acceptance criteria:**

- [ ] App has a `defineExperienceComposition(...)` or equivalent helper.
- [ ] Route definitions, step labels, step order, shell metadata, and route guards are derived from the selected composition.
- [ ] Default Bravo composition reproduces the planned Smart Trip Builder flow.
- [ ] Unknown composition IDs fail with a clear error.

**Verification:**

- [ ] Frontend tests prove a profile can select the default composition.
- [ ] Frontend tests prove missing/disabled steps are not routable.
- [ ] Manual smoke: default profile can complete the mocked happy path.

**Dependencies:** Tasks H1 and H2.

**Files likely touched:**

- `apps/web/src/app/App.tsx`
- `apps/web/src/app/steps.ts`
- `apps/web/src/components/RouteGuard.tsx`
- `apps/web/src/components/AppLayout.tsx`
- `apps/web/src/product-bravo/**`
- `packages/config-schema/src/index.ts`

**Estimated scope:** M.

## Task H4: Define Provider-Neutral Frontend/BFF Contracts

**Description:** Define request and response contracts for the frontend-facing BFF API before integrating Encore. These contracts should represent platform models, not provider wire formats.

**Acceptance criteria:**

- [ ] Contracts cover search criteria, routes, low-fare calendar, availability response, fare offers, trip selections, and normalized errors for the PoC.
- [ ] Contracts live in a shared package or generated schema.
- [ ] Frontend API client consumes the shared contract.
- [ ] BFF controllers validate requests at the boundary.
- [ ] Mock responses use the normalized platform contract.
- [x] Initial shared contracts added in `@eebkg/config-schema` for search criteria, routes, low-fare calendar, availability, fare bundles, trip selections, and normalized errors.
- [x] Initial frontend client methods consume shared schemas for routes, calendar, and availability.
- [x] Initial BFF routes return normalized mock platform contracts for routes, calendar, and availability.

**Verification:**

- [ ] Contract tests cover valid and invalid payloads.
- [ ] Frontend typecheck fails if contract fields are removed or renamed.
- [ ] BFF feature tests assert response shape for routes, calendar, and availability.
- [x] `apps/web/src/services/bookingContracts.test.ts` covers valid platform contracts.
- [x] `apps/bff/tests/Feature/PlatformOfferApiTest.php` asserts routes, calendar, availability, and normalized validation errors.

**Dependencies:** Task H2.

**Files likely touched:**

- `packages/contracts/**`
- `apps/web/src/services/bookingApi.ts`
- `apps/bff/app/Http/Controllers/Api/**`
- `apps/bff/tests/Feature/**`
- `mock-data/platform/**`

**Estimated scope:** M.

## Task H5: Add BFF Provider Adapter Interfaces

**Description:** Put mock data and Encore/provider calls behind the same BFF provider adapter contract.

**Acceptance criteria:**

- [x] BFF has a cohesive `BookingProvider` interface or small provider interfaces for routes, calendar, availability, ancillaries, and booking.
- [x] `MockBookingApi` is renamed, wrapped, or replaced as a mock provider adapter.
- [x] Provider selection happens through Laravel configuration and dependency injection.
- [x] Frontend code never receives provider-specific fields.

**Verification:**

- [x] BFF tests run controller assertions against the mock provider.
- [x] Provider failures normalize into platform error responses.
- [ ] `rg "Encore|provider" apps/web/src` confirms provider details do not leak into frontend code.

**Dependencies:** Task H4.

**Files likely touched:**

- `apps/bff/app/Contracts/**`
- `apps/bff/app/Providers/**`
- `apps/bff/app/Services/**`
- `apps/bff/config/booking.php`
- `apps/bff/tests/**`

**Estimated scope:** M.

## Task H6: Normalize Flow State, Errors, and Customization Boundaries

**Description:** Separate durable booking domain state from transient UI form state, add typed frontend/BFF error contracts, and document customization surfaces before adding customer-specific behavior.

**Acceptance criteria:**

- [x] Booking state stores normalized trip selections and status only.
- [x] Search/passenger/payment form values stay transient until submission.
- [x] BFF returns a consistent error shape.
- [x] Frontend API client maps errors into typed application errors.
- [x] Customization docs define assets, theme, content, features, composition, extensions, provider adapters, and last-resort overrides.

**Verification:**

- [x] Reducer tests cover reset and selected-offer state.
- [x] Frontend tests cover typed API error mapping.
- [x] BFF tests cover validation and provider error response shapes.
- [x] Documentation review confirms behavior variants require named extension points and tests.

**Dependencies:** Tasks H3-H5.

**Files likely touched:**

- `apps/web/src/features/booking/bookingSlice.ts`
- `apps/web/src/services/bookingApi.ts`
- `apps/web/src/pages/**`
- `apps/bff/app/Exceptions/**`
- `apps/bff/tests/**`
- `docs/architecture/customization-classification.md`

**Estimated scope:** M.

### Checkpoint: Platform Foundation

- [ ] Experience/profile terminology and schema are in place.
- [ ] Default Bravo composition owns routes, step labels, and route guards.
- [ ] Frontend/BFF contracts are provider-neutral.
- [ ] Mock provider sits behind the same adapter contract planned for Encore.
- [ ] Booking state and error handling are normalized.
- [ ] Continue into visible Smart Trip Builder screens only after this checkpoint passes.

### Phase 0: Access and Contract Lock

## Task 1: Audit Figma Screen Blueprint Before UI Build

**Description:** Use the now-accessible Figma `07 Screen Design` canvas to capture implementation-relevant layout details before building UI. The frame inventory is already listed in this plan; this task should deepen it into per-screen component notes only where needed for implementation.

**Acceptance criteria:**

- [x] Figma access works for file `SAnyvhT0Quua2cXFzzBuci`.
- [x] `07 Screen Design` desktop and mobile screen frames are identified.
- [ ] Any visual or behavior mismatch against the spec/PDF is noted before UI implementation starts.
- [ ] The implementation task being started has a matching Figma frame or an explicit note that it is spec-driven only.

**Verification:**

- [x] Use Figma metadata/design context or screenshots for the linked node.
- [ ] Add findings to `PLANS.md` or a focused doc if they materially affect scope.

**Dependencies:** None.

**Files likely touched:**

- `PLANS.md`
- Optional focused design notes under `docs/`

**Estimated scope:** S.

## Task 2: Lock API Environment and Auth Assumptions

**Description:** Confirm how the Laravel BFF should call the external provider API: base URL, auth headers, customer/provider codes, sale phase, default point of sale, language, owner, provider sources, timeout policy, and whether example payloads/responses are available.

**Acceptance criteria:**

- [ ] Required env vars are named and documented.
- [ ] Provider content type and accept headers use `application/vnd.2e.air.web.v1+json`.
- [ ] Missing provider details are captured as open questions rather than guessed.

**Verification:**

- [ ] Local config can run in mock mode without provider credentials.
- [ ] No secrets are committed or copied into docs.

**Dependencies:** None.

**Files likely touched:**

- `apps/bff/config/booking.php`
- `apps/bff/.env.example`
- `docs/ai-context.md`

**Estimated scope:** S.

### Checkpoint: Contract Ready

- [x] Figma access is resolved and the screen blueprint inventory is captured.
- [ ] External API assumptions are explicit.
- [ ] The team agrees the PoC scope excludes full passenger details, seats, bags, payment, confirmation, MMB, CKI, and primary multi-city.

### Phase 1: Domain Model and Mock Data Foundation

## Task 3: Define Frontend Trip Builder Domain Types

**Description:** Replace the current broad funnel state shape with Smart Trip Builder domain types for trip type, flow step, search criteria, fare dates, flight options, fare bundles, pending selection, confirmed bound selection, and trip offer references.

**Acceptance criteria:**

- [ ] Types include `round_trip` and `one_way`.
- [ ] Flow state supports `search`, `select_outbound`, `select_return`, `review_trip`, and `passenger_placeholder`.
- [ ] Pending fare selection is separate from confirmed outbound/return selections.
- [ ] Confirmed selections retain provider references needed for future integration.

**Verification:**

- [ ] `npm run typecheck -w apps/web`
- [ ] Focused reducer/type tests where practical.

**Dependencies:** Platform Foundation checkpoint, plus Tasks 1-2 preferred.

**Files likely touched:**

- `apps/web/src/features/booking/bookingSlice.ts`
- `apps/web/src/features/booking/selectors.ts`
- Optional `apps/web/src/features/booking/types.ts`

**Estimated scope:** M.

## Task 4: Create Canonical PoC Mock Data

**Description:** Replace the current generic search-results/fares fixtures with the canonical LHR/BCN Smart Trip Builder demo data from the implementation spec, including route map, fare dates, outbound flights, return flights, Basic/Smart/Plus bundles, and comparison rules.

**Acceptance criteria:**

- [ ] Mock routes include LHR, BCN, JFK, and LAX combinations from the spec.
- [ ] Mock fare dates include available, unavailable, selected, and cheapest states.
- [ ] Mock flights include outbound and return options with fare bundles.
- [ ] Smart is marked recommended.

**Verification:**

- [ ] Mock JSON validates with local parsing.
- [ ] BFF feature tests cover mock responses.

**Dependencies:** Tasks H4 and 3.

**Files likely touched:**

- `mock-data/api-responses/search-results.json`
- `mock-data/api-responses/fares.json`
- New `mock-data/api-responses/calendar.json`
- New `mock-data/api-responses/routes.json`
- Optional shared fixture builder files

**Estimated scope:** M.

## Task 5: Align Experience Composition With PoC Scope

**Description:** Adjust the experience profile and default Bravo composition so the primary booking flow is limited to search, availability, review, and passenger placeholder for the PoC, while preserving room for later product compositions.

**Acceptance criteria:**

- [ ] Default Bravo composition supports an availability step and passenger placeholder.
- [ ] Existing demo profiles remain valid after migration to experience/profile terminology.
- [ ] Later funnel steps can exist in other compositions but are not part of the PoC default path.

**Verification:**

- [ ] `npm run typecheck`
- [ ] Experience profile load path still works.

**Dependencies:** Tasks H1-H3 and 3.

**Files likely touched:**

- `packages/config-schema/src/index.ts`
- `mock-data/customers/*` or migrated `mock-data/tenants/*/config.json`
- `apps/web/src/app/steps.ts`
- `apps/web/src/components/RouteGuard.tsx`

**Estimated scope:** M.

### Checkpoint: Domain Foundation

- [ ] Frontend types compile.
- [ ] Mock data can represent the full round-trip PoC.
- [ ] Experience profile and composition can drive the reduced PoC flow.

### Phase 2: Laravel BFF Routes, Models, and Provider Adapter

## Task 6: Add BFF Routes for Routes, Calendar, and Flight Offers

**Description:** Add Laravel API routes that mirror the needed provider capabilities while returning frontend-friendly domain responses.

**Acceptance criteria:**

- [ ] `GET /api/flights/routes` returns available route options.
- [ ] `POST /api/flights/calendar` returns low-fare date data.
- [ ] `POST /api/flights/offers` or updated `POST /api/flights/search` returns outbound/return flight options with fare bundles.
- [ ] Current route names are reconciled so frontend usage is clear and not duplicated.

**Verification:**

- [ ] `cd apps/bff && php artisan test`
- [ ] Feature tests cover happy path and validation failures.

**Dependencies:** Tasks H4-H5, 2, and 4.

**Files likely touched:**

- `apps/bff/routes/api.php`
- `apps/bff/app/Http/Controllers/Api/*`
- `apps/bff/tests/Feature/*`

**Estimated scope:** M.

## Task 7: Create Provider Request/Response DTO Layer

**Description:** Create PHP DTOs or typed array builders for the three Swagger-backed provider operations. Keep this layer internal to the BFF adapter.

**Acceptance criteria:**

- [ ] Flight offers request builder produces `FlightOfferRQDTO` shape.
- [ ] Low-fare calendar request builder produces `LowFareCalendarOffersRQDTO` shape.
- [ ] Routes request supports optional language query.
- [ ] Builders handle passengers, bound requirements, currency, fare type, direct-only, and date ranges.

**Verification:**

- [ ] Unit tests compare generated payloads to expected DTO shapes.
- [ ] Required fields from Swagger are present.

**Dependencies:** Task 2.

**Files likely touched:**

- `apps/bff/app/Services/Bravo/`
- `apps/bff/tests/Unit/`

**Estimated scope:** M.

## Task 8: Implement Provider Client Interface and Mock/External Modes

**Description:** Introduce a service interface with mock and external implementations. Mock mode reads local data; external mode calls the provider API using the vendor media type.

**Acceptance criteria:**

- [ ] `BOOKING_API_MODE=mock` remains default for local development.
- [ ] External mode uses configured base URL, headers, timeout, and auth if available.
- [ ] Provider errors map to stable BFF error responses without leaking secrets.
- [x] Existing `MockBookingApi` responsibilities are either extended or replaced cleanly.

**Verification:**

- [ ] BFF feature tests pass in mock mode.
- [ ] External mode can be smoke-tested with a stub/fake HTTP response.

**Dependencies:** Tasks H5, 2, 6, and 7.

**Files likely touched:**

- `apps/bff/app/Services/Contracts/BookingProvider.php`
- `apps/bff/app/Services/MockBookingProvider.php`
- `apps/bff/app/Services/*`
- `apps/bff/config/booking.php`
- `apps/bff/tests/Feature/*`

**Estimated scope:** M.

## Task 9: Map Provider Responses Into Trip Builder Domain Models

**Description:** Build mappers that normalize provider response graphs into frontend domain objects. Resolve references across `dataList` arrays, offers, bounds, flights, fare families, prices, conditions, and service allowances.

**Acceptance criteria:**

- [ ] Routes map to origin/destination options.
- [ ] Calendar offers map to `FareDate[]`.
- [ ] Flight offers map to outbound and return `FlightOption[]`.
- [ ] Fare families and bound offers map to Basic/Smart/Plus where provider data allows, with fallback mapping for mock data.
- [ ] Provider references needed for later selection are preserved.

**Verification:**

- [ ] Unit tests cover mapping for routes, calendar, one-way offers, and round-trip offers.
- [ ] Mapper handles missing optional arrays without fatal errors.

**Dependencies:** Tasks 7 and 8.

**Files likely touched:**

- `apps/bff/app/Services/*Mapper.php`
- `apps/bff/tests/Unit/*`

**Estimated scope:** M.

### Checkpoint: BFF Ready

- [ ] `cd apps/bff && php artisan test`
- [ ] BFF can serve route, calendar, and availability data in mock mode.
- [ ] External provider integration path is isolated behind config and tests.

### Phase 3: Frontend API Client and State Machine

## Task 10: Replace Frontend API Client Shapes

**Description:** Update the React API client to call the new/updated BFF endpoints and return domain models for routes, fare dates, and flight offers.

**Acceptance criteria:**

- [ ] Client exposes `fetchRoutes`, `fetchLowFareCalendar`, and `fetchFlightOffers`.
- [ ] Client sends the active experience/customer identifier using the agreed compatibility header or replacement for the existing `X-Tenant-Id` pattern.
- [ ] Error handling provides UI-friendly messages without swallowing failures.

**Verification:**

- [ ] API client tests or component tests with mocked fetch.
- [ ] `npm run typecheck -w apps/web`

**Dependencies:** Tasks H4 and 6.

**Files likely touched:**

- `apps/web/src/services/bookingApi.ts`
- Optional `apps/web/src/services/bookingApi.test.ts`

**Estimated scope:** S.

## Task 11: Implement Trip Builder Reducers and Selectors

**Description:** Implement deterministic state transitions for search submission, expand/collapse, pending fare selection, confirm outbound, confirm return, change bound, review, and passenger placeholder navigation.

**Acceptance criteria:**

- [ ] Only one flight can be expanded at a time.
- [ ] Selecting a fare sets pending selection but does not auto-confirm the bound.
- [ ] Confirming outbound advances to return for round trip and review for one way.
- [ ] Confirming return advances to review.
- [ ] Trip summary state is derived from the same source as the main content.

**Verification:**

- [ ] `npm run test -w apps/web -- selectors`
- [ ] Reducer tests cover one-way and round-trip transitions.

**Dependencies:** Tasks H6 and 3.

**Files likely touched:**

- `apps/web/src/features/booking/bookingSlice.ts`
- `apps/web/src/features/booking/selectors.ts`
- `apps/web/src/features/booking/selectors.test.ts`

**Estimated scope:** M.

## Task 12: Rework Routing to PoC Flow

**Description:** Replace the current separate flights/fares/passengers/extras/payment/confirmation progression with the Smart Trip Builder routes and guards.

**Acceptance criteria:**

- [ ] `/search` starts the flow.
- [ ] `/availability?bound=outbound` shows outbound selection.
- [ ] `/availability?bound=return` shows return selection only after outbound is confirmed.
- [ ] `/review` requires required bounds.
- [ ] `/passengers-placeholder` is a placeholder only.

**Verification:**

- [ ] Route guard tests or manual route checks.
- [ ] `npm run typecheck -w apps/web`

**Dependencies:** Task 11.

**Files likely touched:**

- `apps/web/src/app/App.tsx`
- `apps/web/src/app/steps.ts`
- `apps/web/src/components/RouteGuard.tsx`
- New `apps/web/src/pages/AvailabilityPage.tsx`
- New `apps/web/src/pages/PassengerPlaceholderPage.tsx`

**Estimated scope:** M.

### Checkpoint: Flow Engine Ready

- [ ] Reducer/selector tests pass.
- [ ] Search-to-availability-to-review route progression works with mock data.
- [ ] Old full-funnel routes are removed, hidden, or clearly outside the PoC path.

### Phase 4: Search and Low-Fare Calendar UI

## Task 13: Build Search Form Components

**Description:** Refactor the search page into reusable components: `SearchCard`, `AirportSelector`, `PassengerSelector`, `FareTypeSelector`, `PromoCodeToggle`, and quick action links.

**Acceptance criteria:**

- [ ] Round trip and one way are selectable.
- [ ] Destination options filter after origin selection.
- [ ] Invalid destination clears when origin changes.
- [ ] Submit is disabled until required fields are valid.
- [ ] Promo code is quiet/secondary.

**Verification:**

- [ ] Component tests for validation and route filtering.
- [ ] Manual mobile and desktop check.

**Dependencies:** Tasks 4, 10, and 11.

**Files likely touched:**

- `apps/web/src/pages/SearchPage.tsx`
- `apps/web/src/components/*`
- `apps/web/src/styles/global.css`

**Estimated scope:** M.

## Task 14: Build Low-Fare Calendar and Date Picker

**Description:** Implement `LowFareCalendar` and date field behavior using mock or API-backed `FareDate[]` data.

**Acceptance criteria:**

- [ ] Daily fares display where available.
- [ ] Unavailable/no-flight dates are disabled.
- [ ] Selected outbound and return dates are visually distinct.
- [ ] Round-trip range is shown when both dates are selected.
- [ ] Apply is disabled until required dates are valid.
- [ ] Mobile uses panel/sheet behavior rather than a squeezed inline calendar.

**Verification:**

- [ ] Component tests for date selection rules.
- [ ] Manual checks at desktop and 390px mobile width.

**Dependencies:** Tasks 10 and 13.

**Files likely touched:**

- `apps/web/src/components/LowFareCalendar.tsx`
- `apps/web/src/pages/SearchPage.tsx`
- `apps/web/src/styles/global.css`

**Estimated scope:** M.

### Checkpoint: Search Ready

- [ ] User can select trip type, route, dates, passengers, direct/flexible options, and submit.
- [ ] Low-fare calendar demonstrates fare awareness.
- [ ] Search works on desktop and mobile.

### Phase 5: Availability, Fare Bundles, and Summary

## Task 15: Build Availability Shell

**Description:** Create the availability page shell with search summary header, fare date strip, sort/filter row, results column, and sticky trip summary region.

**Acceptance criteria:**

- [ ] Outbound page shows outbound flights only.
- [ ] Return page shows return flights only.
- [ ] Search summary shows route, dates, passengers, trip type, and Modify Search.
- [ ] Fare date strip shows nearby fares and selected date.
- [ ] Sort/filter controls are present, with mocked behavior acceptable for PoC.

**Verification:**

- [ ] Manual desktop layout check.
- [ ] `npm run typecheck -w apps/web`

**Dependencies:** Tasks 10-12.

**Files likely touched:**

- `apps/web/src/pages/AvailabilityPage.tsx`
- `apps/web/src/components/SearchSummaryHeader.tsx`
- `apps/web/src/components/FareDateStrip.tsx`
- `apps/web/src/styles/global.css`

**Estimated scope:** M.

## Task 16: Build Collapsed and Expanded Flight Cards

**Description:** Implement flight card states with collapsed scanning view, expanded fare choices, pending selected fare, confirmed state, and one-expanded-card-at-a-time behavior.

**Acceptance criteria:**

- [ ] Flight cards are collapsed by default.
- [ ] View fares expands one flight and collapses the previous expanded flight.
- [ ] Collapsed cards show carrier, flight number, times, airports, duration, stops, badges, baggage headline, and lowest price.
- [ ] Expanded cards show Basic/Smart/Plus fare choices.
- [ ] Selection is not indicated by color alone.

**Verification:**

- [ ] Component tests for expand/collapse and fare select events.
- [ ] Keyboard check for expand and select.

**Dependencies:** Task 15.

**Files likely touched:**

- `apps/web/src/components/FlightCard.tsx`
- `apps/web/src/components/FareBundleSelector.tsx`
- `apps/web/src/components/FareBundleCard.tsx`
- `apps/web/src/styles/global.css`

**Estimated scope:** M.

## Task 17: Build Trip Summary Panel and Mobile Bottom Summary

**Description:** Implement desktop `TripSummaryPanel`, `MobileTripSummaryBar`, and `MobileTripSummarySheet` using derived booking state.

**Acceptance criteria:**

- [ ] Empty state shows outbound and return placeholders for round trip.
- [ ] Pending fare state updates total/CTA without inventing confirmed state.
- [ ] Confirmed outbound shows return placeholder.
- [ ] Complete state shows selected segments, fares, key inclusions, passenger count, total, and next CTA.
- [ ] Mobile bottom bar does not obscure required content and opens details sheet.

**Verification:**

- [ ] Selector/component tests for empty, pending, outbound confirmed, return pending, and complete states.
- [ ] Manual desktop and mobile checks.

**Dependencies:** Tasks 11 and 16.

**Files likely touched:**

- `apps/web/src/components/TripSummaryPanel.tsx`
- `apps/web/src/components/MobileTripSummaryBar.tsx`
- `apps/web/src/components/MobileTripSummarySheet.tsx`
- `apps/web/src/styles/global.css`

**Estimated scope:** M.

## Task 18: Implement Confirm Bound CTAs

**Description:** Wire CTAs so users confirm pending fare selections and move through outbound, return, and review states.

**Acceptance criteria:**

- [ ] CTA is disabled until a pending fare selection exists for the current bound.
- [ ] Confirm outbound stores outbound selection and advances correctly.
- [ ] Confirm return stores return selection and advances to review.
- [ ] One-way skips return and advances to review after outbound confirmation.
- [ ] Review change actions can return to outbound or return selection.

**Verification:**

- [ ] Reducer tests for transitions.
- [ ] End-to-end manual check of round-trip and one-way flow.

**Dependencies:** Tasks 16 and 17.

**Files likely touched:**

- `apps/web/src/pages/AvailabilityPage.tsx`
- `apps/web/src/features/booking/bookingSlice.ts`
- `apps/web/src/features/booking/selectors.ts`

**Estimated scope:** M.

## Task 19: Build Fare Comparison Modal and Mobile Sheet

**Description:** Implement full Basic/Smart/Plus fare comparison with grouped rows, select buttons, focus management, and responsive modal/sheet behavior.

**Acceptance criteria:**

- [ ] Desktop opens centered modal.
- [ ] Mobile opens bottom sheet or full-screen sheet.
- [ ] Modal/sheet groups Baggage, Flexibility, and Onboard & Airport.
- [ ] Esc and close button close the modal.
- [ ] Focus returns to trigger after close.
- [ ] Selecting a fare updates pending selection consistently.

**Verification:**

- [ ] Component tests for open/close/select.
- [ ] Keyboard/focus manual check.

**Dependencies:** Task 16.

**Files likely touched:**

- `apps/web/src/components/FareComparisonModal.tsx`
- `apps/web/src/components/FareComparisonSheet.tsx`
- `apps/web/src/styles/global.css`

**Estimated scope:** M.

### Checkpoint: Availability Ready

- [ ] Round-trip user can select outbound fare, confirm outbound, select return fare, and confirm return.
- [ ] One-way user can select outbound fare and advance to review.
- [ ] Desktop sticky summary and mobile bottom summary reflect the same state.
- [ ] Fare comparison is accessible by keyboard.

### Phase 6: Review, Placeholder, Accessibility, and Visual Polish

## Task 20: Build Review Trip and Passenger Placeholder

**Description:** Implement the review page and passenger placeholder page for the PoC ending point.

**Acceptance criteria:**

- [ ] Review shows outbound selected card.
- [ ] Review shows return selected card for round trip.
- [ ] Each selected bound has Change flight and Change fare actions.
- [ ] Summary total and price-confidence note remain visible.
- [ ] Continue goes to passenger placeholder.
- [ ] Passenger placeholder makes clear full passenger details are out of scope for this PoC.

**Verification:**

- [ ] Manual round-trip and one-way review checks.
- [ ] Route guard prevents review without required selections.

**Dependencies:** Task 18.

**Files likely touched:**

- `apps/web/src/pages/ReviewPage.tsx`
- `apps/web/src/pages/PassengerPlaceholderPage.tsx`
- `apps/web/src/components/SelectedFlightReviewCard.tsx`
- `apps/web/src/styles/global.css`

**Estimated scope:** M.

## Task 21: Responsive and Accessibility Pass

**Description:** Verify the full PoC at desktop, tablet, and mobile widths, focusing on mobile-specific behavior, keyboard use, focus states, modal accessibility, touch targets, and text clipping.

**Acceptance criteria:**

- [ ] Core flow is keyboard-completable.
- [ ] Selected fare state has a non-color indicator.
- [ ] Date cells and mobile CTAs meet practical touch target expectations.
- [ ] No incoherent text overlap or clipping at common desktop/tablet/mobile widths.
- [ ] Mobile uses stacked cards, sheets, and bottom bars without nested horizontal scrolling inside flight/fare cards.

**Verification:**

- [ ] Browser screenshots or visual QA at desktop and around 390px mobile width.
- [ ] `npm run lint`
- [ ] `npm run test`
- [ ] `npm run build`

**Dependencies:** Tasks 13-20.

**Files likely touched:**

- `apps/web/src/styles/global.css`
- Any component needing accessibility fixes
- Optional `docs/*verification*` screenshots if requested

**Estimated scope:** M.

## Task 22: Update Project Context and Handoff Docs

**Description:** Update repo docs so future agents and developers understand the implemented PoC flow, API adapter shape, mock mode, and known backlog.

**Acceptance criteria:**

- [ ] `docs/ai-context.md` reflects the new Smart Trip Builder flow.
- [ ] `README.md` local development and verification commands remain accurate.
- [ ] Open questions and postponed features are documented.

**Verification:**

- [ ] Docs reference real files/routes only.
- [ ] No credentials, internal URLs, or production data are included.

**Dependencies:** After implementation tasks or at final checkpoint.

**Files likely touched:**

- `docs/ai-context.md`
- `docs/architecture.md`
- `README.md`
- `PLANS.md`

**Estimated scope:** S.

### Checkpoint: PoC Complete

- [ ] `npm run lint`
- [ ] `npm run test`
- [ ] `npm run build`
- [ ] `cd apps/bff && php artisan test`
- [ ] Manual desktop flow: search -> outbound fare -> return fare -> review -> passenger placeholder.
- [ ] Manual mobile flow at around 390px width.
- [ ] Figma visual review completed or explicitly deferred.

## Parallelization Opportunities

- Tasks 1 and 2 can run in parallel.
- Tasks 7 and 9 should be sequential, but frontend Task 3 can proceed from the spec at the same time.
- Search UI Tasks 13 and 14 can be split after domain types and API client contracts are stable.
- Availability components Tasks 16, 17, and 19 can be implemented by separate agents after Task 15 establishes shared props and state contracts.
- BFF mapper tests and frontend reducer tests can be developed in parallel once expected fixtures are defined.

## Risks and Mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Figma frame details drift during design iteration | Medium | Re-check the relevant Figma frame before each UI phase and record material changes in this plan or a focused design note. |
| Swagger lacks example payloads/responses | High | Request sample successful and error payloads; build mock fixtures from documented DTOs only where clear. |
| Provider fare-family data does not map cleanly to Basic/Smart/Plus | High | Preserve provider references and add a configurable mapping/fallback layer in the BFF. |
| Current app has broader full-funnel routes | Medium | Treat existing passenger/extras/payment/confirmation screens as out-of-scope scaffolding and route the PoC through passenger placeholder. |
| External API auth/config is unknown | High | Keep mock mode as default and isolate external mode behind env/config until credentials and headers are confirmed. |
| Response graph mapping is reference-heavy | Medium | Unit-test mappers with realistic fixtures before wiring UI. |
| Mobile behavior becomes squeezed desktop | Medium | Build mobile bottom bars/sheets as first-class components and verify at 390px. |

## Open Questions

- What external API base URL should the BFF use outside local Swagger `http://localhost:31380`?
- What authentication headers, tokens, customer/provider identifiers, owner, provider sources, point of sale, and channel values are required?
- Can you provide one successful sample payload/response for each provider endpoint: routes, low-fare calendar, and flight offers?
- Should BFF route names be `GET /api/flights/routes`, `POST /api/flights/calendar`, and `POST /api/flights/offers`, or should `POST /api/flights/search` remain the public availability endpoint?
- Should the PoC use the spec's LHR/BCN route and 2-adult demo data, or Bravo-specific airport/date examples?
- Should passenger selection support adults/children/infants per spec, or preserve the current adult/child/senior profile feature for now?
- Is Basic/Smart/Plus mapping standardized in Encore, or should it be customer/provider-configured for the PoC?
- Should the first implementation preserve old payment/confirmation pages behind feature flags, or remove them from the default composition?

## Minimal Acceptance Criteria

The first usable PoC is complete when a user can:

1. Open the search screen.
2. Select or use pre-filled origin/destination.
3. Select round trip or one way.
4. Select dates using a low-fare calendar.
5. Search flights.
6. See outbound availability only.
7. Expand one outbound flight.
8. Select Basic, Smart, or Plus.
9. Confirm outbound.
10. See return availability for round trip.
11. Select and confirm return fare.
12. Review the selected trip.
13. Continue to passenger placeholder.

The PoC should also demonstrate:

- Low-fare date awareness.
- Recommended Smart fare highlighting.
- Full fare comparison on demand.
- Persistent desktop trip summary.
- Mobile bottom summary and sheet behavior.
- White-label-friendly theme structure.
- BFF route/model foundation for provider routes, calendar, and flight-offer endpoints.
