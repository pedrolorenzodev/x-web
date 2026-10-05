# 04 — Follow, Chat, Grok, History (+ Creator Studio, Premium, Business, Spaces)

Captured 2026-10-05 on logged-in x.com (@PedroLo01746179), viewport 1400×900.
**Theme caveat:** another researcher was toggling Settings → Display while this was captured, so screenshots alternate between Default (light), Dim and Lights out. Every colour below is labelled with the theme it was read in. Sizes/copy are theme-independent.

## Scope map

```
Sidebar "Follow"  → /i/connect_people                         (L1, page)            F1  P0
  ├─ tab Who to follow   → /i/connect_people?show_topics=false (L2, default)
  ├─ tab Creators for you→ /i/connect_people?is_creator_only=true (L2; "Subscribe" buttons → paid flow, OUT)
  ├─ variant ?user_id=<id> ("Show more" in right-panel Who to follow) → "Follow" seed + "Similar to <name>" (L2)
  ├─ Unfollow confirmation dialog (L2 modal, no route)
  └─ header gear → /settings/contacts (L3, name only)
Sidebar "Chat" (aria "Direct Messages") → /i/chat             (L1, full-width app)   F2  P1 mock / passcode OUT
  ├─ legacy /messages → /i/chat ; /messages/requests → /i/chat/requests ; /messages/settings → /settings/direct_messages (L3)
  ├─ /i/chat/pin/new  (passcode welcome → Create Passcode PIN step)  [gate, observed]
  ├─ /i/chat/<lowId>-<highId>  conversation (L2)            [not observed]
  ├─ /i/chat/requests (L2) · /i/chat/settings (L2)           [not observed, gated]
  ├─ New message modal (header button "New message")         [not observed]
  └─ /messages/compose → "Share" modal over Home (600×650) hosting the chat app
Floating dock (bottom-right, all timeline pages)              (L1)                  F3  P2
  ├─ Chat drawer 400×530 → "Open in full view" → /i/chat, "Close" (chevron)
  └─ Grok drawer → Private Chat / Chat history / Open conversation / Collapse
Sidebar "Grok" → /i/grok                                      (L1, no right panel)  F4  OUT (static shell P2)
  ├─ Focus Mode · History (Chat history) · Private · Link accounts (modal "One Grok, everywhere")
  ├─ Model menu "Fast" → Fast (Grok 4.6) ✓ · Go to grok.com (external)
  └─ "Meet Grok Bot" card → Learn more (L3)
Sidebar "History" → /i/history  (/i/bookmarks redirects here) (L1)                  F5  P0
  ├─ tab Bookmarks → /i/history          · header "Search Bookmarks" → in-header search mode (no URL change)
  ├─ tab Likes     → /i/history/likes    · header "Information" → "Likes" info modal
  └─ "Search settings" link in no-results → /settings/search (L3)
Sidebar "Creator Studio" → /i/jf/creators/studio              (L1)                  F6  P2 static / rows OUT
  ├─ Original Content Rewards → /i/jf/creators/monetization_paywall?product=original_content_rewards (L2 paywall)
  ├─ Subscriptions → /i/jf/creators/monetization_paywall?product=subscription (L2)
  ├─ Live Studio → /i/premium_sign_up?referring_page=x_studio · Analytics → /i/jf/creators/analytics_paywall
  ├─ Inspiration → /i/jf/creators/inspiration/top_posts (L2, not captured)
  └─ Contact support → chat with X Support (passcode gate) · Learn more → help.x.com (external)
Sidebar "Premium" → /i/premium_sign_up (full-screen takeover)  (L1)                  F7  OUT
  └─ Explore Premium Business → /i/premium-business (L2)
More menu → Business → /i/verified-orgs-signup → /i/premium-business (modal)         F8  OUT
More menu → Create your Space → /i/spaces/start (modal)                              F8  OUT
```

**Features documented:** F1 Follow (+ Unfollow dialog, Creators tab, Similar-to variant), F2 Chat (routes, full-width shell, inbox skeleton, passcode wall; proposed inbox/conversation/composer/new-message specs), F3 Floating dock + chat/Grok drawers, F4 Grok, F5 History (Bookmarks, Likes, search, toasts, info modal), F6 Creator Studio, F7 Premium, F8 Business + Create your Space.


## Features

### F1. Follow page — `/i/connect_people`

- **Level / route / entry points:** Level 1. Sidebar "Follow" (`data-testid=AppTabBar_Follow_Link`, `href=/i/connect_people`, aria-label "Follow"). Also right-panel "Who to follow" → "Show more" links to `/i/connect_people?user_id=<viewerOrProfileId>` (level 2 variant, see below). Document title `Follow / X`.
- **Clone status:** MISSING page (sidebar item is VISUAL in `components/layout/sidebar.tsx`). Reusable as-is: `components/user/user-cell.tsx` (already 16/12 padding, 8px gap, bio `mt-1`, `hover:bg-white/3`) and `components/user/follow-button.tsx` (Following→Unfollow red swap with fixed-width grid). Deltas vs X: (1) **no Unfollow confirmation dialog** — clone unfollows on click; (2) no verified badge after the name; (3) bio is plain text (X colours @mentions/#hashtags/URLs); (4) after a click-to-follow X does not show the red "Unfollow" until the pointer leaves and re-enters (clone shows red immediately because of `:hover`).
- **Suggested priority:** P0 (cheap: it is a list of existing `UserCell`s and makes a sidebar item real).
- **Complexity:** S–M.

#### Layout & measurements (600px column variant: column x=344..942, 598px inner + 1px borders)
- **Header (sticky, z-index 3, h 53):** Back button (`data-testid=app-bar-back`, 36×36 round, margin-left −8px, at x=352) · title `Follow` (h2, 20px / 700 / lh 24px, x=416) · right: Settings gear link (`data-testid=settingsAppBar`, aria-label "Settings", `href=/settings/contacts`, 36×36 round, margin-right −9px). Same blurred header style as the clone's `components/layout/page-header.tsx` (add an optional right-side action slot).
  - Note: the back arrow is present even when reached from the sidebar (it does `history.back()`).
- **Tabs (role=tablist, h 53, full width 598, 2 equal tabs):**
  - `Who to follow` → `href=/i/connect_people?show_topics=false` (default, selected)
  - `Creators for you` → `href=/i/connect_people?is_creator_only=true`
  - Tab cell: padding 0 16px, h 53. Label 15px, line-height 20px. Selected: weight 700, primary text colour. Unselected: weight 500, secondary text colour (`rgb(113,118,123)` light & lights-out). Indicator: 4px tall, `border-radius 9999px`, `#1D9BF0` (`rgb(29,155,240)`), **width = label width** (99px under "Who to follow", 116px under "Creators for you"), bottom-aligned (y=102 for a tab at y=53..106). Hover bg on tab = standard hover (`rgba(15,20,25,0.1)` light / `rgba(231,233,234,0.1)` dark). Clone's `ui/tab.tsx` already matches this pattern.
  - Bottom border of the header block: 1px `rgb(239,243,244)` light / `rgb(47,51,54)` lights out.
  - Switching tabs is a **route change** (query string), indicator jumps (no slide, measured: x 729→440 in a single frame, no transition).
- **Section heading (Who to follow tab only):** `Suggested for you` — h2, 20px rendered / 800 weight (computed 15px on wrapper; visual is the standard 20px/800 "module title" used in right-panel cards), wrapper h 48, padding 12px 16px (text at x=360, y=127). No such heading on the "Creators for you" tab — the list starts directly under the tabs.
- **User cell (`data-testid=UserCell`, rendered as `<button role=button>`, whole cell clickable → profile):**
  - padding 12px 16px; height grows with bio (89px with one bio line, 109px two lines, 129px three lines). No separators between cells.
  - Avatar 40×40 circle (`data-testid=UserAvatar-Container-<handle>`), 16px from the cell edge, `margin-right: 8px` → text column at +64px (avatar x=360, text x=408).
  - Row 1: display name 15px/700/lh 20px primary + verified badge (18.75×18.75, margin-left 2px; blue `#1D9BF0`, gold for orgs, grey for government) + optional affiliate badge (small square org avatar) · Row 2: `@handle` 15px/400 secondary. Name and handle stack vertically, each truncates with ellipsis.
  - Follow button vertically centred against the name/handle block (top of cell + 17px), right-aligned at padding 16px.
  - Bio: 15px/400/lh 20px primary colour, below handle with 4px top gap, full text (no clamp), entities coloured (`#1D9BF0`) for @mentions, #hashtags and URLs.
  - "Follows you" chip: not present in any suggestion (X shows it next to the handle in followers lists: 11px/?, bg `rgba(…)` — not observed here, see Open questions).
  - Hover on cell: background `rgba(0,0,0,0.03)` light / `rgba(255,255,255,0.03)` dark, transition `background-color 0.2s`.
- **Follow button states (pill, height 32, padding 0 16px, min-width 32, border 1px, radius 9999, label 14px/700/lh 16px; transition `background-color .2s, box-shadow .2s`):**

  | State | Label | aria-label | testid | bg | border | text | width |
  |---|---|---|---|---|---|---|---|
  | Not following | `Follow` | `Follow @h` | `<userId>-follow` | light: `rgb(15,20,25)`; dark: `rgb(239,243,244)` | transparent | light: `#fff`; dark `rgb(15,20,25)` | 77.8 |
  | Follow hover | | | | dark: `rgb(215,219,220)` (light: `rgb(39,44,48)`) | | | |
  | Following (rest) | `Following` | `Following @h` | `<userId>-unfollow` | transparent | light `rgb(207,217,222)` / dark `rgb(83,100,113)` | primary | 99 (fixed: X locks the width so Following/Unfollow do not jump) |
  | Following hover | `Unfollow` | (same) | | `rgba(244,33,46,0.1)` | light `rgb(253,201,206)` / dark `rgb(103,7,15)` | `rgb(244,33,46)` | 99 |

  - Right after clicking Follow, while the cursor is still over the button, X shows `Following` with the *pressed* colours (light: bg `rgb(39,44,48)`, text white) — it does **not** immediately show red "Unfollow"; the red hover state only applies after the pointer leaves and re-enters. Worth replicating (avoids accidental double-click unfollow).
  - **No toast** after follow. Count/feedback is the button swap only.
  - Creators tab replaces the button with `Subscribe` (aria-label `Subscribe to @h`, testid `<userId>-subscribe`, pill 102×32, bg `rgb(15,20,25)` light, white label). Clicking it starts a paid creator subscription purchase → **OUT** (render as VISUAL or link to profile).
- **Unfollow confirmation dialog** (opens on click of `Following`):
  - `data-testid=confirmationSheetDialog`, width 320, padding 32, radius 16, bg = page bg (lights out `#000`, light `#fff`), centred in viewport. Mask `data-testid=mask` full viewport `rgba(91,112,131,0.4)` (dim/dark; light uses `rgba(0,0,0,0.4)`).
  - Title (h1): `Unfollow @OrthodoxRedpill?` — 20px/700/lh 24px, margin-bottom 8px.
  - Body: `Their posts will no longer show up in your Following timeline. You can still view their profile, unless their posts are protected.` — 15px/400/lh 20px secondary colour.
  - Buttons (stacked, full width 256, height 44, padding 0 24px, radius 9999, label 15px/700, gap 12px; first one 24px below the body):
    - `Unfollow` (`confirmationSheetConfirm`): primary inverted (dark: bg `rgb(239,243,244)` text `rgb(15,20,25)`; light: bg `rgb(15,20,25)` text white).
    - `Cancel` (`confirmationSheetCancel`): outline, border `rgb(83,100,113)` dark / `rgb(207,217,222)` light, transparent bg.
  - Close: Cancel, click on the mask, Escape. **Motion: none** — measured with rAF sampling, the dialog and mask appear at opacity 1 / no transform on the first painted frame and vanish on the first frame after Cancel.
  - After confirm: button returns to `Follow`, no toast.
- **Infinite scroll:** list paginates (≈20 per page) and virtualises; after scrolling to the bottom repeatedly it **stopped at 100 unique users** with no end message and no visible spinner at rest (a 26px circular spinner appears briefly at the bottom while fetching — standard X `role=progressbar`).
- **Right panel on this page:** Search box, "What's happening" trends card, "Who to follow" card (3 users + "Show more" → `/i/connect_people?user_id=<viewer id>`), footer links. **No Premium card** on this route. Both bottom-right floating buttons (Grok + Chat drawer) are visible.
- **Level-2 variant `/i/connect_people?user_id=<id>`** ("Show more" from the right-panel Who-to-follow on someone's profile, e.g. `?user_id=44196397` for @elonmusk): same header + tabs, then a section `Follow` (h2) with the seed user's cell, a 1px divider, then section `Similar to <Display Name>` (h2) followed by the list. When the id is the viewer's own, it is the plain "Suggested for you" list.
- **Level 3 (name only):** Settings gear → `/settings/contacts` ("Discoverability and contacts" settings page, area 05).

#### Data model
```ts
// features/connect/types.ts
export type ConnectTab = "who-to-follow" | "creators";
export type SuggestionReason =
  | { kind: "suggested" }                 // "Suggested for you"
  | { kind: "similar-to"; user: UserSummary }; // "Similar to {displayName}"
export interface ConnectPeoplePage {
  seed: User | null;                 // ?user_id= variant: the seed user's cell under "Follow"
  sectionTitle: string;              // "Suggested for you" | `Similar to ${seed.displayName}` | "" (creators tab)
  users: Page<User>;                 // reuse Page<T>; User needs `verified`, `followsViewer`
}
```
Add to `User`: `verified: "blue" | "gold" | "grey" | null`, `followsViewer: boolean`, `isCreator: boolean` (creators tab filter). Mocks: rank non-followed users from the 124-user set; `?is_creator_only=true` → users with `isCreator`.

#### Routing
`app/(app)/i/connect_people/page.tsx` reading `searchParams` (`is_creator_only`, `user_id`, `show_topics`). Tabs as `<Link>`s (`ui/tab.tsx`). Right panel: home panel minus Premium card.

#### Screenshots
`screens/04-follow-chat-grok-history/follow-01-page.png` (light), `follow-01b-page-dark.png`, `follow-03-following.png`, `follow-04-unfollow-hover.png`, `follow-05-unfollow-dialog.png` (dim), `follow-06-scrolled.png`, `follow-07-end.png`, `follow-08-creators-tab.png`, `follow-09-similar-to.png` (lights out), `follow-02-hovercard.png` (hover card, owned by area 02).

### F2. Chat (new "X Chat", end-to-end encrypted DMs) — `/i/chat`

> **Superseded by PLAN.md (2026-10-05):** the user decided the clone builds ONLY the passcode flow (Welcome → Create Passcode) as the last reachable Chat screen, with a "not available" notice. The inbox, conversation, new-message, requests, settings and drawer specs below are **not to be built**. See PLAN.md block H1.

> **Hard limit of this capture:** the account has never set up X Chat. Every chat surface (`/i/chat`, the bottom-right drawer, legacy `/messages*`) is gated behind a **passcode-creation wall**. The brief forbids setting a passcode, so the inbox, conversation view, composer, info panel, new-message modal, requests and DM settings could **not** be observed. What *was* observed: route/redirect behaviour, the full-width two-pane shell, the inbox **loading skeleton** (which reveals the list pane geometry), the welcome/passcode screens, and the drawer chrome. Specs for the unobserved parts below are marked **(not observed — proposed)**; build them as a mock-only UI consistent with the measured skeleton.

- **Level / route / entry points:** Level 1. Sidebar "Chat" (`data-testid=AppTabBar_DirectMessage_Link`, `href=/i/chat`, aria-label **"Direct Messages"**, label "Chat"). Bottom-right floating Chat button (`data-testid=chat-drawer-main`, aria-label "Chat") opens the drawer (F3). Profile "Message" button (area 05) should deep-link into a conversation.
- **Clone status:** MISSING (sidebar item VISUAL; profile "Message" VISUAL; no DM types/mocks).
- **Suggested priority:** P1 for a mock inbox + conversation view (high perceived realism, all client-side); **OUT** for encryption/passcode flows (do not replicate the passcode wall — it is an account-state gate, not a feature).
- **Complexity:** L (two-pane layout, collapsed sidebar mode, message list, composer, modal).

#### Routing (observed)
| URL | Result |
|---|---|
| `/i/chat` | Chat app (full-width). Without passcode → client-side redirect to `/i/chat/pin/new?from=%2Fi%2Fchat` after the inbox skeleton has shown for ~2–5s |
| `/messages` (legacy) | redirects to `/i/chat/pin/new?from=%2Fi%2Fchat` (i.e. `/messages` → `/i/chat`) |
| `/i/chat/pin/new?from=…` | passcode welcome → "Create Passcode" step (same URL, no route change between the two steps) |
| `/messages/requests`, `/i/chat/requests` | → `/i/chat/pin/new?from=%2Fi%2Fchat%2Frequests` (so the requests route is `/i/chat/requests`) |
| `/i/chat/settings` | → `/i/chat/pin/new?from=%2Fi%2Fchat%2Fsettings` (chat settings route is `/i/chat/settings`) |
| `/messages/settings` | → **`/settings/direct_messages`** (classic settings page, area 05) |
| `/messages/compose` | stays on the URL and renders **Home behind a 600×650 centred modal titled `Share`** (back arrow at left, title centred 17px/700, radius 16, mask), whose body is the chat app — here the passcode step. This is the "Send via Chat / share post" modal used by the tweet Share menu. |
| Creator Studio → Contact support | `/i/chat/1324935522612031488-1399766153053061121` → passcode wall. **Confirms 1:1 conversation ids are `<lowerUserId>-<higherUserId>`.** |
| Document title | `X` while loading, then stays `X` (no "Chat / X") |

Proposed clone routes: `/i/chat` (inbox, empty right pane), `/i/chat/[conversationId]` (conversation), `/i/chat/new` (New message modal, intercepted `@modal`), `/i/chat/requests`, `/i/chat/settings`. Keep `/messages` → redirect to `/i/chat`.

#### Shell change on Chat routes (observed — important for the shell agent)
- **The left sidebar collapses to icon-only even at 1400px** (labels hidden, x=76..128 icon column, nav column ends at x=136 with a 1px right border). The Post button becomes a 52×52 round icon button with the "compose" (pencil-in-square) icon; the account switcher becomes just the 40px avatar.
- **No right panel** (no search, trends, who-to-follow) and **no floating Grok/Chat buttons**.
- Main area spans x=137..1322 (**1185px**, the full width of primary+sidebar columns), with a 1px right border at x=1322.
- The active sidebar icon is the filled chat bubble.
- The chat app inside is a separate bundle (Tailwind-styled, rendered into **shadow DOM** under `data-testid=xchatEmbedRoute`, `height:100dvh`). Its tokens differ slightly from the main client: text `rgb(15,20,26)`, borders `rgb(228,234,236)`, secondary text `rgba(0,0,0,0.6)` (light), and Tailwind default transitions (`150ms cubic-bezier(0.4,0,0.2,1)`); inputs use `200ms cubic-bezier(0,0,0.2,1)`. Font is still Chirp.

#### Inbox list pane (measured from the loading skeleton, light theme)
- **Pane:** x=137, **width 415px incl. 1px right border `rgb(228,234,236)`** (414 content). Conversation pane = remaining 770px.
- **Header row** (h ≈ 64): title `Chat` — 20px / 700 / lh 24px at (153, 20) → 16px left padding. Right: **New message** icon button (aria-label `New message`), 36×36, radius 9999, **bg `rgba(0,0,0,0.04)`** (filled grey circle even at rest), icon `icon-messages-plus-stroke` (chat bubble with a "+"), at x=498 (16px from the pane's right edge).
- **Search input:** 381.8×40 at (153, 68) — 16px side padding, 12px below header; pill radius 9999; bg `rgba(0,0,0,0.04)`; border 1px transparent; padding 0 40px (leading magnifier icon at 16px, trailing clear button); font 15px / lh 20px; placeholder **`Search`**; transition `color, border-color, box-shadow, background-color 200ms cubic-bezier(0,0,0.2,1)`. Trailing button aria-label **`Close search`** (32×32, `icon-close` 16px) — shown when the field has focus/value.
- **Conversation rows:** 72px pitch (first row top ≈ 133; avatars at y=141, 213, 285…). Avatar **48×48** circle at x=161 (= 8px row inset + 16px row padding → rows are inset cards with rounded hover, see proposed spec). Text column at x=225 (avatar + 16px gap). Skeleton: line 1 (name) 16px tall bar ≈ 100–130px wide; line 2 (preview) 16px bar ≈ 150–220px at +20px; right-aligned time bar ≈ 28px wide at the row's top-right. Skeleton colour `rgb(242,242,242)`, radius 14.4px, Tailwind `animate-pulse` (`2s cubic-bezier(0.4,0,0.6,1) infinite`, opacity 1→0.5→1). 11+ rows fill the viewport.
- **Row content (not observed — proposed, matching X Chat as publicly shipped):** avatar 48 · row 1: display name 15px/700 (truncate) + verified badge + `·` + relative time (`2h`, `Sep 23`) 15px/400 secondary, right-aligned · row 2: last message preview 15px/400 secondary, single line ellipsis, prefixed `You: ` for own messages; unread rows: name and preview in primary colour/700 and a 10px `#1D9BF0` dot on the right. Selected row: bg `rgba(0,0,0,0.04)` (light) / `rgba(255,255,255,0.06)` (dark), radius 12. Hover: same bg at 50% strength.
- **Empty inbox (not observed — proposed, X copy):** title `Welcome to your inbox!` (31px/800), body `Drop a line, share posts and more with private conversations between you and others on X.`, primary button `Write a message` (opens New message).
- **Right pane with no conversation selected (not observed — proposed):** centred `Select a message` (31px/800) + `Choose from your existing conversations, start a new one, or just keep swimming.` + `New message` button.

#### Conversation view (not observed — proposed spec to build against)
- Header 53px: avatar 32 + display name 17px/700 (+ badge) + `@handle` secondary; right: `Conversation info` (i) icon button 36×36.
- Above the first message: profile summary block (avatar 64, name, @handle, bio, `Joined <Month Year> · N Followers`), clickable to profile.
- Bubbles: max-width ~80% of pane; padding 12px 16px; font 15px/lh 20px; radius 24px with the corner adjacent to the next bubble of the same group reduced to 4px. **Sent** = right-aligned, bg `#1D9BF0`, white text. **Received** = left-aligned, bg `rgb(239,243,244)` light / `rgb(47,51,54)` dark, primary text, sender avatar (32) shown only on the last bubble of a group. Group consecutive messages by the same sender within ~5 min (2px gap inside a group, 12px between groups). Under the last bubble of a group: time `3:42 PM` 13px secondary; under the viewer's last sent message: `Seen` / `Sent`. Day separators centred 13px secondary (`Today`, `Sep 23`).
- Composer (sticky bottom, 1px top border): rounded field (radius 16, bg `rgba(0,0,0,0.04)`), placeholder **`Start a new message`**, leading icons Media / GIF / Emoji (`#1D9BF0`, 20px), trailing Send (paper plane, `#1D9BF0`) — **disabled at 50% opacity until text is non-empty**; Enter sends, Shift+Enter newline.
- Conversation info panel (replaces the conversation pane): `Conversation info` header with back arrow; user cell; `Snooze notifications` switch; actions `Block @h`, `Report @h` (red), `Leave conversation` (red). In the clone: render as VISUAL items (no block/report backend).
- New message modal (`@modal` intercepted): 600×650 centred, header `New message` + close + `Next` pill (disabled until ≥1 recipient); search field `Search people` with typeahead user cells; selected recipients as chips (avatar 20 + name + ×, radius 9999, border); "Create a group" row. In the clone: Next → opens/creates the mock conversation.

#### Passcode wall (observed — document only, recommend OUT)
1. **Welcome** (`/i/chat/pin/new`), centred column 328px wide at x=565 inside the 1185 main area, vertically centred:
   - H: `Welcome to the new X Chat` — 34px / 800 / lh 40px, 2 lines.
   - Three rows (icon 32px stroke 1.5 + text column 280px, 16px gap, 24px between rows): **`End-to-End Encryption`** / `Messages are end-to-end encrypted across all your devices.` · **`State-of-the-Art Privacy`** / `There’s no way for anyone, including X, to read your messages.` · **`Set Passcode`** / `In order to secure your messages, you’ll need to set up a passcode.` Titles 15px/700, bodies 15px/400/lh 20 at 60% opacity.
   - Button `Create Passcode` — 328×40, radius 9999, bg black (light) / white (dark), label 15px/500, hover bg `rgba(0,0,0,0.8)`, transition 150ms Tailwind ease.
2. **Create Passcode** (after the button, same URL): passcode glyph (32px) · `Create Passcode` 23px/700/lh 28 · `A personal key that secures your messages.` 15px/400 at 60% · **four 60×60 circular single-digit inputs** (`inputmode=numeric`, `maxlength=1`, aria-labels `Digit 1 of 4`…`Digit 4 of 4`, text transparent so only a dot/fill shows), 24px apart; focused circle border 2px `rgb(15,20,26)`, others 2px `rgb(186,203,212)`. No back/cancel button — leaving is via the sidebar. **Not filled in.**
- Screenshots: `chat-01-landing.png` / `chat-01-skeleton.png` (inbox skeleton + collapsed sidebar), `chat-02-loaded.png` & `chat-03-welcome-passcode.png` (welcome, dark/light), `chat-04-create-passcode-3500.png` (PIN step), `chat-05-state.png` (spinner while the chat bundle boots).

<details><summary>Icons (SVG, 24×24 viewBox) — chat</summary>

```txt
NewMessageIcon (icon-messages-plus-stroke, fill currentColor) — path 1:
M19 17H22V19H19V22H17V19H14V17H17V14H19V17Z
(path 2 is the open chat-bubble outline; copy it from X if needed — or reuse the clone's ChatIcon + a 2px "+" badge at bottom-right)
LockIcon (icon-dms-lock, stroke 1.5, round caps/joins, fill none):
M16 10V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V10M12 14V17M6 21H18C18.5523 21 19 20.5523 19 20V11C19 10.4477 18.5523 10 18 10H6C5.44772 10 5 10.4477 5 11V20C5 20.5523 5.44772 21 6 21Z
ShieldCheckIcon (icon-dms-shield, stroke 1.5):
M9.5 11.75L11 13.25L14.5 9.75M20 11.9123V6.4637C20 6.03671 19.7289 5.65682 19.3251 5.51801L12.3251 2.61176C12.1144 2.53935 11.8856 2.53935 11.6749 2.61176L4.67487 5.51801C4.27112 5.65682 4 6.03671 4 6.4637V11.9123C4 16.8848 8 18.9998 12 21.1579C16 18.9998 20 16.8848 20 11.9123Z
CloseSmallIcon (icon-close, fill):
M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z
```
</details>

### F3. Floating Chat drawer + Grok drawer (bottom-right) — all non-chat pages

- **Level:** Level 1 (always visible on timeline-style pages; hidden on `/i/chat*` and `/i/grok`).
- **Clone status:** MISSING.
- **Suggested priority:** P2 (chrome only; content = same mock inbox as F2). Grok drawer: OUT/static.
- **Complexity:** M.
- **Collapsed buttons (observed, light):** two stacked square-ish buttons, **55×55, radius 16**, right edge at viewport right − 20px (x=1325..1380). Grok button (`data-testid=GrokDrawerHeader`, aria-label `Grok`) at y=766; Chat button (`data-testid=chat-drawer-main`, aria-label `Chat`) at y=833 → **12px gap, 12px from the bottom** (833+55=888). Style: bg `rgba(255,255,255,0.85)` (light; in Lights out it renders as near-black with a grey border — exact dark values not measured, see `creator-studio-01.png`), border 1px `rgb(159,181,195)`, box-shadow `rgba(101,119,134,0.2) 0 0 15px, rgba(101,119,134,0.15) 0 0 3px 1px`, icon 28px primary colour. Hover: bg `rgba(29,155,240,0.1)`, `transition background-color .2s, box-shadow .2s`. No tooltip.
- **Open drawer (Chat):** panel **400×530**, anchored bottom-right (x=980..1380, y=350..880 → 20px from right and bottom), radius 16 (inner 15), border 1px `rgb(50,54,57)` (dark), bg page colour, shadow `rgba(0,0,0,0.15) 0 4px 12px`. The Chat button disappears and the Grok button moves up to sit above the panel (y=283). Header buttons (top-right, 36×36 round, bg `rgba(255,255,255,0.1)` dark): **`Open in full view`** (`icon-media-undock`, navigates to `/i/chat`) and **`Close`** (`icon-chevron-down`, collapses). Content = the full chat UI at 400px (here the passcode welcome; with a passcode it would be the inbox list, then a conversation, inside the panel).
- **Motion:** open — content mounts after the bundle loads (~0.7–1s first time, no visible slide observed). Close — panel height shrinks from the top toward the bottom edge: sampled h 530→528→522→497→464→409→gone at t≈0,59,76,91,110,126,143ms → **~140ms, ease-in (accelerating)**, then unmount; Chat button reappears.
- **Grok drawer** (Grok button): same 400-wide panel (y≈328..805) with header icons `Private Chat`, `Chat history`, `Open conversation`, `Collapse`; centred `How can I help you today?` (26px/500); input `Ask anything` with attach, `Fast` model pill, voice button; chips `Create Videos`, `Create Images`, `Edit Image`, `Latest News` (14px/500, bordered pills 38px tall). Screenshot `grok-drawer-01.png`.
- **Implementation notes:** a client `FloatingDock` in the app shell, `position:fixed; right:20px; bottom:12px`, hidden via `usePathname()` on `/i/chat*` and `/i/grok`. Drawer panel reuses the chat feature's `ConversationList`/`ConversationView` in a compact 400px mode. Persist open/closed in `localStorage` (X does).

<details><summary>Icons — drawer</summary>

```txt
FloatingChatIcon (viewBox 0 0 24 24, fill-rule evenodd):
M12 4c-4.418 0-8 3.582-8 8 0 1.268.294 2.465.818 3.528.144.292.196.634.126.973l-.665 3.242 3.373-.63c.323-.061.647-.012.927.12C9.615 19.726 10.774 20 12 20c4.418 0 8-3.582 8-8s-3.582-8-8-8zM3.547 19.88zM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10c-1.473 0-2.874-.32-4.136-.893l-3.949.74c-1.047.195-1.96-.733-1.745-1.777l.781-3.808C2.341 14.968 2 13.522 2 12z
UndockIcon (icon-media-undock):
M3 3h8v2H6.414l5.543 5.54-1.414 1.42L5 6.41V11H3V3zm16.5 5H14V6h5.5C20.881 6 22 7.12 22 8.5v11c0 1.38-1.119 2.5-2.5 2.5h-11C7.119 22 6 20.88 6 19.5V14h2v5.5c0 .28.224.5.5.5h11c.276 0 .5-.22.5-.5v-11c0-.28-.224-.5-.5-.5z
ChevronDownIcon (icon-chevron-down): M3.543 8.96l1.414-1.42L12 14.59l7.043-7.05 1.414 1.42L12 17.41 3.543 8.96z
GrokFloatingIcon (viewBox 0 0 33 32):
M12.745 20.54l10.97-8.19c.539-.4 1.307-.244 1.564.38 1.349 3.288.746 7.241-1.938 9.955-2.683 2.714-6.417 3.31-9.83 1.954l-3.728 1.745c5.347 3.697 11.84 2.782 15.898-1.324 3.219-3.255 4.216-7.692 3.284-11.693l.008.009c-1.351-5.878.332-8.227 3.782-13.031L33 0l-4.54 4.59v-.014L12.743 20.544m-2.263 1.987c-3.837-3.707-3.175-9.446.1-12.755 2.42-2.449 6.388-3.448 9.852-1.979l3.72-1.737c-.67-.49-1.53-1.017-2.515-1.387-4.455-1.854-9.789-.931-13.41 2.728-3.483 3.523-4.579 8.94-2.697 13.561 1.405 3.454-.899 5.898-3.22 8.364C1.49 30.2.666 31.074 0 32l10.478-9.466
```
</details>

- **Screenshots:** `drawer-01-hover.png`, `drawer-02-open.png`, `drawer-03-closed.png`, `grok-drawer-01.png`.

### F4. Grok — `/i/grok`

- **Level / route / entry points:** Level 1. Sidebar "Grok" (`href=/i/grok`, aria-label "Grok", no testid); floating Grok button opens the Grok drawer (F3). Document title `Grok / X`. Every tweet card also has a "Grok actions" button (area 02).
- **Clone status:** MISSING (sidebar item VISUAL; `GrokIcon` exists).
- **Suggested priority:** **OUT** for anything functional (it is an LLM product). Optional **P2 static shell**: the empty state below is cheap (one centred column) and makes the sidebar link not 404. Do not fake responses.
- **Complexity:** S for the static shell.
- **Layout (observed, 1400 wide, light):**
  - Normal expanded sidebar (labels visible; Grok label bold, icon = filled Grok mark in a rounded square). **No right panel and no floating buttons**; main area spans x=344..1322 (978px) with the right border at 1322.
  - Top bar (h ≈ 70, no title, no border): left **`Focus Mode`** icon button (36×36, radius 12, expand-corners icon) at x=360; right group of three text buttons (h 32, radius 12, padding ≈ 0 16px, icon 18px + label 14px/700, 4px gap, transparent bg; selected bg = dark grey pill in Lights out (see `grok-03-history.png`; exact value not measured)): **`History`** (aria-label `Chat history`, clock-arrow icon), **`Private`** (ghost/incognito icon), **`Link accounts`** (link icon).
  - Centre block (column 800 with padding 16 → content 768 at x=449, vertically centred ≈ y 339–566):
    - Logo lockup "Grok" mark + wordmark, 120×44.
    - **Input pill** 768×61, radius 32, bg `rgb(229,234,236)` (light; a dark-grey fill in Lights out, value not measured), padding 8px 12px 8px 36px, `transition: 0.1s, border-color 0.2s`. Inside: attach (paperclip) button 38×39 at left; textarea placeholder **`Ask anything`** (16px, colour `rgb(83,100,113)`, auto-grows from 43px); model selector pill **`Fast`** (lightning icon + 14px/700 + chevron, 97×35, radius 9999); round voice button 34×35 (bg primary text colour, waveform icon, aria-label **`Enter voice mode`**). When the textarea has text the voice button becomes **send** (aria-label `Grok something`, up-arrow).
    - Promo card (768×90, margin-top 16, border 1px, radius 16): 40px Grok-bot glyph · **`Meet Grok Bot`** (15px/700) · `AI teammates you can give real work to. Bots sign in to your tools, use them just like you do, and come back with finished work.` (14px/400 secondary) · black pill `Learn more` (14px/700).
  - **Model menu** (click `Fast`): popover 280 wide under the pill, radius 16, shadow; rows: `Fast` + `Quick responses · Grok 4.6` with a blue ✓ on the right; divider; `Go to grok.com` with Grok icon. (`grok-02-model-menu.png`)
  - **Link accounts** → centred modal: `One Grok, everywhere` (23px/600) · `Link your account to keep your chats in sync across X and Grok.` · black pill `Agree and continue` · text button `Not now` · legal 12px `By clicking Agree and continue, you agree to SpaceXAI's Terms of Service and Privacy Policy, and data sharing between X and SpaceXAI.` (`grok-04-link-accounts.png`). **Not accepted.**
  - **History** with no past chats just toggles the button to its selected state (no panel content observed; this account has no Grok conversations). Level 3 (name only, not observed): an opened Grok conversation lives under `/i/grok?conversation=<id>`.
  - Attach button opens the OS file picker (hidden `<input type=file>`); nothing to replicate.
- **Recommendation:** If built, make `/i/grok` a static page: top bar buttons VISUAL, input that does nothing on submit (or shows a toast "Grok isn't available in this demo"), `Fast` menu as a static dropdown using `ui/dropdown-menu.tsx`. No prompt was sent during this capture.
- **Screenshots:** `grok-01-page.png` (light), `grok-02-model-menu.png`, `grok-03-history.png` (dark, selected History button; screenshot has a render glitch at the bottom), `grok-04-link-accounts.png`, `grok-05-attach-menu.png`, `grok-06-typed.png`, `grok-drawer-01.png`.

### F5. History (Bookmarks + Likes) — `/i/history`, `/i/history/likes`

- **Level / route / entry points:** Level 1. Sidebar "History" (`href=/i/history`, aria-label "History", icon = bookmark; active = filled bookmark). **`/i/bookmarks` redirects to `/i/history`** (it replaced the old Bookmarks page). Document title `History / X`. Tweet bookmark toast has no "View" link any more (see below).
- **Clone status:** MISSING (sidebar VISUAL; `toggleBookmark` exists in `features/tweet/api/toggle-bookmark.ts` but there is no listing, no `bookmarkedAt`, no toast).
- **Suggested priority:** **P0** — it is the only consumer of the already-working bookmark toggle, and Likes is the same list with a different filter.
- **Complexity:** M (two tabs + header search mode + toasts).

#### Layout (600px column, observed in light & dark)
- **Header (h 53, sticky):** Back (`app-bar-back`) · title `History` (20px/700) · right icon button that depends on the tab:
  - Bookmarks tab → **`Search Bookmarks`** (36×36, magnifier icon, margin-right −5px). Tooltip `Search Bookmarks` appears **~630ms** after hover, below the button: bg `rgba(0,0,0,0.8)` (light), radius 16? (pill, h 19), padding 2px 8px, 11px/400/lh 12 white text (shell agent owns the generic Tooltip).
  - Likes tab → **`Information`** (36×36, "i" in circle icon).
- **Tabs** (h 53, two equal halves, each tab = **icon 18.75px + 8px gap + label**):
  - `Bookmarks` (bookmark outline icon) → `/i/history`
  - `Likes` (heart outline icon) → `/i/history/likes`
  - Selected label 15px/700 primary + icon primary; unselected 15px/500 secondary. Indicator 4px `#1D9BF0`, radius 9999, **width = icon + gap + label** (109px for Bookmarks), bottom-aligned. Tab switch is a route change (no slide).
  - There is no "…" header menu and **no "Clear all Bookmarks"** any more; no folders UI on this account (folders are Premium; the toast's `Add to Folder` is the only entry point).
- **List:** standard tweet cards (area 02 owns the card), newest **bookmark/like first** (ordering is by when it was bookmarked/liked, not by tweet date — a tweet bookmarked just now from Home appeared first). Bookmarks list on this account: 3 items; Likes: 6+. A visually-hidden `h1` "Bookmarks"/"Likes" precedes the list (a11y only). Infinite scroll as in timelines.
- **Right panel:** search + What's happening + Who to follow + footer (no Premium card).

#### Behaviour
1. **Bookmark from anywhere** (tweet card bookmark button): instant icon swap + toast **`Added to your Bookmarks`** with action **`Add to Folder`** (Premium upsell when clicked; render VISUAL). Toast (`data-testid=toast`): bg `#1D9BF0`, text white 15px, padding 12px, **radius 4px**, height 44, centred horizontally in the viewport (600px wrapper, margin 0 400px), **32px above the viewport bottom**, `transition: opacity 0.17s linear`; it stayed visible > 7s in sampling (X's default ≈ 6–8s). (The clone's `ui/toast.tsx` already has the colours; it lacks the action button and the 170ms fade.)
2. **Remove a bookmark from the History page** (filled blue bookmark `data-testid=removeBookmark`, aria-label `Bookmarked`): the icon un-fills immediately, toast **`Removed from your Bookmarks`** appears, and the card is **removed from the list ≈ 0.9s later with no collapse animation** (the next card just jumps up). No undo action.
3. **Unlike from the Likes tab:** same pattern expected (card removed after the mutation) — not exercised to avoid touching the account's likes.
4. **Search Bookmarks** (button click): the header **replaces title + tabs** with a search field (tabs disappear while searching): pill 510×44 at x=416, radius 9999, **2px `#1D9BF0` border when focused**, bg page colour, magnifier at left, input 14px placeholder **`Search Bookmarks`**, autofocus; `transition: border-color, background-color, box-shadow 0.15s cubic-bezier(0.2,0,0,1)`. Body is empty until Enter. After Enter the URL **stays `/i/history`** (state is client-side); results render under a hidden heading `Bookmarks search` as tweet cards. Back arrow leaves search mode.
   - **No results:** `No results for <query>` (31px/800/lh 36, wraps) + `Try searching for something else, or check your Search settings to see if they’re protecting you from potentially sensitive content.` (15px secondary; "Search settings" is a `#1D9BF0` link → `/settings/search`, level 3). Block at x=475, max-width ≈ 336, top padding 32.
5. **Likes info** (`Information` button): centred modal 600 wide (radius 16, mask) with close ✕ at top-left, title **`Likes`** (31px/800), body **`Your likes are private. Only you can see them.`**, full-width black pill **`Got it`** (52px tall, 15px/700) — closes the modal.
- **Empty states (not observed — account has bookmarks & likes; use X's copy):** Bookmarks: **`Save posts for later`** / `Bookmark posts to easily find them again in the future.` Likes: **`You don’t have any likes yet`** / `Tap the heart on any post to show it some love. When you do, it’ll show up here.` (31px/800 title + 15px secondary body, left-aligned at x+32 like the no-results block).

#### Data model
`Tweet.bookmarkedAt: string | null`, `Tweet.likedAt: string | null` (or a separate `mockBookmarks: {tweetId, at}[]` ledger); `getBookmarks(cursor, query?)`, `getLikes(cursor)` return `Page<Tweet>` sorted by `at` desc. Search = case-insensitive `text`/author match over bookmarked tweets.

#### Routing
`app/(app)/i/history/page.tsx` (Bookmarks) and `app/(app)/i/history/likes/page.tsx`; add `/i/bookmarks` → `redirect("/i/history")`. Search mode = client state inside the Bookmarks page header (no URL). Likes info = local modal state (not a route).

#### Screenshots
`history-01-page.png`, `history-02-search.png`, `history-03-search-typing.png`, `history-03-search-results.png`, `history-04-search-empty.png`, `history-05-likes.png`, `history-07-likes-info.png`, `history-08-bookmark-toast.png`, `history-09-with-new-bookmark.png`, `history-10-after-remove.png` (toast "Removed from your Bookmarks").

<details><summary>Icons — history</summary>

```txt
BookmarkIcon (outline, tab + sidebar inactive) — clone already has it; filled version (sidebar active):
M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5z
InfoIcon ("Information" header button):
M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z
SearchIcon — clone already has it.
```
</details>

### F6. Creator Studio — `/i/jf/creators/studio`

- **Level / route / entry points:** Level 1 sidebar "Creator Studio" (rocket icon, `href=/i/jf/creators/studio`). **Note:** the item is not always present — on several loads the sidebar showed Premium directly after History (X A/B or width-dependent); the clone can keep it. Title `Creator Studio / X`.
- **Clone status:** MISSING (sidebar VISUAL; `CreatorStudioIcon` exists).
- **Suggested priority:** **P2 static page** (it is just a menu) — every destination is a paywall/upsell → those are **OUT**.
- **Complexity:** S.
- **Layout (600 column):** header row with back arrow (left) and **centred** title `Creator Studio` (17px/700). Three sections, section titles 15px/700 at x=364 (20px padding): **Programs**, **Tools**, **Support**. Rows (544 wide, 40px icon box + 16px gap, title 15px/500, optional subtitle 14px/400 secondary, chevron-right at the far right, ~56–68px tall):

  | Section | Row | Subtitle | Badge | Destination (level 2/3) |
  |---|---|---|---|---|
  | Programs | Original Content Rewards | Earn from your posts | `Ineligible` (grey pill, 12px/500) | `/i/jf/creators/monetization_paywall?product=original_content_rewards` |
  | Programs | Subscriptions | — | `Ineligible` | `/i/jf/creators/monetization_paywall?product=subscription` |
  | Tools | Live Studio | Go live professionally | `New` (blue pill, white 12px/500) | `/i/premium_sign_up?referring_page=x_studio` |
  | Tools | Analytics | — | — | `/i/jf/creators/analytics_paywall` |
  | Tools | Inspiration | Top posts by engagement | — | `/i/jf/creators/inspiration/top_posts` |
  | Support | Contact support | — | — | opens a Chat conversation with X Support (`/i/chat/<viewerId>-1399766153053061121` → passcode wall) |
  | Support | Learn more | — | — | `https://help.x.com/en/using-x#creators` (external) |
- **Monetization paywall (level 2, observed):** back + help (?) icon; centred `Make money on X` (20px/800) · `The first step to earning from Original Content Rewards is getting Verified with X Premium.` · full-width black pill `Become a Premium Creator` · link `Check Original Content Rewards eligibility ›` · two cards side by side (radius 16, border): `Get paid to post` / `Earn from sharing high quality content. The more you engage users on X, the more you earn.` and `Build a fanbase` / `Offer exclusive content to your biggest supporters and earn recurring income.`, each with a phone mock image. (`creator-studio-original-content-rewards.png`)
- **Right panel:** Who to follow + footer only (no search-trends).
- **Recommendation:** build the menu page statically with rows as `<Link>`s to a single generic "Premium required" placeholder, or leave rows VISUAL. Do not build paywalls.
- **Screenshots:** `creator-studio-01.png` (dark), `creator-studio-original-content-rewards.png`, `creator-studio-subscriptions.png`, `creator-studio-analytics.png`.

### F7. Premium — `/i/premium_sign_up`

- **Level / route / entry points:** Level 1 sidebar "Premium" (`data-testid=premium-signup-tab`, verified-badge icon); right-panel "Subscribe to Premium" card → same; Creator Studio → Live Studio adds `?referring_page=x_studio`.
- **Clone status:** MISSING (sidebar VISUAL, `PremiumCard` VISUAL).
- **Suggested priority:** **OUT** (purchase flow). Optional P2: a static marketing takeover so the links do not 404, with the CTA disabled/VISUAL.
- **Complexity:** M if built statically (two pricing cards + comparison table).
- **Layout (observed):** **full-screen takeover** (covers sidebar and panels; the page behind is not visible), bg page colour, close **✕** button top-left (32×32 round at 14,14). Content column ≈ 666 wide centred:
  - Hero illustration (rocket + verified badge), headline `Don’t lose 50% off your first 2 months` (≈25px/500, "50% off" in `#1D9BF0`) — promo copy varies per account.
  - Segmented control `Monthly` | `Annual` (pill 330×48, selected segment white pill with black text).
  - Two plan cards side by side (≈330×370, radius 16; selected card has 2px `#1D9BF0` border + glow): **Premium** `$2.50 / month` (promo badge `50% off for 2 months`) with feature rows (icon + 14px text, some with ⓘ): `Verified checkmark`, `Enhanced Grok access`, `Advanced analytics`, `Less ads in your feeds`, `Boosted replies`, `Write Articles`, `Get paid to post`, `Everything in Basic`. **Premium+** `$20 / month`: `Fully ad-free`, `SuperGrok` (NEW), `Handle Marketplace` (NEW), `Highest reply boost`, `Radar Advanced Search`, `X Pro`, `Everything in Premium`.
  - Banner `Are you a business?` / `Gain credibility and grow faster with Premium Business` + button `Explore Premium Business` (→ `/i/premium-business`).
  - `Compare tiers & features` table with sections **Enhanced Experience** (Ads, Reply boost, Radar, Edit post, Longer posts, Background video playback, Download videos), **Grok AI** (Usage limits, SuperGrok, Early access to new features, Tag @Grok in replies), **Creator Hub** (Write Articles, Get paid to post, Creator Subscriptions, X Pro, Media Studio, Analytics), **Verification & Security** (Checkmark, Optional ID verification); columns Premium / Premium+.
  - Sticky bottom bar: selected plan summary (`Premium` · `$2.50 / month` · `For first 2 months, then $5 billed monthly`) + white pill **`Subscribe & Pay`** (not clicked) + legal box (`By subscribing, you agree to our Purchaser Terms, and that subscriptions auto-renew until you cancel. Cancel anytime, at least 24 hours prior to renewal…`).
- **Screenshot:** `premium-01.png`.

### F8. More menu → Business and Create your Space

- More menu items observed (owned by the shell agent; listed here for the hrefs): `Lists` → `/<handle>/lists`, `Communities` → `/<handle>/communities`, **`Business` → `/i/verified-orgs-signup`**, `Ads` → `https://ads.x.com/?ref=gl-tw-tw-twitter-ads-rweb` (external), **`Create your Space` → `/i/spaces/start`**, `Settings and privacy` → `/settings`.
- **Business** — `/i/verified-orgs-signup` immediately redirects to **`/i/premium-business`**, which opens a **modal over the current page** (background dimmed) that loads the Premium Business / Verified Organizations plan sheet. In this capture it stayed on a spinner for > 12s (`business-01.png`). **Recommendation: OUT** (link it to the same static Premium placeholder, or make the menu item VISUAL).
- **Create your Space** — `/i/spaces/start` opens an **intercepted modal over the current page** (URL changes, background stays; Escape/✕ closes and restores the previous URL):
  - Modal 600 wide (x=400..1000), radius 16, padding 32, bg page colour, mask over the app. Close ✕ top-left. Centred purple Spaces glyph (≈44px, purple; colour not measured). Title **`Create your Space`** (26px/700).
  - Select field (floating label) **`Who can speak?`** / value `Only people you invite to speak` with chevron (h 56, radius 4, 1px border).
  - Text input placeholder **`What do you want to talk about?`** (pill, h 44, 1px border).
  - Row `Record Space` + ⓘ + switch (off).
  - Primary `#1D9BF0` pill **`Start now`** (h 44, full width minus a 44px round outline "schedule" icon button at right).
  - Link **`Get to know Spaces`** (15px/700 `#1D9BF0`). Nothing was started.
  - **Recommendation: OUT** (Spaces = live audio). If the menu item must not be inert, render this modal statically with `Start now` disabled.
- **Screenshots:** `spaces-01.png`, `business-01.png`.

## Cross-cutting findings

1. **Two app-shell layouts are needed** (shell agent): (a) default 3-column; (b) **full-width "app" mode** used by `/i/chat*` — sidebar forced to icon-only (≈88px), no right panel, no floating dock, main = remaining width up to 1185px; and (c) "no right panel" mode for `/i/grok` (expanded sidebar, 978px main). Implement as a layout prop / route group (`app/(app)/(fullwidth)/i/chat/...`) rather than per-page CSS.
2. **Confirmation dialog primitive** (`ConfirmDialog`): 320 wide, padding 32, radius 16, title 20/700/lh 24 (mb 8), body 15/400/lh 20 secondary, stacked full-width 44px pill buttons with 12px gap (first 24px below body), primary-inverted confirm + outline cancel; mask `rgba(91,112,131,0.4)` (dark/dim) / `rgba(0,0,0,0.4)` (light); closes on mask click, Escape, Cancel; **no animation**. Used by Unfollow here; reused by area 02 (delete post), 05 (block/mute…). Build on `features/auth/hooks/use-modal-dialog.ts` + `trap-focus.ts` but move them to `components/ui` / `hooks/`.
3. **Info / announcement modal** (Likes info): 600 wide, radius 16, ✕ top-left, 31px/800 title, body, full-width 52px black pill `Got it`.
4. **Toast with action**: `ui/toast.tsx` needs an optional action (`Add to Folder`, `View`) and a 170ms linear opacity fade in/out; bg `#1D9BF0`, radius 4, padding 12, centred, 32px from bottom.
5. **Tabs with icons** (History) — extend `ui/tab.tsx` with an optional leading 18.75px icon + 8px gap; indicator width = icon+gap+label. Tabs are always route links; indicator does not animate on X.
6. **Header search mode** (Bookmarks search): PageHeader variant whose middle becomes a focused pill input (2px `#1D9BF0` border when focused, 44px tall, 150ms `cubic-bezier(0.2,0,0,1)` border/bg transition) replacing title + tabs; back arrow exits. The same pill is used by the right-panel search (area 03) — share the component.
7. **Page header right action slot** — Follow (Settings gear → `/settings/contacts`), History (Search / Information), Creator Studio (centred title variant). PageHeader needs `action?: ReactNode` and `align?: "start" | "center"`.
8. **Floating dock** (Grok + Chat buttons + drawer), see F3; hidden on chat/grok routes.
9. **Skeleton shimmer** for list loading (chat): `rgb(242,242,242)` blocks, radius 14.4 (or full for avatars), Tailwind `animate-pulse` 2s `cubic-bezier(0.4,0,0.6,1)`. The clone has no Suspense fallbacks — this pattern can serve every list.
10. **Tooltip** on icon buttons appears ~630ms after hover (11px/lh 12 white on a `rgba(0,0,0,0.8)` pill in light theme — dark value not measured — placed below the trigger). Shell agent owns the primitive; History's `Search Bookmarks` and `Information` need it.
11. **Verified badge** must exist on `UserSummary` (Follow lists, chat rows, Creator lists all show it).
12. **Relative time + "Follows you" + entity-parsed bio** recur in Follow and Chat; parsing (@mentions, #hashtags, URLs) is a shared util also needed by tweet text (area 02).
13. Dark-theme reference values seen in this area (Lights out): text `rgb(231,233,234)`, secondary `rgb(113,118,123)`, border `rgb(47,51,54)` (main client) / `rgb(50,54,57)` (chat drawer), Follow button bg `rgb(239,243,244)` + text `rgb(15,20,25)`, hover `rgb(215,219,220)`, outline-button border `rgb(83,100,113)`, unfollow-hover border `rgb(103,7,15)`, cell hover `rgba(255,255,255,0.03)`.

## Data model (proposed TS contracts + mock shapes)

All types go in `src/types/*` only if shared; otherwise in the owning feature's `types/`. Mocks follow the existing in-memory pattern (`src/mocks/*`, mutated by server actions + `refresh()`).

### Shared additions
```ts
// types/user.ts
export type VerifiedType = "blue" | "gold" | "grey";
export type UserSummary = {
  id: string; handle: string; displayName: string; avatarUrl: string;
  verified: VerifiedType | null;          // NEW (badge after name everywhere)
};
export type User = UserSummary & {
  /* existing fields */
  followsViewer: boolean;                 // NEW ("Follows you" chip)
  isCreator: boolean;                     // NEW (Follow → "Creators for you" tab)
};

// types/tweet.ts — add
export type Tweet = { /* existing */ bookmarkedAt: string | null; likedAt: string | null };
```

### Follow (`features/connect`)
```ts
export type ConnectTab = "who-to-follow" | "creators";
export type ConnectPeoplePage = {
  tab: ConnectTab;
  seed: User | null;                      // ?user_id= → "Follow" section with this user
  sectionTitle: string | null;            // "Suggested for you" | "Similar to Elon Musk" | null (creators)
  users: Page<User>;                      // cursor-paginated, cap at 100 like X
};
// mock: users not followed by viewer, ranked by followersCount desc; creators = isCreator === true
```

### Chat (`features/chat`)
```ts
export type ConversationId = string;      // 1:1 → `${minUserId}-${maxUserId}` like X; group → uuid
export type Conversation = {
  id: ConversationId;
  kind: "direct" | "group";
  participants: UserSummary[];            // excluding viewer
  title: string | null;                   // groups only
  avatarUrl: string | null;               // groups only (else participant avatar)
  lastMessage: MessagePreview | null;
  unreadCount: number;
  muted: boolean;                         // "Snooze notifications"
  status: "accepted" | "request";         // requests live in /i/chat/requests
  updatedAt: string;                      // ISO, list sort key desc
};
export type MessagePreview = { senderId: string; text: string; createdAt: string; hasMedia: boolean };
export type Message = {
  id: string;
  conversationId: ConversationId;
  senderId: string;
  text: string;
  media: TweetMedia[];                    // reuse
  sharedTweetId: string | null;           // "Send via Chat" from a tweet's share menu
  replyToMessageId: string | null;
  reactions: { emoji: string; userIds: string[] }[];
  createdAt: string;
  status: "sending" | "sent" | "seen";    // only meaningful for viewer's messages
};
export type MessageRequest = Conversation & { status: "request"; requestedAt: string };
export type DmSettings = { allowRequestsFrom: "everyone" | "verified" | "nobody"; readReceipts: boolean; filterLowQuality: boolean };

// mock example
const conversation: Conversation = {
  id: "u_002-u_001", kind: "direct",
  participants: [{ id: "u_002", handle: "jack", displayName: "jack", avatarUrl: "/avatars/jack.jpg", verified: "blue" }],
  title: null, avatarUrl: null,
  lastMessage: { senderId: "u_001", text: "see you tomorrow 👋", createdAt: "2026-10-05T14:02:00Z", hasMedia: false },
  unreadCount: 0, muted: false, status: "accepted", updatedAt: "2026-10-05T14:02:00Z",
};
const message: Message = {
  id: "m_9001", conversationId: "u_002-u_001", senderId: "u_002",
  text: "did you see the new layout?", media: [], sharedTweetId: null, replyToMessageId: null,
  reactions: [{ emoji: "🔥", userIds: ["u_001"] }], createdAt: "2026-10-05T13:58:10Z", status: "seen",
};
```
Server actions: `sendMessage(conversationId, text)` (append + bump `updatedAt`, clear composer, optimistic `sending`→`sent`), `markConversationRead(id)`, `createConversation(userIds)` (from New message modal), `acceptRequest(id)` / `deleteRequest(id)`, `toggleMuteConversation(id)`. Seed ~8 conversations with the 18 followed mock users, 5–30 messages each, 2 unread, 2 requests from non-followed users.

### History / Bookmarks / Likes (`features/history`)
```ts
export type HistoryTab = "bookmarks" | "likes";
export type BookmarkEntry = { tweet: Tweet; bookmarkedAt: string };   // sorted bookmarkedAt desc
export type LikeEntry = { tweet: Tweet; likedAt: string };            // sorted likedAt desc
export type HistoryPage<T> = Page<T> & { query: string | null };      // ?q= search inside bookmarks
// getBookmarks(viewerId, cursor, query?) / getLikes(viewerId, cursor)
// toggleBookmark must set/clear `bookmarkedAt`; toggleLike must set/clear `likedAt`
```

## Open questions / not observed

- **Entire Chat inbox/conversation UI** — gated by the passcode wall (`/i/chat/pin/new`); not set up per the brief. Not observed: conversation rows, unread dot, tabs/filters (All / Requests…), empty-inbox copy, message bubbles, composer, conversation info panel, New message modal, Message requests page, DM settings (`/i/chat/settings`). The specs in F2 marked "proposed" are based on X's publicly shipped design, not on this capture — verify on an account that already has X Chat set up before pixel-matching.
- Chat drawer **open** animation (content mounted only after the chat bundle loaded, ~0.7–1s; no slide observed).
- Grok **History** panel content (account has no Grok chats); Grok response layout (no prompt sent, by design).
- Bookmarks / Likes **empty states** (account has items) — copy given is X's standard copy, not captured.
- Unlike-from-Likes-tab removal behaviour (not exercised; assumed identical to bookmark removal).
- "Follows you" chip in user cells — no suggested user followed the viewer.
- Business plan sheet (`/i/premium-business`) never finished loading.
- Creator Studio's sidebar item appears on some loads and not others.
- Colours: the account's Display theme was being switched by another researcher during capture; values are labelled with the theme they were read in, and some light/dark counterparts are missing.

## Safety log

- Followed **@OrthodoxRedpill** → unfollowed via the confirmation dialog (verified button back to `Follow`).
- Followed **@YeiVSinternet** → opened/cancelled the unfollow dialog, mask-click close test, then unfollowed (verified `Follow @YeiVSinternet`).
- Bookmarked `/advoluntas/status/2107196519862747627` from Home → removed it from the History page (verified the status page shows the un-bookmarked state `data-testid=bookmark`).
- Chat: clicked `Create Passcode` to view the PIN step; **no digit entered, no passcode set**. No DM sent. Grok: typed `hi` into the input to see the send-button state and cleared it; **nothing submitted**. Grok "Link accounts" modal opened and dismissed with Escape (not accepted). Spaces modal opened and closed (nothing started). No purchase flow started (Premium page only viewed).
