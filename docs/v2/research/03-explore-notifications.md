# 03 — Explore, Search, Trends & Notifications

Research captured 2026-10-05 on logged-in x.com (@PedroLo01746179), viewport 1400×900, Chrome 154 headless.
**Theme note:** the account flipped between Light ("Default") and Dark ("Lights out") several times during this session (not caused by this research — most likely another researcher in Display settings). Values are labelled **(L)** light / **(D)** dark when both were read. Screenshots are therefore a mix of light and dark; layout is identical.
Content (trend names, counts, news) is live data and changes between loads — treat strings in examples as samples, but treat UI copy (labels, headings, menu items, empty states) as exact.

Colour tokens referenced below:

| Token | Light | Dark (Lights out) |
|---|---|---|
| text | `rgb(15,20,25)` #0F1419 | `rgb(231,233,234)` #E7E9EA |
| muted | `rgb(83,100,113)` #536471 | `rgb(113,118,123)` #71767B |
| border (hairline) | `rgb(239,243,244)` #EFF3F4 | `rgb(47,51,54)` #2F3336 (X standard, not re-measured) |
| input border | `rgb(207,217,222)` #CFD9DE | `rgb(51,54,57)` #333639 (X standard, not re-measured) |
| accent | `rgb(29,155,240)` #1D9BF0 | same |
| row hover | `rgba(0,0,0,0.03)` (rows) / `rgb(247,249,249)` (typeahead option) | `rgba(255,255,255,0.03)` / `rgb(22,24,28)` (typeahead option) |
| tab hover | `rgba(15,20,25,0.1)` | `rgba(231,233,234,0.1)` |
| icon-button hover (accent) | `rgba(29,155,240,0.1)` bg + icon → accent | same |

---

## Scope map

```
Level 1 (sidebar "Explore")
└─ /explore  → renders tab "Explore" (= /explore/tabs/for_you, the canonical tab href)
   ├─ Header: search combobox (typeahead)  + Settings gear (link /settings/explore)
   ├─ Tabs (all level 2, same page shell):
   │   ├─ Explore        /explore/tabs/for_you
   │   ├─ Trending       /explore/tabs/trending
   │   ├─ News           /explore/tabs/news
   │   ├─ Sports         /explore/tabs/sports
   │   └─ Entertainment  /explore/tabs/entertainment
   ├─ Level 2 targets from content:
   │   ├─ Trend row click        → /search?q=<trend>&src=trend_click&vertical=trends   (Search results page)
   │   ├─ News story row click   → /i/trending/<storyId>   ("Grok story" page with Top/Latest tabs)
   │   ├─ "Global Trending" hero → /i/jf/global-trending/home   (level 3 – name only: "Global Trending")
   │   ├─ Who to follow "Show more" → /i/connect_people   (owned by area 04 Follow)
   │   └─ Trend "…" menu (6 feedback items, inline)
   └─ /settings/explore  (modal over Explore — "Explore settings")
       └─ "Explore locations" → /settings/explore/location  (level 3, only visible when location toggle is OFF)

Search (reachable from Explore header, right-panel search box on every other page, hashtags, trends)
├─ Typeahead dropdown (empty-focus = recent searches; typing = suggestions)
└─ /search?q=<q>&src=typed_query            Top
   ├─ &f=live   Latest
   ├─ &f=user   People
   ├─ &f=media  Media
   ├─ &f=list   Lists
   ├─ "…" next to search input → menu: Search settings (/settings/search, modal), Advanced search (/search-advanced?q=<q>, modal)
   ├─ Right panel "Search filters" (People / Location radio groups + "Advanced search" link)
   ├─ /search-advanced  (modal "Advanced search")
   └─ /hashtag/<tag>?src=hashtag_click  → same search results UI (q=#tag)

Trends: right-panel "What’s happening" → "Show more" → /explore/tabs/for-you (hyphen; = Explore tab). No /i/trends page exists. (§T1)

Level 1 (sidebar "Notifications")
└─ /notifications                 All
   ├─ /notifications/mentions     Mentions
   ├─ (/notifications/verified    Verified — only for Premium/verified viewers; redirects to /notifications on this account)
   ├─ notification row click → the post (/<handle>/status/<id>) or profile; row "…" → "See less often"
   └─ Settings gear → /settings/notifications  (level 2: Filters / Preferences)
       ├─ Filters → /settings/notifications/filters                (level 3: Quality filter, Muted notifications → /settings/notifications/advanced_filters)
       └─ Preferences → /settings/notifications/preferences   (level 3: Push → /settings/push_notifications, Email → /settings/email_notifications)
```

---

## Features

### E1. Explore page shell (header + tab bar)

- **Level / route / entry points:** L1. Sidebar "Explore" → `/explore`. The URL stays `/explore` on first load but the first tab's canonical href is `/explore/tabs/for_you`; all tabs are `/explore/tabs/<id>`. Title `Explore / X`.
- **Clone status:** MISSING — `/explore` currently hits `[handle]` → 404 (inventory §1). Sidebar item VISUAL.
- **Suggested priority:** P0
- **Complexity:** M
- **Layout & measurements (primary column, 598px wide @1400):**
  - Sticky header block, `position: sticky; top: 0; z-index: 3`, total 107px tall = search row 53px + tab row 54px (53 + 1px bottom border `#EFF3F4`). Background **opaque** white (L) / black (D) — the inner wrapper has `backdrop-filter: blur(12px)` but `background-color: rgb(255,255,255)` (fully opaque here, unlike Home's translucent header).
  - **Search row (53px):** search pill `x=359.5 → 869.5` (510px incl. 1px border) + gear button. Pill: outer 44px tall, `border-radius: 9999px`, `border: 1px solid #CFD9DE` (L), bg = page bg; transition `border-color .15s cubic-bezier(.2,0,0,1), background-color .15s …, box-shadow .15s …`. Inner content 40px. Search icon 16×16 (`color #536471`), in a 28px-wide slot with `padding-left: 12px`. `<input>` 14px / line-height 16px, `padding: 0 16px 0 4px`, placeholder **"Search"** (placeholder colour = muted). Pill left offset 16px from column edge; 12px gap → gear.
  - **Settings gear:** `<a href="/settings/explore" aria-label="Settings" data-testid="settingsAppBar">`, 36×36 round, icon 20×20 `#0F1419`, hover bg `rgba(15,20,25,0.1)` (standard icon button), transition `background-color .2s, box-shadow .2s`. Gear box x=898.5–934.5 in a column ending at 941.5 → **7px right gap**, vertically centred in the 53px row.
  - **Tab bar (53px):** `role="tablist"` inside a horizontal ScrollSnap list (`data-testid="ScrollSnap-List"`). Tabs are `<a role="tab">` with `flex-grow: 1`, `padding: 0 16px`, height 53px; measured widths @598: 113 / 121 / 98 / 106 / 160 (content-proportional, not equal). Label 15px/20px, **selected = weight 700 colour `#0F1419`**, unselected = weight **500** colour `#536471` (the clone's Inter compensation applies). Label padding 16px top/bottom.
  - **Indicator:** child of the selected label, `height: 4px; border-radius: 9999px; background: #1D9BF0;` width = label width with **min-width 56px** (e.g. "Explore" label 54.6 → bar 56; "News" → 56; "Entertainment" → 105), anchored to the bottom of the tab (y = 102 within a 53px row ⇒ flush with bottom border).
  - Tab hover: bg `rgba(15,20,25,0.1)` (L) / `rgba(231,233,234,0.1)` (D), transition `background-color .2s`.
- **Content & exact copy:** tab labels in order: **Explore**, **Trending**, **News**, **Sports**, **Entertainment** (the first one is labelled "Explore", not "For You"). Search placeholder "Search". Gear aria-label "Settings".
- **Behaviour / interactions / states:**
  - Clicking a tab is a client navigation (pushState). Content area swaps; the header does not re-render.
  - When the search input gets focus, the header row changes: a **Back arrow** (36px, `data-testid="app-bar-back"`, `aria-label="Back"`) appears at x=351.5 and the pill shrinks to 454px wide starting at x=415.5 (see S1). Blur/Escape-out restores it.
  - Overflow arrows: the tab list is wrapped in a ScrollSnap with `Previous` / `Next` buttons (`ScrollSnap-prevButtonWrapper` / `nextButtonWrapper`): 36×36 round, bg `rgba(15,20,25,0.75)` + `backdrop-filter: blur(4px)`, white arrow icon (same path as Back arrow, mirrored for Next), wrapper `transition: opacity .2s`, opacity 0 until the list is hovered **and** scrollable; `disabled` + `aria-disabled` when at an end. At 1400px and even at 480px viewport the 5 tabs fit (they shrink: 90/97/74/82/137 @480) so the arrows never show on Explore — they matter for longer tab lists (profile, search-on-mobile, etc.). Build the TabBar so it can overflow-scroll anyway.
- **Motion:** tab indicator **does not slide** — sampled every frame for 700ms after click: it jumps to the new tab when the route commits (~100–150ms after click, no transition). Tab hover bg 200ms. Search pill border/background 150ms `cubic-bezier(0.2,0,0,1)`.
- **Data model needed:** `type ExploreTabId = "for_you" | "trending" | "news" | "sports" | "entertainment"`; label map `{for_you:"Explore", trending:"Trending", news:"News", sports:"Sports", entertainment:"Entertainment"}`.
- **Routing:** `app/(app)/explore/page.tsx` (= for_you) + `app/(app)/explore/tabs/[tab]/page.tsx`. Static routes beat `[handle]` in the App Router, so `/explore` stops 404-ing. Back browser button walks tab history (each tab click is a history entry).
- **Edge / empty / loading / error states:** while a tab's timeline loads, X shows its standard 26px circular spinner (accent) centred in a ~200px cell (the trailing 200px `cellInnerDiv` seen at the bottom of News/Sports/Entertainment is the "end/loading" spacer). Error: generic "Something went wrong. Try reloading." + "Retry" button (standard timeline error, not specific to Explore — not observed here).
- **Implementation notes:** reuse `ui/tab.tsx` (already 4px accent underline) but (1) add `min-width: 56px` to the indicator and `rounded-full`, (2) unselected weight 500 + muted colour, (3) make the bar horizontally scrollable with optional arrow buttons → new shared `ScrollableTabBar`. New `ExploreHeader` = `SearchCombobox` (S1) + `IconButton` gear `Link`. The right column on Explore **has no search box** (search moves into the primary column) and **no "What’s happening" card** — it shows only "Today’s News" (3 stories, close X) + "Who to follow" + footer. The `@panel` slot for `/explore*` must omit `SearchBox` and `TrendsCard`. On `/search` the panel also has no search box (filters instead, S2); on `/i/trending/<id>` and `/notifications` the search box is back.
- **Screenshots:** `screens/03-explore-notifications/explore-for-you.png`, `explore-tab-trending.png`, `explore-tab-news.png` (dark), `explore-tab-sports.png`, `explore-tab-entertainment.png`, `explore-mobile-480.png`
- **Icons (SVG paths):**
<details><summary>SettingsIcon (gear, 24×24 viewBox) — clone lacks it</summary>

```
M10.54 1.75h2.92l1.57 2.36c.11.17.32.25.53.21l2.53-.59 2.17 2.17-.58 2.54c-.05.2.04.41.21.53l2.36 1.57v2.92l-2.36 1.57c-.17.12-.26.33-.21.53l.58 2.54-2.17 2.17-2.53-.59c-.21-.04-.42.04-.53.21l-1.57 2.36h-2.92l-1.58-2.36c-.11-.17-.32-.25-.52-.21l-2.54.59-2.17-2.17.58-2.54c.05-.2-.03-.41-.21-.53l-2.35-1.57v-2.92L4.1 8.97c.18-.12.26-.33.21-.53L3.73 5.9 5.9 3.73l2.54.59c.2.04.41-.04.52-.21l1.58-2.36zm1.07 2l-.98 1.47C10.05 6.08 9 6.5 7.99 6.27l-1.46-.34-.6.6.33 1.46c.24 1.01-.18 2.07-1.05 2.64l-1.46.98v.78l1.46.98c.87.57 1.29 1.63 1.05 2.64l-.33 1.46.6.6 1.46-.34c1.01-.23 2.06.19 2.64 1.05l.98 1.47h.78l.97-1.47c.58-.86 1.63-1.28 2.65-1.05l1.45.34.61-.6-.34-1.46c-.23-1.01.18-2.07 1.05-2.64l1.47-.98v-.78l-1.47-.98c-.87-.57-1.28-1.63-1.05-2.64l.34-1.46-.61-.6-1.45.34c-1.02.23-2.07-.19-2.65-1.05l-.97-1.47h-.78zM12 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5c.82 0 1.5-.67 1.5-1.5s-.68-1.5-1.5-1.5zM8.5 12c0-1.93 1.56-3.5 3.5-3.5 1.93 0 3.5 1.57 3.5 3.5s-1.57 3.5-3.5 3.5c-1.94 0-3.5-1.57-3.5-3.5z
```
</details>
<details><summary>Search (magnifier) used in the pill — same as clone SearchIcon? verify; X path:</summary>

```
M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z
```
</details>
<details><summary>ArrowLeftIcon (Back / ScrollSnap Previous; mirror for Next)</summary>

```
M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z
```
</details>

### E2. Explore tab "Explore" (`/explore/tabs/for_you`) — modules

- **Level / route:** L1 (default tab).
- **Clone status:** MISSING.
- **Suggested priority:** P0
- **Complexity:** M
- **Layout & measurements:** a single virtualised timeline of `cellInnerDiv`s, in this order (observed on 3 loads, stable order, contents vary):
  1. **Section header "Today's News"** — 48px cell, `h2` text 20px / weight 800 / line-height 24px, padding 12px 16px. (Straight apostrophe in the primary column: "Today's News"; the right-panel card uses a curly one "Today’s News".)
  2. **3 News story rows** (component E4) — 74px each (94px when the headline wraps to 2 lines).
  3. **Divider cell** 9px (a 1px `#EFF3F4` border + spacing — a module separator, not a full-bleed 12px "gap" like home).
  4. **6 trend rows** (component E5, non-ranked variant) — 62px each.
  5. **Divider** (0px cell, the next header carries the top border).
  6. **"Who to follow"** header (48px, same h2 style) + **3 UserCells** (with bio — 89–129px each, `padding: 12px 16px`; follow button 32px tall black pill "Follow" 14px/700) + **"Show more"** row (52px, 15px accent text, `href="/i/connect_people"`).
  7. **"Posts For You"** header (same h2 style) followed by an **infinite list of standard tweet cards** (same as home timeline).
  - A floating **"See new posts"** pill can appear under the header (see cross-cutting X3).
- **Content & exact copy:** "Today's News", "Who to follow", "Show more", "Posts For You". UserCell social-context line above the name when present, e.g. "Father Spyridon Bailey follows" (13px muted, with a small person icon).
- **Behaviour:** news row → `/i/trending/<id>` (E6). Trend row → search (S3). UserCell → profile; Follow toggles (reuse clone FollowButton). Tweets behave like home.
- **Motion:** none beyond row hover bg (200ms).
- **Data model needed:** `ExploreForYouPage { news: NewsStory[] (3), trends: Trend[] (6), whoToFollow: UserSummary[] (3), posts: Page<TimelineItem> }` — see Data model section.
- **Routing:** page.
- **Edge / empty / loading:** spinner while loading; if no news, X simply omits the module (not observed).
- **Implementation notes:** build it as a list of "modules" — `ModuleHeader` (h2 20/800 px-4 py-3), `NewsRow`, `TrendRow`, existing `UserCell` (needs bio variant), `ShowMoreRow` (already in right-panel styles: `showMore`). The home right-panel `TrendsCard` should reuse the same `TrendRow`.
- **Screenshots:** `explore-for-you.png`, `explore-trend-caret-hover.png`

### E3. Explore tab "Trending" (`/explore/tabs/trending`)

- **Level / route:** L2.
- **Clone status:** MISSING. **Priority:** P0. **Complexity:** S (after E5 exists).
- **Layout:**
  1. **"Global Trending" hero card** (168px cell): a `<button>` with `padding: 16px 8px` containing an image card 582×136, `border-radius: 12px`, `border: 2px solid rgb(39,39,42)` (D measurement — likely `#CFD9DE`-ish in light; the asset is a dark space/earth image `https://pbs.twimg.com/topics/topic/global_trending_card_newest.png`). Overlaid text at 16px inset: **"Global Trending"** (≈20px/800 white) and **"The most popular posts"** (15px white), then an outline pill button **"Explore"** (38px tall, `padding: 8px 16px`, `border: 2px solid #fff`, `border-radius: 9999px`, bg black, white 15px/700 text, margin-top 16px). Clicking anywhere → `/i/jf/global-trending/home` (level 3, title "Global Trending / X": a page with "Global Trending 🌍 Popular today" header and a tweet timeline). Recommend **P2/OUT** for the hero; it's a promo surface.
  2. Divider cell 9px.
  3. **Ranked trend rows** (E5 ranked variant) — 66px each, numbered 1…N; ~30 rows loaded, more on scroll (infinite).
- **Content & exact copy:** "Global Trending", "The most popular posts", "Explore". Category line examples: "1 · Politics · Trending", "3 · Trending in Argentina", "11 · Sports · Trending", "20 · Entertainment · Trending".
- **Screenshots:** `explore-tab-trending.png`, `global-trending-page.png`

### E4. News story row (Explore "Today's News", News/Sports/Entertainment tabs, right-panel "Today’s News")

- **Clone status:** right panel has `NewsCard` with 3 hard-coded VISUAL items (inventory §7). Primary-column variant MISSING.
- **Priority:** P0. **Complexity:** S.
- **Layout & measurements (primary column):** whole row is `role="link"` (`data-testid="trend"`, cursor pointer), `padding: 12px 16px`, height 74px (1-line headline) / 94px (2-line).
  - Headline: **17px / weight 700 / line-height 20px**, text colour, wraps (no clamp in primary column; right-panel variant clamps to 2 lines with "…").
  - Meta row 6px below: **facepile** of 3 avatars — each 24px slot, inner image 22px circle with 1px page-bg ring (white (L)/black (D)), overlapping by 12px (x = 359.5, 371.5, 383.5), each img has `box-shadow: inset 0 0 2px rgba(0,0,0,0.03)`; then 8px gap; then meta text **13px / 16px muted**: `"<time> · <category> · <count> posts"`.
- **Content & exact copy:** time is either relative "14 hours ago", "1 hour ago" or the literal **"Trending now"**; category one of "News", "Sports", "Entertainment", "Other" (observed); count abbreviated "1.7K posts", "80 posts" (right panel shows unabbreviated "1,701 posts").
- **Behaviour:** hover bg `rgba(0,0,0,0.03)` (L) — transition 200ms. Click → `/i/trending/<storyId>` (E6). No "…" menu on news rows.
- **Tabs News/Sports/Entertainment** contain **only** these rows (5 observed per tab, then the end spacer — no infinite scroll observed; category of rows matches tab but "Other" also appears).
- **Data model:** `NewsStory` (see Data model).
- **Screenshots:** `explore-tab-news.png`, `explore-tab-sports.png`, `explore-tab-entertainment.png`

### E5. Trend row (shared component — Explore, Trending tab, right-panel "What's happening")

- **Clone status:** right-panel `TrendsCard` renders 4 hard-coded rows; layout close but row/menu/"Show more" VISUAL (`components/layout/right-panel/trends-card.tsx`). Primary-column use MISSING.
- **Priority:** P0. **Complexity:** S (row) + S (menu).
- **Layout & measurements:**
  - Row `role="link"`, `data-testid="trend"`, `padding: 12px 16px`, height **62px** (non-ranked) / **66px** (ranked), hover bg `rgba(0,0,0,0.03)` (L) / `rgba(255,255,255,0.03)` (D), `transition: background-color .2s, box-shadow .2s`.
  - Line 1 (context): **13px / 16px muted** — `"Trending in Argentina"`, `"Politics · Trending"`, `"Sports · Trending"`, `"Entertainment · Trending"`, `"Technology · Trending"`. Ranked variant prefixes `"1"` + `" · "` (the middle dot is a separate 15px span, 4px side margins).
  - Line 2 (name): **15px / weight 700 / 20px**, text colour; starts 4px below line 1 (y 398→417 @ top 386).
  - Optional line 3 (not seen today but exists on X): `"12.3K posts"` 13px muted.
  - **"…" caret** (`data-testid="caret"`, `aria-label="More"`): icon 18.75px muted, inside a 34.75px round hover target with `margin: -8px` (so it doesn't add height); hover → bg `rgba(29,155,240,0.1)`, icon `#1D9BF0`; positioned top-right (y = row top + 13). Hovering the caret also keeps the row hover bg.
- **Behaviour:** click row → `/search?q=<encoded name>&src=trend_click&vertical=trends` (e.g. `/search?q=Lula&src=trend_click&vertical=trends`, page title "Lula - Search / X"). Hashtag trends use `q=%23Tag`.
- **Caret menu** (dropdown anchored to the caret's top-right, opens down-left; width ≈ 337px; 6 items × 44px; item `padding: 12px 16px`, icon 18.75px + 12px gap, label **15px / weight 700**; item hover `rgba(0,0,0,0.03)`). **All six items use the same "frown face" icon**:
  1. "The associated content is not relevant"
  2. "This trend is spam"
  3. "This trend is abusive or harmful"
  4. "Not interested in this"
  5. "This trend is a duplicate"
  6. "This trend is harmful or spammy"
  - Selecting an item was **not executed** (it sends personalisation feedback to the real account). Exact post-selection UI/copy **not observed**; for the clone: remove the trend from the list locally and show a toast.
  - Menu appears ~300ms after click on first open (lazy chunk) and then fades in quickly (opacity 0→1 within ~50ms, no scale). The clone's `.t-dropdown` (scale .95→1 + fade 150ms) is fine.
- **Data model:** `Trend` (see Data model).
- **Screenshots:** `explore-trend-caret-hover.png`, `explore-trend-menu.png`
- **Icons:**
<details><summary>MoreHorizontal (caret) — clone has MoreHorizontalIcon; FrownIcon (menu items) is new</summary>

```
Frown: M12 13.6c1.64-.013 3.278.76 4.284 2.02.114.14.218.282.317.43l-1.202.9c-.088-.102-.177-.197-.272-.289-.844-.823-1.98-1.264-3.125-1.26-1.146-.002-2.282.441-3.129 1.263-.095.092-.185.186-.273.287l-1.2-.902c.1-.149.205-.29.319-.429C8.728 14.364 10.36 13.59 12 13.6zM9.25 8c.828 0 1.5.796 1.5 1.9 0 1.105-.672 1.85-1.5 1.85s-1.5-.745-1.5-1.85c0-1.104.672-1.9 1.5-1.9zm5.5 0c.828 0 1.5.796 1.5 1.9 0 1.105-.672 1.85-1.5 1.85s-1.5-.745-1.5-1.85c0-1.104.672-1.9 1.5-1.9z
```
</details>

### E6. News story page (`/i/trending/<storyId>`)

- **Level / route:** L2 (from any news row).
- **Clone status:** MISSING. **Priority:** P1. **Complexity:** M.
- **Layout & measurements:**
  - Sticky app bar 53px: Back (36px, `app-bar-back`) on the left; right side three 36px icon buttons: **Report** (`aria-label="Report Trend"`, flag icon), **Share** (`data-testid="share-button"`, `aria-label="Share Menu"`), **More** ("…").
  - Title: **23px / weight 800 / 28px**, padding 0 16px, starts y=57 (directly under the bar, no separate header text).
  - "Last updated 14 hours ago" — 13px muted, 4px under title.
  - Summary paragraph — 15px/20px text colour, 8px below.
  - Disclaimer — 13px/16px muted: **"This story is a summary of posts on X and may evolve over time. Grok can make mistakes, verify its outputs."**
  - 1px border, then a 2-tab bar **Top / Latest** (each half-width, same tab spec as E1). Hrefs: `?timeline=<opaque>` query param (two different opaque ids).
  - Tweet timeline below (standard tweet cards).
  - Right panel: **search box restored** + "Relevant people" (UserCells with bio + Follow) + "Today’s News" card.
- **Share menu items:** "Post this", "Send via Chat", "Copy link", "Share via...".
- **Behaviour:** Back → history back. Top/Latest swap timelines in place.
- **Data model:** `NewsStory` + `summary: string`, `updatedAt`, `relatedUserIds: string[]`, `tweetIds: { top: string[]; latest: string[] }`.
- **Routing:** page `app/(app)/i/trending/[id]/page.tsx`; panel = relevant people.
- **Implementation notes:** clone's `PageHeader` + new right-aligned actions slot. Report/More are VISUAL for the clone (P2).
- **Screenshots:** `news-story-page.png`
- **Icons:**
<details><summary>FlagIcon (Report Trend) — verify vs clone FlagIcon</summary>

```
M3 2h18.61l-3.5 7 3.5 7H5v6H3V2zm2 12h13.38l-2.5-5 2.5-5H5v10z
```
</details>

### E7. Explore settings (`/settings/explore`, modal)

- **Level / route:** L2. Gear in Explore header (`<a href="/settings/explore">`). Opens as a **modal dialog over the Explore page** (also on hard load: URL `/settings/explore` renders Explore behind + modal).
- **Clone status:** MISSING. **Priority:** P2. **Complexity:** S (reuse generic Modal).
- **Layout & measurements:** modal `600×650` (fixed height on desktop), centred (x=400 @1400 → `left: calc(50% - 300px)`, top 125), `border-radius: 16px`, bg page colour. Mask full-screen `rgba(180,180,182,0.5)` measured while the theme was light — X's standard light mask is `rgba(0,0,0,0.4)`; dark mask observed visually as blue-grey (`rgba(91,112,131,0.4)` standard). App bar 53px: Close X (36px, `data-testid="app-bar-close"`, `aria-label="Close"`) at left 16px, title **"Explore settings"** 20px/700/24px at x=+72.
  - Section header **"Location"** 20px/800/24px, padding 12px 16px.
  - Row: **"Show content in this location"** (15px/20px) + description **"When this is on, you’ll see what’s happening around you right now."** (13px/16px muted), checkbox on the right.
  - **Checkbox** (not a switch): 20×20, `border-radius: 4px`, `border: 2px solid`; checked = bg + border `#1D9BF0` with white check icon; unchecked = transparent bg, border `#536471` (L) / `#71767B` (D). Row padding 12px 16px.
  - When the checkbox is **unchecked**, a new row appears below: **"Explore locations"** with a chevron-right → `/settings/explore/location` (level 3, "Explore locations" picker).
  - The old "Personalization → Trends for you" toggle **no longer exists** (only Location section).
- **Motion:** modal enter `animation: 150ms cubic-bezier(0.25,0.1,0.25,1) both` — sampled: opacity 0→0.58→0.92→1 and scale **0.92 → 1** over ~150ms; mask `150ms ease-out` fade. Exit not sampled (route back).
- **Safety:** toggled OFF to observe the "Explore locations" row, then immediately back ON (verified `checked: true`).
- **Screenshots:** `settings-explore-modal.png` (L), `settings-explore-location-off.png` (D), `settings-explore-hardload.png`
- **Icons:**
<details><summary>CheckIcon (checkbox / radio / "Yes")</summary>

```
M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z
```
</details>

### S1. Search combobox + typeahead dropdown (shared)

- **Level / route / entry points:** L1 everywhere: right-panel search box on Home/profile/status pages (`[data-testid="sidebarColumn"]`), Explore header, search results header. Same component (`data-testid="SearchBox_Search_Input"`).
- **Clone status:** VISUAL — `components/layout/right-panel/search-box.tsx` is a bare `<input type="search">` with no focus ring change, no clear button, no dropdown, no route.
- **Suggested priority:** P0. **Complexity:** M.
- **Layout & measurements:**
  - Pill: 44px outer (1px border) / 40px inner, `border-radius: 9999px`. Right-panel variant is 350px wide (panel width); Explore/search header variant fills the row (510px @598 column; 454px when the back arrow is shown).
  - Resting: `border: 1px solid #CFD9DE` (L), bg = page bg (white/black). Icon 16px muted in a 28px slot (`padding-left: 12px`). Input: `font-size: 14px; line-height: 16px; padding: 0 16px 0 4px; color: text`; placeholder "Search" in muted.
  - **Focus:** border becomes **2px `#1D9BF0`** plus `box-shadow: 0 0 0 1px #1D9BF0` (visually a 2–3px accent ring), bg unchanged; icon stays muted. Transition `border-color/background-color/box-shadow .15s cubic-bezier(0.2,0,0,1)`.
  - **Clear button** (when value non-empty): `data-testid="clearButton"`, `aria-label="Clear"`, 22×22 round, 12px from the right edge, filled **x-circle** icon 22px coloured `#0F1419` (L) with a light glyph (`color: rgb(239,243,244)` on the svg in D; i.e. a solid circle in text colour with page-bg "x"). Click → empties the input and keeps focus (dropdown switches back to recent/empty state).
  - Explore/search header: on focus a **Back** button (36px) appears left and the pill shifts right (x 361.5 → 417.5) and narrows (508 → 450 inner). Back clears focus and restores.
- **Dropdown (listbox) measurements:**
  - Wrapper: `position: absolute`, directly under the pill (top = pill bottom, no gap), **same width as the pill** (350 right panel / 454 Explore), `border-radius: 8px`, bg page colour, `box-shadow: rgba(101,119,134,0.2) 0 0 15px, rgba(101,119,134,0.15) 0 0 3px 1px` (L; in D X uses `rgba(255,255,255,0.2) 0 0 15px, rgba(255,255,255,0.15) 0 0 3px 1px` — not re-measured), `min-height: 100px`, `max-height: 667px` (≈ `calc(80vh - 53px)` at 900px), `overflow-y: auto`. `role="listbox"` id `typeaheadDropdown-N`; input has `role="combobox"`, `aria-autocomplete="list"`, `aria-owns`, `aria-activedescendant`, `aria-label="Search query"`, `enterkeyhint="search"`, `autocomplete/autocorrect="off"`, `spellcheck=false`.
  - **Empty input, no history:** centred text **"Try searching for people, lists, or keywords"** 15px/20px muted, padding-top ~20px; box 100px tall.
  - **Empty input, with history ("Recent"):** header row 48px: **"Recent"** (20px / 700 / 24px, left 16px) + **"Clear all"** pill-button on the right (24px tall, `padding: 0 12px`, text 14px/700 accent, round hover). Then one 64px `role="option"` per recent query: `padding: 12px 16px`, left icon 20px in a 40px slot (recent icon — magnifier variant), query text 15px/20px, and a **remove "X"** icon button on the right (32×32 round, X icon 18px **accent blue**, hover bg `rgba(29,155,240,0.1)`). Recent *users* (after visiting a profile from the typeahead) render like user rows with a 40px avatar — not observed (only a query was in history). Row hover bg `rgba(0,0,0,0.03)` (L) / `rgb(22,24,28)` (D, measured as the selected-row bg).
  - **Typing ("vercel"):** results arrive ~300–500ms after the last keystroke (no visible loader). Sections:
    1. **Query suggestions** (3 rows, 64px each): magnifier 20px icon + text where the typed prefix is weight 400 and the completion is **weight 700** ("vercel" + **" cloudflare"**). 
    2. 1px divider (with 4px vertical spacing).
    3. **User suggestions** (up to 10 rows, 65px each): avatar 40px circle, display name 15px/700 + verified badge 18.75px (+ affiliate badge 14px square), handle 15px muted on the next line. (Topic suggestions were not returned for this query; X uses the same 64px row with a topic icon.)
    4. **"Go to @vercel"** row (52px, 15px text, `padding: 16px`) when the query exactly matches a handle.
  - **Keyboard:** ArrowDown/ArrowUp move the active option (`aria-selected="true"` + `aria-activedescendant` update) — **the input value does NOT change** while arrowing; the active row gets the hover bg. Enter on an active query row → search for that suggestion; Enter on a user row → profile; Enter with no active row → `/search?q=<value>&src=typed_query`. **Escape** closes the dropdown but keeps focus and value. Clicking outside closes it.
  - Query rows navigate to `/search?q=<q>&src=typeahead_click`; user rows to `/<handle>`; recent rows to `/search?q=<q>&src=recent_search_click` (these `src` values are X convention, **not observed** — only `typed_query`, `trend_click`, `hashtag_click` were). For the clone the `src` param is cosmetic.
- **Motion:** dropdown appears **instantly** (no fade/scale; first open lazy-loads ~300ms). Pill focus ring 150ms. Back-arrow/pill shift is instant.
- **Data model:** `RecentSearch`, `TypeaheadResult` (see Data model). Recent searches persist per viewer (X stores server-side; for the clone `localStorage` or mock store keyed by viewer is fine).
- **Behaviour on submit:** searching a query adds it to the top of Recent (dedup). Removing via X removes one entry; "Clear all" removes all (X asks no confirmation in the dropdown — not executed, it would wipe the owner's history).
- **Implementation notes:** new shared primitive `Combobox`/`TypeaheadDropdown` (portal not needed — absolute under the pill). Debounce input ~150ms. Server data via `features/search/api/get-typeahead.ts` returning `{ queries: string[], users: UserSummary[] }` from mocks (prefix match on handle/displayName, plus 3 canned query completions). Reuse `Avatar` md (40px) and verified badge.
- **Safety:** the search "vercel" I typed was added to the owner's Recent list; I removed it again with its X (it was the only recent entry before → list back to empty) — see S-note in the final section.
- **Screenshots:** `search-focus-empty.png`, `search-typeahead-typing.png`, `search-typeahead-keyboard.png` (D), `search-recent-searches.png`
- **Icons:**
<details><summary>ClearCircleFillIcon (clear button)</summary>

```
M12 1.75C6.34 1.75 1.75 6.34 1.75 12S6.34 22.25 12 22.25 22.25 17.66 22.25 12 17.66 1.75 12 1.75zm3.71 12.54l-1.42 1.42-2.29-2.3-2.29 2.3-1.42-1.42 2.3-2.29-2.3-2.29 1.42-1.42 2.29 2.3 2.29-2.3 1.42 1.42-2.3 2.29 2.3 2.29z
```
</details>
<details><summary>CloseIcon (remove recent / "No" button) — clone has CloseIcon; X path</summary>

```
M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z
```
</details>

### S2. Search results page (`/search?q=…`)

- **Level / route / entry points:** L2. Enter in any search box → `/search?q=<q>&src=typed_query`; trend click → `&src=trend_click&vertical=trends`; hashtag click → `/hashtag/<tag>?src=hashtag_click` (same UI). Title **`<q> - Search / X`**.
- **Clone status:** MISSING. **Priority:** P0 (Top/Latest/People), P1 (Media/Lists). **Complexity:** L.
- **Layout & measurements:**
  - Sticky header like Explore: row 1 = **Back** (36px, always visible here) + search pill pre-filled with the query (x=417.5, 450px inner) + **"…" overflow** (`data-testid="searchBoxOverflowButton"`, `aria-label="More"`, 36px) on the right.
  - Row 2 = tabs **Top / Latest / People / Media / Lists** (same TabBar spec as E1; widths 107/124/129/124/114).
    - Top `…&src=typed_query` · Latest `&f=live` · People `&f=user` · Media `&f=media` · Lists `&f=list` (the `f` param is appended after `src`).
  - **Top:** mixed timeline of tweet cards (possibly with a "People" module of 3 UserCells + "View all" — not seen for "vercel" today). Query terms are **bold (700)** inside tweet text. After a few posts a **relevance prompt** row appears under a tweet: bg `rgb(247,249,249)` (L), `border-top: 1px solid #EFF3F4`, `padding: 12px 16px`, `margin-top: -2px`, a small caret/notch pointing up at the tweet (≈ x=368), text **"Is this post relevant to your search?"** (15px muted) and two outline pills **"No ✕"** / **"Yes ✓"** (32px tall, `padding: 0 12px 0 15px`, `border: 1px solid rgba(15,20,25,0.1)`, round; icon after label: No = red X `#F4212E`, Yes = green check `#00BA7C`). P2 for the clone.
  - **Latest:** reverse-chronological tweets only (no modules).
  - **People:** list of `UserCell`s — `padding: 12px 16px`, avatar 40px, name 15/700 + badges, handle muted, **Follow** button (32px tall, black pill, label 14px/700 white, `aria-label="Follow @handle"`) right-aligned, bio 15px below (rows 65px without bio, 89–129px with). Infinite scroll.
  - **Media:** **3-column square grid**, tiles 194×194 with **4px gaps** and 4px outer padding (x = 347.5 / 545.5 / 743.5; rows 198px apart). Each tile is a link to `/<handle>/status/<id>/photo/1` or `/video/1`; video tiles show a duration badge bottom-left ("0:30") — same badge as tweet media (area 02).
  - **Lists:** `listCell` rows 72px, `padding: 12px 16px`: 48×48 thumbnail with **`border-radius: 12px`** (default thumbnail = solid colour square with a white "list" glyph), name 15/700 + `" · 77 members"` 13px muted, second line = facepile (22px avatars) + "24 followers including @sahilwise" 13px muted, OR owner line (16px avatar + **name 13/700** + @handle muted). Right: **"+" follow-list** button 32×32 round, bg text colour (`#0F1419` (L)), white plus icon 18px, `aria-label="Follow"`. Row click → `/i/lists/<id>` (owned by area 05).
- **Right panel on search pages:** **no search box**. Stack: **"Search filters"** title card (350×50, `border: 1px solid #EFF3F4`, radius 16, title 20/800) → **filters card** (S4) → "Today’s News" → "What's happening" (trends) → Who to follow → footer.
- **"…" overflow menu** (187px wide, 2 items, 44px each): **"Search settings"** (gear icon) → `/settings/search`; **"Advanced search"** (magnifier icon) → `/search-advanced?q=<q>`.
- **Behaviour:** editing the query in the header + Enter loads new results (whether the current `f` tab is kept was **not verified** — default to keeping it). Back → previous page. Infinite scroll on Top/Latest/People/Media; Lists showed 7 results then the end spacer.
- **Edge / empty states (exact copy, identical on Top/Latest/People/Lists):**
  - Heading: **`No results for "zxqvqzxv9971"`** — 31px / weight 800 / line-height 36px (straight double quotes around the query).
  - Body: **"Try searching for something else, or check your Search settings to see if they’re protecting you from potentially sensitive content."** — 15px/20px muted; "Search settings" is an accent link → `/settings/search`. Block max-width 400px (`padding: 0 32px; margin: 32px auto`), left-aligned text, no illustration. Media tab with no results rendered empty (no copy observed — treat as same empty state).
  - Applying "People you follow" + "Near you" to "vercel" also produced this empty state.
- **Data model:** `SearchTab = "top" | "live" | "user" | "media" | "list"`; `searchTweets(q, tab, filters, cursor) → Page<TimelineItem>`; `searchUsers(q) → Page<UserSummary & {bio, followedByViewer}>`; `searchLists(q) → Page<ListSummary>`. Matching on mocks: case-insensitive substring over tweet text / displayName / handle / bio. Highlight matches with `<strong>` (700).
- **Routing:** page `app/(app)/search/page.tsx` reading `searchParams` (`q`, `f`, `pf`, `lf`, `src`). `@panel/search/page.tsx` → filters + trends. `/hashtag/[tag]` → redirect or render same page with `q=#tag`.
- **Implementation notes:** reuse `TimelineFeed` (accepts a fetcher), `UserCell` + `FollowButton`, TabBar from E1. Tweet text needs entity rendering (hashtags/mentions → links, area 02) for hashtag click to work.
- **Screenshots:** `search-results-top.png` (D), `search-tab-latest.png`, `search-tab-people.png`, `search-tab-media.png`, `search-tab-lists.png`, `search-overflow-menu.png`, `search-empty-state.png`, `trend-click-search.png`
- **Icons:**
<details><summary>PlusIcon (list follow) — clone has PlusIcon; X path</summary>

```
M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7z
```
</details>

### S3. Search filters (right-panel card)

- **Clone status:** MISSING. **Priority:** P1. **Complexity:** S.
- **Layout:** card 350px wide, `border: 1px solid #EFF3F4`, `border-radius: 16px`, bg page colour, margin-bottom 16px, inner padding 12px 16px.
  - Group label **"People"** 15px/700, then radio rows **"From anyone"** / **"People you follow"**; group **"Location"** with **"Anywhere"** / **"Near you"**; 12px between groups. Each radio row is a `<label>` 28px tall (`padding: 4px 0`), text 15px/20px, control on the right.
  - **Radio control:** 20×20, `border-radius: 32px` (circle), `border: 2px solid`; checked = filled `#1D9BF0` with white check icon; unchecked = page bg + border `#536471` (L) / `#71767B` (D).
  - Last row: **"Advanced search"** link (52px, `padding: 16px`, 15px accent) → `/search-advanced`; hover bg `rgba(0,0,0,0.03)`, bottom corners rounded.
- **Behaviour:** selecting a radio immediately navigates to the same search with a param: "People you follow" → `&pf=on`, "Near you" → `&lf=on`; selecting the defaults removes them.
- **Screenshots:** `search-results-top.png`, `search-filters-pf-lf.png`

### S4. Advanced search (`/search-advanced`, modal)

- **Level / route:** L2 from the search "…" menu (`/search-advanced?q=<q>` — prefills **"All of these words"** with q, verified) or the filters card link (`/search-advanced`). Opens as a modal over the current page; hard load renders it over Home.
- **Clone status:** MISSING. **Priority:** P2. **Complexity:** M (many fields, but just a form that builds a query string).
- **Layout:** same modal shell as E7 (600×650, radius 16, 150ms scale .92→1 + fade). App bar: Close X (left), title **"Advanced search"** (20/700), primary pill **"Search"** on the right (32px tall, 81px wide, `padding: 0 16px`, bg text colour — measured `rgb(239,243,244)` with dark label in dark mode; light mode = `#0F1419` with white label (X's standard primary pill, inferred), label 14px/700). Body scrolls inside the modal.
  - Section headers 20px/800/24px, `padding: 12px 16px`: **Words**, **Accounts**, **Filters**, **Engagement**, **Dates**.
  - **Text field** (floating label, identical to the clone's auth inputs): `<label>` 58px tall, `border: 1px solid #CFD9DE` (L), `border-radius: 4px`, margin 12px 16px; label text 17px muted when empty → 13px when focused/filled (transition `transform/color/font-size/padding-top .15s cubic-bezier(.4,0,.2,1)`); input 17px/24px text colour at y+28. Focus: border `#1D9BF0` + `box-shadow: 0 0 0 1px #1D9BF0`, label turns accent. Helper text under each field 13px muted, `padding: 4px 8px 0`.
- **Fields (exact labels → helper text, `name`):**
  - Words
    - "All of these words" → "Example: what’s happening · contains both “what’s” and “happening”" (`allOfTheseWords`)
    - "This exact phrase" → "Example: happy hour · contains the exact phrase “happy hour”" (`thisExactPhrase`)
    - "Any of these words" → "Example: cats dogs · contains either “cats” or “dogs” (or both)" (`anyOfTheseWords`)
    - "None of these words" → "Example: cats dogs · does not contain “cats” and does not contain “dogs”" (`noneOfTheseWords`)
    - "These hashtags" → "Example: #ThrowbackThursday · contains the hashtag #ThrowbackThursday" (`theseHashtags`)
    - "Language" select (58px, floating label "Language", default **"Any language"**; 44 options: Any language, Arabic, Arabic (Feminine), Bangla, Bulgarian, Catalan, Croatian, Czech, Danish, Dutch, English, Finnish, French, German, Greek, Gujarati, Hebrew, Hindi, Hungarian, Indonesian, Italian, Japanese, Kannada, Korean, Marathi, Norwegian, Persian, Polish, Portuguese, Romanian, Russian, Serbian, Simplified Chinese, Slovak, Spanish, Swedish, Tamil, Thai, Traditional Chinese, Turkish, Ukrainian, Urdu, Vietnamese)
  - Accounts
    - "From these accounts" → "Example: @X · sent from @X" (`fromTheseAccounts`)
    - "To these accounts" → "Example: @X · sent in reply to @X" (`toTheseAccounts`)
    - "Mentioning these accounts" → "Example: @SFBART @Caltrain · mentions @SFBART or mentions @Caltrain" (`mentioningTheseAccounts`)
  - Filters
    - **"Replies"** checkbox row (56px, 15/700 label, checkbox right, default ON) + radios "Include replies and original posts" / "Only show replies" (`replyFilter`)
    - **"Links"** checkbox row (default ON) + radios "Include posts with links" / "Only show posts with links" (`linkFilter`)
  - Engagement (number inputs): "Minimum replies" → "Example: 280 · posts with at least 280 replies" (`minReplies`); "Minimum Likes" → "Example: 280 · posts with at least 280 Likes" (`minLikes`); "Minimum reposts" → "Example: 280 · posts with at least 280 reposts" (`minRetweets`)
  - Dates: **"From"** and **"To"**, each = three selects **Month** (January…December), **Day** (1…31), **Year** (2026 … 2006) + a 52×52 **"Calendar"** icon button (opens a native date input).
- **Behaviour:** "Search" builds a query string with X operators and navigates to `/search?q=…&src=typed_query&f=top`. Submit **not executed** (would add to recent searches); the operator mapping below is X's documented grammar, not observed: words joined by space; `"exact phrase"`; `(a OR b)`; `-word`; `#tag`; `(from:user)`; `(to:user)`; `(@a OR @b)`; `lang:xx`; `filter:replies` / `-filter:replies`; `filter:links` / `-filter:links`; `min_replies:N`, `min_faves:N`, `min_retweets:N`; `since:YYYY-MM-DD`, `until:YYYY-MM-DD`.
- **Recommendation:** P2 — implement the form and only honour words/from/min_faves on the mocks.
- **Screenshots:** `advanced-search-modal.png` (D), `advanced-search-focus.png` (L)

### S5. Search settings (`/settings/search`, modal) — level 2 (from search "…" menu and the empty-state link)

- Modal over Home (hard load) / over current page. Title **"Search settings"**. Two checkbox rows (both ON for this account):
  - **"Hide sensitive content"** — "This prevents posts with potentially sensitive content from displaying in your search results. Learn more"
  - **"Remove blocked and muted accounts"** — "Use this to eliminate search results from accounts you’ve blocked or muted. Learn more"
- **Priority:** OUT/P2 (no sensitive-content or block data in mocks). Name + link target are enough. Screenshot: `settings-search.png`.

### S6. Hashtag search (`/hashtag/<tag>?src=hashtag_click`)

- Hashtag entities in tweet text are accent links (`color: #1D9BF0`, `href="/hashtag/BuenLunes?src=hashtag_click"`). Click → **search results UI with the query `#BuenLunes`** in the pill, title **"#BuenLunes - Search / X"**, tabs keep the `/hashtag/...` path: Top `/hashtag/BuenLunes?src=hashtag_click`, Latest `…&f=live`, People `…&f=user`, Media `…&f=media`, Lists `…&f=list`. The "…" menu here links to plain `/search-advanced` (no q).
- **Clone status:** MISSING (no entity parsing — inventory §4). **Priority:** P1 (depends on area 02's text entities). **Implementation:** `app/(app)/hashtag/[tag]/page.tsx` re-using the search page component with `q = "#" + tag`.
- Screenshot: `hashtag-click.png`

### T1. Trends "Show more" target

- Right-panel "What's happening" → **"Show more"** is `<a href="/explore/tabs/for-you">` (note the **hyphen**). That URL renders the Explore page with the **"Explore" tab selected** (URL stays `/explore/tabs/for-you`; tab hrefs are `/explore/tabs/for_you` with underscore). There is **no separate `/i/trends` page** in the current web client.
- **Clone:** make `TrendsCard` "Show more" a `Link` to `/explore/tabs/for-you`, and treat `for-you` as an alias of `for_you` in the `[tab]` route (or redirect). Rows link to `/search?q=…&src=trend_click&vertical=trends`. **Priority:** P0, **Complexity:** S.
- Right-panel module (home) measured for reference: title **"What’s happening"** (curly apostrophe), 4 trend rows, "Show more". Owned visually by area 01; the row component is E5.
- Screenshot: `trends-show-more-target.png`

---

### N1. Notifications page shell (`/notifications`)

- **Level / route / entry points:** L1, sidebar "Notifications". Title **"Notifications / X"** (same title on every tab).
- **Clone status:** MISSING (`/notifications` → `[handle]` 404). Sidebar item VISUAL, no badge (inventory §2).
- **Suggested priority:** P0. **Complexity:** M.
- **Layout & measurements:**
  - Sticky header 107px (`position: sticky; top: 0`), **translucent** bg `rgba(255,255,255,0.85)` (L) + `backdrop-filter: blur(12px)` (unlike Explore, which is opaque). Row 1 (53px): `h2` **"Notifications"** 20px / 700 / 24px at left 16px; **Settings gear** right (36px, `<a href="/settings/notifications" aria-label="Settings" data-testid="settingsAppBar">`, icon 20px, same as Explore gear). Row 2: tab bar (same TabBar spec as E1, 53px + 1px border).
  - **Tabs observed on this (non-Premium) account: "All" `/notifications` and "Mentions" `/notifications/mentions`** (two equal-ish flex tabs: 278 / 320px). **There is no "Verified" tab** for this account and `/notifications/verified` **redirects to `/notifications`**. Premium/verified accounts get a third tab "Verified" (`/notifications/verified`) between them — build the TabBar data-driven and show "Verified" only when `viewer.verified` (not observable here).
  - Right panel on Notifications: standard (search box + "What’s happening" + "Who to follow" + footer).
- **Behaviour:** tab click = client navigation; **indicator jumps instantly** (sampled: x 454 → 747 between frames ~150ms and ~300ms after click, no slide). Scroll position resets to top per tab.
- **Unread badge (sidebar):** this account had **0 unread** — no badge rendered (`aria-label="Notifications"`). When unread > 0 X renders a small accent badge over the bell (count text, white, `aria-label="N unread items"`) and clears it when `/notifications` is opened — **not observed**; coordinate with area 01 (sidebar).
- **Sidebar icon:** active = filled bell (path below), inactive = outline bell (clone has `NotificationsIcon`; needs `NotificationsActiveIcon`).
- **Routing:** `app/(app)/notifications/page.tsx` (All) and `app/(app)/notifications/mentions/page.tsx` (+ optional `verified`). Panel = default home panel.
- **Screenshots:** `notif-all.png` (L), `notif-mentions.png`
- **Icons:**
<details><summary>NotificationsActiveIcon (filled bell)</summary>

```
M11.996 2c-4.062 0-7.49 3.021-7.999 7.051L2.866 18H7.1c.463 2.282 2.481 4 4.9 4s4.437-1.718 4.9-4h4.236l-1.143-8.958C19.48 5.017 16.054 2 11.996 2zM9.171 18h5.658c-.412 1.165-1.523 2-2.829 2s-2.417-.835-2.829-2z
```
</details>
<details><summary>Outline bell (X's current path — compare with clone NotificationsIcon)</summary>

```
M19.993 9.042C19.48 5.017 16.054 2 11.996 2s-7.49 3.021-7.999 7.051L2.866 18H7.1c.463 2.282 2.481 4 4.9 4s4.437-1.718 4.9-4h4.236l-1.143-8.958zM12 20c-1.306 0-2.417-.835-2.829-2h5.658c-.412 1.165-1.523 2-2.829 2zm-6.866-4l.847-6.698C6.364 6.272 8.941 4 11.996 4s5.627 2.268 6.013 5.295L18.864 16H5.134z
```
</details>

### N2. Notification row (`article[data-testid="notification"]`) — the "icon + facepile + text" layout

- **Clone status:** MISSING. **Priority:** P0. **Complexity:** M.
- **Observed type on this account:** only **recommendation notifications** (19 items, Sep 21 → today, all with the purple ✦ spark icon: "a post you might like from <account>"). No likes/reposts/follows/mentions exist on this account, so those variants are specified below from the shared layout + X conventions and marked **not observed**.
- **Layout & measurements (recommendation, measured):**
  - `<article role="article" tabindex="0" data-testid="notification">`, `padding: 12px 16px`, cursor pointer, bottom border 1px `#EFF3F4`, hover bg `rgba(0,0,0,0.03)` (L) / `rgba(255,255,255,0.03)` (D) with `transition: background-color .2s`. Heights observed 109 / 117 / 149px (depends on text lines + thumbnail).
  - **Two columns:** left **icon column 40px wide** (icon right-aligned: 30×30 icon at x = col+10), **8px gap**, right content column (flex 1).
  - **Type icon:** 30×30 svg, `fill` set inline: recommendation spark **`#794BC4`** (rgb(121,75,196)).
  - **Content column, row 1 — facepile:** avatars **32×32** circles (one for recommendations; for grouped types X shows up to 8 side-by-side with 4px spacing — not observed), linking to the profile.
  - Row 2 (12px below avatars): **name 15px/700** text colour + `·` + **time** (15px muted, relative "2h"/"Oct 4"/"Sep 27").
  - Row 3: the post text **15px/20px muted** (`data-testid="tweetText"`), **clamped to 3 lines** (`-webkit-line-clamp: 3; overflow: hidden`), ending with "…".
  - **Media thumbnail** (when the post has media): **64×64, `border-radius: 12px`**, right-aligned (16px from the edge), vertically starting 28px from the top; content column shrinks to 442px (479px without thumbnail).
  - **"…" caret** top-right (`data-testid="caret"`, 18.75px muted icon, 34.75px hover circle accent 10%), same component as trend caret.
- **Caret menu (recommendation):** single item **"See less often"** (frown icon). Not executed (feedback).
- **Click behaviour:** clicking the row (anywhere but avatar/caret) opens the **post**: `/sarahli/status/2106949829243133954`. Avatar → profile.
- **Grouped / other types — spec to implement (NOT observed on this account; icon colours are X's standard palette):**

  | type | icon (30px) | colour | text template | click target |
  |---|---|---|---|---|
  | `like` | heart filled (clone `LikeActiveIcon`) | `#F91880` | "**Name** liked your post" / "**Name** and **N others** liked your post" / "… liked your reply" | the liked post |
  | `repost` | repost (clone `RetweetIcon`) | `#00BA7C` | "**Name** reposted your post" / "**Name** and N others reposted …" | the post |
  | `follow` | person filled | `#1D9BF0` | "**Name** followed you" / "**Name** and N others followed you" | single: profile; grouped: follower list |
  | `recommendation` (observed) | spark ✦ | `#794BC4` | (no sentence — avatar + name · time + post text) | the post |
  | `new_post` (subscribed bell) | bell filled | `#1D9BF0` | "New post notifications for **Name**" + post text | the post |
  | `login` / security | X logo (clone `XLogoIcon`) | `#0F1419` (text colour) | "There was a login to your account @handle from a new device on <date>. Review it now." | `/settings/sessions` (level 3) |
  | `milestone` / generic | X logo or spark | — | e.g. "Your post got N likes" | the post |

  Grouping rule on X: likes/reposts/follows on the same target within a time window are aggregated into one row; facepile shows up to 8 avatars (32px, 4px gap) and the sentence names the first actor + "and N others". Text excerpt of *your* post is shown muted below the sentence (15px, clamp 3). Unread rows on X are **not** tinted in the current web client (could not verify — no unread items).
- **Mentions / replies** (type `mention`, `reply`, `quote`) render as a **full tweet card** (`data-testid="tweet"` inside the cell) with "Replying to @you" context — identical to timeline cards (area 02). Not observed (Mentions empty).
- **Data model:** see `Notification` union below.
- **Implementation notes:** new `features/notifications/components/notification-row.tsx` with an icon map; reuse `Avatar` (add a 32px `sm` size), `MoreButton` + `dropdown-menu` for the caret, existing tweet card for mentions. Rows are links via the clone's "overlay link" pattern (like tweet cards).
- **Screenshots:** `notif-all.png`, `notif-hover.png` (D), `notif-caret-menu.png`, `notif-click-target.png`, `notif-scrolled-end.png`
- **Icons:**
<details><summary>SparkIcon (recommendation notification, fill #794BC4)</summary>

```
M22.99 11.295l-6.986-2.13-.877-.326-.325-.88L12.67.975c-.092-.303-.372-.51-.688-.51-.316 0-.596.207-.688.51l-2.392 7.84-1.774.657-6.148 1.82c-.306.092-.515.372-.515.69 0 .32.21.6.515.69l7.956 2.358 2.356 7.956c.09.306.37.515.69.515.32 0 .6-.21.69-.514l1.822-6.15.656-1.773 7.84-2.392c.303-.09.51-.37.51-.687 0-.316-.207-.596-.51-.688z
```
</details>

### N3. Mentions tab (`/notifications/mentions`) and empty states

- **Clone status:** MISSING. **Priority:** P1. **Complexity:** S.
- Content = tweet cards that mention the viewer, newest first, infinite scroll.
- **Empty state (observed, exact copy):** heading **"Nothing to see here — yet"** (31px / 800 / 36px, em-dash with spaces) + body **"When someone mentions you, you’ll find it here."** (15px/20px muted). No illustration. Container `max-width: 400px; padding: 0 32px; margin: 32px auto` (same `emptyState` component as search).
- "All" tab empty state (not observed; X copy): "Nothing to see here — yet" / "From likes to reposts and a whole lot more, this is where all the action happens." — mark as unverified.
- Verified tab empty state (not available on this account; X copy, unverified): "Nothing to see here — yet" / "Likes, mentions, reposts, and a whole lot more — when it comes from a verified account, you’ll find it here."
- **Screenshot:** `notif-mentions.png`

### N4. Loading & infinite scroll

- The list is a virtualised timeline; on first load the header renders immediately and the list area shows a centred circular spinner (accent, ~26px) until cells arrive (not captured — loads were fast). When scrolling to the end, a trailing ~200px cell holds the spinner while the next page loads; on this account the list ended after 19 items (oldest Sep 21) and the trailing cell rendered empty — **no explicit "end of list" copy**.
- "See new posts" pill (X3) can slide under the header when new notifications arrive.
- Clone: reuse the feed's IntersectionObserver pagination (`Page<T>` + cursor) and add the spinner primitive (X1).

### N5. Notifications settings (`/settings/notifications`) — level 2

- Opened by the gear (client navigation, full page — **not a modal**, unlike Explore/Search settings). Title "Notifications / X". Uses the **two-pane settings layout** (owned by area 05): left `section[aria-label="Section navigation"]` 450px wide with "Settings" header + search input + nav rows (Your account, Monetization, Premium, Security and account access, Privacy and safety, **Notifications** (active), Accessibility, display, and languages, Additional resources, Help Center); right `section[aria-label="Section details"]` 600px.
- **Detail pane content (exact):**
  - Header **"Notifications"** (20/700) + description **"Select the kinds of notifications you get about your activities, interests, and recommendations."** (13px muted, padding 16px)
  - Row (72px, icon left 64px column, chevron right): **"Filters"** — "Choose the notifications you’d like to see — and those you don’t." → `/settings/notifications/filters`
  - Row: **"Preferences"** — "Select your preferences by notification type." → `/settings/notifications/preferences`
- **Level 3 (names only):**
  - `/settings/notifications/filters` "Filters": checkbox **"Quality filter"** (ON) — "Choose to filter out content such as duplicate or automated posts. This doesn’t apply to notifications from accounts you follow or have interacted with recently. Learn more"; link row **"Muted notifications"** → `/settings/notifications/advanced_filters`.
  - `/settings/notifications/preferences` "Preferences": "Select your preferences by notification type. Learn more"; rows **"Push notifications"** → `/settings/push_notifications`, **"Email notifications"** → `/settings/email_notifications`.
- **Priority:** P2 (static structure only), Complexity S once area 05's settings shell exists.
- **Screenshots:** `settings-notifications.png`, `settings-notif-filters.png`, `settings-notif-preferences.png`

---

## Data model (proposed — none of this exists in the clone)

Put shared contracts in `src/types/` (consumed by right panel + features), feature-only shapes in `features/<f>/types`.

```ts
// types/trend.ts
export type TrendContext =
  | { kind: "location"; location: string }            // "Trending in Argentina"
  | { kind: "category"; category: string };           // "Politics · Trending", "Sports · Trending"

export interface Trend {
  id: string;                 // "trend-lula"
  name: string;               // "Lula" | "#BuenLunes"
  query: string;              // what the search uses: "Lula" | "#BuenLunes"
  context: TrendContext;
  postCount: number | null;   // 12345 → "12.3K posts" (optional third line; null = hidden)
  rank?: number;              // only on /explore/tabs/trending
}

// types/news.ts
export type NewsCategory = "News" | "Sports" | "Entertainment" | "Technology" | "Other";
export interface NewsStory {
  id: string;                         // "2106980744711307745"
  headline: string;                   // "OpenAI's GPT-6 Astra Tops Design Arena Leaderboards"
  category: NewsCategory;
  postCount: number;                  // 1700 → "1.7K posts" (row) / "1,700 posts" (right panel)
  publishedAt: string;                // ISO; rendered "14 hours ago" or "Trending now" if isTrendingNow
  isTrendingNow: boolean;
  facepile: UserSummary[];            // exactly 3 avatars
  summary: string;                    // story page paragraph
  relatedUserIds: string[];           // "Relevant people" panel
  topTweetIds: string[];
  latestTweetIds: string[];
}

export type ExploreTabId = "for_you" | "trending" | "news" | "sports" | "entertainment";

// features/search/types
export type SearchTab = "top" | "live" | "user" | "media" | "list";   // URL f= param (top = absent)
export interface SearchParams {
  q: string;
  tab: SearchTab;
  peopleYouFollow: boolean;   // pf=on
  nearYou: boolean;           // lf=on
  src?: "typed_query" | "trend_click" | "hashtag_click" | "typeahead_click" | "recent_search_click";
}
export interface RecentSearch {
  id: string;
  kind: "query" | "user";
  query?: string;             // "vercel"
  user?: UserSummary;
  searchedAt: string;
}
export interface TypeaheadResult {
  queries: string[];          // ["vercel", "vercel cloudflare", "vercel acquired"] (max 3)
  users: (UserSummary & { verified: boolean })[]; // max 10
  exactHandle?: string;       // → "Go to @vercel"
}
export interface ListSummary {
  id: string; name: string; memberCount: number; followerCount: number;
  owner: UserSummary; bannerUrl: string | null;
  followerFacepile: UserSummary[]; followedByViewer: boolean;
}

// types/notification.ts — discriminated union, grouped server-side
interface NotificationBase {
  id: string;
  createdAt: string;          // newest event in the group
  read: boolean;
}
export type Notification =
  | (NotificationBase & { type: "like";    actors: UserSummary[]; actorCount: number; tweet: Tweet })        // grouped
  | (NotificationBase & { type: "repost";  actors: UserSummary[]; actorCount: number; tweet: Tweet })        // grouped
  | (NotificationBase & { type: "follow";  actors: UserSummary[]; actorCount: number })                      // grouped
  | (NotificationBase & { type: "mention" | "reply" | "quote"; tweet: Tweet })                               // rendered as TweetCard
  | (NotificationBase & { type: "recommendation"; author: UserSummary; tweet: Tweet })                       // spark, observed
  | (NotificationBase & { type: "new_post"; author: UserSummary; tweet: Tweet })                             // bell
  | (NotificationBase & { type: "login"; device: string; location?: string });                               // X logo

export type NotificationTab = "all" | "mentions" | "verified";
// getNotifications(tab, cursor) → Page<Notification>; mentions tab = filter type ∈ {mention, reply, quote}
// getUnreadNotificationCount() → number (sidebar badge); markNotificationsRead() on page view.
```

**Mock generation hints:** derive notifications from existing mocks — likes/reposts/follows by mock users on the viewer's (`Elpepodev`) tweets, grouped per tweet per 24h (actors ≤ 8 shown, `actorCount` total), plus a few `recommendation` rows pointing at popular mock tweets and replies to the viewer as `reply`. Trends: ~30 entries (mix of `Trending in Argentina`, `Technology · Trending`, `Sports · Trending`, hashtags) whose `query` actually matches mock tweet text so trend → search returns results. News: 5 per category with 3-avatar facepiles from mock users.

## Cross-cutting findings

- **X1 TabBar (shared, needed by Explore, Search, Notifications, News story, profile):** items = `{label, href, selected}`; height 53px + 1px bottom border; tabs `flex: 1 1 auto`, `padding: 0 16px`, min content width; label 15px/20px, selected 700 + text colour, unselected **500** + muted; hover bg 10% text colour, 200ms; indicator 4px, `border-radius: 9999px`, accent, **width = label width, min 56px**, flush bottom, **no slide animation** (instant swap). Horizontally scrollable with prev/next 36px arrow buttons (`rgba(15,20,25,0.75)` + `blur(4px)`, white arrow, fade 200ms on hover, disabled at ends). Clone `ui/tab.tsx` needs: min-width 56 + rounded indicator + weight 500 + scroll container.
- **X2 SearchCombobox + TypeaheadDropdown:** spec in S1 (pill 44px, focus ring 2px accent + 1px spread shadow, 150ms `cubic-bezier(.2,0,0,1)`; clear button 22px; dropdown `radius 8`, double shadow, `min-height 100`, `max-height ~80vh-53`, instant; option rows 64/65/52px; ARIA combobox pattern). Used in right panel, Explore header, search header.
- **X3 "See new posts" pill:** absolute under the sticky header in a 60px slot that slides with `transform .35s cubic-bezier(0,0,0,1)`; pill 28px tall, `padding: 4px 16px`, radius 9999, bg `#1D9BF0`, `box-shadow: rgba(101,119,134,0.2) 0 0 8px, rgba(101,119,134,0.25) 0 1px 3px 1px`, white 15px text "See new posts" + up-arrow icon, aria-label "New posts are available. Push the period key to go to the them." (sic). Present on Explore, search, notifications, news story (also home — area 01).
- **X4 Generic Modal (route-intercepted):** settings/explore, settings/search, search-advanced all use: 600×650 desktop (fixed height, inner scroll), radius 16, top 125 @900 viewport (vertically centred: `top: calc(50% - 325px)`), app bar 53px with Close (36px, `app-bar-close`) + 20/700 title + optional right action pill; enter **150ms `cubic-bezier(0.25,0.1,0.25,1)` scale 0.92→1 + opacity 0→1**; mask fade 150ms ease-out. Hard load of the URL renders the modal over Explore (settings/explore) or Home (settings/search, search-advanced). The clone needs a shared `ui/modal.tsx` (focus trap from `features/auth/utils/trap-focus.ts` should move to shared).
- **X5 Checkbox (20px, radius 4, 2px border) and Radio (20px circle, 2px border, filled accent + white check when on)** — new shared form primitives; used by Explore settings, search filters, advanced search, search settings, notification filters.
- **X6 Module primitives for timelines:** `ModuleHeader` (h2 20/800/24, `padding: 12px 16px`), `ShowMoreRow` (52px, 15px accent, hover row bg), module divider (1px border), `TrendRow`, `NewsRow`, `UserCell` (with bio + social-context line), `ListCell`. Right-panel cards should compose the same rows (card = `border 1px, radius 16, mb 16`).
- **X7 EmptyState:** `max-width 400; padding 0 32px; margin 32px auto`; heading 31px/800/36px; body 15px/20px muted, 8px gap; optional inline accent link. Copy table: search no-results, Mentions empty (see S2/N3).
- **X8 Row hover:** every clickable row uses `background-color` transition 200ms to `rgba(0,0,0,0.03)` (L) / `rgba(255,255,255,0.03)` (D); the clone's `row` style in `right-panel/styles.ts` (`hover:bg-white/3`) already matches the dark value.
- **X9 Icon-button "caret" (…):** 18.75px muted icon, 34.75px circular hover target via negative margin −8px, hover accent 10% + accent icon, 200ms — shared by trends, notifications, tweets.
- **X10 Number formatting:** counts "1.7K posts", "80 posts", "1,701 posts" (right-panel card shows full number with comma). Relative time "14 hours ago" (news) vs compact "2h"/"Oct 4" (notifications, tweets).

## Open questions / not observed

- **Theme flips:** the account switched Light/Dark repeatedly during the session (another agent in Display settings). Dark values recorded where seen; some light values for the same element (dropdown shadow in dark, input border in dark) were not re-measured.
- **Rate limiting:** X returned HTTP 429 on `Viewer`/`settings.json` for ~10 minutes mid-session (5 agents in parallel); work resumed afterwards. Some secondary measurements were skipped as a result.
- **Notification types other than "recommendation"** (like, repost, follow, mention/reply, new-post bell, login, milestones, community/spaces) — **not observed**: the account has none. The table in N2 uses X's known templates/colours; verify icon paths when an account with activity is available (clone already has heart/repost icons; follow and login icons still needed).
- **Unread badge + unread row highlighting + "mark read"** — not observable (0 unread).
- **Verified notifications tab** — not available (non-Premium account; URL redirects). Empty-state copy for All/Verified quoted from X but **unverified**.
- **Trend/notification feedback menu actions** ("Not interested in this", "See less often", …) not executed (would send feedback for the real account); post-action UI not observed.
- **Advanced search submit** not executed; query-operator mapping is X's documented grammar.
- **Typeahead `src` values** other than `typed_query`, `trend_click`, `hashtag_click` not directly observed. Topic suggestions in the typeahead not returned for the test query.
- **"Clear all" recent searches** not executed (owner's history). 
- **Loading spinner** dimensions not captured (loads too fast); reuse whatever area 01/02 measures for the timeline spinner.
- **News story "…" (header)** menu not opened.

## Safety log

- Explore settings "Show content in this location": toggled **OFF → ON** within ~4s to observe the hidden "Explore locations" row; verified `checked: true` afterwards.
- Search "vercel" (typed + Enter) added one entry to Recent searches; **removed it** via its X in the typeahead (list verified back to the empty state "Try searching for people, lists, or keywords").
- Search filter radios ("People you follow", "Near you") only change the URL (`pf=on`, `lf=on`) — no persistent setting.
- No posts, likes, follows, DMs, list follows, or feedback submissions were made.
