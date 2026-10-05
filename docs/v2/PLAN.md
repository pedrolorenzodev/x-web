# x-web v2 — Implementation plan

v2 goal: replicate logged-in x.com **two navigation levels deep** on top of the v1 clone (home, composer, tweet detail, profile, likes/reposts/bookmarks/follows on mocks).
Research date: 2026-10-05, live x.com (logged-in RN-web client `responsive-web/client-web`), viewport 1400×900.

This file is the **index and the order of work**. The exact specs (copy, px, colours, motion, SVG paths, screenshots) live in `docs/v2/research/*.md`. Every block below points to the sections it implements: **read those sections before writing code**.

---

## 0. How to work through this plan (implementing agent)

1. Read `AGENTS.md` (repo rules: **no commits, no staging, no explanatory comments**, Conventional Commit message handed to the user after each block, Next 16 docs in `node_modules/next/dist/docs/`), `docs/PROJECT.md` (architecture: bulletproof-react, features never import features, `api/` layer per feature, no barrels, Server Components by default), then this file, then `docs/v2/research/00-clone-inventory.md`.
2. Work **one block at a time**, in the order of §5. A block is done when it type-checks (`npx tsc --noEmit`), lints (`npm run lint`), builds (`npm run build`), and you have compared it with the referenced screenshots.
3. **Stop after each block** and hand the user: what changed, the files touched, and a commit message. The user verifies visually before the next block. Don't batch blocks.
4. Everything stays on **mocks** (`src/mocks/*`, server actions + `refresh()`), with all data access in `features/<f>/api/`. Supabase (PROJECT.md phase 2/3) comes later and must only touch `api/` layers. Shape new types so they can map to tables.
5. The clone is **dark-only ("Lights out")**, by decision (§7). Research colours are tagged **L**/**D**: use **D** and ignore **L**. Don't build light theme, theme switching, accent colours or font-size settings.
   - When the research only measured a light value, derive the dark one from the existing tokens in `src/app/globals.css` (`foreground`, `muted`, `border`, `elevated`, `inverted`…).
   - If none of those tokens fits, re-measure on x.com in Lights out.
6. To re-check something on live x.com, use the headless Chrome + CDP setup (port 9222, profile `~/.chrome-cdp-x`, open your own tab in `contexts()[0]`, close it after). Never `newContext()`. Don't post, DM, block, mute or report.
7. **This plan wins over the research files.** Where a research file recommends something that §1, §2 or §7 contradicts (e.g. a chat inbox, light theme), follow this plan.
8. If something in the research is marked **"not observed"**, build the proposed spec and say so in the block report.
9. **Screenshots are local-only.** `docs/v2/research/screens/` is gitignored because it holds real X content. If a referenced PNG is missing (fresh clone, another machine), re-capture that screen on x.com with the CDP setup above before building the block.

### Research index

| File | Covers | Screens |
|---|---|---|
| `research/00-clone-inventory.md` | What the clone already has (status per control, file paths) | — |
| `research/01-shell-home.md` | Sidebar, More/account menus, breakpoints & mobile bars, floating dock, home header/tabs, Manage timelines, new-posts pill, spinners, composer + every picker, compose modal/drafts, right panel modules, keyboard shortcuts, toast/tooltip/focus/title | `screens/01-shell-home/` |
| `research/02-tweet.md` | Tweet card anatomy, "…" menu (+dialogs), action bar (reply/quote modals, share, views), hover card, tooltip, media (photo viewer, video, cards, polls), tweet detail + subpages | `screens/02-tweet/` |
| `research/03-explore-notifications.md` | Explore + tabs, trend/news rows, news story page, explore settings, search combobox, results page + tabs, filters, advanced search, hashtags, notifications + rows + settings, data model | `screens/03-explore-notifications/` |
| `research/04-follow-chat-grok-history.md` | Follow page, Chat (passcode wall + inbox skeleton + proposed spec), floating drawers, Grok, History (Bookmarks/Likes), Creator Studio, Premium, Business/Spaces, data model | `screens/04-follow-chat-grok-history/` |
| `research/05-profile-lists-communities-settings.md` | Profile header/tabs/menus, edit profile, followers pages, viewers, not-found/protected, Lists (home/create/page/edit), Communities, Settings shell/categories, Display/theming (not built — dark-only), data model, **icons appendix** | `screens/05-profile-lists-communities-settings/` |

---

## 1. Scope for v2

**Level 1** = one click from the shell: sidebar items, the More menu, home tabs, the composer toolbar, tweet card controls, and right-panel modules.
**Level 2** = what those open: a tab inside Explore, a modal from a tweet menu, edit profile, a list page, a settings category.
**Level 3** links are only *pointed at*: they get the correct href, plus a placeholder page or the existing 404.

### In (to build)
Shell (links, active states, More menu, responsive), Home (For you / Following, Manage timelines, new-posts pill), full composer (pickers, thread, drafts), tweet card (entities, badges, menus, hover card, tooltips, reply/quote modals, share, photo viewer, video, polls, link cards), tweet detail (sort, quotes/reposts pages), Explore + trends + news story, Search (typeahead, results tabs, filters, advanced, hashtags), Notifications, Follow page, History (Bookmarks + Likes), Profile (meta, tabs, edit profile, followers/following, viewers, menus, unfollow confirm, states), Lists, Settings shell (category pages as static row lists), and the **Chat entry flow up to the passcode screen**, which is the last reachable Chat screen and carries a "not available" notice (block H1).

### Static only (so the sidebar never 404s, no functionality)
Grok (empty-state shell, no fake answers), Creator Studio (menu page, every destination upsell → OUT), Premium (static marketing takeover, CTA inert), Communities (read-only browse + one community page, **P2**).

### Out (recommended, with reason)
- **Chat beyond the passcode screen:** the inbox, conversations, sending, the new-message modal, requests, DM settings and the chat drawer content. These were decided OUT on 2026-10-05; see H1.
- **Light theme / Dim / theme switching / accent colours / font-size settings:** the clone is dark-only, decided 2026-10-05.
- **Spaces:** needs realtime audio.
- **Business and Ads:** external, purchase flows.
- **Grok answers:** an LLM product.
- **Premium purchase.**
- **Video upload and real media upload:** local preview only. File storage is out of scope.
- **Native "Share post via…".**
- **Settings pages beyond level 2:** except Display.
- **Monetization.**
- **Community creation and moderation.**

> `docs/PROJECT.md` v1 listed DMs, notifications, search, lists, communities and premium as **Out**. For v2 this plan supersedes that list. The architecture rules in PROJECT.md still apply.

---

## 2. Reconciled decisions (the research files disagree in places; this is the rule)

| Topic | Decision | Why / source |
|---|---|---|
| Sidebar nav set | Home, Explore, Notifications, Follow, Chat, Grok, History, Creator Studio, Premium, Profile, More (Lists, Communities, Business, Ads, Create your Space, Settings and privacy). **Bookmarks is not a nav item**: it lives in History. | 01 §1, 04 F5 |
| Home URL | Keep `/` as the clone's home. Add a `/home` → `/` redirect so X-style links work. | Clone convention; avoids a routing rewrite |
| Handles | Make `findUserByHandle` **case-insensitive** and redirect to the canonical case (same as the status route). | X behaviour; inventory §1 |
| Tab indicator | **No slide**: the indicator swaps instantly, everywhere. | 01, 03, 04, 05 all measured it; the user rejected a sliding indicator in Sept 2026 |
| Menus (dropdowns) | Keep the clone's approved `.t-dropdown` motion (scale .95→1 + fade 150ms). Add the item variants: sub-label, check, submenu, destructive. | The clone's motion was user-approved; X is a ~140ms reveal (02 §cross-cutting 2) |
| Modal motion | `Modal` gets `motion="sheet"` (default): fade + scale **.95→1, 150ms, ease-out**, mask fade 150ms; exit instant. Confirmation sheets and fixed dialogs: `motion="none"`. | 01 measured compose sheets ~.95/150ms, 03/05 measured .92/150ms, 02 saw none on Lists/Report/Views. One value keeps the code simple |
| Modal placement | Compose family (compose, reply, quote, GIF, schedule, drafts, thread): `top: 45px`, height grows. Fixed 600×650 family (edit profile, lists, settings modals, advanced search, report, share): centred. Confirm sheet: 320px centred. | 01 §cross-cutting 1, 03 X4, 05 #1, 02 #5 |
| Mask colour (dark) | `--color-mask` `rgb(91 112 131 / 0.4)` for dialogs; `rgb(0 0 0 / 0.5)` (`--color-scrim`) for compose sheets and media viewers use `rgba(0,0,0,0.9)`. | Measured D values |
| Tooltip | 600ms open delay, instant hide, fade + scale .95→1 150ms, placed below with flip. | 02 F5 (01 saw ~500ms, 04 ~630ms) |
| Hover card | 600ms open / 600ms close delay, the pointer can travel into the card, fade-in 250ms, 300px wide. | 02 F4 |
| Toast | Accent bg, radius 4, padding 12, 15px white, optional bold action, 32px from the bottom centred on the primary column, opacity 170ms linear, **lifetime 4s**, one at a time. | 02 #6, 04 #4 (clone currently 6s, no motion) |
| Like animation | **Keep the clone's pop + burst** (user-approved in Sept 2026), even though X only fills the heart instantly and rolls the count. | 02 F3 vs the user's approval |
| Verified type | `verified: "blue" \| "business" \| "government" \| null` (business = gold, government = grey). | 04 and 05 used different names |
| Photos 2–4 | Keep the carousel. Fix the row height so the first two tiles fill the row by aspect ratio instead of a fixed 352px. | 02 F6 |
| Tweet detail | No Quotes/Reposts/Likes counts row. Counts sit in a 48px action bar without Views; Views shows as `61.7M`; then `Relevant ⌄` sort and `View quotes ›`. | 02 F7 |
| Profile tabs | Own: Posts▾ · Replies · Reposts · Media▾. Others add Highlights/Articles/Subs only when flagged. **Likes moved to `/i/history/likes`** (`/:handle/likes` redirects there for the viewer). | 05 F6 |
| Followers link | The "Followers" count links to `/:handle/verified_followers` (tabs: Verified Followers, Followers you know, Followers, Following). | 05 F3/F9 |
| Theme | **Dark only** (Lights out). The Display settings row links to a placeholder; no theme tokens refactor. | User decision 2026-10-05 |
| Chat | Only the entry flow is built: Welcome → Create Passcode. The passcode step is the **last screen** and shows a small "not available in this clone" notice. Every chat entry point (sidebar, dock, profile Message, Share → Send via Chat, `/messages*`) leads there. | User decision 2026-10-05; 04 F2 |
| Shell layout modes | `default` (3 columns), `no-panel` (Grok, Settings), `fullwidth` (Chat: icon sidebar forced, no right panel, no dock, main up to 1185px). | 04 #1, 05 F18 |
| Breakpoints | ≥1265 expanded sidebar (275); <1265 icon sidebar (88); right column 350 → 290 below 1078; hidden below 988; dock hidden below 1078; <500 mobile top bar + bottom tab bar + FAB (P2). | 01 §2 |

---

## 3. Data contracts (target shape)

Put shared types in `src/types/*` and feature-only types in `features/<f>/types`. Extend the existing mocks; don't fork them. Full proposals and mock hints: 03 §Data model, 04 §Data model, 05 §Data model proposal.

**`types/user.ts`**
- `UserSummary` gains:
  - `verified: VerifiedType`
  - `protected: boolean`
  - `affiliate?: { handle; avatarUrl } | null`
- `User` gains:
  - `location`, `website {url, display}`, `birthDate`, `birthDateVisibility`, `professionalCategory`
  - `pinnedTweetId`, `mediaCount`, `isCreator`, `hasArticles`, `verifiedSince`, `accountBasedIn`
  - viewer-relative fields: `followsViewer`, `notificationsOn`, `followedByPreview {users, total}`

**`types/tweet.ts`**
- `Tweet.stats` gains `quotes`, `bookmarks` and `views`. Replace `derive-views.ts` with seeded values.
- `Tweet` gains:
  - `editedAt`, `replySettings: "everyone" | "following" | "verified" | "mentioned"`
  - `poll?: { options: {label, votes}[]; endsAt; viewerVoteIndex | null }`
  - `card?: { kind: "summary" | "summary_large_image"; url; domain; title; description?; imageUrl }`
  - `community?: { id; name }`, `sensitive: boolean`
  - `likedAt`, `bookmarkedAt` (viewer, for History ordering)
  - `TweetMedia` gains `videoUrl?`, `durationMs?`, `isGif?`
- Entities (mentions, hashtags, cashtags, URLs) are **parsed at render time** by a shared util, not stored.
- `mockRetweets` must be fed by `toggleRetweet` so "X reposted" appears.

**New contracts**
- `types/trend.ts` + `types/news.ts`: Trend, NewsStory, ExploreTabId (03).
- `features/search/types`: SearchTab, SearchParams, RecentSearch, TypeaheadResult (03).
- `types/notification.ts`: discriminated union `like | repost | follow | mention | reply | quote | recommendation | new_post | login`, grouped (03).
- `types/list.ts`: List, ListMember (05).
- `types/community.ts` (05, P2).
- `features/history/types` (04).
- `features/connect/types` (04).
- No chat data: the Chat flow ends at the passcode screen, so 04's Conversation/Message types are **not** used.
- No `DisplayPrefs`: the clone is dark-only.

**Mock generation rules**
- Notifications are derived from existing mock users acting on the viewer's tweets.
- Trends use queries that match mock tweet text, so trend → search returns results.
- News: 5 stories per category with 3-avatar facepiles.
- Lists: 3 for the viewer, 1 private.
- Polls, cards and videos: a handful of seeded tweets each, using real-looking public assets or local `/public/media` files.

---

## 4. Shared primitives to build first (dedup of every area's "cross-cutting")

| Primitive | Path | Spec source | Used by |
|---|---|---|---|
| `Modal` (+ `motion`, `placement`, header with close/back/title/action) | `components/ui/modal.tsx`. Lift `features/auth/hooks/use-modal-dialog.ts`, `use-escape-to-close.ts` and `features/auth/utils/trap-focus.ts` into `hooks/` and `utils/` | 01 §cross-cutting 1, 02 #5, 03 X4, 05 #1 | compose, reply, quote, GIF, schedule, drafts, timelines, shortcuts, edit profile, lists, settings modals, advanced search, report/embed/views/share |
| `ConfirmSheet` (inverted/danger confirm + outline cancel) | `components/ui/confirm-sheet.tsx` | 04 #2, 05 #2 | Unfollow, Save post?, Discard changes, Delete list, edit DOB, logout (migrate) |
| `Tooltip` | `components/ui/tooltip.tsx` | 02 F5, 01 §8.2 | action bar, composer toolbar, icon sidebar, header icons |
| `HoverCard` | `components/ui/hover-card.tsx` | 02 F4 | user hover card (avatars, names, mentions) |
| `DropdownMenu` variants | extend `components/ui/dropdown-menu.tsx` | 02 #2, 05 #5 | caret menu, More, trends "…", sort, Posts▾/Media▾, list "…" |
| `Toast` v2 | update `components/ui/toast.tsx` | 02 #6 | bookmarks, copy link, mute, post sent |
| `Spinner`, `ProgressBar`, `Skeleton` + `loading.tsx` / Suspense fallbacks | `components/ui/spinner.tsx` … | 01 §4.3, 04 #9 | every list |
| `Switch`, `Checkbox`, `Radio` | `components/ui/*` (auth `toggle-switch.tsx` → shared) | 01 #7, 03 X5, 05 #6 | settings, filters, GIF autoplay, content disclosure, list private |
| `FloatingLabelField` (input/textarea/select + counter) | move from `features/auth/components/floating-label-*` to `components/ui` | 01 #8, 05 #3 | poll, schedule, edit profile, lists, advanced search |
| `PillSearchInput` + `SearchCombobox` | `components/ui/search-input.tsx`, `components/search/search-combobox.tsx` | 03 S1/X2, 04 #6, 05 #7 | right panel, Explore header, results header, bookmarks, lists, settings, GIF/emoji |
| `Tabs` v2 (min 56, rounded indicator, weight 500 inactive, leading icon, dropdown tab, overflow scroll arrows) | extend `components/ui/tab.tsx` | 03 X1, 04 #5, 05 #4 | home, explore, search, notifications, profile, history, follow lists |
| `EmptyState`, `ModuleHeader`, `ShowMoreRow`, `TrendRow`, `NewsRow`, `ListCell`, `Facepile`, `CountsLink` | `components/ui/*` / `components/modules/*` | 03 X6/X7, 05 #8/#10/#11 | explore, right panel, notifications, lists, profile |
| `VerifiedBadge`, `TweetText` (entity parser + Show more) | `components/ui/verified-badge.tsx`, `components/tweet/tweet-text.tsx`, `utils/parse-entities.ts` | 02 F1, 04 #12 | tweets, bios, DMs, notifications |
| `MediaViewer` (photo/avatar/banner, URL-driven index) | `components/media-viewer/*` | 02 F6, 05 #9 | `/status/:id/photo/:n`, `/:handle/photo`, `/:handle/header_photo` |
| `PageHeader` v2 (`action` slot, `align`, search mode) | update `components/layout/page-header.tsx` | 04 #6/#7 | history, follow, creator studio, lists |
| Icons batch | `components/ui/icons.tsx` | 01 §cross-cutting 11, 05 §Icons appendix, plus paths inline in 02/03/04 | everything |

---

## 5. Phases and blocks (do them in this order)

Notation: **[P0/P1/P2] [S/M/L]**, followed by the research sections to read.

### Phase A — Foundations (no visible feature without these)

- **A1. Modal + ConfirmSheet + shared modal hooks** [P0 M]. 01 §cross-cutting 1, 02 §cross-cutting 5, 03 X4, 04 #2, 05 #1–#2.
  - Migrate `ComposeModal` and `LogoutDialog` onto it.
  - Accept: focus trap, Escape, mask click, scroll lock, focus return, `@modal` intercept + hard-load fallback both work.
- **A2. Tooltip + HoverCard primitives** [P0 S+M]. 02 F4/F5.
- **A3. DropdownMenu variants + Toast v2** [P0 S]. 02 #2/#6, 05 #5.
- **A4. Loading: Spinner, ProgressBar, Skeleton, `loading.tsx`/Suspense fallbacks, `not-found.tsx` inside the app shell** [P0 S]. 01 §4.3, 04 #9, 05 F10.
- **A5. Form primitives**: Switch, Checkbox, Radio, FloatingLabelField moved to `components/ui`, PillSearchInput [P0 M]. 01 #7–#9, 03 X5, 05 #3/#6/#7.
- **A6. Tabs v2 + EmptyState + module rows** (ModuleHeader, ShowMoreRow, Facepile, CountsLink) [P0 S]. 03 X1/X6/X7, 05 #4/#8/#10/#11.
- **A7. Icons batch**: every missing icon, including the filled active nav variants [P0 S]. 01 §cross-cutting 11, 05 appendix.
- **A8. Data contracts v2 + mock expansion** [P0 M]. §3 of this plan.
  - Add the new User/Tweet fields with seeded values; verified flags on known accounts; views/quotes/bookmarks counts; feed `mockRetweets`; case-insensitive handles; `/home` redirect.
  - Accept: the existing screens still render identically.

### Phase B — Shell

- **B1. Sidebar real** [P0 M]. 01 §1–§1.9.
  - Every item gets an href (an unbuilt destination gets a placeholder page in the shell, not a 404).
  - Filled active icons; active by route **prefix** (Profile active on `/:handle/*`).
  - More menu with its 6 items; Post button; account menu deltas.
- **B2. Responsive shell + layout modes** (`default` / `no-panel` / `fullwidth`) [P1 M]. 01 §2, 04 #1.
  - Icon sidebar with tooltips; right column widths; dock visibility.
  - Mobile bars (<500) are P2 and can be split out.
- **B3. Keyboard shortcuts** (global handler + "?" modal; j/k/l/r/t/b/n, g+h/e/n/m/p/b…) and **page titles** (`Home / X`, `(N) Home / X`) [P1 M]. 01 §7, §8.4.
- **B4. Floating dock** (Grok + Chat buttons only; no drawers) [P2 S]. 01 §3, 04 F3.
  - Chat → `/i/chat`; Grok → `/i/grok`.
  - Hidden on `fullwidth`/`no-panel` routes and below 1078px.

### Phase C — Tweet (highest perceived realism)

- **C1. Card anatomy** [P0 M]. 02 F1.
  - `TweetText` with entities (links t.co-style display, @mention, #hashtag, $cashtag) and "Show more" expanding in place.
  - Verified badges; "Replying to"; "X reposted"; pinned label; timestamp rules + full-date tooltip; reply-restriction note; "Edited" (P2); community notes (P2).
- **C2. Action bar** [P0 M]. 02 F3.
  - Tooltips, hover colours and circles, count formatting.
  - Bookmark toasts ("Added to your Bookmarks" / "Removed from your Bookmarks").
  - Share menu: Copy link → "Copied to clipboard"; Send via Chat → the `Share` modal with the passcode step (P1, after H1); Bookmark.
  - Views → post analytics modal (P1).
- **C3. Reply modal + Quote composer** (compose-family `Modal`, connector line, "Replying to", reuses the composer) [P0 L]. 02 F3, 01 §5.10.
- **C4. "…" caret menu** (other user's / own tweet) [P0 M]. 02 F2.
  - Not interested, Follow/Unfollow (with ConfirmSheet), Add/remove from Lists (modal; full after G2), Mute/Block (toast with Undo, local state), View post activity → `/quotes`, Embed post (modal), Report (static modal flow), Request Community Note (P2).
  - Own tweet: Delete (ConfirmSheet), Pin to profile, Change who can reply.
- **C5. User hover card** (avatar, name, @mentions) [P0 M]. 02 F4.
- **C6. Photo viewer** `/:handle/status/:id/photo/:n` (intercepted over the timeline) [P0 L]. 02 F6.
  - Black mask, arrows, counter, ←/→/Esc, bottom action bar, 350px replies panel with hide toggle.
  - Then the carousel row-height fix.
- **C7. Media extras** [P1 L]. 02 F6.
  - Video player (`<video>` muted autoplay in view, controls, duration badge, GIF badge).
  - Link cards (summary / large image); polls (results, local vote); ALT badge (P2); nested quote "This post is unavailable".
- **C8. Tweet detail deltas** [P0 M]. 02 F7.
  - 48px counts action bar, views line, "Relevant ⌄" sort (Relevant/Recent/Likes), "View quotes ›".
  - `/quotes` page with Quotes/Reposts tabs; `/retweets`; `/likes` for own posts only; pagination for replies.

### Phase D — Home & composer

- **D1. Home tabs** [P0 M]. 01 §4.
  - For you (ranked mix: followed + popular non-followed) vs Following (chronological followed). The selection persists (cookie); clicking the active tab scrolls to top and refreshes.
- **D2. New-posts pill + loading states on the feed** [P1 M]. 01 §4.2–4.3, 03 X3.
- **D3. Composer pickers** [P0/P1 L, one sub-block each].
  - Emoji picker (P0).
  - "Who can reply?" audience menu (P0).
  - Poll editor (P1).
  - GIF picker (P1, mock GIF set).
  - Schedule modal (P1).
  - Content disclosure (P2).
  - Media attach with local preview, up to 4, remove/edit buttons (P1, no upload).
  - Location stays disabled.
  - Spec: 01 §5.4–5.9.
- **D4. Thread composer** ("+" → "Post all") + over-limit highlight and upsell [P1 M]. 01 §5.2–5.3.
- **D5. Compose modal v2** [P1 M]. 01 §5.10.
  - Drafts / Scheduled (`/compose/post/unsent/drafts`, `/scheduled`) with empty states.
  - "Save post?" ConfirmSheet on close with text.
  - Sheet motion; posting progress bar animation.
- **D6. Manage timelines modal** ("+" on the home header, pinned lists ↔ home tabs) [P1 M]. 01 §4.1, after G2.

### Phase E — Explore, Search, Notifications

- **E1. Trends + news mocks and right-panel wiring** [P0 S]. 03 E4/E5/T1, 01 §6.
  - Trend rows link to search; "…" menu; Show more → `/explore/tabs/for-you`.
  - Today's News close → menu (Dismiss for a day / week / Not interested).
  - Footer links + More menu.
- **E2. Explore page** `/explore` + `/explore/tabs/[tab]` (Explore/for_you, Trending, News, Sports, Entertainment) [P0 M]. 03 E1–E3.
  - On Explore the search box moves into the main column.
- **E3. Search combobox + typeahead** (recent searches, users, "Search for …", "Go to @x", keyboard) [P0 M]. 03 S1.
- **E4. Search results** `/search?q=&f=` (Top / Latest / People / Media / Lists), empty state, `/hashtag/[tag]` [P0 L]. 03 S2/S6.
- **E5. Search filters card + Advanced search modal + search settings modal** [P1 M]. 03 S3–S5.
- **E6. News story page** `/i/trending/[id]` [P1 M]. 03 E6.
- **E7. Explore settings modal** `/settings/explore` [P2 S]. 03 E7.
- **E8. Notifications** `/notifications` (All / Mentions; Verified redirects like X) [P0 M]. 03 N1–N5.
  - Grouped rows (like/repost/follow facepiles), mention/reply as tweet cards, recommendation/new_post/login rows.
  - Unread highlight + sidebar badge + title count; mark read on view.
  - Settings modal is P2.

### Phase F — Profile & people

- **F1. Profile header v2** [P0 M]. 05 F1–F2.
  - Verified/protected/affiliate badges; meta row (category, location, website, birthday, joined); counts as links; "Follows you"; "Followed by A, B and N others" facepile.
  - Profile app bar.
- **F2. Profile tabs** [P0 M]. 05 F6.
  - Reposts tab; Media▾ (Photos 3-col grid of 194px squares with 4px gap / Videos); Posts▾ menu; pinned post; infinite scroll; empty states.
  - `/:handle/likes` → `/i/history/likes` for the viewer.
- **F3. Edit profile modal** `/settings/profile` [P0 M]. 05 F8.
  - Fields + counters (50/160/30/100), birth-date confirm + editor, Discard changes? sheet; Save mutates the mock viewer.
- **F4. Followers / Following pages** (`/verified_followers`, `/followers_you_follow`, `/followers`, `/following`) [P0 M]. 05 F9.
- **F5. Other-profile controls** [P1 S]. 05 F3–F5.
  - "…" menu; Unfollow ConfirmSheet (also in `FollowButton` everywhere); bell toggle; Message button → `/i/chat` (the passcode flow, H1); `/:handle/about` (P2).
- **F6. Avatar/banner viewer** `/:handle/photo`, `/:handle/header_photo` [P1 S]. 05 F7 (reuses C6 MediaViewer).
- **F7. Profile states**: not found ("This account doesn't exist"), protected, suspended [P0 S]. 05 F10.
- **F8. Follow page** `/i/connect_people` (Who to follow / Creators for you, `?user_id=` seed) [P0 S–M]. 04 F1.
  - Right-panel and module "Show more" links point here.

### Phase G — History, Lists, Communities

- **G1. History** `/i/history` (Bookmarks) + `/i/history/likes` [P0 M]. 04 F5.
  - Tabs with icons; header search mode `?q=`; remove-bookmark toast + delayed removal; Likes info modal; empty states.
  - `/i/bookmarks` → redirect.
- **G2. Lists** [P1 L]. 05 F11–F14.
  - `/:handle/lists`; Create List 2-step modal `/i/lists/create`; list page `/i/lists/[id]` (+ `/members`, `/followers`); Edit List `/i/lists/[id]/info` + Delete ConfirmSheet; pin to Home.
  - Then finish C4 "Add/remove from Lists" and D6.
- **G3. Communities read-only** [P2 M]. 05 F15–F17.
  - `/:handle/communities` → explore communities; `/i/communities/suggested`; `/i/communities/[id]` (Top/Latest/Media/About).

### Phase H — Chat entry flow (ends at the passcode screen, by decision)

Chat is **not** built as a messaging feature. The clone replicates X's real first-run flow for an account without X Chat set up, and stops at the passcode step, which is the last reachable Chat screen.

- **H1. Chat passcode flow + "not available" notice** [P1 M]. Read 04 F2: "Routing (observed)", "Shell change on Chat routes" and "Passcode wall"; screenshots `chat-03-welcome-passcode.png`, `chat-04-create-passcode.png`, `chat-06-messages-compose.png`.
  - **Layout:** the `fullwidth` shell mode (from B2; if B2 isn't done yet, build only the mode needed here):
    - icon-only sidebar even at 1400px, with the Post button as a 52px round pencil icon and the account switcher as just the avatar
    - no right panel and no floating dock
    - main area up to 1185px wide, with a 1px right border
    - Chat icon in its filled active state
  - **Routes:**
    - `/i/chat` renders the Welcome screen directly. Skip X's 2–5s inbox skeleton; no fake inbox.
    - `/i/chat/pin/new` is the canonical URL of the flow. Make `/i/chat` redirect to it, as X does, or render the same component at both.
    - These all redirect to `/i/chat`: `/messages`, `/messages/*`, `/i/chat/requests`, `/i/chat/settings`, `/i/chat/[conversationId]`.
    - Exception: `/messages/settings` goes to `/settings/direct_messages`, which is a placeholder page.
  - **Step 1, Welcome:**
    - centred 328px column, title `Welcome to the new X Chat` at 34px/800
    - three icon rows: End-to-End Encryption / State-of-the-Art Privacy / Set Passcode, with the exact copy in 04
    - a full-width `Create Passcode` pill. Use the dark values: white bg, black text, 150ms hover.
  - **Step 2, Create Passcode** (same URL, local state):
    - lock glyph, then `Create Passcode` at 23px/700, then `A personal key that secures your messages.`
    - four 60×60 circular single-digit inputs: `inputmode=numeric`, `maxLength=1`, aria-labels `Digit N of 4`. Auto-advance on type, Backspace goes back, digits render as filled dots, border colours per 04.
    - No back/cancel button; the user leaves through the sidebar.
  - **The "last screen" notice** (new, not on X) appears on step 2 only:
    - a small, quiet line centred under the digit circles, 24px below them
    - 13px, `muted` colour, a 16px lock/info icon + 4px gap
    - copy: **`Chat isn't available in this clone — this is the last screen.`**
    - When all four digits are filled, nothing navigates. The inputs keep their value, and the notice switches to `foreground` colour for emphasis; no shake, no toast.
    - No banner on step 1, so the flow still reads like X up to the end.
  - **Every other chat entry point leads here:**
    - sidebar Chat (B1)
    - the floating dock Chat button (B4): it **navigates to `/i/chat`** and opens no drawer
    - the profile "Message" button (F5)
    - tweet Share → `Send via Chat` (C2): opens the 600×650 `Share` modal like X's `/messages/compose`, back arrow + centred title `Share`, whose body is the same component (compact) starting on step 2, with the notice
  - **Component:** one `ChatPasscodeFlow` in `features/chat/components/` with `initialStep` and `variant: "page" | "modal"` props. No `api/`, no types, no mocks.
  - **Icons:** LockIcon, ShieldCheckIcon and NewMessageIcon paths are in 04 F2 "Icons".

### Phase I — Settings

- **I1. Settings shell** `/settings` → `/settings/account`, two-pane 450 + 600, no right panel, settings search [P1 M]. 05 F18–F19.
  - Category pages as static row lists (level 3 rows link to placeholders).
  - **Display** (`/settings/display`, 05 F20) is **not built**: the clone is dark-only. Its row links to a placeholder like any other level-3 page.

### Phase J — Static shells for OUT products
- **J1. Grok** `/i/grok` empty-state shell (`no-panel` layout), input inert [P2 S]. 04 F4.
- **J2. Creator Studio** `/i/jf/creators/studio` menu page [P2 S]. 04 F6.
- **J3. Premium** `/i/premium_sign_up` static takeover, CTA inert [P2 M]. 04 F7.
- **J4. Business / Create your Space**: Business is an external link like X; Space shows the "not available" modal or is hidden [P2 S]. 04 F8.

### Phase K — Motion & polish pass
Finish the motion work paused in Sept 2026. Menus, the count roll and the action hover circle are already done. Tooltips, modals and toast land in A2/A1/A3. What remains: the Follow → Following / Unfollow button swap, a composer character-counter pop, and hover micro-timings (use the RN client values in the research: ~200ms colour transitions). Then a consistency sweep against all screenshots in light and dark.

---

## 6. Critical path / suggested milestones

1. **M1 "Everything clickable"** = A1–A8 + B1 + E1 + F7 + placeholder pages for every L1 destination. After M1 no sidebar item, tab or menu is inert.
2. **M2 "Tweets feel real"** = C1–C6, C8 + D1.
3. **M3 "Discovery"** = E2–E4 + E8 + F8.
4. **M4 "Profiles & collections"** = F1–F6 + G1 + G2 + D6.
5. **M5 "Composer complete"** = D2–D5 + C7.
6. **M6 "Shell complete"** = B2–B3 + H1 + I1.
7. **M7 "Long tail"** = everything P2 (E5–E7, G3, J*, B4, K).

---

## 7. Decisions taken (user, 2026-10-05) and remaining caveats

**Decided:**
1. **Chat ends at the passcode screen.** The clone builds X's real first-run flow (Welcome → Create Passcode). The passcode step is the last reachable screen and shows a small "not available in this clone" notice (H1). No inbox, conversations or chat data.
2. **Dark mode only.** No light theme, Dim, accent colours or font size; use **D** values (§0.5). The Display settings page is not built.
3. **Screenshots stay out of git.** `docs/v2/research/screens/` is in `.gitignore` (real X content, ~66MB); they're local-only (§0.9).
4. **`docs/PROJECT.md` points here.** PROJECT.md now says v2 is the current work and that this plan's scope wins over its v1 "Out" list.

**Kept from earlier decisions:** the like pop + burst stays (user-approved, though X has none); no sliding tab indicator.

**Remaining caveats** (build from the proposed specs and flag them in the block report):
- Unobserved because the research account has no activity: notification types other than "recommended post", unread badges, the own-tweet "…" menu, "Follows you", community notes, the "See new posts" pill (rate-limited).
- **Supabase timing:** v1 PROJECT.md put the backend next. This plan keeps building on mocks; review the new contracts (§3) before writing the schema.
