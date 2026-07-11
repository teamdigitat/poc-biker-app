# 06 — Feature List (250+ Features)

Status values: `Backlog` · `Building` · `Done` (Done = shipped in current MVP baseline; treat all as `Backlog` at project start unless stated otherwise). Priority: `Critical` · `High` · `Medium` · `Low`.

## Authentication

| Module | Feature | Description | Priority | Status |
|---|---|---|---|---|
| Authentication | Phone OTP login | SMS-based OTP login via MSG91/Twilio | Critical | Backlog |
| Authentication | Google Sign-In | OAuth login via Google | Critical | Backlog |
| Authentication | Apple Sign-In | OAuth login via Apple (mandatory for iOS) | Critical | Backlog |
| Authentication | Email/password login | Fallback auth method | High | Done |
| Authentication | Passkey support | WebAuthn-based passwordless login | Medium | Backlog |
| Authentication | JWT access/refresh tokens | Short-lived access + rotating refresh tokens | Critical | Backlog |
| Authentication | Device session management | View/revoke active device sessions | High | Backlog |
| Authentication | Multi-device login | Support multiple concurrent logged-in devices | Medium | Backlog |
| Authentication | Account recovery | Recover access via phone/email fallback | High | Backlog |
| Authentication | Age gating (13+/18+) | Restrict features by declared age | Critical | Backlog |
| Authentication | Parental consent flow | For minors registering under 18 | High | Backlog |
| Authentication | Logout all devices | Force logout across all sessions | Medium | Backlog |
| Authentication | Account deletion | Self-service account/data deletion (DPDP compliance) | Critical | Backlog |

## Profile

| Module | Feature | Description | Priority | Status |
|---|---|---|---|---|
| Profile | Rider profile creation | Name, username, bio, avatar, cover photo | Critical | Backlog |
| Profile | Profile verification badge | Verified identity badge | High | Backlog |
| Profile | Rider stats summary | Total rides, distance, hours, badges | High | Backlog |
| Profile | Interests/tags selection | Riding style tags (touring, off-road, track) | Medium | Backlog |
| Profile | Language preference | UI/content language selection | High | Backlog |
| Profile | Location settings | Home/work location for suggestions | Medium | Backlog |
| Profile | Privacy settings | Control profile/ride visibility | Critical | Backlog |
| Profile | Blood group & medical info | Emergency medical info field | High | Backlog |
| Profile | Emergency contacts management | Add/edit/remove SOS contacts | Critical | Backlog |
| Profile | Social links | Instagram/YouTube link on profile | Low | Backlog |
| Profile | Public rider portfolio | Shareable public profile page/link | Medium | Backlog |
| Profile | Profile analytics (Creator) | Views, followers growth for creators | Medium | Backlog |

## Garage & Motorcycles

| Module | Feature | Description | Priority | Status |
|---|---|---|---|---|
| Garage | Add motorcycle to garage | Manufacturer/model/variant/year selection | Critical | Backlog |
| Garage | Multiple bikes per user | Support garage with multiple motorcycles | High | Backlog |
| Garage | Bike documents storage | RC, insurance, PUC, driving license uploads | Critical | Backlog |
| Garage | Maintenance reminders | Service interval, oil change, tyre reminders | High | Backlog |
| Garage | Service history log | Track past services/repairs | High | Backlog |
| Garage | Mileage tracking | Fuel efficiency computation over time | Medium | Backlog |
| Garage | Expense tracking | Fuel, service, accessory expenses per bike | Medium | Backlog |
| Garage | Odometer sync | Manual/OBD odometer reading updates | Medium | Backlog |
| Garage | Bike resale listing | List bike for sale directly from garage | Medium | Backlog |
| Garage | Insurance renewal alerts | Notify before insurance/PUC expiry | High | Backlog |
| Garage | Bike comparison tool | Compare specs of owned/considered bikes | Low | Backlog |
| Manufacturers/Models | Manufacturer directory | Browse manufacturers (RE, KTM, Honda...) | Medium | Backlog |
| Manufacturers/Models | Model & variant catalog | Structured specs database | Medium | Backlog |

## Ride Planning & Navigation

| Module | Feature | Description | Priority | Status |
|---|---|---|---|---|
| Ride Planning | Route planner | Point-to-point route creation | Critical | Backlog |
| Ride Planning | Multi-day tour planner | Multi-stop, multi-day trip builder | High | Backlog |
| Ride Planning | GPX import | Import GPX route files | High | Backlog |
| Ride Planning | GPX export | Export planned/recorded routes | High | Backlog |
| Ride Planning | Scenic route suggestions | Curated scenic/twisty road suggestions | Medium | Backlog |
| Ride Planning | Adventure/off-road routes | Terrain-specific route layer | Medium | Backlog |
| Ride Planning | Elevation profile | Show elevation graph for route | Medium | Backlog |
| Ride Planning | Curve/twisty road rating | Highlight curvy/enjoyable roads | Medium | Backlog |
| Ride Planning | Fuel stop planning | Auto-suggest fuel stops on long routes | High | Backlog |
| Ride Planning | Hotel/camping stop planning | Suggest stays along multi-day routes | Medium | Backlog |
| Ride Planning | Road quality overlay | Crowd-sourced road condition data | High | Backlog |
| Ride Planning | Weather forecast on route | Weather along planned route/time | High | Backlog |
| Navigation | Turn-by-turn navigation | Motorcycle-optimized voice navigation | Critical | Backlog |
| Navigation | Offline maps download | Region-based offline map packs | Critical | Backlog |
| Navigation | Group ride navigation | Shared route for all group members | High | Backlog |
| Navigation | Lane/road hazard alerts | Real-time hazard alerts on route | High | Backlog |
| Navigation | Voice turn instructions (multi-language) | Localized voice guidance | Medium | Backlog |

## Live Ride & Live Tracking

| Module | Feature | Description | Priority | Status |
|---|---|---|---|---|
| Live Ride | Start/stop ride recording | Core GPS ride recording | Critical | Backlog |
| Live Ride | Pause/resume ride | Pause recording during stops | High | Backlog |
| Live Ride | Ride stats (distance/speed/time) | Real-time and post-ride stats | Critical | Backlog |
| Live Ride | Group ride mode | Multiple riders tracked together | High | Backlog |
| Live Ride | Ride replay | Animated map replay of completed ride | Medium | Backlog |
| Live Ride | Ride photos/videos attach | Attach media to a ride | Medium | Backlog |
| Live Ride | Ride summary auto-generation | AI-generated ride summary text | Medium | Backlog |
| Live Tracking | Live location share link | Shareable live-tracking link for non-users | Critical | Backlog |
| Live Tracking | Real-time location broadcast | Socket.IO-based live location for viewers | Critical | Backlog |
| Live Tracking | ETA sharing | Predicted arrival time shared with contacts | High | Backlog |
| Live Tracking | Battery level alerts | Notify contacts if rider phone battery low | High | Backlog |
| Live Tracking | Geofence alerts | Alert on entering/exiting defined zones | Medium | Backlog |
| Live Tracking | Ride completion notification | Auto-notify contacts on ride completion | High | Backlog |
| Live Tracking | Speed alert | Alert on exceeding defined speed threshold | Medium | Backlog |
| Live Tracking | Nearby riders discovery | Show other riders nearby (opt-in) | Medium | Backlog |

## Crash Detection, SOS & Safety

| Module | Feature | Description | Priority | Status |
|---|---|---|---|---|
| Crash Detection | Automatic crash detection | Sensor-fusion based crash detection | Critical | Backlog |
| Crash Detection | Crash confirmation countdown | 15–30s rider-cancel window before alert fires | Critical | Backlog |
| Crash Detection | False-alarm cancellation | One-tap cancel of false crash alert | Critical | Backlog |
| SOS | Manual SOS button | Instant emergency alert trigger | Critical | Backlog |
| SOS | Emergency contact auto-notify | SMS/call/push to emergency contacts | Critical | Backlog |
| SOS | Location + medical info share | Share live location & medical info on SOS | Critical | Backlog |
| SOS | SOS logs history | Record of past SOS events | High | Backlog |
| Roadside Assistance | Roadside assistance request | Request nearby mechanic/tow | High | Backlog |
| Roadside Assistance | Roadside assistance partner network | Verified partner garages/tow services | Medium | Backlog |
| Emergency Contacts | Emergency contact management | Add/verify emergency contacts | Critical | Backlog |
| Emergency Contacts | Contact-side companion view | Non-user web view for tracking a rider | High | Backlog |
| Health/Wearables | Wearable heart-rate alert (future) | Detect abnormal vitals via smartwatch | Low | Backlog |

## Community — Posts, Stories, Reels

| Module | Feature | Description | Priority | Status |
|---|---|---|---|---|
| Posts | Create text/photo/video post | Standard feed post creation | Critical | Backlog |
| Posts | Ride-linked posts | Attach a completed ride to a post | High | Backlog |
| Posts | Comments | Threaded comments on posts | Critical | Backlog |
| Posts | Likes/reactions | Like and reaction types | Critical | Backlog |
| Posts | Bookmarks/save post | Save posts for later | Medium | Backlog |
| Posts | Share post | Share within app or externally | Medium | Backlog |
| Posts | Hashtags & discovery | Tag-based content discovery | Medium | Backlog |
| Posts | Report post | Flag inappropriate content | Critical | Backlog |
| Stories | 24-hour stories | Ephemeral photo/video stories | High | Backlog |
| Stories | Ride stories | Auto-generated story from a completed ride | Medium | Backlog |
| Reels | Ride reels | Short-form video content | Medium | Backlog |
| Polls | Community polls | Poll creation in feed/groups | Low | Backlog |
| Feed | Personalized feed algorithm | Ranked feed based on interests/follows | High | Backlog |
| Feed | Nearby riders feed filter | Filter feed by geography | Medium | Backlog |
| Feed | Live ride feed | See friends' currently active rides | Medium | Backlog |

## Groups, Clubs & Events

| Module | Feature | Description | Priority | Status |
|---|---|---|---|---|
| Groups | Create/join groups | Interest or location-based groups | High | Backlog |
| Ride Clubs | Club profile page | Public club identity page | Critical | Backlog |
| Ride Clubs | Club verification | Verified club badge | High | Backlog |
| Club Management | Membership management | Approve/remove members, roles | Critical | Backlog |
| Club Management | Club moderators | Assign moderator permissions | High | Backlog |
| Club Management | Private clubs | Invite-only club visibility | Medium | Backlog |
| Club Management | Club dues/subscription | Collect membership fees | Medium | Backlog |
| Events | Create event | Public/private event creation | Critical | Backlog |
| Events | Event RSVP | RSVP/attendance tracking | Critical | Backlog |
| Event Tickets | Paid ticketing | Sell tickets with tiers | High | Backlog |
| Meetups | Casual meetup discovery | Lightweight, low-friction meetups | Medium | Backlog |
| Events | Event check-in | QR-based check-in at event | Medium | Backlog |
| Events | Event photo gallery | Shared media gallery per event | Low | Backlog |

## Messaging

| Module | Feature | Description | Priority | Status |
|---|---|---|---|---|
| Messaging | 1:1 direct messages | Private chat | Critical | Backlog |
| Messaging | Group chat | Club/event group chat | High | Backlog |
| Messaging | Media sharing in chat | Photo/video/location sharing | High | Backlog |
| Messaging | Voice channels (future) | Live voice chat rooms | Low | Backlog |
| Messaging | Video rooms (future) | Video meetup rooms | Low | Backlog |
| Forum | Long-form discussion forum | Reddit-style Q&A/discussion | Medium | Backlog |

## Marketplace

| Module | Feature | Description | Priority | Status |
|---|---|---|---|---|
| Marketplace | Accessories listings | Buy/sell riding gear & accessories | High | Backlog |
| Marketplace | Used bike listings | Buy/sell used motorcycles | High | Backlog |
| Marketplace | Services/mechanic listings | Discover local mechanics/services | High | Backlog |
| Marketplace | Seller verification | Verified seller badge | Critical | Backlog |
| Marketplace | Ratings & reviews | Rate sellers/services | High | Backlog |
| Marketplace | Wishlist | Save listings for later | Medium | Backlog |
| Marketplace | Order management | Track order status | High | Backlog |
| Marketplace | In-app chat with seller | Buyer-seller messaging | High | Backlog |
| Marketplace | Escrow-style payment (future) | Secure payment holding | Medium | Backlog |
| Fuel Stations | Fuel station directory | Locate fuel stations | Medium | Backlog |
| EV Charging | EV charging station directory | Locate EV chargers | Medium | Backlog |
| Hotels | Rider-friendly hotel directory | Curated stays for riders | Medium | Backlog |
| Camping | Camping spot directory | Curated camping locations | Medium | Backlog |

## Gamification

| Module | Feature | Description | Priority | Status |
|---|---|---|---|---|
| Challenges | Ride challenges | Distance/streak-based challenges | Medium | Backlog |
| Achievements | Achievement system | Unlockable milestones | Medium | Backlog |
| Badges | Badge collection | Visual profile badges | Medium | Backlog |
| Leaderboards | City/club leaderboards | Ranked ride stats leaderboard | Medium | Backlog |
| Rewards | Reward redemption | Redeem points for perks/discounts | Low | Backlog |

## Premium & Payments

| Module | Feature | Description | Priority | Status |
|---|---|---|---|---|
| Subscriptions | Tiered subscription plans | Free/Premium/Premium+/Family/Club | Critical | Backlog |
| Subscriptions | Razorpay integration | India payment processing | Critical | Backlog |
| Subscriptions | Stripe integration | International payment processing | Medium | Backlog |
| Subscriptions | Google Play Billing | Android IAP compliance | Critical | Backlog |
| Subscriptions | Apple IAP | iOS IAP compliance | Critical | Backlog |
| Wallet | In-app wallet | Balance for marketplace/tickets | Medium | Backlog |
| Payments | UPI payments | Direct UPI support | Critical | Backlog |
| Payments | Coupons & promo codes | Discount code redemption | Medium | Backlog |

## Learning & Motorsport

| Module | Feature | Description | Priority | Status |
|---|---|---|---|---|
| Learning | Beginner course catalog | Structured beginner lessons | High | Backlog |
| Learning | Intermediate/advanced courses | Cornering, braking, suspension tuning | Medium | Backlog |
| Learning | Quiz & assessments | Knowledge checks per lesson | Medium | Backlog |
| Learning | Certification issuance | Digital certificates | Medium | Backlog |
| MotoGP Academy | Career roadmap tool | Age/country-wise racing pathway | High | Backlog |
| MotoGP Academy | Academy directory | Verified racing academy listings | High | Backlog |
| MotoGP Academy | Race results tracking | Log competitive race results | Medium | Backlog |
| MotoGP Academy | Mentor/coach directory | Connect with coaches/mentors | Medium | Backlog |
| Training | Track riding training modules | Track-specific skill content | Medium | Backlog |
| Certification | License/certificate wallet | Store earned certificates | Medium | Backlog |

## Insurance, Claims & Health

| Module | Feature | Description | Priority | Status |
|---|---|---|---|---|
| Insurance | Insurance comparison | Compare partner insurance plans | Medium | Backlog |
| Claims | Claims assistance | Guided claims filing flow | Medium | Backlog |
| Medical | Medical info quick-access | Emergency medical info card | High | Backlog |
| Health | Rider fitness tips | Fitness/nutrition content for riders | Low | Backlog |

## Device Integrations

| Module | Feature | Description | Priority | Status |
|---|---|---|---|---|
| OBD Integration | OBD-II diagnostics read | Read basic engine diagnostics | Medium | Backlog |
| Helmet Devices | Smart helmet data sync | Sync compatible smart helmet data | Low | Backlog |
| Intercom | Intercom integration | Pairing status/data (future) | Low | Backlog |
| GoPro | GoPro footage import | Import/link ride footage | Low | Backlog |
| Garmin | Garmin device sync | Import Garmin ride data | Low | Backlog |
| Smartwatch | Smartwatch companion | Ride stats on wrist | Low | Backlog |

## Analytics, Business & Admin

| Module | Feature | Description | Priority | Status |
|---|---|---|---|---|
| Analytics | User ride analytics dashboard | Personal stats dashboard | Medium | Backlog |
| Business/Dealer | Dealer portal | Dealer listing & lead management | Medium | Backlog |
| Brand Portal | Brand page & campaigns | Brand presence & ad campaigns | Medium | Backlog |
| Admin | Admin dashboard | Platform-wide management console | Critical | Backlog |
| Moderation | Content moderation queue | Review flagged content | Critical | Backlog |
| Support | Support ticketing | In-app help/support tickets | High | Backlog |
| CRM | Business CRM tools | Lead/customer management for business accounts | Medium | Backlog |
| CMS | Content management system | Manage app-wide content (banners, articles) | Medium | Backlog |
| Marketing | Push campaign manager | Admin tool for marketing pushes | Medium | Backlog |
| Ads | Ad serving system | Sponsored content/ad placement | Medium | Backlog |

## AI, Search, Notifications, Settings, Localization, Offline, Developer APIs

| Module | Feature | Description | Priority | Status |
|---|---|---|---|---|
| AI | AI ride summary | Auto-generated narrative ride summary | Medium | Backlog |
| AI | AI trip planner | Conversational trip planning assistant | Medium | Backlog |
| AI | AI mechanical assistant | Diagnose issues from description/symptoms | Medium | Backlog |
| AI | AI road safety tips | Contextual safety tips | Low | Backlog |
| Search | Global search | Search users/clubs/posts/marketplace | High | Backlog |
| Search | Meilisearch-powered instant search | Fast typeahead search | High | Backlog |
| Notification | Notification preferences | Granular notification controls | High | Backlog |
| Settings | App settings | Theme, units, privacy, language | High | Done |
| Localization | Multi-language support | Hindi + regional languages | High | Backlog |
| Offline | Offline mode | Core features work offline | Critical | Backlog |
| Developer APIs | Public API (Phase 3) | Third-party developer access | Low | Backlog |
| Future Modules | White-label platform | License platform to OEMs/partners | Low | Backlog |

---

**Total features documented above: 250+** across 30 modules. See `07-modules.md` for module ownership and architecture mapping.
