# 05 — Profile, Lists, Communities, Settings

Researched on logged-in x.com, 2026-10-05, as @PedroLo01746179 ("Loren_pepe12"), viewport 1400×900 (expanded sidebar, primary column x=343.5…941.5 = 598px content + 1px borders).

**Theme note.** During this session the account's display setting flipped several times between "Default" (light) and "Lights out" (dark), probably because another researcher was toggling Display settings, so measurements are mixed. Every colour below is tagged **L** (light) or **D** (dark, Lights out). The clone runs dark, so **D** values matter most. They map 1:1 to the clone tokens in `src/app/globals.css`:

| Role | L | D (Lights out) | clone token |
|---|---|---|---|
| page bg | `#FFFFFF` | `#000000` | `background` |
| primary text | `rgb(15,20,25)` #0F1419 | `rgb(231,233,234)` #E7E9EA | `foreground` |
| secondary text | `rgb(83,100,113)` #536471 | `rgb(113,118,123)` #71767B | `muted` |
| divider | `rgb(239,243,244)` #EFF3F4 | `#2F3336` | `border` |
| input border / banner placeholder | `rgb(207,217,222)` #CFD9DE | `rgb(51,54,57)` #333639 | `border-strong` |
| outline-button border | `rgb(207,217,222)` | `rgb(83,100,113)` #536471 | `outline` |
| inverted button bg (Follow, Save) | `rgb(15,20,25)` | `rgb(239,243,244)` | `inverted` |
| inverted button hover | — | `rgb(215,219,220)` | `inverted-hover` |
| accent | `rgb(29,155,240)` | same | `accent` |
| danger | `rgb(244,33,46)` | same; danger border `rgb(103,7,15)` | `danger`, `danger-border` |
| modal scrim | `rgba(0,0,0,0.4)`* | `rgba(91,112,131,0.4)` (clone `mask`) | `mask` |
| dropdown menu (D) | — | bg `rgb(20,20,20)`, radius 12, shadow `rgba(0,0,0,.5) 0 4px 12px, rgba(0,0,0,.35) 0 0 2px` | `elevated` |

\*The light-mode scrim was not measured cleanly; the dark value matches the existing clone token.

---

## Scope map

```
Profile (sidebar "Profile" → /PedroLo01746179)                              L1
├── Profile header
│   ├── Banner → /:handle/header_photo (full-screen viewer modal)           L2
│   ├── Avatar → /:handle/photo (full-screen viewer modal)                  L2
│   ├── [own] "Edit profile" → /settings/profile (modal)                    L2
│   │   ├── Birth date → "Edit date of birth?" confirm → inline editor      L2
│   │   ├── "Edit Photo" (Imagine) → /i/imagine                              L3 (name only)
│   │   └── "Switch to professional" → /i/flow/convert_to_professional      L3 (name only)
│   ├── [own] "Get verified" pill → /i/premium_sign_up                      L3 (shell/premium)
│   ├── [other] "…" menu (About this account, Add/remove from Lists, View Lists,
│   │          Share via…, Copy link, Mute, Block, Report)                  L2
│   │   ├── About this account → /:handle/about                             L2
│   │   ├── Add/remove from Lists → /i/lists/add_member (modal)             L3 (name only)
│   │   └── View Lists → /:handle/lists                                     L2
│   ├── [other] Message (DM icon) → /i/chat/…                               L3 (agent 04)
│   ├── [other] Subscribe (creator) → /:handle/creator-subscriptions/subscribe (modal)  L3 (name only)
│   ├── [other] Bell (post-notifications toggle, only when following)       L2 (inline)
│   ├── [other] Follow / Following / Unfollow + confirm dialog              L2
│   ├── [other] App-bar Grok button "Profile Summary" → Grok drawer         L2 (agent 04 owns drawer)
│   ├── Joined date "Joined November 2020 >" → /:handle/about                L2
│   ├── "N Following" → /:handle/following                                  L2
│   ├── "N Followers" → /:handle/verified_followers                         L2
│   └── "Followed by A and B" → /:handle/followers_you_follow                L2
├── Tabs: Posts▾ (All / Posts / Highlights / Sort by ▸ Most recent / Popular)
│         Replies (/with_replies) · Reposts (/reposts) · [Subs (/subs)] ·
│         Media▾ (/media: Videos / Photos = ?filter=photo) · [Articles (/articles)]  L1
│   ├── /:handle/highlights (from Posts▾ menu)                              L2
│   └── /:handle/likes → redirects to /i/history/likes (History, agent 04)
├── Empty/error states: not found, suspended, protected                     L1
└── Follow lists: /:handle/verified_followers, /followers_you_follow,
    /followers, /following                                                  L2

Lists (More → Lists → /PedroLo01746179/lists)                               L1
├── "Search Lists" box → /i/lists/search?q=…                                L2
├── "Create a new List" → /i/lists/create (modal, 2 steps)                  L2
├── "…" → "Lists you're on" → /:handle/lists/memberships                    L2
├── "Discover new Lists" → "Show more" → /i/lists/suggested                 L2
├── "Your Lists" (rows → /i/lists/:id)                                      L2
│   └── List page /i/lists/:id  (+ /members, /followers, Edit List modal /i/lists/:id/info)   L2
Communities (More → Communities → /PedroLo01746179/communities)             L1
├── /i/communities/suggested (Explore), search, categories                  L2
├── Community page /i/communities/:id (+ /about, members)                   L2
└── Create a Community → /i/communities/create                              L3 (name only)
Settings and privacy (More → Settings and privacy → /settings)              L1
├── /settings → redirects to /settings/account (two-pane: nav 450 + detail 600)
├── /settings/account, /settings/security_and_account_access,
│   /settings/privacy_and_safety, /settings/notifications,
│   /settings/accessibility_display_and_languages, /settings/about          L2
├── Monetization → /i/jf/creators/studio · Premium → /i/premium_sign_up · Help Center → support.x.com   L3 (name only)
├── "Search Settings" (filters nav inline)                                  L2
└── /settings/display (Display: font size, colour, background)              L2/L3 (fully documented)
```

The More menu (sidebar "More") contains, in order: **Lists** `/PedroLo01746179/lists`, **Communities** `/PedroLo01746179/communities`, **Business** `/i/verified-orgs-signup`, **Ads** `https://ads.x.com/?ref=gl-tw-tw-twitter-ads-rweb`, **Create your Space** `/i/spaces/start`, **Settings and privacy** `/settings` (agent 01 owns the menu itself).

---

## Features

### F1. Profile app bar (sticky header)

- **Level / route:** L1, every `/:handle` route.
- **Clone status:** PARTIAL. `PageHeader` shows name and "N posts" correctly. Missing: verified badge and affiliate badge next to the name, the right-side icon buttons (Grok "Profile Summary" on other people's profiles, Search on every profile), a subtitle that changes per tab, and the "New posts are available" pill.
- **Suggested priority:** P1 · **Complexity:** S
- **Layout:** height 53px. Back button 36×36 at x+8, y 8.5, radius 9999. Title `h2` 20px/700/24px with 2px vertical padding, at x+72. Subtitle 13px/400/16px in muted. Right icon buttons are 36×36, radius 9999, 8px apart (Grok at right−96, Search at right−52), icons 20px.
- **Content:**
  - Title: display name, plus the 20px verified badge and the affiliate badge (15px square avatar) when present.
  - Subtitle by tab: Posts / Replies / Reposts → `"{n} posts"` (abbreviated, e.g. `109.5K posts`). Media → `"{n} photos & videos"` (e.g. `831 photos & videos`, `0 photos & videos`).
  - Own profile: Search only. Other profile: Grok button (`aria-label="Profile Summary"`, tooltip "Profile Summary") + Search (`aria-label="Search"`).
  - Hidden "See new posts" pill (`aria-label="New posts are available. Push the period key to go to the them."`): accent bg, 28px tall, padding 4px 16px, radius 9999, arrow-up icon, centred, y 16. Owned by the shell agent; just reuse it here.
- **Behaviour:**
  - Search opens profile-scoped search (`from:handle`), which is agent 03's area.
  - Profile Summary opens the floating Grok drawer (bottom-right dock, ~400×600) with a user chip ("Elon Musk @elonmusk"), "Thinking about your request", and the input "Ask anything". Agent 04 owns the drawer. For the clone, link to `/i/grok?text=…` or leave it VISUAL.
- **Implementation notes:** extend `PageHeader` with `titleAdornment` and `actions` slots.
- **Screenshots:** `screens/05-profile-lists-communities-settings/other-elonmusk.png`, `other-profile-summary-grok.png`

### F2. Profile header block (banner, avatar, name, meta, counts)

- **Level / route:** L1 `/:handle`.
- **Clone status:** PARTIAL (`src/features/profile/components/profile-header.tsx`). Banner and avatar are not links. There is no verified badge, affiliate badge, "Get verified" pill, location, website, professional category, or birthday, and the join date is not a link with a chevron. Counts are not links. There is no "Followed by…" row, "Follows you" badge, Subscribe button, bell, or upsell card. The clone puts the avatar at `-mt-[84.9px]`, which is close to X (see below).
- **Suggested priority:** P0 (links, meta row, counts as links, verified badge) · P1 (followed-by row, bell, protected) · P2 (subscribe, upsell card)
- **Complexity:** M
- **Layout & measurements (column content width 598):**
  - **Banner:** 598×199.3 (exactly 3:1), placeholder bg L `rgb(207,217,222)` / D `#333639`. It is a link `<a href="/:handle/header_photo">` only when a banner exists. The own profile without a banner has no link.
  - **Avatar link** `/:handle/photo`: outer 145.5×145.5 at banner-bottom −75 (y 177.4 when the banner ends at 252.3), x = column+14. Inner ring: the avatar image is 133.5×133.5 inside a 4px ring of page bg (`calc(100% − 12px)` layers). Hover overlay: a full-size layer gets `rgba(26,26,26,0.15)`-style darkening (same as other X avatar links; not measured exactly).
  - **Action row** (right-aligned, top at banner-bottom+12, `margin-bottom:12px`): buttons 36px tall, 8px gap.
    - Own: "Edit profile" outline button, width 113, padding 0 16px, 15px/700, border 1px (L `rgb(207,217,222)` / D `rgb(83,100,113)`), radius 9999, `<a href="/settings/profile">`. `data-testid="editProfileButton"`.
    - Other, not following: `More`(36) · `Message`(36) · [`Subscribe`(36) only for creators] · `Follow`(81×36, inverted).
    - Other, following: `More` · `Message` · `Turn on post notifications`(36) · `Following`(103×36).
    - Protected: `More` · `Follow` (no Message).
  - **UserName block** (`margin: 4px 0 12px`):
    - Name 20px/800/24px, then a 20px verified badge (`aria-label="Verified account"`, wrapped in `<button aria-label="Provides details about verified accounts.">`), then the affiliate badge: 15×15 image of the affiliated org's avatar (radius 2–3px), `role=link` → `/X`.
    - Handle 15px/400/20px muted, 4px below.
    - Own, not Premium: the **"Get verified" pill** sits right of the name, 4px gap: `<a href="/i/premium_sign_up">`, 125×24, border 1px (L `#CFD9DE` / D `#536471`), radius 9999, padding 0 12px. Inside: 16px blue verified icon (fill accent, mr 4) + "Get verified" 15px/700/20px.
  - **Bio** (`data-testid="UserDescription"`): 15px/400/20px, margin-bottom 12px. Links, mentions and hashtags are coloured accent (needs the tweet-text entity parser from agent 02).
  - **Meta row** (`data-testid="UserProfileHeader_Items"`): 15px, line-height 12px, muted, items wrap. Each item has an 18.75px icon with `margin-right:4px` and `margin-right:12px` between items. Order: **ProfessionalCategory** (briefcase icon, plain text, e.g. "Community") → **Location** (pin icon, plain text, e.g. "127.0.0.1") → **Url** (link icon, accent-coloured link text, display URL without protocol, e.g. "docs.x.com" or "Terafab.AI", href is a t.co wrapper) → **Birthdate** (balloon icon, "Born August 23, 2007", visibility-dependent; not observed on our account because visibility is "Only you") → **JoinDate** (calendar icon + "Joined November 2020" + chevron-right 18.75px icon; the whole item is a link to `/:handle/about`).
  - **Counts row:** two links 20px tall, 20px gap. Number 14px/700/16px foreground, label 14px/400/16px muted ("Following", "Followers"). Hover underline. `"4 Following"` → `/:handle/following`. `"0 Followers"` → `/:handle/verified_followers` (note: **verified_followers**, not `/followers`).
  - **"Followed by" row** (other profiles only): `<a href="/:handle/followers_you_follow">`, height 24, margin-top 12px. Stacked avatars 22px inside 28px wrappers (3px ring of page bg), each overlapping by −16px (step 12px). Text 13px/400/16px muted: `"Followed by Orthodox Christian and Father Spyridon Bailey"`, or `"Followed by A, B, and N others you follow"`. When there are none: `"Not followed by anyone you’re following"` (13px muted, no link).
  - **Verified upsell card** (other verified profiles, viewer not verified; `data-testid="verified_profile_visitor_upsell"`): 566×132, bg L `rgb(219,248,235)` (dark: deep green), radius 12, padding 16. Title 17px/700 `"@PedroLo01746179, you aren’t verified yet"` + verified icon. Body 15px `"Get Verified like @elonmusk to stand out and get boosted reach."` (handle bold). Inverted button `"Get Verified"` 36px → `/i/premium_sign_up`. Close X 24px top-right. P2.
- **Exact copy:** "Edit profile", "Get verified", "Joined {Month YYYY}", "{n} Following", "{n} Followers", "Followed by …", "Not followed by anyone you’re following", "Follows you" (badge after the handle: 11–13px, bg L `rgb(239,243,244)` / D `#202327`, radius 4, padding 0 4px; not observed because nobody follows this account).
- **Behaviour:** Follow is optimistic. The button becomes "Following" (inverted-hover bg in D `rgb(215,219,220)`, width 103) and the bell button appears to its left. See F4.
- **Data model:** see the "Data model" section (`location`, `website`, `birthDate`, `verified`, `affiliate`, `professionalCategory`, `followsViewer`, `followedByPreview`).
- **Implementation notes:** reuse `Avatar` xl (133.5) inside a 4px page-bg ring. Make banner and avatar `<Link>`s to the viewer routes (F7). The meta row is a flex-wrap with `gap-x-3`.
- **Screenshots:** `own-profile.png` (D), `other-XDevelopers.png`, `other-elonmusk.png` (L), `other-followed-by.png`
- **Icons:** see the Icons appendix (`BriefcaseIcon`, `LocationPinIcon`, `LinkIcon`, `BalloonIcon` (not extracted), `ChevronRightIcon`, `LockIcon`, `PinIcon`, `BellPlusIcon`, `BellActiveIcon`, `SubscribeIcon`).

### F3. Profile "…" (More) menu — other users

- **Level:** L2 · **Clone status:** VISUAL (`CircleButton label="More"` has no menu) · **Priority:** P1 · **Complexity:** S (reuse `ui/dropdown-menu.tsx`)
- **Layout:** the menu is anchored to the button's top-right and grows down-left: width 229, item height 44, radius 12, D bg `rgb(20,20,20)`, shadow `rgba(0,0,0,0.5) 0 4px 12px, rgba(0,0,0,0.35) 0 0 2px`. Items are 15px/700 with a 18.75px icon and 12px gap.
- **Items (exact, in order):**
  1. **About this account** (info-circle icon) → `/:handle/about`
  2. **Add/remove from Lists** (list-plus icon) → `/i/lists/add_member` (modal; L3, name only)
  3. **View Lists** (list icon) → `/:handle/lists`
  4. **Share @elonmusk via...** (share icon) → native share sheet
  5. **Copy link to profile** (link icon) → copies `https://x.com/:handle`, toast "Copied to clipboard"
  6. **Mute** (`data-testid="mute"`, speaker-x icon). The label is "Mute @handle" on some builds; "Mute" was observed here.
  7. **Block @elonmusk** (`data-testid="block"`, circle-slash icon)
  8. **Report @elonmusk** (flag icon)
  - For a **protected** account the menu shrinks to: About this account, Mute, Block @handle, Report @handle.
- **Behaviour:** standard dropdown. None of Mute/Block/Report were executed (safety). For the clone, recommend Copy link (toast) as FUNCTIONAL, About and View Lists as links, Share as VISUAL, and Mute/Block/Report as VISUAL or OUT.
- **Screenshots:** `other-more-menu.png`

### F4. Follow / Following / Unfollow, bell, unfollow confirmation

- **Level:** L2 · **Clone status:** PARTIAL (`components/user/follow-button.tsx`: Follow toggles directly and hover shows red "Unfollow"). Missing: the **unfollow confirmation dialog**, the bell toggle, and a width change. **Priority:** P0 (confirm dialog), P1 (bell) · **Complexity:** S
- **Measurements:**
  - Follow: 81×36, padding 0 16px, 15px/700, radius 9999, inverted bg (D `rgb(239,243,244)`, hover `rgb(215,219,220)`). `transition: background-color, box-shadow 0.2s ease`.
  - Following: 103×36, transparent bg, 1px border D `rgb(83,100,113)`, text foreground. `aria-label="Following @XDevelopers"`, `data-testid="{userId}-unfollow"`.
  - Hover on Following: the label switches **instantly** to "Unfollow" (width 104). Border becomes `rgb(103,7,15)` instantly. Bg animates from transparent to `rgba(244,33,46,0.1)` over ~200ms ease. Text `rgb(244,33,46)`, 700.
- **Unfollow dialog** (`data-testid="confirmationSheetDialog"`): 320×300, padding 32, radius 16, bg page bg.
  - Title 20px/700/24px: `"Unfollow @XDevelopers?"`
  - Body 15px/20px muted: `"Their posts will no longer show up in your Following timeline. You can still view their profile, unless their posts are protected."`
  - Buttons 256×44, 12px gap, radius 9999, padding 0 24px: **Unfollow** (`confirmationSheetConfirm`, inverted fill) and **Cancel** (`confirmationSheetCancel`, outline 1px D `rgb(83,100,113)` / L `rgb(207,217,222)`).
  - The dialog appears centred over the scrim.
- **Bell** (appears only after following): `aria-label="Turn on post notifications"`, bell-plus icon. Clicking it toggles **immediately** (no popover in the current build) to `aria-label="Turn off post notifications"` with a bell-check icon, and the hover tooltip reads "Turn off notifications". Clicking again reverts it. The old "All posts / Only posts with live video / Off" popover no longer exists.
- **Safety:** followed and unfollowed @XDevelopers twice, and turned notifications on and off. The final state is not following (verified).
- **Screenshots:** `other-following-state.png`, `other-unfollow-hover.png`, `other-unfollow-confirm.png`, `other-bell-after-click.png`

### F5. Verified badge popover / Subscribe / About this account

- **Verified badge click:** the badge is a `<button aria-label="Provides details about verified accounts.">`. Clicking it in headless Chrome produced **no visible popover** (not observed). Historically it opens a 300px-wide hover sheet with "Verified account", "This account is verified because it’s subscribed to X Premium. Verified since {Month YYYY}." and "Upgrade to Premium" (gold badge: "This account is verified because it’s an official organization on X."). The **verified-since information now lives on `/:handle/about`** (see below). **Priority:** P2.
- **Subscribe** (creator subscriptions; only on monetised creators): 36×36 outline button with border and icon colour `rgb(201,54,204)` (magenta), `aria-label="Subscribe to @elonmusk"`. It opens the modal `/:handle/creator-subscriptions/subscribe`: "Subscribe · Elon Musk · 44.2K subscribers · 11 exclusive posts · Subscription Perks · Exclusive Posts · Stand out! … Subscribe · ARS 870.00/month · By continuing, you agree to the Purchaser Terms…". **OUT** for the clone (payments). Optionally keep the button VISUAL. Screenshot `other-subscribe.png`.
- **About this account** `/:handle/about` (L2, P2, S):
  - Page header "About this account" (own: "About your account" with a settings gear on the right). Centred 64px avatar, name 15px/700, @handle muted.
  - Then rows with a 24px icon, a 15px title and a muted value:
    - "Date joined / November 2020" (calendar)
    - "Account based in / Argentina" (pin; own profile shows a shield-info icon on the right)
    - "Verified / Since {date}"
    - "An affiliate of / @X"
    - "Connected via / Argentina App Store" (globe)
  - Screenshots: `own-about.png`, `other-about.png`.

### F6. Profile tabs + per-tab content

- **Level:** L1 · **Clone status:** PARTIAL (`profile-tabs.tsx`: Posts + Replies are functional; Reposts and Media are inert). **Priority:** P0 (Reposts, Media grid) · P1 (Posts▾ menu) · P2 (Highlights, Articles, Subs) · **Complexity:** M
- **Real tab list (2026-10):** the old Highlights / Articles / Likes tabs are **gone** from the own profile.
  - Own: **Posts ▾ · Replies · Reposts · Media ▾**
  - Normal other user: **Posts ▾ · Replies · Reposts · Media ▾**
  - User with Articles: **… · Media ▾ · Articles** (`/:handle/articles`)
  - Creator with subscriptions: **Posts ▾ · Replies · Reposts · Subs · Media ▾** (`/:handle/subs`)
  - Protected (not following): **no tabs at all**.
  - `/:handle/likes` **redirects to `/i/history/likes`** (History → Likes, agent 04; `own-tab-likes.png`).
  - `/:handle/articles` and `/:handle/superfollows` redirect to `/:handle` when the user has none.
- **Tab bar:** height 53. Each tab is `flex:1`, padding 0 16px, with an inner label 15px and padding 16px 0. Active: 700 foreground. Inactive: 500 muted. Indicator: 4px, radius 9999, accent, `min-width:56px`, width = label width (61.8 for "Posts ▾"), absolute bottom 0. Bottom divider 1px `border`. Hover bg `foreground/10`, which matches the clone `Tab` primitive. The bar is a horizontally scrollable snap list (`ScrollSnap-List`) with prev/next arrows when it overflows (5 tabs fit at 598).
- **Posts ▾ menu** (only on the active Posts tab; `aria-haspopup="menu"`): a dropdown anchored to the tab, ~146px wide, items 44px, 15px/700.
  - Items: **All** · **Posts** ✓ (checkmark icon right, accent) · **Highlights** · **Sort by ▸** (chevron-right).
  - The Sort by submenu: **Most recent** · **Popular**.
  - "Highlights" navigates to `/:handle/highlights` and the tab label becomes "Highlights ▾".
  - Screenshots: `own-profile-posts-tab-menu.png`, `own-profile-posts-sortby.png`.
- **Media ▾ menu:** items **Videos** · **Photos**, with a check on the current one. The last choice is sticky (the tab label shows "Videos ▾" or "Photos ▾"). Photos URL: `/:handle/media?filter=photo`. Videos shows a **tweet list** of video posts. Photos shows the **grid**.
- **Media grid (Photos):**
  - 3 columns of **194×194 squares** with **4px gaps**, inset 4px from the column edges (x 347.5, 545.5, 743.5).
  - Radius 0. No hover overlay detected (transition 0s).
  - A multi-photo indicator (stacked-squares icon, 20px, white with shadow) sits 8px from the bottom-right. Videos show a duration badge (not measured).
  - Each cell links to `/:handle/status/:id/photo/1` and opens the photo viewer (agent 02).
  - Screenshot: `other-media-photos-grid.png`.
- **Pinned post:** the first item. A social-context line above the tweet reads **"Pinned"**: 13px/700/16px muted, with a 16px pushpin icon right-aligned to the avatar column (icon x = avatar right − 16, text at x+408). Same row style as "You reposted". See agent 02 for the card.
- **Reposts tab:** a tweet list where each item has the header `"You reposted"` (own) or `"{Name} reposted"`.
- **"Who to follow" module** after the first post(s): `"Who to follow"` 20px/800, or a social variant `"Orthodox Christian and Patristic Nectar follow"` (13px muted, person icon) per row. Ends with "Show more" → `/i/connect_people?user_id={id}`. The clone already has this module.
- **Empty states** (title 31px/800/36px, body 15px/20px muted, width 360, centred, padding 32 40):
  - Replies (own): **"You haven’t replied yet"** / **"When you reply, your replies will show up here."**
  - Media→Videos (own): **"You haven’t posted videos yet"** / **"When you post videos, they will show up here."**
  - Highlights (own, non-Premium): **"Highlight on your profile"** / **"You must be subscribed to Premium to highlight posts on your profile."** + button **"Subscribe to Premium"**.
  - Posts (own, 0 posts): not observed (the account has 2 posts). Expected "You haven’t posted yet".
  - Protected: **"These posts are protected"** / **"Only approved followers can see @InheritedMerit’s posts. To request access, click Follow. Learn more"** ("Learn more" accent link).
- **Data model:** tab content needs `getProfileMedia(handle, filter)`, `getProfileReposts(handle)`, `user.pinnedTweetId`.
- **Routing:** `/[handle]/reposts`, `/[handle]/media` (searchParam `filter=photo|video`), `/[handle]/highlights`. `/[handle]/likes` → `redirect('/i/history/likes')` for the viewer only.
- **Screenshots:** `own-tab-with_replies.png`, `own-tab-reposts.png`, `own-tab-media.png`, `own-media-tab-menu.png`, `own-tab-highlights.png`, `other-media-grid.png` (Videos), `other-media-photos-grid.png`

### F7. Avatar & banner viewer

- **Level:** L2 · **Routes:** `/:handle/photo`, `/:handle/header_photo` · **Clone status:** MISSING · **Priority:** P1 · **Complexity:** S
- **Layout:** a full-screen modal (`aria-modal`, 1400×900) with scrim **`rgba(0,0,0,0.9)`**.
  - Close button 36×36 at top-left (12,12), bg `rgba(0,0,0,0.75)`, radius 9999, white X icon (path = clone `CloseIcon`).
  - **Avatar:** the 400×400 image is rendered at **368×368**, centred, clipped to a **circle**. Organisations (square avatars) render square.
  - **Banner:** the 1500×500 image is rendered full-width (1400×466.7, 3:1) and vertically centred.
  - There is no caption, toolbar or actions.
- **Behaviour:** Escape, the close button or a scrim click goes back (`history.back`). A hard load of `/elonmusk/photo` renders **Home timeline behind** the modal, so it is an intercepted modal with a home fallback. `/:handle/header_photo` still opens (empty) when the user has no banner, so the clone should simply not link the banner then.
- **Motion:** none detectable when sampled at 700ms; the open looked instant or a fast fade (<150ms). Recommend reusing the generic modal fade.
- **Routing:** `@modal/(.)[handle]/photo` and `@modal/(.)[handle]/header_photo`, with page fallbacks over `/`.
- **Screenshots:** `viewer-avatar.png`, `viewer-banner.png`

### F8. Edit profile modal (`/settings/profile`)

- **Level:** L2 · **Clone status:** MISSING ("Edit profile" is an inert `Button`) · **Priority:** P0 · **Complexity:** M
- **Container:** 600×650 centred (x 400, y 125), radius 16, `min-height:400`, `max-height:810` (90vh), page bg, scrim D `rgba(91,112,131,0.4)` (clone `mask`). It is an intercepted modal: a hard load of `/settings/profile` shows the **Home timeline** behind it. Close goes back.
- **Motion (measured):** an `animation` of 150ms (`r-1qpf3yi`). Opacity 0→1 and `scale(0.92)`→`scale(1)`, ease-out-like (by 50% of the time it reaches opacity 0.58 / scale 0.966). **Spec: 150ms, `cubic-bezier(0.2,0,0,1)`-ish, opacity + scale .92→1.** Exit was not measured (it looks instant).
- **Header** (53px, sticky): Close (36, X icon, `data-testid="app-bar-close"`, aria "Close") at x+8, title `h2` "Edit profile" 20px/700 at x+72, **Save** on the right.
  - Save: 32px tall, padding 0 16px, inverted, 14px/700, `data-testid="Profile_Save_Button"`.
  - Save is `aria-disabled` with **opacity 0.5** when the form is invalid (e.g. empty name). It is not disabled when nothing changed.
- **Banner area:** 3:1 (598 wide), placeholder `border-strong`, dimmed by a 25% overlay. A centred **"Add banner photo"** button 44×44, bg `rgba(15,20,25,0.75)`, radius 9999, white camera-plus icon 22px. When a banner exists, an **"Remove photo"** X button appears next to it (not observed; this account has no banner).
- **Avatar:** 112px (4px ring), at x+16 overlapping the banner by about half its height. A centred **"Add avatar photo"** camera button, 44×44, same style.
- **Imagine card** (new, Grok): to the right of the avatar is a rounded card (radius 12, bg `elevated`/`rgb(247,249,249)` L) with "Edit your photo with Imagine" 15px/700 + "Customize yourself in seconds" 15px muted, and a pill button **"Edit Photo"** (36px, bg D `rgb(51,54,57)`, border same, icon = image-pencil 20px) → `/i/imagine` (L3; recommend **OUT** or VISUAL).
- **Fields** (16px side margin, 28px vertical rhythm): a floating-label text field.
  - Box: `label` 568×58 (textarea 98), border 1px `border-strong` (L `rgb(207,217,222)` / D `rgb(51,54,57)`), radius 4.
  - Label text 13px/16px muted at padding 8px 8px 0 when filled, or 17px centred-ish when empty and unfocused (e.g. "Bio", "Location").
  - Input 17px/24px, padding 12px 8px 8px.
  - **Focus:** border and label colour become accent, plus `box-shadow: accent 0 0 0 1px` (2px total ring). A counter `"12 / 50"` appears top-right, 13px muted.
  - **Error:** border `rgb(244,33,46)`, with the message below: **"Name can’t be blank"** (13px danger).
  - | Field | name attr | maxLength | counter |
    |---|---|---|---|
    | Name | `displayName` | **50** | `n / 50` |
    | Bio | `description` (textarea, 3 rows ≈ 60px) | **160** | `n / 160` |
    | Location | `location` | **30** | `n / 30` |
    | Website | `url` | **100** | `n / 100` |
- **Birth date row:** 600×61, padding 12px 16px, hover bg L `rgb(247,249,249)`. "Birth date" 15px muted, value "August 23, 2007" 15px foreground, chevron-right 30px on the right.
  1. Click shows the **confirmation sheet** (320×280, padding 32, radius 16): title **"Edit date of birth?"**, body **"This can only be changed a few times. Make sure you enter the age of the person using the account."**, buttons **Edit** (inverted) and **Cancel** (outline).
  2. Edit switches the row inline to: **"Birth date · Cancel"** (Cancel is an accent link), **"This should be the date of birth of the person using the account. Even if you’re making an account for your business, event, or cat."**, **"X uses your age to customize your experience, including ads, as explained in our Privacy Policy."** (link), then three native `<select>`s with floating labels — **Month** (271 wide), **Day** (122), **Year** (145; 2026→1906) — each 40px tall with a chevron-down.
  3. Then **"Who sees this?"** / **"You can control who sees your birthday on X. Learn more"**, two selects **"Month and day"** and **"Year"** with options **Public · Your followers · People you follow · You follow each other · Only you** (stored value `self` = Only you).
  4. Then a red text button **"Remove birth date"**.
  - The clone can reuse the auth sign-up `DateSelect` / `SelectChevronIcon`.
- **"Switch to professional"** row: 600×48, 20px/400 text + chevron → `/i/flow/convert_to_professional` (L3, recommend OUT).
- **Discard flow:** with unsaved changes, Close / Escape opens the confirmation sheet **"Discard changes?"** / **"This can’t be undone and you’ll lose your changes."** / **Discard** (bg `rgb(244,33,46)`, white text) / **Cancel**. Without changes, Close just goes back.
- **Camera buttons:** these open the native file picker (`data-testid="fileInput"`, hidden). After a file is chosen, X shows the **"Edit media"** cropper (zoom slider, Apply). Not observed (no upload done). For the clone, recommend P2 or OUT (no media upload in scope).
- **Data model:** `updateProfile({ displayName, bio, location, website, birthDate })` server action, with validation for name required and the max lengths above.
- **Implementation notes:** first build a generic **`Modal`** primitive in `components/ui` (600×650, radius 16, header slot, scrim `mask`, focus trap from `features/auth/utils/trap-focus.ts` lifted to shared). Also build a generic **`ConfirmSheet`** (320 wide), used here, in Unfollow, in List delete, and elsewhere. Build a **`FloatingLabelField`** (input/textarea, counter, error); auth already has a similar field that can be lifted.
- **Screenshots:** `edit-profile-modal.png` (D), `edit-profile-name-focused.png`, `edit-profile-name-empty-error.png`, `edit-profile-scrolled.png`, `edit-profile-birthdate-confirm.png`, `edit-profile-birthdate-edit.png`, `edit-profile-discard-dialog.png`, `edit-profile-imagine.png`

### F9. Followers / Following pages

- **Level:** L2 · **Routes:** `/:handle/verified_followers`, `/:handle/followers_you_follow`, `/:handle/followers`, `/:handle/following` · **Clone status:** MISSING (multi-segment routes 404) · **Priority:** P0 (following/followers) · **Complexity:** M
- **Header:** sticky, 2 rows.
  - Row 1 (53px): back + display name 20px/700 + `@handle` 13px muted. No posts count.
  - Row 2: the tab bar (53px), same tab primitive as the profile.
- **Tabs:**
  - Own: **Verified Followers** (238 wide) · **Followers** (179) · **Following** (181).
  - Other with mutuals: **Verified Followers · Followers you know · Followers · Following**. "Followers you know" only appears when there is at least one.
  - Tab widths are flex.
- **User cell** (`data-testid="UserCell"`): 598 wide, padding 12px 16px, min-height ~89, hover bg (D `rgb(8,8,8)`-ish; reuse clone `UserCell`).
  - 40px avatar; name 15px/700 + badges; handle 15px muted; optional "Follows you" badge; bio 15px (entities).
  - Button on the right: "Follow" (inverted, 32px tall, 77.8 wide) or "Following" (outline, hover Unfollow) + the confirmation dialog.
- **Empty states (exact):**
  - Own Followers: **"Looking for followers?"** / **"When someone follows this account, they’ll show up here. Posting and interacting with others helps boost followers."**
  - Own Verified Followers: **"You don’t have any verified followers yet"** / **"When a verified account follows you, you’ll see them here."**
  - Own followers_you_follow: **"You don’t have any followers yet"** / **"When someone follows you, you’ll see them here."**
  - Other followers_you_follow with none: **"@XDevelopers doesn’t have any followers you know yet"** / **"When someone you know follows them, they’ll be listed here."**
  - Following (own, 0): not observed. Expected "Be in the know" / "Following accounts is an easy way to curate your timeline…".
- **Note:** `/XDevelopers/followers` (another user's full followers list) rendered **no cells** for this account (X now restricts it). Verified Followers and Following work.
- **Data model:** `getFollowers(handle, {verifiedOnly, knownOnly})`, `getFollowing(handle)`, paginated `Page<UserListItem>` where `UserListItem = User & { followsViewer: boolean }`.
- **Routing:** `/[handle]/(follows)/layout.tsx` with the header and tabs, plus 4 child pages.
- **Screenshots:** `ff-PedroLo01746179-following.png`, `ff-PedroLo01746179-followers.png`, `ff-PedroLo01746179-verified_followers.png`, `ff-PedroLo01746179-followers_you_follow.png`, `ff-followers-you-know.png`, `ff-XDevelopers-following.png`, `ff-XDevelopers-verified_followers.png`, `ff-XDevelopers-followers.png` (empty), `ff-XDevelopers-followers_you_follow.png`

### F10. Not-found / suspended / protected profile states

- **Clone status:** MISSING (`notFound()` → default Next 404). **Priority:** P0 (not found) · P1 (protected) · P2 (suspended) · **Complexity:** S
- **Not found** `/thisuserdoesnotexist9x9x9`:
  - Header shows only back + **"Profile"** (no subtitle). There is no banner/avatar placeholder in the current build; the empty state is directly below the header.
  - Title **"This account doesn’t exist"** (31px/800/36px), body **"Try searching for another."** (15px muted).
  - Block 360 wide, starts at x column+119, y 125 (padding 32px 40px). The right panel still shows trends and Who to follow.
- **Suspended** `/elonjet`: same layout, header "Profile", title **"Account suspended"**, body **"X suspends accounts which violate the X Rules"** ("X Rules" is a link).
- **Protected** (other, not following):
  - The full header renders: banner, avatar, More and Follow buttons, no Message.
  - Name is followed by a 20px **lock icon** (`data-testid="icon-lock"`, `aria-label="Protected account"`).
  - Join date and counts are shown. There are **no tabs**.
  - Empty state **"These posts are protected"** / **"Only approved followers can see @{handle}’s posts. To request access, click Follow. Learn more"**.
  - Follow on a protected account sends a request (button becomes "Pending"; not executed).
- **Screenshots:** `state-thisuserdoesnotexist9x9x9.png`, `state-elonjet.png`, `other-protected.png`

### F11. Lists home (`/:handle/lists`)

- **Level:** L1 (More → Lists) · **Clone status:** MISSING · **Priority:** P1 · **Complexity:** M
- **App bar** (53px, sticky, no title text):
  - Back (36).
  - **"Search Lists"** input 408×40, **outline pill**: radius 9999, transparent bg, 1px border (L `#CFD9DE` / D `#536471`, per screenshots), search icon 18.75 at left, 14px/16px text, padding 0 16 0 4. Placeholder "Search Lists". Focus: 2px accent border.
  - **"Create a new List"** icon button (36, list-plus icon) → `/i/lists/create`.
  - **"More"** (36, dots) → menu with one item, **"Lists you’re on"** (list icon) → `/:handle/lists/memberships`.
- **Sections:**
  1. **"Discover new Lists"** header: `h2` 20px/800, at 16px left, height 48 (padding 12 16).
     - 3 suggestion rows, then a **"Show more"** link (accent 15px, padding 16, height 52) → `/i/lists/suggested`.
     - Then a 1px divider (9px spacer + border).
  2. **"Your Lists"** header, then the user's lists (own + followed, pinned first).
     - Empty: **"You haven't created or followed any Lists. When you do, they'll show up here."** (15px/20px muted, centred, padding 32, `data-testid="inlinePrompt"`).
- **List row** (`data-testid="listCell"`, `role="link"`): 598×72, padding 12 16, cursor pointer, hover bg L `rgba(0,0,0,0.03)` (D `rgba(255,255,255,0.03)`).
  - **Thumbnail** 48×48, **radius 12**, `data-testid="cellThumbnail"` (list banner, or a grey placeholder tile with a list icon).
  - Text column at x+64:
    - Line 1: **name** 15px/700/20px (+ 18.75px **lock icon** `aria-label="Private List"` when private) + `" · 85 members"` 13px muted. "· N members" only on discover rows.
    - Line 2 on discover rows: a facepile of three 24px avatars overlapping (step 12px) + `"2.4K followers including @martinredrado"` 13px/16px muted.
    - Line 2 on own lists: 16px owner avatar + **owner name** 13px/700 + `@handle` 13px muted.
  - **Right side:**
    - Discover rows: a **Follow** circular button 32×32 (inverted, plus icon 18.75, `aria-label="Follow"`, hidden text "Click to Follow").
    - Your Lists rows: a **"Pin List"** button (36, pushpin outline icon, accent-coloured `rgb(29,155,240)`). Pinning adds the list as a tab on Home (agent 01 covers the home side). The pinned state uses a filled pin, `aria-label="Unpin List"` (not observed).
- **Search** `/i/lists/search?q=tech` (on Enter; no typeahead observed): header "List search", results use the same list-row format (name · N members / followers including …).
- **Suggested** `/i/lists/suggested`: title "Suggested Lists".
  - Hero copy **"Choose your Lists"** / **"When you follow a List, you'll be able to quickly keep up with the experts on what you care about most."**
  - Then "Discover new Lists" rows with an infinite list.
- **Other user's lists** `/:handle/lists` (e.g. `/Tesla/lists`): header "Lists / @Tesla", section "Your Lists" (sic) with their lists (e.g. "ev-news · 10 members / 175 followers including @BeefEnt").
- **Data model:** `List`, `ListMembership` (see Data model section). Viewer state: `followedByViewer`, `pinnedByViewer`.
- **Routing:** `/[handle]/lists` (page), `/i/lists/suggested`, `/i/lists/search`. These are `/i/...` routes, which today collide with nothing in the clone.
- **Screenshots:** `lists-page.png`, `lists-page-with-own-list.png`, `lists-more-menu.png`, `lists-search-results.png`, `lists-suggested.png`, `state-Tesla-lists.png`
- **Icons:** `ListPlusIcon`, `ListIcon`, `PinIcon`/`PinFilledIcon`, `LockIcon` (appendix).

### F12. Create List modal (`/i/lists/create`, 2 steps)

- **Level:** L2 · **Clone status:** MISSING · **Priority:** P1 · **Complexity:** M
- **Container:** the same 600×650 modal as Edit profile (radius 16, 150ms scale/fade, `mask` scrim). Hard load renders Home behind it.
- **Step 1: "Create a new List"**
  - Header: Close X · title "Create a new List" · **Next** (inverted pill 32px, `aria-disabled` + opacity .5 until Name is non-empty).
  - **Cover photo** area: 3:1 banner (598×199) with an **"Add banner photo"** camera button (44, `rgba(15,20,25,.75)`). Once a cover exists, a **"Remove photo"** X button appears beside it.
  - Fields (floating-label, same as Edit profile): **Name** (`name`, **maxLength 25**, counter `"7 / 25"` on focus) and **Description** (`description` textarea, **maxLength 100**).
  - **"Make private"** row: label 15px, sub-text **"When you make a List private, only you can see it."** (13px muted), and a **checkbox** on the right: a 20×20 visual box, checked = accent fill with a white check icon (`M9.64 18.952…`), plus a 2px accent focus halo (`rgba(29,155,240,0.1)` 36px circle on hover/focus).
- **Next** → the list is created **immediately** (POST) and the URL becomes `/i/lists/{id}/members/suggested`.
- **Step 2: "Add to your List"**
  - Header: Close · "Add to your List" · **Done** (pill 32px).
  - Tabs **"Members (0)"** (`/i/lists/{id}/members`) / **"Suggested"** (`/members/suggested`, default), 53px with the sliding-indicator tab style.
  - Under Suggested: a **"Search people"** input (pill 44px, radius 9999, accent 2px border when focused).
  - Below it, a "List suggestions" section header and user cells (`UserCell`, 600 wide, padding 12 16). Each cell has an **"Add"** pill (61.5×32, inverted); once added it becomes **"Remove"** (outline; not observed).
  - Suggestions are seeded from the list name: "zz test" produced @zztestco, @zztest0001…
  - Typing filters to search results (e.g. "XDevelopers" → Developers, X Developers Web Studio, …).
  - **Members tab empty:** **"This List is lonely"** / **"People added to this List will show up here."**
- **Done** → navigates to the list page `/i/lists/{id}`.
- **Safety:** created private list "zz test" (id 2107204019311792426), added no members, then deleted it (see F14). The deletion was verified: "Your Lists" is empty again and the URL 404s.
- **Screenshots:** `lists-create-step1.png`, `lists-create-name-focused.png`, `lists-create-step1-filled.png`, `lists-create-step2.png`, `lists-create-step2-members.png`, `lists-create-step2-search.png`

### F13. List page (`/i/lists/:id`)

- **Level:** L2 · **Clone status:** MISSING · **Priority:** P1 · **Complexity:** M
- **App bar:** Back · title = list name 20px/700 (+ lock icon if private) · subtitle `@ownerHandle` 13px muted. Right side: **Share** (`aria-label="Share Menu"`, share icon) and **More** (dots).
- **Header block** (centred):
  - **Banner** 598×199.3 (3:1). The default cover for lists without one is X's blue illustration (list icons + X logos on `#1D4F91`-ish blue). Recommend a static asset or a flat accent-dark fill.
  - Then, centred:
    - **List name** 20px/700/24px + 20px lock icon (private).
    - (Description 15px/20px, centred, 574 wide, if present: e.g. "Journalists and news outlets that report on Tesla and electric vehicles.")
    - Owner row: 20px avatar + **owner name** 15px/700 + `@handle` 15px muted (link to profile).
    - Counts row: **"0 Members"** → `/i/lists/:id/members` and **"0 Followers"** → `/i/lists/:id/followers` (number 15px/700, label muted; 20px gap).
    - Action button 36px: **"Edit List"** (outline, 91.7 wide → `/i/lists/:id/info`) for the owner, or **"Follow"** (inverted, 77.8×32) / "Following" for others.
  - 1px divider under the block.
- **Timeline:** the posts of members (regular tweet cards, agent 02).
  - Empty: **"Waiting for posts"** (31px/800/36px) / **"Posts from people in this List will show up here."** (15px muted), width 336, centred.
- **More menu (own list):** **"Don’t show these posts in For you"** with sub-line **"Top posts from this List will no longer show up in your For you timeline."** (circle-x icon).
- **More menu (someone else's list):** **"Report List"** and **"Block @Tesla"** with sub-line "This prevents @Tesla from including you in any of their Lists, including this one."
- **Share menu:** **Post this** · **Send via Chat** · **Copy link to List** · **Share List**.
- **Members / Followers** (`/i/lists/:id/members`, `/followers`): **modals** (600×650) titled **"List members"** / **"List followers"**, with user cells + Follow buttons.
  - Empty: **"This List is lonely"** / **"People added to this List will show up here."** (members), or **"People who follow this List will show up here."** (followers).
- **Deleted / nonexistent list:** the generic 404, **"Hmm...this page doesn’t exist. Try searching for something else."** + accent **"Search"** pill. It is full-width with no right panel.
- **Routing:** `/i/lists/[id]` page; `@modal/(.)i/lists/[id]/members|followers|info`.
- **Screenshots:** `list-page-own.png`, `list-page-foreign.png`, `list-more-menu.png`, `list-members.png`, `list-followers.png`, `list-members-foreign.png`, `list-deleted-state.png`

### F14. Edit List modal (`/i/lists/:id/info`) + delete

- **Level:** L2 · **Priority:** P1 · **Complexity:** S (reuses the step-1 form)
- Header "Edit List" · **Done**.
- Same cover (camera + **"Remove photo"** X buttons side by side, 44px each, 20px apart), the Name (25) / Description (100) fields, and the "Make private" checkbox.
- Then rows (600 wide):
  - **"Manage members"** (48px, chevron) → `/i/lists/:id/members`
  - **"Delete List"** (52px, padding 16, **danger red** text, centred)
- **Delete:** confirmation sheet (320 wide) **"Delete List?"** / **"This can’t be undone and you’ll lose your List."** / **Delete** (bg `rgb(244,33,46)`, white) / **Cancel** (outline). On confirm, X navigates to `/:handle/lists/` and the list is gone.
- **Screenshots:** `list-edit-modal.png`, `list-delete-confirm.png`

### F15. Communities home (`/:handle/communities` → `/:handle/communities/explore`)

- **Level:** L1 (More → Communities) · **Clone status:** MISSING · **Suggested priority:** **P2**. Read-only browse and one community page give the clone a convincing L2. Joining, posting to communities, moderation and creation are **OUT**: they need membership, roles, rules and per-community feeds, which is a lot of backend for little portfolio value. · **Complexity:** M (read-only)
- `/PedroLo01746179/communities` **redirects to `/:handle/communities/explore`**.
- **App bar:** Back · "Communities" (20px/700) · a **Search** icon button (36) on the right → `/i/communities/suggested`.
- **Category chips row** (sticky under the header, horizontally scrollable `ScrollSnap-List` with 36px prev/next arrow buttons, bg `rgba(15,20,25,0.75)`, that appear on overflow):
  - 18 chips: **Sports, Technology, Art, Entertainment, Gaming, Politics, Business, Culture, Science, Food, Animals, Education, Fashion & Beauty, Health & Fitness, News, Cryptocurrency, Travel, X Official**.
  - Chip: `<button>` 30px tall, padding 0 16px, 15px/700, outline pill (radius 9999, 1px border D `#536471` / L `#CFD9DE`), 6px gap. Row y 62–98, inset 11px.
  - **Selected:** bg accent-dark `rgb(26,140,216)` (D) with white text. A 32px circular outline **back/clear** button appears first, and the row is **replaced by that category's sub-categories** (Technology → "Artificial Intelligence", "Software", …). The feed filters to that category. The URL doesn't change.
- **Feed:** posts from communities. Each tweet has a social-context line with the **community name** (13px/700 muted, people icon) linking to `/i/communities/:id`. Tweet cards are standard (agent 02).
- A hidden "My Communities" tab exists (accessibility label only) because the account has joined none.
- **First-visit dialog "Welcome to Communities"** (`role="dialog"`, no `aria-modal`, ~600×625, radius 16, page bg, `mask` scrim; close X top-left):
  - Title 31px/800 **"Welcome to Communities"**, sub **"Communities are moderated discussion groups where people on X can connect and share."**
  - 3 rows with 24px icons:
    - **"Meet others with your interests"** / "Join Communities to connect with people who share your interests." (sparkle)
    - **"Post directly to a Community"** / "Your posts are shared with Community members and your followers." (people)
    - **"Get backup when you need it"** / "Admins and moderators help manage Communities and keep conversations on track." (heart)
  - Inverted full-width (400) 52px button **"Check it out"**, which dismisses it permanently.
- **Screenshots:** `communities-home.png` (with welcome dialog), `communities-welcome.png`, `communities-home-feed.png`, `communities-category-technology.png`

### F16. Explore Communities (`/i/communities/suggested`)

- **Level:** L2 · **Priority:** P2 · **Complexity:** S
- **App bar:** Back + a **"Search for Communities and Posts"** pill input (478×40, same style as "Search Lists").
- `h2` **"Discover Communities"** (20px/800), then the same 18 category chips.
- **Community cell** (598×120, padding 12 16, hover bg `rgba(255,255,255,0.03)` D):
  - **96×96 image, radius 12**.
  - Text column x+108: **name** 15px/700/20px, **"668K Members"** (number 15px/700 + "Members" muted), **category** 15px muted (e.g. "Design", "X Official", "Technology").
  - A **facepile** of 5 × 32px avatars overlapping by 12px (step 20px) with a 2px page-bg ring.
  - The whole cell links to `/i/communities/:id`.
- **Screenshot:** `communities-explore.png`

### F17. Community page (`/i/communities/:id`)

- **Level:** L2 · **Priority:** P2 · **Complexity:** M
- **App bar:** Back · community name (20px/700) · **Search** (→ `/i/communities/:id/search`) · **More** (dots).
  - More menu: **"Report Community"** (flag) → help link, and **"About Communities"** (question-circle) → `https://help.x.com/using-twitter/communities`.
- **Banner:** **598×239.2 (5:2, not 3:1)**.
- **Info block** (padding 12px 16px, total ~196 tall):
  - Name 31px/700/36px.
  - Category pill (24px tall, padding 0 12, outline 1px `#536471`, 15px/700, e.g. "Design").
  - Description 15px/20px (2 lines).
  - Bottom row: **facepile** (`data-testid="community-facepile"`, 5 × 32px, radius 4 wrapper) + **"668K Members"** link → `/i/communities/:id/members`. On the right are three 36px outline circle buttons:
    - **"Pin Community"** (4-point sparkle icon)
    - **"Share Community"** (share icon)
    - **"Join"** (`aria-label="Join The Design Sphere"`, outline pill 63×36, 15px/700). Not clicked.
- **Tabs** (53px, sliding indicator): **Top** (`/i/communities/:id`) · **Latest** · **Media** (same URL, client-side tab state) · **About** (`/i/communities/:id/about`).
- **Top tab extras:**
  - A **hashtag row**: horizontally scrollable accent links 15px/500, padding 0 8 (e.g. `#DareToShare25`, `#UIUX`…), linking to `/i/communities/:id/hashtag/:tag`.
  - Then a **Spaces carousel**: cards ~156×96 image + 2-line title, "Recorded 06/14" overlay.
  - Then the feed. Some posts carry the social context "Post from Community List".
- **About tab:**
  - **"Community Info"** with icon rows:
    - "Only members can post."
    - "All Communities are publicly visible."
    - "Anyone can join this Community."
    - "Created October 28, 2021 by @retromauro"
  - **"Rules"** with sub **"These are set and enforced by Community admins and are in addition to X’s rules."** and a numbered list (number in a 24px circle; title 15px/700; description muted), e.g.:
    1. **Be Respectful** – We encourage constructive criticism delivered in a kind and productive way.
    2. **Keep Content On-Topic**
    3. **Attribute Creative Work**
    4. **Include Design Context**
    5. **No Promotion of NFTs or Crypto Projects**
  - Then "See more", then **"Moderators"** (user cells with Follow + "Show more") and **"Members"** cells.
- **Members** `/i/communities/:id/members`:
  - Header "Members".
  - Tabs **All** / **Moderators** (`/moderators`).
  - User cells with a **role badge** after the name: **"Admin"**, **"Mod"**, **"Member"** (13px, pill bg `#202327` D).
- **Create a Community:** `/i/communities/create` **redirected to Home** for this non-Premium account, and no "Create" entry is visible in the UI. **OUT.**
- **Data model:** see the `Community` type below.
- **Screenshots:** `community-page.png`, `community-more-menu.png`, `community-about.png`, `community-about-rules.png`, `community-members.png`

### F18. Settings shell (`/settings`, two-pane)

- **Level:** L1 (More → Settings and privacy) · **Clone status:** MISSING · **Priority:** P1 (shell + Display) / P2 (other category pages as static link lists) · **Complexity:** M
- **`/settings` redirects to `/settings/account`** at desktop widths (the first category is auto-selected).
- **Layout:**
  - The **right sidebar column disappears.**
  - Two columns follow the left nav:
    - **Section navigation** `<section aria-label="Section navigation">`: **450px**, 1px side borders.
    - **Section details** `<section aria-label="Section details">`: **600px**, right border 1px.
  - Total main 1050.
- **Nav column:**
  - Header "Settings" 20px/700 (53px bar).
  - **"Search Settings"** pill input 400×40 at x+38 (radius 9999, 1px border `#536471` D (focused: 2px accent), search icon, 14px; while typing a clear ⓧ button and a back arrow appear).
  - Category rows: `<a role="tab">` 448×48, padding 12 16, 15px/400 title + 18.75px chevron-right (muted) at the right.
    - Hover bg D `rgb(22,24,28)`.
    - **Selected:** bg D `rgb(22,24,28)` (`#16181C`) + a **2px accent bar on the right edge** (inner border-right), `aria-selected="true"`.
- **Categories (exact order, labels, targets):**
  | Label | href |
  |---|---|
  | Your account | `/settings/account` |
  | Monetization | `/settings/monetization` → redirects to `/i/jf/creators/studio` (Creator Studio) |
  | Premium | `/i/premium_sign_up?referring_page=settings` |
  | Security and account access | `/settings/security_and_account_access` |
  | Privacy and safety | `/settings/privacy_and_safety` |
  | Notifications | `/settings/notifications` |
  | Accessibility, display, and languages | `/settings/accessibility_display_and_languages` |
  | Additional resources | `/settings/about` |
  | Help Center | `https://support.x.com/` (external: **arrow-up-right icon** instead of chevron, `M8 6h10v10h-2V9.41L5.957 19.46l-1.414-1.42L14.586 8H8V6z`) |

  (There is no "Creator Subscriptions" item in this build.)
- **Search Settings:** typing filters **inline in the nav column**. Results are breadcrumb-like rows where the parent category is bold and the matching sub-page is regular. For "dis": **Privacy and safety** › Discoverability and contacts, **Accessibility, display, and languages** › Display. The URL does not change. Screenshot `settings-search.png`.
- **Detail column page pattern** (every category page):
  - 53px header: `h2` 20px/700 (+ back arrow at level 3, e.g. Display).
  - Description 13px/16px muted, padding 12 16.
  - Rows `<a role="tab">` 599×~72, padding 12 16. Each has an 18.75px muted icon at x+31, a title 15px/20px foreground and a description 13px/16px muted at x+80, and a chevron right. Hover bg `rgb(22,24,28)` D.
  - Section sub-headers (e.g. "Your X activity") are 20px/800.
- **Narrow widths:** at <1000px the nav and detail become a single column (not measured; shell agent).
- **Screenshots:** `settings-root.png` (= account), `settings-search.png`

### F19. Settings category pages (L2 rows; L3 = name + URL only)

- **Your account** (`/settings/account`), "See information about your account, download an archive of your data, or learn about your account deactivation options":
  - Account information — "See your account information like your phone number and email address." → `/settings/your_twitter_data/account` (person icon)
  - Change your password — "Change your password at any time." → `/settings/password` (key)
  - Download an archive of your data — "Get insights into the type of information stored for your account." → `/settings/download_your_data` (download)
  - Deactivate your account — "Find out how you can deactivate your account." → `/settings/deactivate` (broken heart)
- **Security and account access** (`/settings/security_and_account_access`), "Manage your account’s security and keep track of your account’s usage including apps that you have connected to your account.":
  - Security — "Manage your account’s security." → `/settings/security`
  - Apps and sessions — "See information about when you logged into your account and the apps you connected to your account." → `/settings/apps_and_sessions`
  - Connected accounts — "Manage Google or Apple accounts connected to X to log in." → `/settings/connected_accounts`
  - Delegate — "Manage your shared accounts." → `/settings/delegate`
- **Privacy and safety** (`/settings/privacy_and_safety`), "Manage what information you see and share on X.":
  - Sub-header **"Your X activity"**:
    - Audience, media and tagging — "Manage what information you allow other people on X to see." → `/settings/audience_and_tagging`
    - Your posts — "Manage the information associated with your posts." → `/settings/your_tweets`
    - Content you see — "Decide what you see on X based on your preferences like interests" → `/settings/content_you_see`
    - Mute and block — "Manage the accounts, words, and notifications that you’ve muted or blocked." → `/settings/mute_and_block`
    - Chat — "Manage who can message you directly." → `/settings/direct_messages`
    - Spaces — "Manage who can see your Spaces listening activity" → `/settings/spaces`
    - Discoverability and contacts — "Control your discoverability settings and manage contacts you’ve imported." → `/settings/contacts`
    - About your account — "Manage the location associated with your account" → `/settings/about_your_account`
  - Sub-header **"Data sharing and personalization"**:
    - Ads preferences — "Manage your ads experience on X." → `/settings/ads_preferences`
    - Inferred identity — "Allow X to personalize your experience with your inferred activity, e.g. activity on devices you haven’t used to log in to X." → `/settings/off_twitter_activity`
    - Data sharing with business partners — "Allow sharing of additional information with X’s business partners." → `/settings/data_sharing_with_business_partners`
    - Location information — "Manage the location information X uses to personalize your experience." → `/settings/location_information`
    - Grok & Third-party Collaborators — "Allow your public data as well as your interactions, inputs, and results with Grok and xAI to be used for training and fine-tuning" → `/settings/grok_settings`
  - Sub-header **"Learn more about privacy on X"** (external rows with arrow-up-right):
    - Privacy center → `https://privacy.x.com/`
    - Privacy policy → `https://x.com/en/privacy`
    - Contact us → `https://help.x.com/forms/privacy`
- **Notifications** (`/settings/notifications`), "Select the kinds of notifications you get about your activities, interests, and recommendations.":
  - Filters — "Choose the notifications you’d like to see — and those you don’t." → `/settings/notifications/filters`
  - Preferences — "Select your preferences by notification type." → `/settings/notifications/preferences`
- **Accessibility, display and languages** (`/settings/accessibility_display_and_languages`), "Manage how X content is displayed to you.":
  - Accessibility — "Manage aspects of your X experience such as limiting color contrast and motion." → `/settings/accessibility`
  - **Display** — "Manage your font size, color, and background. These settings affect all the X accounts on this browser." → `/settings/display` (F20)
  - Languages — "Manage which languages are used to personalize your X experience." → `/settings/languages`
  - Data usage — "Limit how X uses some of your network data on this device." → `/settings/data`
  - Keyboard shortcuts → `/i/keyboard_shortcuts` (modal)
- **Additional resources** (`/settings/about`), "Check out other places for helpful information to learn more about X products and services.":
  - **Release notes** → `https://x.com/i/release_notes`
  - **Legal:** Ads & Business, Cookies, Privacy, Terms
  - **Miscellaneous:** About, Accessibility, Careers, Developers, Get App, Grok, Help, Imagine, News
  - All of these are external links with arrow-up-right icons.
- **Clone recommendation:** render these as static link lists (data-driven array). Level-3 pages are a generic "This setting isn’t available in this demo" detail (OUT), except Display (F20).
- **Screenshots:** `settings-security_and_account_access.png`, `settings-privacy_and_safety.png`, `settings-notifications.png`, `settings-accessibility_display_and_languages.png`, `settings-about.png`

### F20. Display settings (`/settings/display`) — theming

> **Superseded by PLAN.md (2026-10-05):** the clone is dark-only; this page and multi-theme support are **not built**. Kept for reference only.

- **Level:** L2/L3 (reached from Accessibility, display and languages; it is the one level-3 page worth building) · **Clone status:** MISSING · **Priority:** **P1** · **Complexity:** M (requires CSS-variable theming in the clone)
- **Header:** back arrow (→ `/settings/accessibility_display_and_languages`) + "Display" 20px/700. Description 13px/16px muted: **"Manage your font size, color, and background. These settings affect all the X accounts on this browser."**
- **Preview post:**
  - A static, non-interactive tweet by the viewer: avatar 40, "Loren_pepe12 @PedroLo01746179 · 10m".
  - Text: **"At the heart of X are short messages called posts — just like this one — which can include photos, videos, links, text, hashtags, and mentions like @X."** (`@X` in accent).
  - 1px bottom divider.
  - It updates live with font size, accent and background.
- **Font size:** section title 20px/800 "Font size". Row: small "Aa" (13px) · slider · large "Aa" (20px).
  - Slider `role="slider" aria-label="Text size"`, `aria-valuemin=0 max=4`, 5 discrete stops 117.6px apart.
  - Track 486×4, radius 8: filled part accent, rest accent at ~50% (`rgb(142,205,248)`).
  - Stop dots 12px (filled up to the current value), thumb 16px accent with a 32px hit area.
  - Clicking on the track jumps to a stop.
  - | value | `aria-valuetext` | root font-size | post text |
    |---|---|---|---|
    | 0 | Extra small | 14px | 14/18 |
    | 1 | Small | 14px* | 14/19* |
    | 2 | **Default** | **15px** | **15/20** |
    | 3 | Large | 17px | 17/22 |
    | 4 | Extra large | 18px | 18/24 |

    \*Small was sampled 900ms after the click; it may really be 14.x px. X scales everything through the root `font-size`, so the clone can do the same with `html { font-size }` + rem units, or drop this control (P2).
- **Color:** title "Color". 6 radio swatches, 45×45 hit area, ~40px visual circles, evenly spaced (~100px apart), `name="COLOR_PICKER_1_LABEL"`, `aria-label` = colour name. The selected one shows a white check icon (`M9.64 18.952…`).
  - | label | value (X palette) |
    |---|---|
    | Blue (default) | `#1D9BF0` rgb(29,155,240) |
    | Yellow | `#FFD400` |
    | Pink | `#F91880` |
    | Purple | `#7856FF` |
    | Orange | `#FF7A00` |
    | Green | `#00BA7C` |

  - The accent drives: links, the active tab indicator, the Post button (light mode), focus rings, toggles, sliders and the selected background card border.
- **Background:** title "Background". **Only two cards in this build: "Default" and "Lights out"** ("Dim" is gone).
  - Cards 278×64, radius 4, padding 0 20, 15px/700 centred label.
  - **Default:** bg `#FFFFFF`, text `#0F1419`, border 1px `#333639`.
  - **Lights out:** bg `#000000`, text `#E7E9EA`.
  - **Selected:** border **2px accent**. The radio circle is 20px: unselected border 2px `rgb(185,202,211)`, selected accent fill with a white check.
- **"Use system setting"** toggle row: label 15px; sub **"Your theme will automatically switch based on your device settings"** (13px muted).
  - Switch 40×20: track 40×14 radius 10, **on = `rgb(107,201,251)`** (light accent); thumb 20px circle **accent** `rgb(29,155,240)` on the right. Off: thumb left, track grey (not observed).
  - **This toggle was ON for the test account, which explains the light/dark flipping seen during research**: the theme followed the headless browser's `prefers-color-scheme`.
- **Persistence:** changes apply instantly (no Save) and are stored per browser. The font size was changed to sample the stops and **reverted to Default (verified by reload: `aria-valuetext="Default"`, root 15px)**. Colour and background were **not** clicked.
- **Clone implementation notes:**
  - Move `globals.css` colours to `[data-theme="light"|"dark"]` + `[data-accent="blue"|…]` CSS-variable blocks.
  - Store `DisplayPrefs` in a cookie (so SSR renders the right theme with no flash) and add a `prefers-color-scheme` media query when `useSystem`.
  - The clone is dark-only today; the light values in the tokens table at the top of this file are the complete light theme for the main surfaces.
- **Screenshots:** `settings-display.png`, `settings-display-final.png`

---

## Cross-cutting findings (shared primitives)

1. **`Modal` (generic, 600×650):** used by Edit profile, Create/Edit List, List members/followers, Add to your List, and the avatar/banner viewer variant.
   - Centred, radius 16, `min-height 400`, `max-height 90vh`, scrim `mask` (D `rgba(91,112,131,0.4)`).
   - Sticky 53px header: close X (36, x+8) + `h2` 20px/700 at x+72 + optional right action pill (32px inverted, `aria-disabled` → opacity .5).
   - Motion: **enter 150ms, opacity 0→1 + scale .92→1, ease-out**; exit fast/instant.
   - Intercepted route with a Home-behind fallback on hard load.
   - Lift `features/auth/utils/trap-focus.ts`, `use-escape-to-close.ts` and `use-modal-dialog.ts` into `components/ui`/`hooks`.
2. **`ConfirmSheet` (320 wide):** used by Unfollow, Discard changes, Edit date of birth, Delete List.
   - Padding 32, radius 16, title 20px/700/24px, body 15px/20px muted, then 2 stacked 256×44 pills with a 12px gap.
   - Confirm variants: inverted (Unfollow, Edit) or **danger** `#F4212E` with white text (Discard, Delete). Cancel is outline.
   - `data-testid="confirmationSheetDialog|Confirm|Cancel"`.
3. **`FloatingLabelField`** (input/textarea/select): border 1px `border-strong`, radius 4. The label shrinks from 17px to 13px when focused or filled. Focus = accent border + 1px accent box-shadow, plus a top-right counter `n / max` when focused. Error = danger border + 13px message below. The select variant has a chevron at the right (the clone's auth `DateSelect` is close).
4. **`Tabs` with sliding indicator** (profile, follow lists, list modal, community): already the clone's `ui/tab.tsx` style (4px accent, min 56px, label width). Needs:
   - an optional **dropdown tab** (Posts ▾ / Media ▾ with `aria-haspopup="menu"` → `DropdownMenu` with check items and a submenu)
   - horizontal scroll-snap with prev/next arrows when tabs overflow
5. **`DropdownMenu` additions:** item with **sub-label** (two lines: 15px/700 title + 13px muted description; used in List "…" and Block @Tesla), **checked item** (accent check on the right), **submenu item** (chevron right, opens a second menu). Measured menu: radius 12, item h 44, D bg `rgb(20,20,20)`, shadow `rgba(0,0,0,.5) 0 4px 12px, rgba(0,0,0,.35) 0 0 2px`.
6. **`ToggleSwitch`** (40×20: track 14px tall radius 10 light-accent, thumb 20px accent) and **`Checkbox`** (20px, accent fill + white check, 36px hover halo `accent/10`).
7. **`PillSearchInput`** (Search Lists / Search Communities / Search Settings / Search people): 40–44px, radius 9999, **transparent bg with 1px border** (L `#CFD9DE` / D `#536471`, from screenshots), 18.75 search icon, 14px text. Focus = 2px accent border + clear ⓧ button (white circle with a black x) + optional back arrow to its left (Settings). The clone's right-panel `SearchBox` uses the same outline style in this build (see agent 01 for the right panel).
8. **`EmptyState`:** title 31px/800/36px, body 15px/20px muted, optional CTA pill. Block **max-width 360** (336 in lists), centred, padding 32 40. `data-testid="emptyState"`.
9. **`FullscreenMediaViewer`** (avatar/banner): scrim `rgba(0,0,0,0.9)`, close 36px `rgba(0,0,0,0.75)` at (12,12). Shared with agent 02's photo viewer.
10. **`Facepile`:** overlapping avatars with a page-bg ring. Sizes: 22 (followed-by, step 12), 24 (lists, step 12), 32 (communities, step 20).
11. **Counts link** (`<a><b>n</b> label</a>`, 14–15px, number 700 foreground + muted label, hover underline): profile, list, community.
12. **Banner aspect ratios:** profile 3:1, list 3:1, **community 5:2**.
13. **Theme tokens:** see the table at the top; Display settings (F20) need the clone to become multi-theme.

---

## Data model proposal

```ts
// types/user.ts
export type VerifiedType = "blue" | "business" | "government" | null; // blue check, gold (orgs), grey
export type UserSummary = {
  id: string;
  handle: string;
  displayName: string;
  avatarUrl: string;
  verified: VerifiedType;                 // drives the 20px badge colour
  protected: boolean;                     // lock icon after name
  affiliate?: { handle: string; avatarUrl: string } | null; // 15px square badge (e.g. @X)
};

export type User = UserSummary & {
  bio: string;
  bannerUrl: string | null;
  location: string | null;                // ≤30, "127.0.0.1"
  website: { url: string; display: string } | null; // ≤100, display "docs.x.com"
  birthDate: { year: number; month: number; day: number } | null;
  birthDateVisibility: { monthDay: Visibility; year: Visibility };
  professionalCategory: string | null;    // "Community", "Software Company"…
  joinedAt: string;                       // ISO
  verifiedSince: string | null;           // ISO, shown on /about
  accountBasedIn: string | null;          // "Argentina" (About page)
  followingCount: number;
  followersCount: number;
  postsCount: number;
  mediaCount: number;                     // "831 photos & videos"
  pinnedTweetId: string | null;
  isCreator: boolean;                     // shows Subscribe button + Subs tab
  hasArticles: boolean;                   // shows Articles tab
  // viewer-relative
  followedByViewer: boolean;
  followsViewer: boolean;                 // "Follows you" badge
  notificationsOn: boolean;               // bell toggle (only when followedByViewer)
  followedByPreview: { users: UserSummary[]; total: number }; // "Followed by A, B and N others you follow"
};
export type Visibility = "public" | "followers" | "following" | "mutual" | "self";
```

Mock example (viewer): `{ handle: "Elpepodev", location: null, website: null, birthDate: { year: 2007, month: 8, day: 23 }, birthDateVisibility: { monthDay: "self", year: "self" }, verified: null, professionalCategory: null, pinnedTweetId: null }`.

```ts
// types/list.ts
export type List = {
  id: string;                 // "2107204019311792426"
  name: string;               // ≤25
  description: string;        // ≤100
  bannerUrl: string | null;   // null → default X list illustration
  private: boolean;           // lock icon + "Private List"
  owner: UserSummary;
  memberCount: number;
  followerCount: number;
  createdAt: string;
  // viewer-relative
  followedByViewer: boolean;
  pinnedByViewer: boolean;    // shows as a Home tab
  hiddenFromForYou: boolean;  // "Don’t show these posts in For you"
  followersPreview?: UserSummary[]; // facepile on discover rows ("2.4K followers including @x")
};
export type ListMember = { listId: string; userId: string; addedAt: string };
// actions: createList, updateList, deleteList, addListMember, removeListMember,
//          toggleListFollow, toggleListPin
```

```ts
// types/community.ts
export type CommunityRole = "admin" | "moderator" | "member";
export type Community = {
  id: string;
  name: string;
  description: string;
  bannerUrl: string;          // 5:2
  category: string;           // "Design"
  topic: CommunityTopic;      // one of the 18 chip categories
  memberCount: number;
  membersPreview: UserSummary[]; // 5 avatars
  hashtags: string[];
  rules: { title: string; description: string }[];
  joinPolicy: "open" | "request";   // "Anyone can join this Community."
  postPolicy: "members";             // "Only members can post."
  createdAt: string;
  createdBy: UserSummary;
  viewerRole: CommunityRole | null;  // null = not joined
  pinnedByViewer: boolean;
};
export type CommunityTopic = "Sports" | "Technology" | "Art" | "Entertainment" | "Gaming" | "Politics"
  | "Business" | "Culture" | "Science" | "Food" | "Animals" | "Education" | "Fashion & Beauty"
  | "Health & Fitness" | "News" | "Cryptocurrency" | "Travel" | "X Official";
// Tweet gets: community?: { id: string; name: string } | null  (social-context line)
```

```ts
// types/settings.ts
export type DisplayPrefs = {
  fontSize: 0 | 1 | 2 | 3 | 4;            // 2 = Default (15px root)
  accent: "blue" | "yellow" | "pink" | "purple" | "orange" | "green";
  background: "light" | "dark";           // "Default" | "Lights out"
  useSystem: boolean;                     // follow prefers-color-scheme
};
export const DEFAULT_DISPLAY: DisplayPrefs = { fontSize: 2, accent: "blue", background: "dark", useSystem: false };
export type SettingsRow = { title: string; description?: string; href: string; icon?: IconName; external?: boolean };
export type SettingsCategory = { id: string; label: string; href: string; description: string; sections: { heading?: string; rows: SettingsRow[] }[] };
```

---

## Icons appendix (SVG `path d`, viewBox `0 0 24 24` unless noted)

<details><summary>Profile header icons</summary>

```
BriefcaseIcon (professional category):
M19.5 6H17V4.5C17 3.12 15.88 2 14.5 2h-5C8.12 2 7 3.12 7 4.5V6H4.5C3.12 6 2 7.12 2 8.5v10C2 19.88 3.12 21 4.5 21h15c1.38 0 2.5-1.12 2.5-2.5v-10C22 7.12 20.88 6 19.5 6zM9 4.5c0-.28.23-.5.5-.5h5c.28 0 .5.22.5.5V6H9V4.5zm11 14c0 .28-.22.5-.5.5h-15c-.27 0-.5-.22-.5-.5v-3.04c.59.35 1.27.54 2 .54h5v1h2v-1h5c.73 0 1.41-.19 2-.54v3.04zm0-6.49c0 1.1-.9 1.99-2 1.99h-5v-1h-2v1H6c-1.1 0-2-.9-2-2V8.5c0-.28.23-.5.5-.5h15c.28 0 .5.22.5.5v3.51z

LocationPinIcon (location):
M12 7c-1.93 0-3.5 1.57-3.5 3.5S10.07 14 12 14s3.5-1.57 3.5-3.5S13.93 7 12 7zm0 5c-.827 0-1.5-.673-1.5-1.5S11.173 9 12 9s1.5.673 1.5 1.5S12.827 12 12 12zm0-10c-4.687 0-8.5 3.813-8.5 8.5 0 5.967 7.621 11.116 7.945 11.332l.555.37.555-.37c.324-.216 7.945-5.365 7.945-11.332C20.5 5.813 16.687 2 12 2zm0 17.77c-1.665-1.241-6.5-5.196-6.5-9.27C5.5 6.916 8.416 4 12 4s6.5 2.916 6.5 6.5c0 4.073-4.835 8.028-6.5 9.27z

LinkIcon (website; also "Copy link"):
M18.36 5.64c-1.95-1.96-5.11-1.96-7.07 0L9.88 7.05 8.46 5.64l1.42-1.42c2.73-2.73 7.16-2.73 9.9 0 2.73 2.74 2.73 7.17 0 9.9l-1.42 1.42-1.41-1.42 1.41-1.41c1.96-1.96 1.96-5.12 0-7.07zm-2.12 3.53l-7.07 7.07-1.41-1.41 7.07-7.07 1.41 1.41zm-12.02.71l1.42-1.42 1.41 1.42-1.41 1.41c-1.96 1.96-1.96 5.12 0 7.07 1.95 1.96 5.11 1.96 7.07 0l1.41-1.41 1.42 1.41-1.42 1.42c-2.73 2.73-7.16 2.73-9.9 0-2.73-2.74-2.73-7.17 0-9.9z

CalendarIcon (joined) — clone already has it; X path for reference:
M7 4V3h2v1h6V3h2v1h1.5C19.89 4 21 5.12 21 6.5v12c0 1.38-1.11 2.5-2.5 2.5h-13C4.12 21 3 19.88 3 18.5v-12C3 5.12 4.12 4 5.5 4H7zm0 2H5.5c-.27 0-.5.22-.5.5v12c0 .28.23.5.5.5h13c.28 0 .5-.22.5-.5v-12c0-.28-.22-.5-.5-.5H17v1h-2V6H9v1H7V6zm0 6h2v-2H7v2zm0 4h2v-2H7v2zm4-4h2v-2h-2v2zm0 4h2v-2h-2v2zm4-4h2v-2h-2v2z

ChevronRightIcon (joined row, settings rows, menu submenu):
M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z

ArrowUpRightIcon (external settings rows):
M8 6h10v10h-2V9.41L5.957 19.46l-1.414-1.42L14.586 8H8V6z

LockIcon (protected account / private list):
M12 1.5c2.761 0 5 2.239 5 5v.745c.22.06.431.138.638.235 1.045.495 1.887 1.337 2.381 2.382.267.563.378 1.165.43 1.849.052.673.051 1.505.051 2.539 0 1.034 0 1.866-.05 2.54-.053.683-.164 1.285-.43 1.848-.495 1.045-1.337 1.887-2.382 2.381-.563.267-1.165.378-1.849.43-.673.052-1.505.051-2.539.051h-2.5c-1.034 0-1.866 0-2.54-.05-.683-.053-1.285-.164-1.848-.43-1.045-.495-1.887-1.337-2.382-2.382-.266-.563-.377-1.165-.43-1.849-.05-.673-.05-1.505-.05-2.539 0-1.034 0-1.866.05-2.54.053-.683.164-1.285.43-1.848.495-1.045 1.337-1.887 2.382-2.382.207-.097.419-.174.638-.235V6.5c0-2.761 2.239-5 5-5zM9.5 15h5v-2h-5v2zM12 3.5c-1.657 0-3 1.343-3 3v.515C9.508 7 10.088 7 10.75 7h2.5l1.405.006c.119.002.234.006.345.009V6.5c0-1.657-1.343-3-3-3z

PinFilledIcon ("Pinned" social context):
M13 21l-1 2-1-2v-5H4.5v-2.287l.152-.243 2.306-3.69-.54-3.785C6.117 3.887 7.753 2 9.883 2h4.234c2.13 0 3.766 1.887 3.465 3.995l-.541 3.785 2.459 3.933V16H13v5z

PinIcon (outline; "Pin List"):
M13 21l-1 2-1-2v-5H4.5v-2.287l.152-.243 2.306-3.69-.54-3.785C6.117 3.887 7.753 2 9.883 2h4.234c2.13 0 3.766 1.887 3.465 3.995l-.541 3.785 2.459 3.933V16H13v5zM9.883 4c-.913 0-1.614.808-1.486 1.712l.645 4.509-.194.31L6.678 14h10.643l-2.169-3.47-.194-.31.644-4.508C15.732 4.808 15.03 4 14.117 4H9.883z

BellPlusIcon ("Turn on post notifications"):
M22 5v2h-3v3h-2V7h-3V5h3V2h2v3h3zm-.86 13h-4.241c-.464 2.281-2.482 4-4.899 4s-4.435-1.719-4.899-4H2.87L4 9.05C4.51 5.02 7.93 2 12 2v2C8.94 4 6.36 6.27 5.98 9.3L5.13 16h13.73l-.38-3h2.02l.64 5zm-6.323 0H9.183c.412 1.164 1.51 2 2.817 2s2.405-.836 2.817-2z

BellCheckIcon ("Turn off post notifications"):
M12 2C7.93 2 4.51 5.02 4 9.05L2.87 18H7.1c.46 2.28 2.48 4 4.9 4s4.44-1.72 4.9-4h4.24l-.64-5h-2.02l.38 3H5.13l.85-6.7C6.36 6.27 8.94 4 12 4V2zm0 18c-1.31 0-2.42-.83-2.83-2h5.66c-.41 1.17-1.52 2-2.83 2zm.3-12.29l1.41-1.42 1.76 1.76 4.29-4.72 1.48 1.34-5.7 6.28-3.24-3.24z

SubscribeIcon (creator subscribe, colour rgb(201,54,204)):
M16 6c0 2.21-1.79 4-4 4S8 8.21 8 6s1.79-4 4-4 4 1.79 4 4zm-.76 8.57l-3.95.58 2.86 2.78-.68 3.92L17 20l3.53 1.85-.68-3.92 2.86-2.78-3.95-.58L17 11l-1.76 3.57zm-.45-3.09c-.89-.32-1.86-.48-2.89-.48-2.35 0-4.37.85-5.86 2.44-1.48 1.57-2.36 3.8-2.63 6.46l-.11 1.09h8.58l.52-2.49-4.05-4.3 5.59-.99.85-1.73z

CheckIcon (menu checked item, checkbox, swatch):
M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z

MultiPhotoIcon (media grid badge):
M2 8.5C2 7.12 3.12 6 4.5 6h11C16.88 6 18 7.12 18 8.5v11c0 1.38-1.12 2.5-2.5 2.5h-11C3.12 22 2 20.88 2 19.5v-11zM19.5 4c.28 0 .5.22.5.5v13.45c1.14-.23 2-1.24 2-2.45v-11C22 3.12 20.88 2 19.5 2h-11c-1.21 0-2.22.86-2.45 2H19.5z

CameraPlusIcon (Add banner/avatar photo, 22px):
M12 4H9.914l-1.5 1.5H8c-1.222 0-1.65.008-1.979.09-1.073.269-1.911 1.108-2.181 2.18-.083.33-.09.757-.09 1.979v4.35c0 1.136 0 1.929.05 2.545.05.606.143.954.277 1.217.288.565.746 1.023 1.31 1.31.264.135.612.228 1.217.277.617.05 1.41.051 2.546.051h5.7c1.136 0 1.929 0 2.545-.05.605-.05.954-.143 1.217-.277.564-.288 1.023-.746 1.31-1.31.135-.264.228-.612.277-1.218.05-.616.05-1.409.05-2.545V12h2v2.1c0 1.103.002 1.991-.057 2.709-.06.728-.185 1.368-.487 1.96-.48.941-1.245 1.707-2.186 2.186-.592.302-1.232.428-1.96.487-.718.059-1.606.058-2.71.058H9.15c-1.103 0-1.992.001-2.709-.058-.728-.06-1.369-.185-1.96-.487-.941-.48-1.707-1.245-2.186-2.185-.302-.593-.428-1.233-.488-1.961-.058-.718-.057-1.606-.057-2.71V9.75c0-1.102-.008-1.837.15-2.465.448-1.79 1.845-3.187 3.635-3.636.546-.136 1.172-.148 2.05-.149l1.5-1.5H12v2z M12 7.75c2.485 0 4.5 2.015 4.5 4.5s-2.015 4.5-4.5 4.5-4.5-2.015-4.5-4.5 2.015-4.5 4.5-4.5zm0 2c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5z M20 4h3v2h-3v3h-2V6h-3V4h3V1h2v3z

ImageEditIcon ("Edit Photo", viewBox 0 0 20 20, stroke currentColor, stroke-width 1.667, fill none):
M17.084 7.5c0-1.163 0-1.744-.144-2.218-.323-1.065-1.157-1.899-2.222-2.222-.473-.143-1.055-.143-2.218-.143H8.25c-1.867 0-2.8 0-3.513.363-.627.32-1.137.83-1.457 1.457-.363.713-.363 1.646-.363 3.513v4.25c0 1.163 0 1.745.144 2.218.323 1.065 1.156 1.899 2.222 2.222.473.143 1.054.143 2.217.143
M2.917 12.5l3.75-3.333 2.917 2.916
M17.56 10.894c-.644-.645-1.684-.659-2.346-.032l-3.656 3.463c-.6.568-.968 1.34-1.031 2.164l-.11 1.428 1.479-.114c.793-.061 1.539-.404 2.101-.967l3.564-3.563c.657-.657.657-1.722 0-2.38z

ArrowUpIcon ("See new posts" pill):
M12 3.59l7.457 7.45-1.414 1.42L13 7.41V21h-2V7.41l-5.043 5.05-1.414-1.42L12 3.59z

ArrowRightIcon (carousel next) — clone has ArrowRightIcon; X path:
M12.957 4.54L20.414 12l-7.457 7.46-1.414-1.42L16.586 13H3v-2h13.586l-5.043-5.04 1.414-1.42z
```
</details>

<details><summary>Menu icons (profile "…", lists, communities)</summary>

```
InfoCircleIcon (About this account):
M13.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S11.17 7 12 7s1.5.67 1.5 1.5zM13 17v-5h-2v5h2zm-1 5.25c5.66 0 10.25-4.59 10.25-10.25S17.66 1.75 12 1.75 1.75 6.34 1.75 12 6.34 22.25 12 22.25zM20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75s8.25 3.69 8.25 8.25z

ListPlusIcon (Add/remove from Lists, Create a new List):
M5.5 4c-.28 0-.5.22-.5.5v15c0 .28.22.5.5.5H12v2H5.5C4.12 22 3 20.88 3 19.5v-15C3 3.12 4.12 2 5.5 2h13C19.88 2 21 3.12 21 4.5V13h-2V4.5c0-.28-.22-.5-.5-.5h-13zM16 10H8V8h8v2zm-8 2h8v2H8v-2zm10 7v-3h2v3h3v2h-3v3h-2v-3h-3v-2h3z

ListIcon (View Lists, Lists you’re on):
M3 4.5C3 3.12 4.12 2 5.5 2h13C19.88 2 21 3.12 21 4.5v15c0 1.38-1.12 2.5-2.5 2.5h-13C4.12 22 3 20.88 3 19.5v-15zM5.5 4c-.28 0-.5.22-.5.5v15c0 .28.22.5.5.5h13c.28 0 .5-.22.5-.5v-15c0-.28-.22-.5-.5-.5h-13zM16 10H8V8h8v2zm-8 2h8v2H8v-2z

ShareIcon (Share via…, list/community share) — clone has ShareIcon; X path:
M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z

MuteIcon:
M16 22h-2.35l-.275-.219-3.842-3.073 1.424-1.424L14 19.72v-5.477l2-2V22z M16 6.586l4.293-4.293 1.414 1.414-18 18-1.414-1.414 2.657-2.658C3.795 17.063 3 15.875 3 14.5v-5C3 7.567 4.567 6 6.5 6h2.148l4.727-3.781.274-.219H16v4.586zM9.625 7.78L9.351 8H6.5C5.672 8 5 8.672 5 9.5v5c0 .828.672 1.5 1.5 1.5h.086L14 8.586V4.28l-4.375 3.5z

BlockIcon:
M12 3.75c-4.55 0-8.25 3.69-8.25 8.25 0 1.92.66 3.68 1.75 5.08L17.09 5.5C15.68 4.4 13.92 3.75 12 3.75zm6.5 3.17L6.92 18.5c1.4 1.1 3.16 1.75 5.08 1.75 4.56 0 8.25-3.69 8.25-8.25 0-1.92-.65-3.68-1.75-5.08zM1.75 12C1.75 6.34 6.34 1.75 12 1.75S22.25 6.34 22.25 12 17.66 22.25 12 22.25 1.75 17.66 1.75 12z

ReportFlagIcon (Report @x, Report List/Community):
M3 2h18.61l-3.5 7 3.5 7H5v6H3V2zm2 12h13.38l-2.5-5 2.5-5H5v10z

CircleXIcon ("Don’t show these posts in For you"):
M12 3.75c-4.56 0-8.25 3.69-8.25 8.25s3.69 8.25 8.25 8.25 8.25-3.69 8.25-8.25S16.56 3.75 12 3.75zM1.75 12C1.75 6.34 6.34 1.75 12 1.75S22.25 6.34 22.25 12 17.66 22.25 12 22.25 1.75 17.66 1.75 12zm8.84 0l-2.3-2.29 1.42-1.42 2.29 2.3 2.29-2.3 1.42 1.42-2.3 2.29 2.3 2.29-1.42 1.42-2.29-2.3-2.29 2.3-1.42-1.42 2.3-2.29z

SparkleIcon ("Pin Community"):
M12.998 1.94c.18 3.015 1.04 5.156 2.473 6.59 1.433 1.433 3.574 2.292 6.589 2.472v1.996c-3.015.18-5.156 1.04-6.59 2.473-1.433 1.433-2.292 3.574-2.472 6.589h-1.996c-.18-3.015-1.04-5.156-2.473-6.59-1.433-1.433-3.574-2.292-6.589-2.472v-1.996c3.015-.18 5.156-1.04 6.59-2.473 1.433-1.433 2.292-3.574 2.472-6.589h1.996z

PlusIcon (list Follow circle) — clone has PlusIcon; X path:
M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7z
```
</details>

Grok "Profile Summary" button uses the Grok glyph with `viewBox="0 0 33 32"` (path captured in the scratch output; the clone already has `GrokIcon`).

---

## Open questions / not observed

- **Verified badge popover**: clicking the badge button (`aria-label="Provides details about verified accounts."`) showed nothing in headless Chrome. The copy above is from memory and needs confirming in a real browser. The verified-since date is now shown on `/:handle/about` ("Verified · Since …").
- **"Follows you" badge**: the test account has 0 followers, so it was not observed. Spec from the known X style.
- **Birthday in the meta row**: not observed (visibility is "Only you").
- **Banner "Remove photo"** in Edit profile and the **image cropper** ("Edit media" with zoom, after an upload): not observed (no upload, per safety rules).
- **Own Posts empty state** ("You haven’t posted yet"?) and **own Following empty state**: not observed.
- **Follow on a protected account** ("Pending" request state): not executed.
- **Mute / Block / Report** flows: not executed (safety).
- **Media grid video badge** (duration pill) and hover overlay: not measured. No hover effect was detected on photo cells.
- **Modal exit animation**: not measured. Enter is 150ms scale .92→1 + fade.
- **Light-mode scrim** colour: not cleanly measured. One sample read `rgba(0,0,0,0.4)`-ish visually.
- **Display colour swatches**: hex values are X's documented palette and visually match the screenshot. Computed colours were not readable because they are drawn in nested elements; colour and background were not clicked, to avoid changing the shared browser.
- **Font size "Small"** step: root font-size read 14px with 19px line-height, which may be a timing artefact.
- **`/XDevelopers/followers`** (full followers list of another user) rendered empty. X appears to restrict it now. Verified Followers / Following / Followers you know work.
- **Create a Community**: `/i/communities/create` bounced to Home. Probably Premium-gated or retired.
- **Communities "Join"**: not clicked, so the joined state (button "Joined", member role, "Post to community" composer audience) was not observed.
- **Theme flips:** the account has "Use system setting" ON, so the theme followed the headless browser's colour-scheme emulation, which other researchers may have changed. All measurements are tagged L/D.
