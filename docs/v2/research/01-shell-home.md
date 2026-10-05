# 01 — Shell & Home

Researched 2026-10-05 against logged-in x.com (@PedroLo01746179), headless Chrome 154, light theme ("Default") unless stated.
All measurements are `getBoundingClientRect` / `getComputedStyle` values at 1400×900 unless another width is given.
Screenshots: `screens/01-shell-home/`.

> Caveat: during this session another researcher briefly switched the account to dark mode twice (seen in `dock-chat-open.png`). Every colour below was re-checked with `body` = `rgb(255,255,255)`; dark values are given where they were captured.

## Scope map

```
Shell (every logged-in route)
├── Left sidebar <header role="banner">
│   ├── X logo → /home
│   ├── Home → /home                          (L1, this area)
│   ├── Explore → /explore                    (L1, area 03)
│   ├── Notifications → /notifications        (L1, area 03)
│   ├── Follow → /i/connect_people            (L1, area 04)
│   ├── Chat → /i/chat                        (L1, area 04; shell collapses to icons there)
│   ├── Grok → /i/grok                        (L1, area 04)
│   ├── History → /i/history  (/i/bookmarks redirects here) (L1, area 04)
│   ├── Creator Studio → /i/jf/creators/studio (L1, area 04)
│   ├── Premium → /i/premium_sign_up          (L1, area 04)
│   ├── Profile → /{handle}                   (L1, area 05)
│   ├── More (popover menu, L2)
│   │   ├── Lists → /{handle}/lists           (area 05)
│   │   ├── Communities → /{handle}/communities (area 05)
│   │   ├── [Creator Studio / Premium / History when they overflow, see §1.6]
│   │   ├── Business → /i/verified-orgs-signup (L3, name only)
│   │   ├── Ads → https://ads.x.com/?ref=gl-tw-tw-twitter-ads-rweb (external)
│   │   ├── Create your Space → /i/spaces/start (L3, name only)
│   │   └── Settings and privacy → /settings  (area 05)
│   ├── Post button → /compose/post (modal, L2)
│   └── Account switcher (popover, L2)
│       ├── Add an existing account → /i/flow/login (L3, out of scope)
│       └── Log out @handle → /logout (exists in clone)
├── Floating dock (bottom-right, ≥1078px wide)
│   ├── Grok drawer button → mini Grok panel (L2)
│   └── Chat drawer button → mini Chat panel (L2; content = area 04)
├── Mobile (<500px): top bar (avatar → drawer, X logo, Subscribe) + bottom tab bar + compose FAB
└── Keyboard shortcuts modal ("?") (L2)

/home (L1)
├── Sticky header: For you | Following | "+" (pinned timelines popover, L2)
├── Inline composer (L1) → toolbar pickers (L2): Media, GIF, Poll, Emoji, Schedule, Location(disabled), Content disclosure, Everyone can reply
├── Compose modal /compose/post (L2) → Drafts /compose/post/unsent/drafts (L2/3), Schedule modal, "Save post?" dialog
├── "Show N posts" pill
└── Timeline (tweet cards = area 02)

Right panel on /home
├── Search box + typeahead (L2) → results /search?q=…&src=typed_query (area 03)
├── Subscribe to Premium card → /i/premium_sign_up (area 04)
├── Today's News card (close X) → story pages /i/trending/{id} (area 03)
├── What's happening (trends + "…" menu) → Show more /explore/tabs/for-you (area 03)
├── Who to follow → Show more /i/connect_people?user_id=… (area 04)
└── Footer links + "More" popover
```

## Features

### 1. Left sidebar (expanded, ≥1265px)

- **Level / route / entry points:** L1, present on every logged-in route (`header[role="banner"]`).
- **Clone status:** PARTIAL — `src/components/layout/sidebar.tsx`. Explore…Premium are inert; no filled active icons except Home/Profile; no badges; no responsive collapse; no overflow-to-More; More has no popover.
- **Suggested priority:** P0 (links + active icons), P1 (badges, collapse), P2 (height-overflow).
- **Complexity:** M

**Layout & measurements (1400px):**
- Whole shell = 1265px wide, centred: `header` outer width 342.5 = 67.5 gutter + 275 inner. Primary column at x=342.5, width 600 (border-left/right 1px `rgb(239,243,244)`). Right column (`sidebarColumn`) at x=972.5 (30px gap), width 350, then 10px to shell edge.
- Logo link: 52×52 at (75.5, 2), round hover pill; SVG 50×30 (viewBox 24, so the glyph is ~30px tall). Hover bg `rgba(15,20,25,0.1)`.
- `nav[aria-label="Primary"]` at y=58, width 259. Each item = `<a>` 259×58.3 (4px vertical padding around the pill), pill inside is content-width (e.g. Home 143.4×50.3), `padding:12px`, `border-radius:9999px`.
- Icon 26.25×26.25 (SVG viewBox 0 0 24 24), text margin-left 20px, margin-right 16px (pill = 12 + 26.25 + 20 + text + 16 + 12 approx; Home pill 143.4 wide).
- Label: 20px / 24px line-height, colour `rgb(15,20,25)`. Weight 400 inactive, **700 active**. Icon switches to the filled variant when active.
- Hover: pill bg `rgba(15,20,25,0.1)` (dark: `rgba(231,233,234,0.1)`), `transition: background-color 0.2s, box-shadow 0.2s` (ease). No scale.
- Keyboard focus-visible: pill gets `box-shadow: rgb(135,138,140) 0 0 0 2px` (grey 2px ring), no outline. Screenshot `sidebar-focus-ring.png`.
- Post button: 233.1×52 at y=718.8 (16px below the nav), radius 9999, bg `rgb(15,20,25)`, text "Post" 17px/700 white, horizontal padding 32px. Hover bg `rgb(39,44,48)`. In dark: bg `rgb(239,243,244)`, text `rgb(15,20,25)`.
- Account switcher button at the bottom (y=822.9, 259×65.1, 12px padding, radius 9999, hover pill same as nav): avatar 40, name 15px/700, `@handle` 15px/400 `rgb(83,100,113)`, "…" icon at right (18.75px).

**Routes, labels & icons** (aria-label is what X uses; `data-testid` in brackets):

| Item | aria-label [testid] | href | Clone has outline icon | Active (filled) icon in clone |
|---|---|---|---|---|
| Home | Home [AppTabBar_Home_Link] | /home | HomeIcon ✓ | HomeActiveIcon ✓ |
| Explore | Search and explore [AppTabBar_Explore_Link] | /explore | ExploreIcon ✓ | = clone `SearchIcon` path (bold magnifier) ✓ reuse |
| Notifications | Notifications [AppTabBar_Notifications_Link] | /notifications | ✓ | **MISSING** `NotificationsActiveIcon` |
| Follow | Follow [AppTabBar_Follow_Link] | /i/connect_people | ✓ | **MISSING** `FollowActiveIcon` |
| Chat | Direct Messages [AppTabBar_DirectMessage_Link] | /i/chat | ✓ | **MISSING** `ChatActiveIcon` |
| Grok | Grok | /i/grok | ✓ (viewBox 0 0 33 32) | **MISSING** `GrokActiveIcon` (viewBox 0 0 42 42) |
| History | History | /i/history | ✓ (bookmark glyph) | = `BookmarkActiveIcon` ✓ reuse |
| Creator Studio | Creator Studio | /i/jf/creators/studio | ✓ | **MISSING** `CreatorStudioActiveIcon` |
| Premium | Premium [premium-signup-tab] | /i/premium_sign_up | ✓ | **MISSING** `PremiumActiveIcon` (filled badge) |
| Profile | Profile [AppTabBar_Profile_Link] | /{handle} | ✓ | ProfileActiveIcon ✓ |
| More | More menu items [AppTabBar_More_Menu] | button | ✓ | none (no active state) |

Notes:
- `/i/bookmarks` redirects to `/i/history` and History is active there. The "History" page is X's renamed Bookmarks (area 04).
- Grok: `/i/grok` sometimes bounces through `/i/jf/grok/entry?redirect=…` (title "X - The Everything App / X").
- Page title format: `"{Page} / X"` — `Home / X`, `Explore / X`, `Notifications / X`, `Follow / X`, `History / X`, `Creator Studio / X`, `Loren_pepe12 (@PedroLo01746179) / X`. With unread notifications X prefixes `(N) ` (e.g. `(3) Home / X`) — **not observed** (account had 0 unread).
- Active detection on X is by section, not exact path (Profile stays active on `/{handle}/with_replies`, `/media`…). Clone uses exact match — fix.

<details><summary>Active (filled) icon SVG paths the clone lacks (viewBox 0 0 24 24 unless noted)</summary>

```
NotificationsActiveIcon:
M11.996 2c-4.062 0-7.49 3.021-7.999 7.051L2.866 18H7.1c.463 2.282 2.481 4 4.9 4s4.437-1.718 4.9-4h4.236l-1.143-8.958C19.48 5.017 16.054 2 11.996 2zM9.171 18h5.658c-.412 1.165-1.523 2-2.829 2s-2.417-.835-2.829-2z

FollowActiveIcon:
M21 5v3h3v2h-3v3h-2v-3h-3V8h3V5h2zM10 2C7.791 2 6 3.79 6 6s1.791 4 4 4 4-1.79 4-4-1.791-4-4-4zm0 9c-2.352 0-4.373.85-5.863 2.44-1.477 1.58-2.366 3.8-2.632 6.46l-.11 1.1h17.21l-.11-1.1c-.266-2.66-1.155-4.88-2.632-6.46C14.373 11.85 12.352 11 10 11z

ChatActiveIcon:
M12.001 1.5c5.858 0 10.7 4.518 10.7 10.2-.001 5.683-4.842 10.2-10.7 10.2-1.785 0-2.96-.555-3.95-1.095-1.876.768-4.02 1.2-6.245-.075l-.885-.505.523-.875c.54-.904.77-1.581.849-2.118.077-.526.02-.98-.11-1.463-.066-.25-.15-.502-.247-.788-.095-.277-.204-.59-.301-.92-.2-.674-.36-1.449-.332-2.39C1.319 6.002 6.153 1.5 12 1.5z

GrokActiveIcon (viewBox 0 0 42 42):
M8 0C3.582 0 0 3.582 0 8v26c0 4.418 3.582 8 8 8h26c4.418 0 8-3.582 8-8V8c0-4.418-3.582-8-8-8H8zm19.997 17.35l-11.1 8.19 15.9-15.963v.015L37.391 5c-.082.117-.165.23-.248.345-3.49 4.804-5.194 7.153-3.826 13.03l-.009-.008c.943 4.001-.065 8.438-3.322 11.693-4.106 4.107-10.677 5.02-16.087 1.324l3.772-1.745c3.454 1.355 7.232.76 9.947-1.954 2.716-2.714 3.325-6.666 1.96-9.956-.259-.623-1.037-.78-1.58-.378zm-13.292-2.574c-3.314 3.31-3.983 9.047-.1 12.755l-.003.003L4 37c.663-.913 1.485-1.776 2.306-2.639l.04-.042c2.346-2.464 4.67-4.906 3.25-8.357-1.903-4.622-.795-10.038 2.73-13.56 3.664-3.66 9.06-4.583 13.568-2.729.998.37 1.867.897 2.545 1.387l-3.764 1.737c-3.505-1.47-7.52-.47-9.97 1.98z

CreatorStudioActiveIcon:
M18 16.758c0 1.06-.422 2.078-1.172 2.828l-4.265 4.266-1.18-3.536.219-.218L18 13.642v3.116zm-12.531-.517l-.001.003-.003.013-.014.06-.053.236c-.044.206-.103.504-.163.861-.074.447-.144.978-.188 1.537.56-.045 1.091-.113 1.538-.187.357-.06.654-.12.86-.163.103-.022.183-.04.236-.053l.06-.014.012-.004h.003l.484 1.94h-.003l-.006.003c-.005 0-.011.002-.02.005l-.075.017c-.064.015-.156.036-.272.06-.23.05-.559.116-.95.181-.78.13-1.839.264-2.914.264H3v-1c0-1.075.133-2.135.263-2.914.065-.392.13-.72.18-.951.024-.116.045-.208.06-.272l.018-.074.004-.021.002-.006v-.003l1.942.482zM21 5.611c0 .19-.007.379-.018.567-.209 1.527-.906 2.955-2.003 4.062l-7.984 8.055-5.293-5.293 8.056-7.981c1.106-1.096 2.532-1.793 4.056-2.003.191-.011.383-.018.575-.018H21v2.611zM3.9 12.396l-.221.217-3.53-1.175 4.265-4.266C5.164 6.422 6.181 6 7.242 6h3.112L3.9 12.396z

PremiumActiveIcon (same glyph as VerifiedIcon — clone can reuse VerifiedIcon):
M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z
```
</details>

- **Unread badges:** **not observed** (0 unread notifications/messages on this account). The DOM slot exists inside the icon container. For implementation use X's known spec and verify later: a blue (`rgb(29,155,240)`) pill pinned to the top-right of the icon, min-width ~16–18px, height ~16–18px, 11px/700 white digits, 1px white border (`rgb(255,255,255)`; black in dark), aria-label `"N unread items"`; the nav link aria-label becomes `"Notifications (N unread notifications)"`; title gets `(N) ` prefix. Mark as P1 and keep data-driven (`unreadNotificationsCount`, `unreadChatCount` on viewer).
- **Data model:** `Viewer { unreadNotificationsCount: number; unreadChatCount: number }` (mock e.g. 3 and 0).
- **Implementation notes:** reuse `NavItem` / `nav-item-content.tsx`; add `activeIcon` per item; switch to `usePathname().startsWith(section)`; add badge slot to `NavItemContent`. All hrefs above should become real `<Link>`s even when the target page is a stub (other areas define them).
- **Screenshots:** `home-1400.png`, `sidebar-hover.png`, `sidebar-focus-ring.png`.

### 1.6 Sidebar height overflow (items move into More)

- At 1400 wide, X drops low-priority nav items into the More popover when the window is short. Measured order (window height → visible items):
  - ≥700: Home, Explore, Notifications, Follow, Chat, Grok, History, Creator Studio, Premium, Profile, More
  - 600: … Grok, **History**, Profile, More (Creator Studio + Premium moved to More)
  - 500: … Grok, Profile, More (History also moved)
- The moved items are inserted into the More menu (Creator Studio observed between Communities and Business, same icon/label, 56px row).
- **Priority:** P2. **Complexity:** M (needs a ResizeObserver on viewport height). Simple approach: hide Creator Studio/Premium below `max-height: 650px`, History below `550px` with CSS, and render the same items conditionally in More with the inverse media query.

### 1.7 More menu (popover)

- **Level:** L2, `button[data-testid="AppTabBar_More_Menu"]` (`aria-label="More menu items"`, `aria-haspopup="menu"`).
- **Clone status:** MISSING (MoreIcon button is inert). Reuse `ui/dropdown-menu.tsx`.
- **Priority:** P0. **Complexity:** S.
- **Layout:** `div[role="menu"]` positioned `fixed`, left-aligned with the nav (x=75.5), width **318px**, bottom edge aligned to the More button's top edge region (inline style `top: 247.5px; max-height: calc(100vh - 247.5px)`; with 6 items it grew upward covering More). Height = 56 × items (6 items → 337, 7 → 393). bg `#fff`, radius **12px**, shadow `rgba(101,119,134,0.2) 0 0 15px, rgba(101,119,134,0.15) 0 0 3px 1px` (dark: `rgba(255,255,255,0.2) 0 0 15px, rgba(255,255,255,0.15) 0 0 3px 1px`), `overflow-y:auto`. No visible backdrop (an invisible full-screen layer catches outside clicks).
- **Rows:** `<a role="link">` 318×56, inner padding **16px**, icon 24×24 at left (x+16), label starts 24px after icon end (x+64), **20px/24px, weight 700**, `rgb(15,20,25)`. Hover/keyboard-focus bg `rgb(247,249,249)` (dark `rgb(22,24,28)`), `transition: background-color .2s, box-shadow .2s`. Keyboard focus-visible additionally shows `box-shadow: rgb(142,205,248) 0 0 0 2px inset`.
- **Items (exact order & copy):**
  1. **Lists** → `/{handle}/lists`
  2. **Communities** → `/{handle}/communities`
  3. *(Creator Studio / Premium / History only when overflowed — see 1.6)*
  4. **Business** → `/i/verified-orgs-signup`
  5. **Ads** → `https://ads.x.com/?ref=gl-tw-tw-twitter-ads-rweb` (external, same tab)
  6. **Create your Space** → `/i/spaces/start`
  7. **Settings and privacy** → `/settings` (`data-testid="settings"`)
  - No "Monetization"/"Professional tools" accordions any more (old X).
- **Behaviour:** click toggles; opening focuses the first item (Lists) — arrow keys move focus (ArrowDown → next), Escape closes and returns focus, outside click closes, clicking an item navigates and closes.
- **Motion:** opacity 0→1 in ~1 frame window (sampled: 0 at t=300ms after click, 1 at t=320ms) — effectively a ~100–150ms fade, no scale/translate. The clone's `.t-dropdown` (scale .95→1 + fade 150ms) is close enough; set origin bottom-left.
- **Screenshots:** `more-menu.png`, `more-menu-2.png` (Creator Studio overflowed).

<details><summary>More-menu icon paths (all missing in clone; viewBox 0 0 24 24)</summary>

```
ListsIcon:
M3 4.5C3 3.12 4.12 2 5.5 2h13C19.88 2 21 3.12 21 4.5v15c0 1.38-1.12 2.5-2.5 2.5h-13C4.12 22 3 20.88 3 19.5v-15zM5.5 4c-.28 0-.5.22-.5.5v15c0 .28.22.5.5.5h13c.28 0 .5-.22.5-.5v-15c0-.28-.22-.5-.5-.5h-13zM16 10H8V8h8v2zm-8 2h8v2H8v-2z

CommunitiesIcon:
M7.501 19.917L7.471 21H.472l.029-1.027c.184-6.618 3.736-8.977 7-8.977.963 0 1.95.212 2.87.672-.444.478-.851 1.03-1.212 1.656-.507-.204-1.054-.329-1.658-.329-2.767 0-4.57 2.223-4.938 6.004H7.56c-.023.302-.05.599-.059.917zm15.998.056L23.528 21H9.472l.029-1.027c.184-6.618 3.736-8.977 7-8.977s6.816 2.358 7 8.977zM21.437 19c-.367-3.781-2.17-6.004-4.938-6.004s-4.57 2.223-4.938 6.004h9.875zm-4.938-9c-.799 0-1.527-.279-2.116-.73-.836-.64-1.384-1.638-1.384-2.77 0-1.93 1.567-3.5 3.5-3.5s3.5 1.57 3.5 3.5c0 1.132-.548 2.13-1.384 2.77-.589.451-1.317.73-2.116.73zm-1.5-3.5c0 .827.673 1.5 1.5 1.5s1.5-.673 1.5-1.5-.673-1.5-1.5-1.5-1.5.673-1.5 1.5zM7.5 3C9.433 3 11 4.57 11 6.5S9.433 10 7.5 10 4 8.43 4 6.5 5.567 3 7.5 3zm0 2C6.673 5 6 5.673 6 6.5S6.673 8 7.5 8 9 7.327 9 6.5 8.327 5 7.5 5z

BusinessIcon (lightning):
M7.323 2h11.443l-3 5h6.648L6.586 22.83 7.847 14H2.523l4.8-12zm1.354 2l-3.2 8h4.676l-.739 5.17L17.586 9h-5.352l3-5H8.677z

AdsIcon:
M1.996 5.5c0-1.38 1.119-2.5 2.5-2.5h15c1.38 0 2.5 1.12 2.5 2.5v13c0 1.38-1.12 2.5-2.5 2.5h-15c-1.381 0-2.5-1.12-2.5-2.5v-13zm2.5-.5c-.277 0-.5.22-.5.5v13c0 .28.223.5.5.5h15c.276 0 .5-.22.5-.5v-13c0-.28-.224-.5-.5-.5h-15zm8.085 5H8.996V8h7v7h-2v-3.59l-5.293 5.3-1.415-1.42L12.581 10z

SpacesIcon (microphone):
M12 22.25c-4.99 0-9.18-3.393-10.39-7.994l1.93-.512c.99 3.746 4.4 6.506 8.46 6.506s7.47-2.76 8.46-6.506l1.93.512c-1.21 4.601-5.4 7.994-10.39 7.994zM5 11.5c0 3.866 3.13 7 7 7s7-3.134 7-7V8.75c0-3.866-3.13-7-7-7s-7 3.134-7 7v2.75zm12-2.75v2.75c0 2.761-2.24 5-5 5s-5-2.239-5-5V8.75c0-2.761 2.24-5 5-5s5 2.239 5 5zM11.25 8v4.25c0 .414.34.75.75.75s.75-.336.75-.75V8c0-.414-.34-.75-.75-.75s-.75.336-.75.75zm-3 1v2.25c0 .414.34.75.75.75s.75-.336.75-.75V9c0-.414-.34-.75-.75-.75s-.75.336-.75.75zm7.5 0c0-.414-.34-.75-.75-.75s-.75.336-.75.75v2.25c0 .414.34.75.75.75s.75-.336.75-.75V9z

SettingsIcon (gear):
M10.54 1.75h2.92l1.57 2.36c.11.17.32.25.53.21l2.53-.59 2.17 2.17-.58 2.54c-.05.2.04.41.21.53l2.36 1.57v2.92l-2.36 1.57c-.17.12-.26.33-.21.53l.58 2.54-2.17 2.17-2.53-.59c-.21-.04-.42.04-.53.21l-1.57 2.36h-2.92l-1.58-2.36c-.11-.17-.32-.25-.52-.21l-2.54.59-2.17-2.17.58-2.54c.05-.2-.03-.41-.21-.53l-2.35-1.57v-2.92L4.1 8.97c.18-.12.26-.33.21-.53L3.73 5.9 5.9 3.73l2.54.59c.2.04.41-.04.52-.21l1.58-2.36zm1.07 2l-.98 1.47C10.05 6.08 9 6.5 7.99 6.27l-1.46-.34-.6.6.33 1.46c.24 1.01-.18 2.07-1.05 2.64l-1.46.98v.78l1.46.98c.87.57 1.29 1.63 1.05 2.64l-.33 1.46.6.6 1.46-.34c1.01-.23 2.06.19 2.64 1.05l.98 1.47h.78l.97-1.47c.58-.86 1.63-1.28 2.65-1.05l1.45.34.61-.6-.34-1.46c-.23-1.01.18-2.07 1.05-2.64l1.47-.98v-.78l-1.47-.98c-.87-.57-1.28-1.63-1.05-2.64l.34-1.46-.61-.6-1.45.34c-1.02.23-2.07-.19-2.65-1.05l-.97-1.47h-.78zM12 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5c.82 0 1.5-.67 1.5-1.5s-.68-1.5-1.5-1.5zM8.5 12c0-1.93 1.56-3.5 3.5-3.5 1.93 0 3.5 1.57 3.5 3.5s-1.57 3.5-3.5 3.5c-1.94 0-3.5-1.57-3.5-3.5z
```
</details>

### 1.8 Account switcher menu

- **Level:** L2. `button[data-testid="SideNav_AccountSwitcher_Button"]`.
- **Clone status:** PARTIAL/OK — `components/layout/account-menu.tsx` (300px dropdown with arrow, Add VISUAL, Log out FUNCTIONAL). Matches X closely.
- **Priority:** P2 (delta only). **Complexity:** S.
- **Measured on X:** container `data-testid="HoverCard"` 300px wide, radius **16px**, same shadow as More menu, positioned above the trigger (left x=55 at 1400 → centred on the 259px button minus offsets), arrow `PopoverArrowIcon` (24×16.3, white, `M22 17H2L12 6l10 11z`) pointing down at the bottom, 12px vertical padding. Rows 300×44, `padding:12px 16px`, 15px/700 `rgb(15,20,25)`:
  1. (current-account row + other accounts list — on this account the list request failed and X rendered **"Something went wrong. Try reloading."** 15px `rgb(83,100,113)` + blue **Retry** pill (36px, bg `rgb(29,155,240)`, refresh icon 20px) — headless/rate-limit artefact; normally a row with avatar, name, @handle and a green check.)
  2. **Add an existing account** → `/i/flow/login` [AccountSwitcher_AddAccount_Button], separated by a 1px `rgb(239,243,244)` top border.
  3. **Log out @PedroLo01746179** → `/logout` [AccountSwitcher_Logout_Button].
- **Delta for clone:** make "Add an existing account" a link to `/login` (or `/i/flow/login` stub); keep the current-account row with check.
- **Screenshot:** `account-menu.png`.

### 1.9 Post button (sidebar)

- Expanded: see measurements above. Collapsed (<1265px): 52×52 circle, compose (feather/pencil-square) icon 24px, `aria-label="Post"`, tooltip "Post". Clone: the pill exists; collapsed variant MISSING.

<details><summary>ComposeIcon (collapsed Post button + mobile FAB), viewBox 0 0 24 24, two paths</summary>

```
path 1: M10.938 4.5H9.9c-1.136 0-1.929 0-2.546.05-.605.05-.953.143-1.216.277-.564.288-1.023.747-1.31 1.31-.135.264-.228.612-.277 1.218C4.5 7.97 4.5 8.765 4.5 9.9v4.2c0 1.136 0 1.929.05 2.546.05.605.143.953.277 1.216.288.565.747 1.023 1.31 1.31.264.135.612.228 1.217.277.617.05 1.41.051 2.546.051h4.2c1.136 0 1.929 0 2.545-.05.606-.05.954-.143 1.217-.277.565-.288 1.023-.746 1.31-1.31.135-.264.228-.612.277-1.217.05-.617.051-1.41.051-2.546v-1.037h2V14.1c0 1.103.001 1.992-.058 2.709-.06.728-.185 1.368-.487 1.96-.48.941-1.245 1.707-2.185 2.186-.593.302-1.233.428-1.961.488-.718.058-1.606.057-2.71.057H9.9c-1.103 0-1.991.001-2.709-.058-.728-.06-1.368-.185-1.96-.487-.941-.48-1.707-1.245-2.186-2.185-.302-.593-.428-1.233-.487-1.961-.059-.718-.058-1.606-.058-2.71V9.9c0-1.103-.001-1.991.058-2.709.06-.728.185-1.368.487-1.96.48-.941 1.245-1.707 2.185-2.186.593-.302 1.233-.428 1.961-.487.718-.059 1.606-.058 2.71-.058h1.037v2z
path 2 (fill-rule/clip-rule evenodd): M16.293 3.293c1.219-1.219 3.195-1.219 4.414 0 1.219 1.219 1.219 3.195 0 4.414l-5.491 5.491c-.533.533-.89.896-1.31 1.179-.356.24-.742.433-1.148.574-.478.167-.983.234-1.729.341l-2.708.387.387-2.708c.107-.746.174-1.25.34-1.729.142-.405.335-.792.575-1.148.283-.42.646-.777 1.179-1.31l5.491-5.491zm3 1.414c-.438-.438-1.148-.438-1.586 0l-5.491 5.491c-.587.587-.784.79-.934 1.013-.144.214-.26.445-.345.688-.088.254-.131.533-.248 1.354l-.01.067.068-.008c.82-.118 1.1-.161 1.354-.25.243-.084.474-.2.688-.344.223-.15.426-.347 1.013-.934l5.491-5.491c.438-.438.438-1.148 0-1.586z
```
</details>

### 2. Responsive breakpoints of the shell

- **Clone status:** MISSING — fixed 275px sidebar, no collapse, no right-panel hiding, no mobile bars (`app-shell.tsx`, `sidebar.tsx`).
- **Priority:** P1 (≥988 behaviours), P2 (mobile <500). **Complexity:** M.

Measured by scanning widths every 5px then every 1px (height 900):

| Viewport width | Left header (outer / inner) | Nav | Primary column | Right column | Dock |
|---|---|---|---|---|---|
| ≥ 1265 | (w−1265)/2 + 275 / **275** expanded with labels | 259 wide | 600 | **350** (x = primary + 630) | visible |
| 1078 – 1264 | inner **88** (icons only), outer grows with centring | 72 wide | 600 | 350 | visible |
| 1008 – 1077 | inner 88 | 72 | 600 | **290** (search 258) | **hidden** |
| 989 – 1007 | inner **68** | 60 | 600 | 290 | hidden |
| 600 – 988 | inner **88** | 72 | 600 (shrinks = w−88 below 688) | **hidden** | hidden |
| 500 – 599 | inner **68** | 60 | w−68 (fluid) | hidden | hidden |
| < 500 | **no left header** | bottom tab bar | 100% | hidden | hidden; FAB |

Column positions examples: 1400 → header 0–342.5 (inner 67.5–342.5), primary 342.5–942.5, right 972.5–1322.5. 1280 → inner 7.5–282.5, primary 282.5, right 912.5. 1100 → inner 11–99, primary 99, right 729. 1000 → inner 6–74, primary 74, right 694 (290). 900 → inner 70.7–158.7 (centred), primary 158.7. 700 → primary 92. 500 → primary 68–500 (432 wide).

- Collapsed sidebar (88px inner): items 72×58.3, pill 50.3×50.3 centred, logo 52×52, Post = 52×52 circle (bg `rgb(15,20,25)`, compose icon), account = 64×64 hit area with 40px avatar only. Tooltips appear on hover (see Cross-cutting › Tooltip). Composer toolbar also drops Poll & Schedule below ~600px wide (Media, GIF, Emoji, Location, Flag remain).
- The **Chat** route (`/i/chat`) forces the collapsed (icons-only) sidebar even at 1400 and has no right column (area 04).
- Screenshots: `bp-1400.png`, `bp-1280.png`, `bp-1100.png`, `bp-1000.png`, `bp-900.png`, `bp-700.png`, `bp-500.png`.

#### 2.1 Mobile layout (<500px)

- **Top bar** `data-testid="TopNavBar"`: 480×107 total (53px row + 53px tab row "For you / Following / +"), bg `rgba(255,255,255,0.85)` + `backdrop-filter: blur(12px)`. Row: avatar 32px at (16,10.5) (`aria-label="Profile menu Loren_pepe12"`, opens the side drawer — not documented), X logo centred (≈25×24), outlined **Subscribe** pill at right (106.9×36, border 1px `rgb(207,217,222)`, 15px/700, → `/i/premium_sign_up`).
- **Hide on scroll:** scrolling down → `TopNavBar` `transform: translateY(-106px)` with `transition: transform .35s cubic-bezier(0,0,0,1)`; scrolling up restores it. The bottom bar and FAB fade to **opacity 0.3** (`transition: opacity .17s linear`) while scrolling down and return to 1 on scroll up.
- **Bottom tab bar** `data-testid="BottomBar"`: full width × 53.5, bg `#fff`, border-top 1px `rgb(239,243,244)`. 5 equal tabs (96px each at 480): **Home** /home, **Search and explore** /explore, **Grok** /i/grok, **Notifications** /notifications, **Direct Messages** /i/chat. Icons 26.25px centred in a 42.3px hover circle (same hover bg as sidebar).
- **Compose FAB** `data-testid="FloatingActionButtons_Tweet_Button"`, `aria-label="Compose a post"` → `/compose/post`: 56×56 circle at right 20 / bottom ~73 (above the bar), bg `rgb(29,155,240)`, icon 24px white compose glyph, shadow `rgba(217,217,217,0.2) 0 0 5px, rgba(217,217,217,0.25) 0 1px 4px 1px`.
- Screenshots: `bp-480-mobile.png`, `bp-480-mobile-scrolled.png`.

### 3. Floating dock (bottom-right): Grok + Chat drawers

- **Level:** L1 buttons → L2 mini panels. Visible only when the right column is 350px (viewport ≥1078px), on routes with the right column.
- **Clone status:** MISSING.
- **Priority:** P2 (the buttons are cheap; the panels are product features owned by area 04). **Complexity:** S for buttons, M for panels.
- **Closed state:** two stacked square buttons, right edge = viewport right − 20px (x=1325 at 1400), 55×55 each (Grok at y=766, Chat at y=833 → 12px gap, 12px from bottom). Each sits in a 400px-wide (350px at <1265) right-anchored container (`GrokDrawer`, `chat-drawer-root`). Button style (light): bg `rgba(255,255,255,0.85)`, border 1px `rgb(207,217,222)`, radius **16px**, shadow `rgba(0,0,0,0.08) 0 2px 8px`. Hover bg `rgba(29,155,240,0.1)`. Icons: Grok glyph (viewBox 33×32) ~26px; Chat = round bubble (path below). Dark mode: bg `rgba(0,0,0,0.65)`, border `rgb(75,78,82)`, shadow `rgba(255,255,255,0.2) 0 0 15px, rgba(255,255,255,0.15) 0 0 3px 1px`.
- **Grok button** (`GrokDrawerHeader`, `aria-label="Grok"`): opens an in-page **mini Grok panel** 400×477, anchored bottom-right (x=980, y=336 → bottom 813), bg #fff, radius 16, shadow `rgba(101,119,134,0.2) 0 0 15px, rgba(101,119,134,0.15) 0 0 3px 1px`. Header row of 36px icon buttons at top-right: **Private Chat** (ghost), **Chat history** (clock), **Open conversation** (expand to /i/grok), **Collapse** (chevron down). Body: heading "How can I help you today?" (~26px/700, centred), input card (bg `rgb(239,243,244)`, radius ~24) with textarea placeholder **"Ask anything"**, attach (paperclip) button, model pill **"Fast"** with lightning icon + chevron, black round **"Enter voice mode"** button; suggestion chips (outlined pills, 38px tall, 15px/700): **Create Videos**, **Create Images**, **Edit Image**, **Latest News**. Collapse returns to the 55px button. Panel appeared ~500ms after click (lazy load), no slide animation observed. URL does not change.
- **Chat button** (`chat-drawer-main`, `aria-label="Chat"`): the Grok button first slides down ~67px then up to sit above the panel (~300ms, ease-out), then a **400×530 mini Chat panel** grows from the bottom (`chat-drawer-root` height 0→530, x=980, y=350→880) containing an embedded X Chat (`xchatEmbedDrawer`). For this account it shows X Chat onboarding: **"Welcome to the new X Chat"**, bullets *End-to-End Encryption / State-of-the-Art Privacy / Set Passcode* and a **Create Passcode** button; header icons "expand" + "collapse" (chevron). Content = area 04.
- Screenshots: `dock-closed.png`, `dock-closed-zoom.png`, `dock-grok-open.png`, `dock-chat-open.png` (captured while the account was momentarily dark).
- **Implementation notes:** a fixed `DockButton` (55px, radius 16) stack; P2 open a small panel stub or simply link Grok → `/i/grok`, Chat → `/i/chat`.

<details><summary>Dock Chat bubble icon (viewBox 0 0 24 24)</summary>

```
M12 4c-4.418 0-8 3.582-8 8 0 1.268.294 2.465.818 3.528.144.292.196.634.126.973l-.665 3.242 3.373-.63c.323-.061.647-.012.927.12C9.615 19.726 10.774 20 12 20c4.418 0 8-3.582 8-8s-3.582-8-8-8zM3.547 19.88zM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10c-1.473 0-2.874-.32-4.136-.893l-3.949.74c-1.047.195-1.96-.733-1.745-1.777l.781-3.808C2.341 14.968 2 13.522 2 12z
```
</details>

### 4. Home timeline header (For you / Following / Manage timelines)

- **Level / route:** L1, `/home` only (X's home is `/home`; clone uses `/`). Both tabs keep the URL at `/home` (no `/following` route) and the title `Home / X`.
- **Clone status:** PARTIAL — `features/feed/components/timeline-header.tsx`: For you hard-coded, Following inert, "+" inert, no Following feed.
- **Priority:** P0 (Following tab switching + separate feed), P1 (Manage timelines modal), P2 (pinned-timeline tab scroller).
- **Complexity:** M

**Layout & measurements:**
- Sticky container: `position:sticky; top:0; z-index:3`, 598×54 (inside the 600 column borders). Inner background `rgba(255,255,255,0.85)` + `backdrop-filter: blur(12px)` (dark: `rgba(0,0,0,0.65)` + blur 12px), `border-bottom: 1px solid rgb(239,243,244)` (dark `rgb(47,51,54)`). **No hide-on-scroll on desktop** (only <500px, see 2.1).
- `role="tablist"` 545×53, tabs share the width equally (`flex:1`; For you 265.4, Following 279.6 — the difference is the text width; they are `flex-grow:1` with content basis). Each tab `role="tab"`, `aria-selected`, no href.
- Tab label 15px; active weight **700** colour `rgb(15,20,25)`; inactive weight **500** colour `rgb(83,100,113)`. Text vertically centred in 53px.
- Active indicator: 4px tall, `border-radius:9999px`, bg `rgb(29,155,240)`, **width = label width with a min of 56px** (For you → 56px, Following → 69px), bottom-aligned (y=49), centred under the label. Clone uses fixed underline — fix the min-width/auto width.
- Tab hover: whole tab bg `rgba(15,20,25,0.1)`, `transition: background-color .2s, box-shadow .2s`.
- "Manage timelines" button: 53×53 square at right of the tablist, `aria-label="Manage timelines"`, tooltip **"Manage timelines"**, plus icon 16px `rgb(83,100,113)`, hover bg `rgba(15,20,25,0.1)`.
- Tab-scroller arrows exist in the DOM: **Previous** (36px round, BackIcon) at left and **Next** (ArrowRightIcon) at right of the tablist — shown only when pinned timelines overflow (hidden for this account, which has no pins).

**Behaviour:**
- Clicking Following: switches instantly (indicator **jumps, no slide**; sampled 0ms→600ms with no intermediate x). Timeline content swaps to the chronological "Following" feed; selection persists across page loads/tabs (observed: after another session switched to Following, a brand-new tab opened with Following selected — see `shortcuts-modal.png`).
- Clicking the already-active tab: no menu (the old "Recent/Popular" sort menu is gone), no scroll when at top.
- **Clicking the sidebar Home link while on /home**: scrolls to top (if scrolled) and refreshes — a **3px progress bar** (`role="progressbar"`, 598×3 at y=54, directly under the header) appears and new posts are prepended (first tweet changed after click). Same effect when clicking Home while already at top.
- Keyboard: `.` (period) = load new posts (see 4.2).

**Motion:** none on indicator (instant). Hover bg 200ms.

**Data model:** `TimelineKind = "for-you" | "following"`; `getTimeline({ kind, cursor })`. For a convincing clone: For you = mixed (followed + suggested/popular, not purely chronological), Following = followed + viewer, newest first (what the clone's "For you" currently is).

**Implementation notes:** keep `ui/tab.tsx` but add an auto-width indicator (`min-w-14`, `w-[label]`), store the selected tab in a cookie (`timeline_tab`) so SSR renders the right feed. Tabs are buttons, not links. Reuse IconButton for Manage timelines.

**Screenshots:** `home-header-hover.png`, `home-following-tab.png`, `home-following-click-again.png`.

#### 4.1 Manage timelines modal ("+")

- **Level:** L2. Opens a centred modal (URL unchanged, not a route).
- **Clone status:** MISSING. **Priority:** P1. **Complexity:** M.
- **Layout:** modal box 600×720 max (x=400,y=90 at 1400×900, i.e. centred horizontally, ~90px from top), bg #fff, radius **16px**, `overflow-y:auto`, no shadow. Backdrop `rgba(91,112,131,0.4)` (X's standard light-mode modal mask). No open animation (appears instantly).
- **Header:** title **"Timelines"** centred (17px/700), close **X** button at right (36px round, CloseIcon 20px, `aria-label="Close"`).
- **Search:** input `aria-label="Search timelines"`, placeholder **"Search"**, wrapper 568×44, bg `rgb(229,234,236)` (light grey), radius **12px**, padding 12px 16px; 16px side padding, 8px bottom.
- **Sections** (each heading 17px/700, 52px tall row button with chevron at right):
  1. **Pinned** (no chevron) — empty state: **"Nothing to show"** (13–14px, `rgb(83,100,113)`).
  2. **Topics** (`aria-label="Collapse Topics"`, chevron-down when expanded) — rows 600×72: 48px rounded icon tile (bg `rgb(229,234,236)`, 24px glyph), name 15px/700, at right a 36px **pin button** = green plus-in-circle icon 24px `rgb(0,186,124)` with `aria-label="Pin {Topic}"`. Rows seen: **Soccer, Stocks & Economy, Politics, Iran Conflict, Sports, Business & Finance, Science, Technology**, then **"See 65 more"** (600×40, 14px `rgb(83,100,113)`).
  3. **Lists** (`aria-label="Expand Lists"`, chevron-right when collapsed) → expanded empty: "Nothing to show".
  4. **Communities** (`aria-label="Expand Communities"`) → expanded empty: "Nothing to show".
- **Behaviour:** pinning a topic/list/community adds it as an extra tab in the home header (tab scroller with Previous/Next arrows appears) — **not exercised** (would change account state; reversible but skipped to avoid the header layout changing for other researchers). Typing in Search filters all sections. Escape / X / backdrop click closes.
- **Data model:** `PinnedTimeline { id, kind: "topic"|"list"|"community", name, iconKey }`, `Topic { id, name, icon }` (mock 8–12 topics).
- **Screenshots:** `manage-timelines.png`, `manage-timelines-expanded.png`.

<details><summary>Pin (plus-circle) icon, viewBox 24</summary>

```
M12 22.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM11 16v-3H8v-2h3V8h2v3h3v2h-3v3h-2z
```
</details>

#### 4.2 "See new posts" pill

- **Clone status:** MISSING. **Priority:** P1. **Complexity:** M.
- **DOM (always mounted):** a `<button aria-label="New posts are available. Push the period key to go to the them.">` (sic, X's typo) inside a wrapper absolutely positioned under the sticky header (wrapper `translateY(53px)` relative to the header, `transition: transform .35s cubic-bezier(0,0,0,1)`), and an inner wrapper that is **hidden with `opacity:0; transform: translateY(-52.5px)`** and `transition: transform .15s, opacity .15s`. When new posts exist it animates to `opacity:1; translateY(0)` (slides down 52px + fades in 150ms).
- **Pill:** 156.6×28 (content width), bg `rgb(29,155,240)`, radius 9999, `padding:4px 16px`, shadow `rgba(101,119,134,0.2) 0 0 8px, rgba(101,119,134,0.25) 0 1px 3px 1px`, up-arrow icon 20px white at left, text 15px white. Centred horizontally in the 600 column, top ≈ header bottom + 16px (y≈70 when visible).
- **Copy:** the accessible text node is **"See new posts"**; the visible variant on X shows up to 3 overlapping 20–24px avatars (white 2px ring) + **"posted"** (e.g. `[↑][avatar][avatar][avatar] posted`). **Visible state not observed** in a 4-minute watch (rate-limited session) — implement from this spec.
- **Behaviour:** appears only when the user is scrolled down and new posts arrived; click (or `.` key) → smooth-scroll to top, prepend posts, pill fades out. Scrolling to top manually also hides it.
- **Data model:** mock a "new posts" injection (e.g. after 30s, 3 authors) — `{ count, avatars: UserSummary[] }`.
- **Up-arrow icon** (viewBox 24): `M12 3.59l7.457 7.45-1.414 1.42L13 7.41V21h-2V7.41l-5.043 5.05-1.414-1.42L12 3.59z`
- **Screenshots:** `new-posts-pill-scrolled.png` (hidden state; nothing visible).

#### 4.3 Loading states (spinner + progress bar)

- **Clone status:** MISSING (Suspense fallbacks are `null`). **Priority:** P0. **Complexity:** S.
- **Spinner** (`role="progressbar"`, initial one has `aria-label="Loading timeline"`): 26×26 box (initial timeline load renders it inside a 66px-tall row = 20px padding top/bottom, centred in the 600 column). SVG markup (copy verbatim):

```html
<svg height="100%" viewBox="0 0 32 32" width="100%">
  <circle cx="16" cy="16" fill="none" r="14" stroke-width="4" style="stroke: rgb(29,155,240); opacity: 0.2;"></circle>
  <circle cx="16" cy="16" fill="none" r="14" stroke-width="4" style="stroke: rgb(29,155,240); stroke-dasharray: 80; stroke-dashoffset: 60;"></circle>
</svg>
```
  Rotation: `animation: spin 0.75s linear infinite` (X class `r-11cv4x` = `@keyframes { 0% { transform: rotate(0deg) } 100% { transform: rotate(360deg) } }`). Colour is the accent (`rgb(29,155,240)`) in all themes.
- Same spinner (26px) is used inside media placeholders while images load, and at the bottom of the timeline for infinite scroll (same 66px row).
- **Top progress bar:** `role="progressbar"` 3px tall, full column width, directly under the sticky header (y=54), shown while the timeline refreshes (Home click, new posts). Indeterminate accent bar.
- **App splash** (hard reload, before the shell mounts): full-screen page bg with the X logo 72×72 centred (white on black in dark, black on white in light). The clone could show this in a root `loading.tsx`. Screenshot `splash-dark.png` shows the dark variant (session was momentarily in dark mode).
- **Screenshots:** `spinner-initial.png`.

### 5. Inline composer + compose modal

- **Level / route:** inline composer L1 on `/home`; compose modal `/compose/post` (L2, opened by sidebar Post, `n` key, mobile FAB); thread mode and pickers L2; Drafts `/compose/post/unsent/drafts` + `/compose/post/unsent/scheduled` (L2/3).
- **Clone status:** PARTIAL — `features/compose/components/composer.tsx`, `composer-toolbar.tsx`, `compose-modal.tsx`. Toolbar buttons inert, no thread "+", no Drafts, no Save-post dialog, no modal motion, no over-limit banner/highlight.
- **Priority:** P0 (Emoji picker, Poll editor, Save-post dialog, thread "+", over-limit UI), P1 (Schedule modal, Drafts empty state, audience menu, GIF picker with mock GIFs), P2 (Content disclosure), OUT (real media upload/location — keep file picker UI only if Supabase storage arrives).
- **Complexity:** L overall (each picker S–M).

#### 5.1 Inline composer anatomy (1400px)

- Avatar 40px at left (x=360, padding 16px). Editor (Draft.js, `data-testid="tweetTextarea_0"`) at x=410.5, 513 wide, **20px** font, line-height 24/28; placeholder **"What's happening?"** colour `rgb(83,100,113)` light / `rgb(113,118,123)` dark. With a poll attached the placeholder becomes **"Ask a question"**.
- Focus reveals the **"Everyone can reply"** row instantly (no measurable animation; the clone's 250ms reveal is fine): globe icon 16px + text 14px/700 `rgb(29,155,240)`, button 173×24 at x=391.5 (a hair left of the text column), followed by a 1px `rgb(239,243,244)` divider above the toolbar. Toolbar row moves from y=128 to y=177.
- **Toolbar** (`data-testid="toolBar"`) is a horizontally scrolling row with hidden **Previous / Next** 36px arrow buttons (disabled unless it overflows). Buttons are 36×36 circles, icon 20px (rendered 23.3), 4px gaps (x = 401.5, 441.5, 481.5…):

| # | aria-label | data-testid | Tooltip | Opens |
|---|---|---|---|---|
| 1 | Add photos or video | — (+ hidden `input[data-testid="fileInput"]` accept `image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime`, multiple) | Media | native file picker |
| 2 | Add a GIF | gifSearchButton | GIF | GIF modal (5.4) |
| 3 | Add poll | createPollButton | Poll | inline poll editor (5.5) |
| 4 | Add emoji | — | Emoji | emoji popover (5.6) |
| 5 | Schedule post | scheduleOption | Schedule | Schedule modal (5.7) |
| 6 | Tag location | geoButton | — | **disabled** (opacity 0.5, no tooltip) |
| 7 | Content disclosure | contentDisclosureButton | Content disclosure | modal (5.8) |

  No Grok/AI button in the composer. Icon colour: accent `rgb(29,155,240)` on X historically; on this build the icons render in the neutral text colour (screens show dark-grey glyphs) — keep the clone's current colour. Hover: circle bg `rgba(29,155,240,0.1)`; disabled 0.5 opacity. At <600px Poll and Schedule are dropped from the row.
- **Right cluster:** character ring (20px; appears once text exists) → (thread mode only: 1px vertical divider + **"+" Add post** button 24×24, `data-testid="addButton"`, `aria-label="Add post"`, 1px border `rgb(83,100,113)` circle) → **Post** pill 66.7×36, padding 0 16px, 15px/700. Light: bg `rgb(15,20,25)` text white; disabled opacity **0.5**. Dark: bg `rgb(239,243,244)` text `rgb(15,20,25)`.
- **Posting progress bar:** a hidden `role="progressbar"` (`data-testid="progressBar-bar"`, 3px, accent, `width:0%→100%`, `visibility:hidden` when idle) sits under the sticky header — X fills it while a post is sending. The clone's static 3px bar should become this determinate bar.

#### 5.2 Character counter & over-limit (non-Premium = 280)

- Ring appears at 1 char (20×20). At **≥260 chars** (20 remaining) the number appears inside/next to the ring and the ring grows (clone already does 20→30px; X shows the number from 20 down: "20" … "1", "0", then negative "-1", "-10", "-20").
- Screen-reader text: `"20 characters remaining"`, `"1 character remaining"`, `"0 characters remaining"`, `"You have exceeded the character limit by 10"`.
- Over 280: overflowing characters get a red highlight (dark: bg `rgb(138,13,32)`; light: pinkish `rgba(244,33,46,0.1)`-ish — light value not captured), Post disabled (opacity 0.5), and a **Premium upsell banner** appears under the text: **"Upgrade to Premium to write longer posts and Articles."** + bold underlined link **"Upgrade to Premium"** (→ `/i/premium_sign_up`), banner = rounded (≈8px) box with a dark-blue tint in dark mode, 15px text, 16px padding. Screenshots `counter-260.png`, `counter-290.png`.
- Clone delta: add the inline number, the red overflow highlight (needs a mirrored overlay since the clone uses a textarea) and the banner.

#### 5.3 Thread composer ("+" → "Post all")

- Typing text makes the **"+"** (Add post) appear; clicking it opens the compose **modal** (URL `/compose/post`) with the current text as post 1 and a new empty post 2 focused (placeholder **"Add another post"**).
- Modal layout: 600 wide, header row 53px with **Close** (X, `data-testid="app-bar-close"`) at left and **Drafts** text button (14px/700 accent, `data-testid="unsentButton"`) at right. Each post row: 40px avatar + editor; **non-focused posts render at reduced opacity (~0.5)**; the focused post shows a **"Remove post"** (24px X) button at its right. "Everyone can reply" appears once, under the last post. No visible vertical connector line between avatars was rendered in this build.
- Footer toolbar: same buttons + ring + divider + "+" + **"Post all"** (87.3×36, disabled until every post has text).
- Screenshots `thread-modal.png`, `thread-modal-2.png`.

#### 5.4 GIF picker (modal)

- Modal 600×650 at top 45px (desktop), radius 16, white. Header 53px: **Close** (X) at left, search pill 512×40 (radius 9999, focused ring `rgb(29,155,240) 0 0 0 1px`), magnifier icon, placeholder **"Search for GIFs"** (`data-testid="gifSearchSearchInput"`), autofocus.
- Row: **"Auto-play GIFs"** label (15px) + switch (40×20, accent when on) at right.
- Body: **no category tiles any more** — it opens straight on a trending GIF grid, justified rows ~123–147px tall, 2px gaps, each tile a `button` with `<img alt="Angry Fire GIF by Gerbert!">`. Infinite scroll.
- Searching (e.g. "cat"): Close becomes a **Back arrow**, a clear (×) button appears in the pill, grid updates (debounced ~300ms). Selecting a GIF closes the modal and attaches it to the composer (media preview, not observed).
- Mask: `rgba(180,180,182,0.5)` in light (compose-family modals), `rgba(0,0,0,0.5)` in dark.
- Mock data: `Gif { id, url, previewUrl, width, height, alt }` × ~30 (Giphy/Tenor URLs or local).
- Screenshots `gif-picker.png`, `gif-search.png`.

#### 5.5 Poll editor (inline)

- Replaces nothing; inserted under the editor. Box 512 wide, radius 16, border 1px `rgb(207,217,222)` (light). Placeholder of the main editor → **"Ask a question"**.
- Choice rows: at left a 64×58 dashed rounded square with an image icon (**add image to this choice**, new in 2026), then a floating-label input 372×58 (radius 4, border 1px grey; focused: border + `0 0 0 1px` accent ring, label turns accent). Labels **"Choice 1"**, **"Choice 2"**, **"Choice 3 (optional)"**, **"Choice 4 (optional)"**; `maxlength=25` with counter **"0 / 25"** at top-right when focused. A **"+" (Add a choice)** 36px accent button sits right of the last row; max 4 choices (button disappears at 4).
- **Poll length** (15px heading) with three floating-label selects 140–151×40(+label): **Days** 0–7 (default 1), **Hours** 0–23 (default 0), **Minutes** 0–59 (default 0).
- **Remove poll** — full-width 52px row, red text (`rgb(244,33,46)`), top border.
- While a poll is attached: Media, GIF, Poll and Schedule buttons are disabled.
- Data model: `Poll { options: {label, imageUrl?}[]; durationMinutes; }`, results later `votes`.
- Screenshots `poll-editor.png`, `poll-editor-3choices.png`.

#### 5.6 Emoji picker (popover)

- Popover 320×400, anchored under the Emoji button with a small up-arrow, radius 16, shadow `rgba(101,119,134,0.2) 0 0 15px, rgba(101,119,134,0.15) 0 0 3px 1px`.
- Top: search pill 312×44 (radius 9999, focused ring accent), placeholder **"Search emojis"** (autofocus).
- Category bar (9 buttons, 35.5×28, greyscale except active which shows colour + 4px accent underline): 🕑 Recent (disabled when empty), 😀 Smileys & people, 🐻 Animals & nature, 🍔 Food & drink, ⚽ Activity, 🚘 Travel & places, 💡 Objects, 🔣 Symbols, 🚩 Flags. Clicking scrolls the grid to that section.
- Section headings 17px/700 (e.g. **"Smileys & people"**), grid 9 columns, cells 33×28 (`role="option"`, `aria-label="Grinning face"`), emoji ~22px, hover cell bg tinted.
- Footer: preview hand + **skin-tone selector** (6 dots: Default, Light, Medium light, Medium, Medium dark, Dark; selected dot has an accent ring with check).
- Search: heading **"Search results"**; empty → **"No Emojis found"** / **"Try searching for something else instead."**
- Clicking an emoji inserts at the caret and keeps the popover open; Escape/outside click closes.
- Implementation: ship a static JSON (`emoji-data` subset: char, name, category, keywords), no library needed. Recent = localStorage.
- Screenshots `emoji-picker.png`, `emoji-skin-tones.png`, `emoji-search.png`.

#### 5.7 Schedule modal

- Modal 600×~429 at top 45 (dark bg `rgb(20,20,20)` in Lights out on this build; light = white), radius 16. Header: Close (X) left, title **"Schedule"** 20px/700, **Confirm** pill right (89×32, 14px/700; light = black pill/white text, dark = white pill/black text).
- Line: calendar icon + **"Will send on Mon, Oct 5, 2026 at 6:22 PM"** (13px, secondary colour) — updates live.
- **Date** label (15px secondary) → three floating-label selects: **Month** (January…December, 240.5 wide), **Day** (1–31, 106.8), **Year** (2026–2028, 126.8) + 52px **Calendar** icon button (opens the native date picker; hidden `<input type=date>`).
- **Time** → **Hour** (1–12), **Minute** (00–59), **AM/PM** (158 wide each) + **Time picker** icon button (hidden `<input type=time>`).
- **Time zone** label + value **"Argentina Standard Time"** (17px).
- Footer (top border): **"Scheduled posts"** text button 14px/700 accent → `/compose/post/unsent/scheduled`.
- Confirm (not clicked) turns the composer's Post button into **"Schedule"** and shows the scheduled time above the editor (not observed — per X behaviour).
- Screenshot `schedule-modal.png` (dark).

#### 5.8 Content disclosure (flag button)

- Modal 600×229, title **"Content disclosure"** 20px/700 at left (no close X), **Done** text button (15px/700 accent) at right.
- Two rows with switches (40×20): **"Paid partnership"** — "Let others know this post promotes a brand or business. **Learn more**" (link → `https://help.x.com/rules-and-policies/paid-partnerships-policy`, 13px accent); **"Made with AI"** — "Mark this post as containing synthetically generated content." Descriptions 13px secondary. Toggling adds a label to the post (not observed). P2.
- Screenshot `content-disclosure.png`.

#### 5.9 "Who can reply?" audience menu

- Click "Everyone can reply" → popover 360×332 anchored under the button (x=321.5), radius 16, padding 24px 16px, dark bg `rgb(20,20,20)` + shadow `rgba(0,0,0,0.5) 0 4px 12px, rgba(0,0,0,0.35) 0 0 2px` (dark; light = white + the standard light popover shadow).
- Title **"Who can reply?"** 17px/700. Rows (48px; the 2-line one 64px), 20px icon + 15px/700 label + 20px radio circle at right (selected = filled accent circle with white check 16px):
  1. **Everyone** (globe) — default, label on button "Everyone can reply"
  2. **Accounts you follow** (person + check) → button text **"Accounts you follow can reply"** with the person-check icon
  3. **Accounts you follow and who they follow** (group)
  4. **Only accounts you mention** (@)
  5. **Verified accounts** (verified badge outline)
- Selecting closes the menu immediately and updates the button label/icon (local state only).
- Screenshots `reply-audience-menu.png` (dark), `reply-audience-changed.png`.

<details><summary>Audience icons (viewBox 24)</summary>

```
GlobeIcon (Everyone) = clone GlobeIcon ✓
FollowingCheckIcon (Accounts you follow, 20px in menu):
M10 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM6 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4zM3.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C13.318 13.65 11.838 13 10 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C5.627 11.85 7.648 11 10 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H1.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46zm19.75-7.22l-4.141 6.21L16.1 9.7l1.2-1.6 1.954 1.47 2.969-4.46 1.664 1.11z
FollowingCheckFilledIcon (button when "Accounts you follow" selected):
M14 6c0 2.21-1.791 4-4 4S6 8.21 6 6s1.791-4 4-4 4 1.79 4 4zm-4 5c-2.352 0-4.373.85-5.863 2.44-1.477 1.58-2.366 3.8-2.632 6.46l-.11 1.1h17.21l-.11-1.1c-.266-2.66-1.155-4.88-2.632-6.46C14.373 11.85 12.352 11 10 11zm12.223-5.89l-2.969 4.46L17.3 8.1l-1.2 1.6 3.646 2.73 4.141-6.21-1.664-1.11z
GroupIcon (follow + who they follow):
M12 5c-.83 0-1.5.67-1.5 1.5S11.17 8 12 8s1.5-.67 1.5-1.5S12.83 5 12 5zM8.5 6.5C8.5 4.57 10.07 3 12 3s3.5 1.57 3.5 3.5S13.93 10 12 10 8.5 8.43 8.5 6.5zm-3.25 1c-.41 0-.75.34-.75.75s.34.75.75.75.75-.34.75-.75-.34-.75-.75-.75zm-2.75.75c0-1.52 1.23-2.75 2.75-2.75S8 6.73 8 8.25 6.77 11 5.25 11 2.5 9.77 2.5 8.25zm16.25-.75c-.41 0-.75.34-.75.75s.34.75.75.75.75-.34.75-.75-.34-.75-.75-.75zM16 8.25c0-1.52 1.23-2.75 2.75-2.75s2.75 1.23 2.75 2.75S20.27 11 18.75 11 16 9.77 16 8.25zM12 13c-1.29 0-2.37.54-3.22 1.61C8 15.6 7.4 17.07 7.12 19h9.76c-.27-1.85-.83-3.28-1.57-4.28C14.45 13.58 13.34 13 12 13zm-4.78.36C8.41 11.86 10.06 11 12 11c2.02 0 3.7.92 4.91 2.53 1.18 1.57 1.88 3.77 2.09 6.39l.08 1.08H4.92L5 19.92c.22-2.7.96-4.97 2.22-6.56zM2.95 16c.16-.55.39-.97.66-1.28.4-.46.94-.72 1.64-.72v-2c-1.26 0-2.35.49-3.15 1.4-.78.89-1.22 2.11-1.35 3.51L.65 18H4v-2H2.95zm18.95-2.6c.78.89 1.22 2.11 1.35 3.51l.1 1.09H20v-2h1.05c-.16-.55-.39-.97-.66-1.28-.4-.46-.94-.72-1.64-.72v-2c1.26 0 2.35.49 3.15 1.4z
MentionIcon (@):
M12 3.786c-4.556 0-8.25 3.694-8.25 8.25s3.694 8.25 8.25 8.25c1.595 0 3.081-.451 4.341-1.233l1.054 1.7c-1.568.972-3.418 1.534-5.395 1.534-5.661 0-10.25-4.589-10.25-10.25S6.339 1.786 12 1.786s10.25 4.589 10.25 10.25c0 .901-.21 1.77-.452 2.477-.592 1.731-2.343 2.477-3.917 2.334-1.242-.113-2.307-.74-3.013-1.647-.961 1.253-2.45 2.011-4.092 1.78-2.581-.363-4.127-2.971-3.76-5.578.366-2.606 2.571-4.688 5.152-4.325 1.019.143 1.877.637 2.519 1.342l1.803.258-.507 3.549c-.187 1.31.761 2.509 2.079 2.629.915.083 1.627-.356 1.843-.99.2-.585.345-1.224.345-1.83 0-4.556-3.694-8.25-8.25-8.25zm-.111 5.274c-1.247-.175-2.645.854-2.893 2.623-.249 1.769.811 3.143 2.058 3.319 1.247.175 2.645-.854 2.893-2.623.249-1.769-.811-3.144-2.058-3.319z
Verified accounts = clone PremiumIcon (outline badge) ✓
Radio check (16px, white on accent circle): M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z
```
</details>

#### 5.10 Compose modal (/compose/post)

- Modal 600 wide × content height (290 empty), **top 45px** (not vertically centred), radius 16, bg white (dark: `rgb(0,0,0)`/`rgb(20,20,20)` on this build). Mask: `rgba(180,180,182,0.5)` light / `rgba(0,0,0,0.5)` dark (lighter than the 0.4 blue-grey mask used by other dialogs).
- Header 53px: **Close** (X, tooltip "Close" appears below it as a small dark pill) left, **Drafts** text button right.
- **Enter motion:** `opacity 0→1` + `scale(0.95→1)` in ~150ms (sampled 0.74/0.979 at t0, 1/1 at ~100ms) — matches the clone's `.t-dropdown`. URL changes to `/compose/post` (clone already intercepts).
- **Escape / Close with text → "Save post?" confirmation sheet:** 320×260 card centred, padding 32, radius 16, extra mask `rgba(0,0,0,0.4)`; title **"Save post?"** (20px/700), body **"You can save this to send later from your drafts."** (15px secondary); buttons 256×44 stacked: **Save** (`confirmationSheetConfirm`, black pill / white text; autofocused) and **Discard** (`confirmationSheetCancel`, outline `1px rgb(207,217,222)`). Discard → closes modal, URL back to `/home`, text discarded. Save → draft stored (not exercised). Reuse the clone's LogoutDialog/confirmation pattern.
- Closing an **empty** modal: no dialog.
- **Drafts** (`/compose/post/unsent/drafts`, title "Drafts", Back arrow `app-bar-back`): tabs **Unsent posts** (`/compose/post/unsent/drafts`) | **Scheduled** (`/compose/post/unsent/scheduled`), 53px, same tab style as home. Empty state (both tabs): headline **"Hold that thought"** (31px/800) + **"Not ready to post just yet? Save it to your drafts or schedule it for later."** (15px secondary). With drafts: list with checkboxes + "Edit" (not observed).
- Screenshots `compose-modal.png`, `drafts.png`, `drafts-scheduled.png`, `save-post-dialog-esc.png`.

### 6. Right panel on /home

- **Clone status:** PARTIAL — `components/layout/right-panel/*` (SearchBox bare input, PremiumCard/News/Trends inert, WhoToFollow functional, footer spans inert). Sticky-by-direction behaviour already implemented (`sticky-panel.tsx`) and matches X closely.
- **Priority:** P0 (search typeahead stub + link targets for every row), P1 (News dismiss menu, trend "…" menu, footer More), P2 (exact typeahead user rows).
- **Complexity:** M

**Column layout (1400):** `sidebarColumn` 350 wide at x=972.5; search bar pinned at top (not part of the sticky body); cards stacked with 16px gaps: Premium (y 65–227), Today's News (243–607), What's happening (623–973), Who to follow (989–1286), footer (1302–1350). Cards: radius **16px**, border 1px `rgb(239,243,244)` light / `rgb(47,51,54)` dark, transparent bg (page bg), headings **20px/800**, 24px line-height, padding 12px 16px.

#### 6.1 Search box + typeahead

- Pill 350×44 (border box), radius 9999, border 1px `rgb(207,217,222)` light / `rgb(51,54,57)` dark; magnifier 16px at left; input 14–15px, placeholder **"Search"**. Focus: border becomes 2px-looking accent ring `rgb(29,155,240)`, icon turns accent. `/` keyboard shortcut focuses it.
- **Focused, empty, no history** → dropdown directly under the pill (350 wide, radius 8, bg page, shadow `rgba(101,119,134,0.2) 0 0 15px, rgba(101,119,134,0.15) 0 0 3px 1px` light / white-glow in dark, min-height ~100px) with centred **"Try searching for people, lists, or keywords"** (15px secondary, 20px padding).
- With recent searches X shows a **"Recent"** header + **"Clear all"** (accent, 13–15px/700) and rows with an × each — **not observed** (account has no history).
- **Typing** ("react") → (a) 3 query suggestions 64px tall: magnifier icon 24px + text where the typed prefix is regular and the completion **bold** (e.g. `react` + **`ion video`**); divider; (b) up to 10 user rows (`data-testid="TypeaheadUser"`, 65.1px: 40px avatar, name 15px/700 + verified badge, @handle secondary); (c) final row **"Go to @react"** (52px). Clear button (`data-testid="clearButton"`, `aria-label="Clear"`, 22px filled circle with × — `rgb(239,243,244)` glyph-circle in dark, `rgb(15,20,25)` in light) inside the pill on the right. Dropdown (verified): radius **8px**, bg = page, shadow `rgba(255,255,255,0.2) 0 0 15px, rgba(255,255,255,0.15) 0 0 3px 1px` in dark (light: the rgba(101,119,134,…) pair).
- Enter → `/search?q=react&src=typed_query` (standard X URL; the synthetic Enter in this session did not navigate, so not re-verified) (results page = area 03). Clicking a suggestion → `/search?q=…&src=typeahead_click`; user row → `/{handle}`.
- Escape closes the dropdown but keeps focus and the text.
- Data: reuse mock users for typeahead (prefix match on handle/displayName) + static query suggestions.
- Screenshots `search-focus-empty.png`, `search-typeahead.png` (dark).

#### 6.2 Subscribe to Premium card

- Unchanged vs clone visually: heading **"Subscribe to Premium"** 20px/800; body **"Get rid of ads, see your analytics, boost your replies and unlock 20+ features."** 15px; **Subscribe** pill (accent bg `rgb(29,155,240)`, white 15px/700, 36px tall, padding 0 16px) → `/i/premium_sign_up` (area 04). Card is an `<aside aria-label="Subscribe to Premium">`, no dismiss.

#### 6.3 Today's News

- Card 350×364. Header **"Today's News"** + **Close** button (32×32, CloseIcon 18.75px, `aria-label="Close"`). 3 rows (`role="link"`, `data-testid="news_sidebar_article_{base64 id}"`), each 348×102, padding 12px 16px: title 15px/700/20px (2-line clamp, ellipsis), meta row: stacked **avatar facepile** (three 22px circles overlapping by ~10px, 2px ring in bg colour) + **"Trending now · News · 81 posts"** or **"14 hours ago · Other · 1,697 posts"** (13px/400/16px secondary).
- Row click → `/i/trending/{id}` (e.g. `/i/trending/2107198470171881796`, title "Nebius Shares Dip to $232 as Investors Buy the Weakness / X") — story page belongs to area 03.
- **Close X does not hide immediately** — it opens a small menu (166.6×132, radius 12, items 44px, 15px/700, padding 12px 16px, no icons): **Dismiss for a day**, **Dismiss for a week**, **Not interested**. (Not clicked to avoid hiding the module for the other researchers; expected: card disappears, no toast.) Screenshot `news-close-menu.png`.
- Clone delta: rows → links to a `/i/trending/[id]` stub; X → dropdown-menu with those 3 items, hide card in local state.
- Data: `NewsStory { id, title, category: "News"|"Other"|"Sports"…, postCount, updatedLabel: "Trending now"|"14 hours ago", avatars: string[3] }`.

#### 6.4 What's happening (trends)

- `section` with heading **"What's happening"**, 4 rows (`data-testid="trend"`, 348×62, padding 12px 16px): context line 13px/400 secondary (**"Trending in Argentina"**, **"Politics · Trending"**, **"Sports · Trending"**), name 15px/700 (e.g. **"#Eleições2026"**, **"Gianluca Prestianni"**), optional third line "N posts" 13px secondary. Hover bg `rgba(0,0,0,0.03)` light / `rgba(255,255,255,0.03)` dark.
- Row click → `/search?q=%22Gianluca%20Prestianni%22&src=trend_click&vertical=trends` (verified; multi-word trends are wrapped in quotes) (area 03).
- **"…" (More)** button (18.75px icon in a 34.75px circle, hover accent tint) at top-right of each row → menu (337.5×264, radius 12, anchored right-aligned under the button) with 6 items, 44px each, 15px/700, each with the same **frown face icon** 18.75px:
  1. **The associated content is not relevant**
  2. **This trend is spam**
  3. **This trend is abusive or harmful**
  4. **Not interested in this**
  5. **This trend is a duplicate**
  6. **This trend is harmful or spammy**
  Selecting removes the trend row (X replaces it with a "Thanks. Refresh this page to update these trends." style message — **not observed**, not clicked).
- **"Show more"** (accent 15px, 52px row, padding 16px) → `/explore/tabs/for-you`.
- Screenshot `trend-more-menu.png`.

<details><summary>Frown icon (trend menu), viewBox 24</summary>

```
M12 13.6c1.64-.013 3.278.76 4.284 2.02.114.14.218.282.317.43l-1.202.9c-.088-.102-.177-.197-.272-.289-.844-.823-1.98-1.264-3.125-1.26-1.146-.002-2.282.441-3.129 1.263-.095.092-.185.186-.273.287l-1.2-.902c.1-.149.205-.29.319-.429C8.728 14.364 10.36 13.59 12 13.6zM9.25 8c.828 0 1.5.796 1.5 1.9 0 1.105-.672 1.85-1.5 1.85s-1.5-.745-1.5-1.85c0-1.104.672-1.9 1.5-1.9zm5.5 0c.828 0 1.5.796 1.5 1.9 0 1.105-.672 1.85-1.5 1.85s-1.5-.745-1.5-1.85c0-1.104.672-1.9 1.5-1.9z
(X renders this inside a 24px circle outline — capture the full svg if the outline is wanted)
```
</details>

#### 6.5 Who to follow

- `aside aria-label="Who to follow"`, 3 `UserCell` rows (348×65.1) → avatar/name/handle link to `/{handle}`; Follow pill. Clone FUNCTIONAL.
- **"Show more"** → `/i/connect_people?user_id={viewerId}` (area 04 "Follow" page). Clone: make it a link to `/i/connect_people`.

#### 6.6 Footer

- `nav aria-label="Footer"`, padding 0 16px, links **11px/12px** secondary (`rgb(83,100,113)` light / `rgb(113,118,123)` dark) separated by " · ": **Terms** → `https://x.com/tos`, **Privacy** → `https://x.com/privacy`, **Cookies** → `https://support.x.com/articles/20170514`, **Accessibility** → `https://help.x.com/resources/accessibility`, **Ads Info** → `https://business.x.com/help/troubleshooting/how-twitter-ads-work.html?...`, **More** (button with tiny "…"), then **"© 2026 X Corp."**
- **More** → menu 113.8×132, radius 12, opening upward from the button: **About** (`https://about.x.com`), **Get App** (`https://help.x.com/using-x/download-the-x-app`), **Developers** (`https://developer.x.com`), 44px rows, 15px/700.
- Clone: turn spans into `<a target="_blank">`; add the More dropdown. Screenshot `footer-more-menu.png`.

#### 6.7 Sticky behaviour

- Search bar stays fixed at top (y=8.5) while the card stack scrolls with the page until its bottom is reached, then sticks (scrolling up reverses) — same model the clone implements. Screenshots `right-panel-top.png`, `right-panel-scrolled.png`.

### 7. Keyboard shortcuts

- **Clone status:** MISSING. **Priority:** P1 (j/k/l/n/g+h/g+e, "?" modal), P2 (rest). **Complexity:** M (global key handler + modal).
- **"?"** opens a modal at route **`/i/keyboard_shortcuts`** (URL changes; title stays "Home / X"; Escape returns to `/home`). Modal 822×721, centred (x=288.8, y=89.5), radius 16, bg page/elevated; header with Close X + **"Keyboard shortcuts"** (20px/700). Three columns separated by 1px vertical dividers; column headings **Navigation**, **Actions**, **Media** (20px/800). Each row: label 15px left, key caps right — caps are monospace 15px, `padding:1px 4px`, radius 4, min-width ~25px, bg `rgb(22,24,28)` + border 1px `rgb(32,35,39)` (dark; light ≈ `rgb(247,249,249)` + `rgb(239,243,244)`), "+" between chord keys.
- **Full list (exact copy):**
  - *Navigation:* Shortcut help `?` · Next post `j` · Previous post `k` · Page down `Space` · Load new posts `.` · Home `g + h` · Explore `g + e` · Notifications `g + n` · Mentions `g + r` · Profile `g + p` · Drafts `g + f` · Scheduled posts `g + t` · Likes `g + l` · Lists `g + i` · Chat `g + m` · Grok `g + g` · Creator Studio `g + c` · Settings `g + s` · Bookmarks `g + b` · Go to user… `g + u` · Display settings `g + d`
  - *Actions:* New post `n` · Send post `⌘ + Enter` · Search `/` · Like `l` · Reply `r` · Repost `t` · Share post `s` · Bookmark `b` · Mute account `u` · Block account `x` · Open post details `Enter` · Expand photo `o` · Open/Close Messages dock `i`
  - *Media:* Pause/Play selected Video `k` · Pause/Play selected Video `space` · Mute selected Video `m` · Go to Audio Dock `a + d` · Play/Pause Audio Dock `a + space` · Mute/Unmute Audio Dock `a + m`
- **Verified behaviour:** `j`/`k` move a focus ring between timeline posts and scroll the focused post into view (focused `article` gets `box-shadow: rgb(142,205,248) 0 0 0 2px inset` and hover-like bg `rgb(22,24,28)` dark / `rgb(247,249,249)` light); `l` likes the focused post (verified, then pressed `l` again to unlike — reverted); `n` → `/compose/post`; `g e` → `/explore`; `g n` → `/notifications`; `g h` → `/home`; `g p` → `/PedroLo01746179`; `g b` → `/i/history`; `g m` → `/i/chat/...`; `/` focuses `SearchBox_Search_Input`. Keys are ignored while typing in inputs.
- Screenshots `shortcuts-modal.png`, `kbd-j-focus.png`.

### 8. Global surfaces

#### 8.1 Toast

- Trigger used: bookmark a post → **"Added to your Bookmarks"** + action button **"Add to Folder"** (15px/700 white); remove → **"Removed from your Bookmarks"** (no action). Both reverted (bookmark removed).
- `data-testid="toast"`, `role="alert"`. Box: bg **`rgb(29,155,240)`** (accent, both themes), radius **4px**, padding **12px**, height 44, width = content (347 with action, 263.9 without), text 15px/400/20px white. Position: horizontally centred in the **600px primary column** (container x=400–1000 at 1400), **32px above the viewport bottom** (y=824 of 900).
- Motion: `transition: opacity .17s linear` (fade in/out, no slide). Appears after the request resolves (~0.5–0.8s after click). Visible ≈ 5–6s, then fades.
- Clone delta (`ui/toast.tsx`): add the 170ms fade, the optional action button, centre on the primary column (not the viewport), 32px bottom offset. Screenshots `toast-bookmark.png`, `toast-remove-bookmark.png` (if empty, the toast had already faded — values above are from DOM).

#### 8.2 Tooltip

- Appears **~500ms after hover** (first frame at ~610ms incl. polling), animates `opacity 0→1` + `scale(0.95→1)` over ~150ms (sampled .49/.974 at +47ms, .84/.992 at +98ms, 1/1 at +148ms ⇒ ease-out).
- Box: bg `rgba(70,70,70,0.9)` (measured while dark), radius 16 (pill), text **11px/12px, white**, padding ≈ 4px 8px (box 53.7×20 for "Explore"); placed **6px below** the trigger, horizontally centred.
- Where: collapsed sidebar icons (label = item name, "Post"), composer toolbar ("Media", "GIF", "Poll", "Emoji", "Schedule", "Content disclosure"), "Manage timelines", modal "Close", tweet action buttons (area 02). Disabled buttons have none.
- Screenshot `collapsed-tooltip.png`.

#### 8.3 Focus rings

- Nav pills: `box-shadow: rgb(135,138,140) 0 0 0 2px` (grey). Menu items / list rows / focused posts: `box-shadow: rgb(142,205,248) 0 0 0 2px inset` (light blue). Buttons in dialogs (e.g. Save): 2px blue outer ring. Only on `:focus-visible` (keyboard).

#### 8.4 Page title

- Format `"{Section} / X"`; profile `"{Name} (@{handle}) / X"`; story `"{Headline} / X"`. Unread prefix `"(N) "` — not observed. Modal routes (`/compose/post`, `/i/keyboard_shortcuts`) keep the underlying page's title.

#### 8.5 Scrollbar

- Native document scrollbar, no custom styling. X sets inline on `<html>`: `overflow-y: scroll; overscroll-behavior-y: none; font-size: 15px; color-scheme: dark` (dark theme) — so the scrollbar track is always reserved (no layout shift) and dark in dark mode. Clone: same three properties on `html`.


## Cross-cutting findings

Shared primitives this area needs (spec'd so the consolidator can dedupe):

1. **Modal (generic)** — X has two families:
   - *Dialog* (Manage timelines, Keyboard shortcuts, confirmation sheets): centred, radius 16, mask `rgba(91,112,131,0.4)` (light), no enter animation; confirmation sheet 320 wide, padding 32, stacked 44px buttons.
   - *Compose-family sheet* (compose, GIF, Schedule, Content disclosure, Drafts, thread): 600 wide, **top: 45px** (not centred), radius 16, header 53px with Close/Back at left (36px icon button at x+8) and title 20px/700 at x+72, mask `rgba(180,180,182,0.5)` light / `rgba(0,0,0,0.5)` dark, enter = fade + scale .95→1 ~150ms.
   - Needs: focus trap, Escape, backdrop click, scroll lock, return focus, route-driven (`@modal`) or local. Promote `features/auth/hooks/use-modal-dialog.ts` + `trap-focus.ts` into `components/ui/modal.tsx`.
2. **Popover menu** (More, account, trend "…", footer More, News close, audience): reuse `ui/dropdown-menu.tsx`. Specs: radius 12 (16 for account/audience/emoji/Grok), light shadow `rgba(101,119,134,0.2) 0 0 15px, rgba(101,119,134,0.15) 0 0 3px 1px`, dark shadow `rgba(255,255,255,0.2) 0 0 15px, rgba(255,255,255,0.15) 0 0 3px 1px` (some newer menus use `rgba(0,0,0,0.5) 0 4px 12px, rgba(0,0,0,0.35) 0 0 2px` on an elevated `rgb(20,20,20)` surface in dark), rows 44px (15px/700, padding 12px 16px) or 56px (sidebar More, 20px/700, padding 16px), hover `rgb(247,249,249)` light / `rgb(22,24,28)` dark, focus-visible inset ring `rgb(142,205,248) 0 0 0 2px`. Fade-in ~100–150ms.
3. **Tooltip** — 500ms delay, fade+scale .95→1 150ms, `rgba(70,70,70,0.9)`-ish pill, 11px/12px white, 6px below trigger. New `components/ui/tooltip.tsx`.
4. **Tabs with indicator** — 53px tabs, 15px, active 700 primary / inactive 500 secondary, 4px pill indicator in accent, width = label width (min 56px), **no slide animation** (instant). Used by home, drafts, explore, profile. Extend `ui/tab.tsx`.
5. **Spinner** — 26px SVG (viewBox 32, r14, stroke 4, track opacity .2, dasharray 80/offset 60), rotate 0.75s linear infinite, accent colour. Plus a 3px top progress bar (determinate for posting, indeterminate for refresh). New `components/ui/spinner.tsx`.
6. **Toast** — accent bg, radius 4, padding 12, 15px white, optional bold action, centred on the primary column 32px from bottom, opacity 170ms linear, ~5–6s. Update `ui/toast.tsx`.
7. **Switch** — 40×20 track, accent when on (GIF auto-play, Content disclosure). New `components/ui/switch.tsx` (area 05 settings will need it too).
8. **Floating-label select / input** — 58–60px tall, radius 4, 1px border `rgb(207,217,222)`/`rgb(51,54,57)`, label 13px top-left, value 17px, chevron at right; focused: accent border + 1px accent ring + accent label; char counter "0 / 25" top-right. Used in Poll + Schedule (and settings). The clone's auth inputs already implement most of this — move to `components/ui`.
9. **Search input pill** — 44px, radius 9999, focus accent ring, clear button (22px) — used by right panel, GIF picker, emoji picker (44px), Manage timelines (44px but radius 12 and grey fill).
10. **Responsive shell** — three breakpoints worth implementing: `≥1265` expanded, `<1265` icon sidebar (88px), `<988` hide right column; optional `<500` mobile bars. Implement with Tailwind arbitrary breakpoints (`min-[1265px]:`, `min-[988px]:`) in `app-shell.tsx`/`sidebar.tsx`.
11. **Icons to add** (paths above): NotificationsActive, FollowActive, ChatActive, GrokActive, CreatorStudioActive, PremiumActive(=Verified), Lists, Communities, Business, Ads, Spaces, Settings, Compose (2-path), PinPlus, ArrowUp, FollowingCheck, FollowingCheckFilled, Group, Mention, Frown, DockChatBubble, RadioCheck.

## Open questions / not observed

- **Unread badges** on Notifications/Chat and the `(N) ` title prefix — account had 0 unread; spec given from known X behaviour, needs verification.
- **"See new posts" pill visible state** (avatars + "posted") — never surfaced during a 4-minute watch (session was being rate-limited, 429 on `Viewer`/`account/settings`). Hidden-state DOM and transitions were measured.
- **Recent searches** list in the search dropdown — account has no history.
- Account switcher showed **"Something went wrong. Try reloading."** (multi-account list request failed) — the normal current-account row was not seen.
- Final effect of News "Dismiss for a day / week / Not interested", trend "…" items, pinning a timeline, Schedule "Confirm", poll/GIF attachment previews, Save-draft and the posting flow — deliberately not executed (would change account state visible to other researchers or publish).
- Theme instability: another researcher toggled the account between light and dark several times; values are labelled light/dark where known. Ambiguous ones: compose-modal mask `rgba(180,180,182,0.5)` (light) vs dialog mask `rgba(91,112,131,0.4)`; popover surface `rgb(20,20,20)` in dark on newer menus vs page-black on older ones.
- Exact pixel thresholds for the height-overflow of sidebar items (between 600 and 700px window height) were not bisected.
- A hung third-party tab (starlink.com ad page opened by someone's click) blocked Playwright's `connectOverCDP` for everyone from ~mid-session; the last steps were done over raw CDP (own target, closed afterwards). The hung tab was left open (not mine to close).
