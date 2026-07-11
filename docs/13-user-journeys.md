# 13 — User Journeys

## 1. First-Time User Onboarding → First Tracked Ride
```mermaid
flowchart TD
    A[Install App] --> B[Splash]
    B --> C[Onboarding Slides]
    C --> D[Permissions: Location, Notifications, Motion]
    D --> E[Phone OTP Login]
    E --> F[Profile Setup]
    F --> G[Select Motorcycle]
    G --> H[Select Interests]
    H --> I[Add Emergency Contact]
    I --> J[Home Feed]
    J --> K[Tap Start Ride]
    K --> L[Live Ride Recording]
    L --> M[Stop Ride]
    M --> N[Ride Summary + Share Prompt]
```
**Key success moment:** completing first tracked ride with an emergency contact configured — the core "safety trust" moment.

## 2. Solo Female Rider — Safety-First Ride
```mermaid
flowchart TD
    A[Open App] --> B[Start Ride]
    B --> C[Auto-suggest: Share Live Location?]
    C -->|Yes| D[Select Emergency Contacts to Notify]
    D --> E[Live Ride Recording w/ Family Watching Link Active]
    E --> F{Crash Signal Detected?}
    F -->|No| G[Ride Completed Normally]
    F -->|Yes| H[Crash Countdown 20s]
    H -->|Rider Cancels| G
    H -->|No Response| I[SOS Triggered - Contacts Notified via Push+SMS]
    I --> J[Contact Opens Public Tracking Link]
    J --> K[Rider Marked Safe / Escalate to Emergency Services]
```

## 3. Club Organizer — Planning a Paid Multi-Day Tour
```mermaid
flowchart TD
    A[Club Admin Home] --> B[Create Event]
    B --> C[Set Multi-Day Itinerary via Route Planner]
    C --> D[Add Hotel/Camping Stops]
    D --> E[Configure Ticket Tiers]
    E --> F[Publish Event]
    F --> G[Members Discover & Purchase Tickets]
    G --> H[Organizer Sends Reminders + Checklist]
    H --> I[Event Day: QR Check-in]
    I --> J[Group Ride with Shared Navigation]
    J --> K[Post-Event Gallery + Reviews]
```

## 4. Marketplace — Selling a Used Motorcycle
```mermaid
flowchart TD
    A[Garage: Select Bike] --> B[Tap List for Sale]
    B --> C[Auto-fill Specs from Garage Data]
    C --> D[Add Photos + Price]
    D --> E[Publish Listing]
    E --> F[Buyer Views Listing]
    F --> G[Buyer Chats with Seller]
    G --> H[Buyer Makes Offer / Buy Now]
    H --> I[Payment via Razorpay/UPI]
    I --> J[Order Status: Confirmed -> Handover -> Completed]
    J --> K[Buyer Leaves Review]
```

## 5. MotoGP Aspirant — Discovering the Career Pathway
```mermaid
flowchart TD
    A[Discovers Career Roadmap in Feed/Ad] --> B[Opens Career Roadmap Screen]
    B --> C[Enters Age + City]
    C --> D[Personalized Roadmap Generated]
    D --> E[Views Nearby Academies]
    E --> F[Views Cost Estimator]
    F --> G[Contacts Academy via In-App Message]
    G --> H[Enrolls Offline, Logs Milestone in App]
    H --> I[Logs First Race Result]
    I --> J[Roadmap Progress Updated + Shareable Achievement]
```

## 6. Crash Detection → Emergency Response (Critical Path)
```mermaid
sequenceDiagram
    participant Rider
    participant App
    participant Backend
    participant EmergencyContact
    Rider->>App: Riding (sensors streaming)
    App->>App: ML model detects crash signature
    App->>Rider: Show countdown modal (20s)
    alt Rider responds "I'm OK"
        Rider->>App: Cancel
        App->>Backend: Log false_alarm outcome
    else No response
        App->>Backend: POST /safety/sos/trigger (auto)
        Backend->>Backend: Create sos_log, crash_event(confirmed)
        Backend->>EmergencyContact: Push + SMS with location link
        EmergencyContact->>Backend: Opens tracking link
        Backend->>App: Notify rider "contacts notified"
    end
```

## 7. Delivery Rider — Daily Utility Flow
```mermaid
flowchart TD
    A[Open App - Quick Home Screen] --> B[Start Ride - No-frills mode]
    B --> C[Background GPS Tracking]
    C --> D[Fuel Stop - Log Fuel Entry]
    D --> E[Continue Riding]
    E --> F[End of Day: Stop Ride]
    F --> G[View Daily Distance + Fuel Cost Summary]
    G --> H[Optional: SOS available throughout]
```

## 8. Brand — Running a Sponsored Campaign
```mermaid
flowchart TD
    A[Brand Portal Login] --> B[Create Brand Page]
    B --> C[Create Ad Campaign - Target by City/Interest/Bike Type]
    C --> D[Set Budget + Creative]
    D --> E[Submit for Admin Review]
    E --> F[Campaign Goes Live in Feed]
    F --> G[Riders See Sponsored Post/Event]
    G --> H[Brand Views Analytics Dashboard - Impressions/Clicks/Conversions]
```
