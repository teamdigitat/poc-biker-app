# 19 — MotoGP Career Roadmap Module

**Disclaimer (shown in-app):** Riding Verse provides informational guidance compiled from publicly available and partner-academy information. It does not guarantee racing outcomes, sponsorships, or professional placement. Costs are estimates and vary by region, provider, and year. Always verify current requirements with official bodies (FMSCI/MMSC in India, FIM internationally).

## 1. Roadmap Structure (Age & Stage-Based)

| Stage                              | Typical Age | What Happens                                                                                         | Est. Cost (India, INR/year)                          | Licenses/Requirements                                |
| ---------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------- |
| Foundation (Mini Bike/Pocket Bike) | 6–12        | Pocket bike / mini-moto training at go-karting-style tracks                                          | ₹1–3 Lakh                                            | None formal; academy enrollment                      |
| Grassroots Racing                  | 12–16       | Junior national-level mini-bike championships (e.g., Idemitsu Honda India Talent Cup style programs) | ₹5–15 Lakh                                           | State/national junior racing license via FMSCI       |
| National Championship              | 16–18       | National-level circuit racing (INMRC and similar)                                                    | ₹10–25 Lakh                                          | FMSCI national racing license                        |
| Asian Championship Pathway         | 17–21       | Asia Talent Cup, Asia Road Racing Championship entries                                               | ₹25–60 Lakh                                          | FIM Asia license, sponsor backing typically required |
| Moto3                              | 18–24       | International Moto3 grid (FIM Moto3 World Championship or feeder series)                             | ₹1–3 Crore+                                          | FIM international license, team contract             |
| Moto2                              | 21+         | Progression from Moto3 based on results                                                              | ₹2–5 Crore+                                          | FIM international license, team contract             |
| MotoGP                             | 22+         | Premier class, by invitation/contract only                                                           | Team-funded (rider does not self-fund at this stage) | FIM MotoGP license                                   |

_Note: costs above are illustrative estimates for planning purposes only, covering training, equipment, travel, and entry fees; actual costs vary significantly by team/sponsorship arrangement._

## 2. India-to-International Pathway (Narrative)

1. **Track Days & Local Racing (Age 14+):** Start with supervised track days at circuits like MMRT (Chennai), BIC (Buddh International Circuit), or Kari Motor Speedway (Coimbatore).
2. **Academy Enrollment:** Join an FMSCI/MMSC-affiliated racing academy for structured coaching (race craft, bike setup basics, fitness).
3. **National Championship Circuit:** Compete in INMRC (Indian National Motorcycle Racing Championship) or similar to build a race record.
4. **Scouting & Talent Cups:** Programs like Idemitsu Asia Talent Cup scout from national circuits — strong results here are the most common bridge to international exposure.
5. **International Feeder Series:** Strong Asia Talent Cup / ARRC results can lead to Moto3 test/wildcard opportunities.
6. **Professional Contract:** Moto3 → Moto2 → MotoGP progression is team-contract-driven, based on results and sponsor backing, not self-funded beyond the Moto3 stage in most cases.

## 3. Roadmap Screen Features (see SCR-205 in `08-screen-flow.md`)

- Personalized timeline based on rider's current age and city.
- Cost estimator with editable assumptions (own bike vs. academy-provided, travel frequency).
- Academy directory filtered by proximity and stage relevance.
- Milestone tracker (mark "Enrolled in Academy," "First Race Completed," "National License Obtained," etc.) with shareable progress cards.
- Mentor/coach directory for 1:1 guidance requests.
- Scholarship & sponsorship info repository (curated list of known scholarship programs, kept updated by Content Manager role in admin CMS).

## 4. Common Mistakes (Educational Content Shown In-App)

- Skipping structured training and jumping straight into competitive racing.
- Underestimating fitness/reaction-training requirements (see `18-future-features.md` learning modules: fitness, nutrition, mental training, reaction training, vision training).
- Over-investing in bike upgrades before securing adequate track time/coaching.
- Ignoring documentation/licensing timelines (national licenses can take months to process).
- Not building a visible track record (race results, footage) that scouts and sponsors can discover — this is precisely what the Race Results and Career Progress tracker in Riding Verse solves.

## 5. Fitness, Diet & Mental Training Pathway (Learning Platform Cross-Reference)

- **Fitness:** cardiovascular endurance, neck/core strength specific to racing g-forces.
- **Nutrition:** weight management appropriate for bike class, hydration/race-day nutrition planning.
- **Mental Training:** focus/visualization techniques, race-day pressure management.
- **Reaction & Vision Training:** reaction-time drills, peripheral vision and track-reading exercises.
  All delivered as structured courses within the Learning module (`07-modules.md` #22), tagged as "Professional Racing" track.

## 6. Data Model Cross-Reference

See `11-database-schema.md`: `career_roadmap_milestones`, `user_career_progress`, `academies`, `training_institutes`, `race_events`, `race_results`, `mentors`, `mentor_connections`.
