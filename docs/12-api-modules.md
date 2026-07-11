# 12 — API Modules (REST + GraphQL)

Base URL: `https://api.ridingverse.com/v1`. REST for CRUD/mobile-critical paths; GraphQL (`/graphql`) for flexible read-heavy aggregation (feed, profile, dashboards). All endpoints documented via OpenAPI/Swagger at `/docs`. Socket.IO namespace: `/realtime`.

## 1. Auth Module (`/auth`)
| Method | Path | Description |
|---|---|---|
| POST | /auth/otp/request | Request OTP for phone number |
| POST | /auth/otp/verify | Verify OTP, issue tokens |
| POST | /auth/google | Google OAuth login |
| POST | /auth/apple | Apple OAuth login |
| POST | /auth/email/login | Email/password login |
| POST | /auth/email/register | Email/password registration |
| POST | /auth/passkey/register | Register passkey credential |
| POST | /auth/passkey/login | Passkey login |
| POST | /auth/refresh | Exchange refresh token for new access token |
| POST | /auth/logout | Revoke current session |
| POST | /auth/logout-all | Revoke all sessions |
| GET | /auth/sessions | List active sessions/devices |
| DELETE | /auth/sessions/:id | Revoke a specific session |
| DELETE | /auth/account | Request account deletion |

## 2. Profile Module (`/users`)
| Method | Path | Description |
|---|---|---|
| GET | /users/me | Get own profile |
| PATCH | /users/me | Update profile fields |
| GET | /users/:id | Get public profile |
| POST | /users/me/avatar | Upload avatar |
| POST | /users/me/cover-photo | Upload cover photo |
| PATCH | /users/me/privacy | Update privacy settings |
| POST | /users/me/emergency-contacts | Add emergency contact |
| GET | /users/me/emergency-contacts | List emergency contacts |
| DELETE | /users/me/emergency-contacts/:id | Remove emergency contact |
| GET | /users/:id/stats | Get rider stats |
| POST | /users/:id/follow | Follow user |
| DELETE | /users/:id/follow | Unfollow user |

## 3. Garage Module (`/garage`)
| Method | Path | Description |
|---|---|---|
| GET | /garage | List user's motorcycles |
| POST | /garage | Add motorcycle |
| GET | /garage/:id | Get motorcycle detail |
| PATCH | /garage/:id | Update motorcycle |
| DELETE | /garage/:id | Remove motorcycle |
| POST | /garage/:id/documents | Upload document |
| GET | /garage/:id/documents | List documents |
| POST | /garage/:id/maintenance | Log maintenance record |
| GET | /garage/:id/maintenance | Get maintenance history |
| POST | /garage/:id/reminders | Create service reminder |
| POST | /garage/:id/fuel-logs | Log fuel entry |
| GET | /garage/:id/expenses | Get expense log |
| GET | /manufacturers | List manufacturers |
| GET | /manufacturers/:id/models | List models for manufacturer |

## 4. Ride Planning & Navigation Module (`/routes`, `/navigation`)
| Method | Path | Description |
|---|---|---|
| POST | /routes | Create planned route |
| GET | /routes/:id | Get route detail |
| POST | /routes/gpx-import | Import GPX file |
| GET | /routes/:id/gpx-export | Export route as GPX |
| GET | /routes/scenic | Get curated scenic routes |
| GET | /routes/adventure | Get curated adventure/off-road routes |
| POST | /routes/:id/fuel-stops | Get suggested fuel stops |
| POST | /routes/:id/hotel-stops | Get suggested hotel/camp stops |
| GET | /routes/:id/elevation | Get elevation profile |
| GET | /routes/:id/weather | Get weather forecast on route |
| POST | /road-hazards | Report a road hazard |
| GET | /road-hazards | Get hazards near location |
| GET | /navigation/offline-maps | List downloadable regions |
| POST | /navigation/offline-maps/:region/download | Trigger region download prep |

## 5. Rides Module (`/rides`)
| Method | Path | Description |
|---|---|---|
| POST | /rides | Start a new ride |
| POST | /rides/:id/points | Batch-submit GPS points |
| POST | /rides/:id/pause | Pause ride |
| POST | /rides/:id/resume | Resume ride |
| POST | /rides/:id/stop | Stop & finalize ride |
| GET | /rides/:id | Get ride detail |
| GET | /rides | List user's ride history |
| DELETE | /rides/:id | Delete a ride |
| POST | /rides/:id/photos | Attach photo |
| GET | /rides/:id/replay | Get replay data |
| POST | /rides/:id/invite | Invite rider to group ride |
| POST | /rides/:id/join-request | Request to join open ride |

## 6. Live Tracking Module (`/tracking`, WS `/realtime`)
| Method | Path | Description |
|---|---|---|
| POST | /tracking/:rideId/share | Create/get share link & token |
| GET | /tracking/share/:token | Public (no-auth) live view data |
| WS | /realtime (event: `location:update`) | Real-time location push to viewers |
| PATCH | /tracking/settings | Update sharing preferences |
| GET | /tracking/nearby-riders | Get nearby opt-in riders |

## 7. Safety Module (`/safety`)
| Method | Path | Description |
|---|---|---|
| POST | /safety/sos/trigger | Trigger SOS |
| POST | /safety/sos/cancel | Cancel SOS during countdown |
| GET | /safety/sos/history | Get SOS log history |
| POST | /safety/crash/report | Submit detected crash signal (client-side ML result) |
| POST | /safety/crash/:id/confirm | Confirm crash / false alarm |
| POST | /safety/geofences | Create geofence |
| GET | /safety/geofences | List geofences |
| POST | /safety/roadside-assistance | Request roadside assistance |
| GET | /safety/roadside-assistance/:id | Get assistance request status |
| GET | /safety/assistance-partners | List nearby partners |

## 8. Community Module (`/posts`, `/stories`, `/reels`)
| Method | Path | Description |
|---|---|---|
| POST | /posts | Create post |
| GET | /posts/feed | Get personalized feed |
| GET | /posts/:id | Get post detail |
| POST | /posts/:id/like | Like post |
| DELETE | /posts/:id/like | Unlike post |
| POST | /posts/:id/comments | Add comment |
| GET | /posts/:id/comments | List comments |
| POST | /posts/:id/bookmark | Bookmark post |
| POST | /posts/:id/report | Report post |
| POST | /stories | Create story |
| GET | /stories/feed | Get stories tray |
| POST | /reels | Create reel |
| GET | /reels/feed | Get reels feed |
| POST | /polls | Create poll |
| POST | /polls/:id/vote | Vote on poll |

## 9. Clubs, Groups & Events Module (`/clubs`, `/groups`, `/events`)
| Method | Path | Description |
|---|---|---|
| POST | /clubs | Create club |
| GET | /clubs/:id | Get club detail |
| POST | /clubs/:id/join | Join/request to join club |
| GET | /clubs/:id/members | List members |
| PATCH | /clubs/:id/members/:userId/role | Update member role |
| POST | /clubs/:id/dues | Configure dues |
| GET | /clubs/discover | Discover clubs |
| POST | /groups | Create group |
| POST | /events | Create event |
| GET | /events/:id | Get event detail |
| POST | /events/:id/rsvp | RSVP to event |
| POST | /events/:id/tickets | Create ticket tier |
| POST | /events/:id/tickets/:ticketId/purchase | Purchase ticket |
| POST | /events/:id/checkin | Check in attendee (QR) |

## 10. Messaging Module (`/conversations`, WS `/realtime`)
| Method | Path | Description |
|---|---|---|
| POST | /conversations | Start conversation |
| GET | /conversations | List conversations |
| GET | /conversations/:id/messages | Get message history |
| POST | /conversations/:id/messages | Send message |
| WS | /realtime (event: `message:new`) | Real-time message delivery |
| POST | /conversations/:id/read | Mark as read |

## 11. Marketplace Module (`/marketplace`)
| Method | Path | Description |
|---|---|---|
| POST | /marketplace/listings | Create listing |
| GET | /marketplace/listings | Search/browse listings |
| GET | /marketplace/listings/:id | Get listing detail |
| PATCH | /marketplace/listings/:id | Update listing |
| POST | /marketplace/listings/:id/wishlist | Add to wishlist |
| POST | /orders | Create order |
| GET | /orders/:id | Get order detail |
| POST | /orders/:id/status | Update order status |
| POST | /reviews | Submit review |
| GET | /directory/fuel-stations | List fuel stations |
| GET | /directory/ev-stations | List EV chargers |
| GET | /directory/hotels | List hotels |
| GET | /directory/mechanics | List mechanics |

## 12. Gamification Module (`/challenges`, `/achievements`, `/leaderboards`)
| Method | Path | Description |
|---|---|---|
| GET | /challenges | List active challenges |
| POST | /challenges/:id/join | Join a challenge |
| GET | /achievements | List achievement definitions |
| GET | /users/:id/badges | Get user's earned badges |
| GET | /leaderboards | Get leaderboard (scoped by query params) |

## 13. Payments & Subscriptions Module (`/payments`, `/subscriptions`, `/wallet`)
| Method | Path | Description |
|---|---|---|
| GET | /subscriptions/plans | List available plans |
| POST | /subscriptions | Create/upgrade subscription |
| POST | /subscriptions/cancel | Cancel subscription |
| POST | /payments/razorpay/order | Create Razorpay order |
| POST | /payments/razorpay/webhook | Razorpay webhook receiver |
| POST | /payments/stripe/webhook | Stripe webhook receiver |
| POST | /payments/apple-iap/verify | Verify Apple IAP receipt |
| POST | /payments/google-play/verify | Verify Google Play purchase |
| GET | /wallet | Get wallet balance |
| POST | /wallet/add-money | Top up wallet |
| GET | /wallet/transactions | Get transaction history |
| POST | /coupons/apply | Apply coupon code |

## 14. Learning & Career Module (`/learning`, `/career`)
| Method | Path | Description |
|---|---|---|
| GET | /learning/courses | List courses |
| GET | /learning/courses/:id | Get course detail |
| POST | /learning/courses/:id/enroll | Enroll in course |
| GET | /learning/courses/:id/lessons/:lessonId | Get lesson content |
| POST | /learning/quizzes/:id/attempt | Submit quiz attempt |
| GET | /learning/certificates | List user's certificates |
| GET | /career/roadmap | Get personalized career roadmap |
| GET | /career/academies | List academies |
| POST | /career/race-results | Log race result |
| GET | /career/mentors | List mentors |

## 15. AI Services Module (`/ai`)
| Method | Path | Description |
|---|---|---|
| POST | /ai/ride-summary/:rideId | Generate AI ride summary |
| POST | /ai/trip-planner | Conversational trip planning request |
| POST | /ai/mechanical-assistant | Submit symptoms for diagnosis |
| POST | /ai/road-safety-tip | Get contextual safety tip |

## 16. Admin Module (`/admin`) — RBAC protected
| Method | Path | Description |
|---|---|---|
| GET | /admin/moderation/queue | Get moderation queue |
| POST | /admin/moderation/:id/action | Take moderation action |
| GET | /admin/users | Search/list users |
| PATCH | /admin/users/:id/status | Suspend/ban/reinstate user |
| GET | /admin/analytics/overview | Platform-wide analytics summary |
| POST | /admin/cms/content | Create/update CMS content block |
| POST | /admin/feature-flags | Create/update feature flag |
| GET | /admin/support/tickets | List support tickets |

## 17. Search Module (`/search`)
| Method | Path | Description |
|---|---|---|
| GET | /search | Global search (users/clubs/posts/listings) |
| GET | /search/suggestions | Typeahead suggestions (Meilisearch) |

## 18. Notifications Module (`/notifications`)
| Method | Path | Description |
|---|---|---|
| GET | /notifications | List notifications |
| POST | /notifications/:id/read | Mark as read |
| PATCH | /notifications/preferences | Update notification preferences |

## GraphQL Schema (Key Types, Summary)
```graphql
type Query {
  me: User
  feed(cursor: String, limit: Int): PostConnection
  ride(id: ID!): Ride
  club(id: ID!): Club
  marketplaceListings(filter: ListingFilter): ListingConnection
  careerRoadmap(age: Int, country: String): [RoadmapMilestone]
}

type Mutation {
  createPost(input: CreatePostInput!): Post
  likePost(postId: ID!): Post
  startRide(input: StartRideInput!): Ride
  triggerSOS(input: SOSInput!): SOSLog
}

type Subscription {
  liveLocationUpdated(rideId: ID!): LocationUpdate
  newMessage(conversationId: ID!): Message
}
```

## Versioning & Deprecation Policy
- URI versioning (`/v1`, `/v2`); minimum 6-month deprecation notice for breaking changes.
- All responses include `X-API-Version` header; mobile app enforces minimum supported API version via remote config force-update gate.
