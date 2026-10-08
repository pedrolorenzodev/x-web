# 02 — Tweet (card, menus, actions, hover cards, media, detail)

> Research on logged-in x.com, 2026-10-05, viewport 1400×900, account @PedroLo01746179.
> **Theme caveat:** the account's theme follows the system setting, which flipped during the session, so some
> captures/screens are in Light ("Default") and some in Dark ("Lights out", body `#000`). Colours below are labelled
> **L** (light) or **D** (dark) where it matters. The clone runs dark, so **D** values are directly usable;
> where only **L** was measured, the standard X dark counterpart is given in brackets.
> All numbers are measured with `getBoundingClientRect` / `getComputedStyle` unless marked _(not observed)_.

## Scope map

```
Tweet card (timeline / profile / search / replies)              level 1 (lives everywhere)
├── Avatar / name / handle ── hover → User HoverCard              level 2 (popover)
│     └── HoverCard → Follow, "Profile Summary" (Grok), Following/Followers links → level 3: /h/following, /h/verified_followers
├── Timestamp ── hover → tooltip full date; click → /h/status/ID (detail)
├── Grok button "Explain this post" ── click → Grok floating chat panel (owned by 04-grok)   level 2
├── "..." caret menu (someone else's post)                          level 2 (menu)
│     ├── Not interested in this post  → inline feedback (not executed, see notes)
│     ├── Follow @h / Unfollow @h       → toggles follow (+ toast)
│     ├── Add/remove from Lists         → /i/lists/add_member  modal "Pick a List"
│     ├── Mute                          → (not executed) toast with Undo
│     ├── Block @h                      → confirmation sheet "Block @h?"
│     ├── View post activity            → /h/status/ID/quotes  page "Post activity" (tabs Quotes / Reposts)
│     ├── Embed post                    → publish.x.com (new tab) _(popup not observable headless)_
│     ├── Edit image (photo posts only) → https://grok.com/imagine?...  (external, level 3)
│     ├── Report post                   → /i/safety/report_story_start modal "What are you reporting?"
│     └── Request Community Note        → /i/communitynotes/noterequest/ID  (not opened)
│   (ads: "Not interested in this ad", "Why this ad?" → /i/about-this-ad/ID, "Report ad")
├── Action bar
│     ├── Reply      → reply modal (/compose/post intercept)       level 2
│     ├── Repost     → menu: Repost / Quote → quote composer modal  level 2
│     ├── Like       → toggle
│     ├── Views      → /h/status/ID/analytics  → "Views" info modal (others' posts)   level 2
│     ├── Bookmark   → toggle + toast "Added to your Bookmarks · Add to Folder" → /i/verified-get-verified (non-premium)
│     └── Share      → menu: Send via Chat (modal "Share") / Copy link (toast) / Share post via … (navigator.share)
│                      / Post Video, Download video (video posts only)
├── Media
│     ├── Photo → /h/status/ID/photo/N   full-screen media viewer modal with replies side panel   level 2
│     ├── Video → inline autoplay-muted player; click → /h/status/ID/video/N viewer _(same viewer shell)_
│     ├── Link card (summary / summary_large_image) → external t.co link
│     ├── Poll (open / final)
│     └── Quote card (nested), Article card
└── Tweet detail /h/status/ID                                       level 2 (page)
      ├── /h/status/ID/quotes   "Post activity" → Quotes tab       level 3 (named)
      ├── /h/status/ID/retweets "Post activity" → Reposts tab      level 3 (named)
      ├── /h/status/ID/likes    (own posts only)                   level 3 (named)
      └── /h/status/ID/analytics (Views modal)                     level 3 (named)
```

_(continued below — features are appended in order: card anatomy → caret menu → action bar → hover card →
tooltip → modals/toasts → media → detail page → cross-cutting.)_

## Features

### F1. Tweet card anatomy (deltas vs clone)

- **Level / route / entry points:** level 1 — every timeline (home, profile tabs, search, replies, bookmarks…). Component `article[data-testid="tweet"]` inside `[data-testid="cellInnerDiv"]`.
- **Clone status:** PARTIAL — `src/components/tweet/tweet-card.tsx`. Missing: verified/affiliate badges, social context (Pinned / reposted), Grok button, text entities, "Show more", Ad label, translate line, link cards, polls, video, nested quote. Wrong: action bar has 6 slots but no "Views is a link", counts typography, like burst (X has none, see F3).
- **Suggested priority:** P0 (badges, entities, social context, Show more); P1 (Grok button visual, Ad label, translate); P2 (community notes, edited).
- **Complexity:** M

**Layout & measurements** (column 600px wide incl. 1px borders → article 598px):
| Part | Value |
|---|---|
| `article` | padding `0 16px`; `cursor:pointer`; `transition: background-color .2s, box-shadow .2s`; hover bg **L** `rgba(0,0,0,0.03)` **D** `rgba(255,255,255,0.03)`; bottom border 1px **L** `rgb(239,243,244)` **D** `rgb(47,51,54)` |
| top padding | 12px when no social context; with social context the context row starts 8px from top, is 16px tall, then 4px gap → avatar at 28px |
| avatar column | 40×40 avatar, column 40px, gap to content **8px** (avatar x 359.5 → content x 407.5) |
| header row `[data-testid="User-Name"]` | height 20px, `display:flex`, items: name (15px/20px **700**) → badges → handle (15px/20px 400 muted) → `·` (padding 0 4px, muted) → time link (muted). Right side: Grok button (19.33×20) 8px gap → caret (18.75×20). |
| text `[data-testid="tweetText"]` | 15px / 20px, weight 400, colour **L** `rgb(15,20,25)` **D** `rgb(231,233,234)`; starts 4px below header (header 187→207, text at 211) |
| media / card / quote | margin-top 12px, full content width (518px incl. border) |
| action bar `[role=group]` | margin-top 12px, height 20px, `gap:4px`, padding-bottom 12px of the cell. See F3. |
| muted colour | **L** `rgb(83,100,113)` **D** `rgb(113,118,123)` |

**Social context row** (`[data-testid="socialContext"]`) — exact copy:
- `Pinned` (profile pinned post) — pin icon.
- `You reposted` (own repost; link to own profile) / `{Display Name} reposted` (link to that profile) — repost icon (the slightly bolder "reposted" variant, path below).
- Text 13px / 16px **700**, muted colour; icon 16×16 muted, **right-aligned inside the 40px avatar column** (icon x = column x + 24), 8px gap → text aligned with the name column. Text hover: underline (link).
- Clone: code exists but data never feeds it (inventory §4). Needs `pinnedTweetId` on user and repost items in timelines.

**Badges** (all `svg[data-testid="icon-verified"]`, `aria-label="Verified account"`, viewBox `0 0 22 22`, rendered 18.75×18.75, `margin-left:2px`):
- **Blue** (individual Premium): single path, `fill: currentColor`, colour `rgb(29,155,240)` (`#1d9bf0`) in both themes.
- **Gold** (Verified Organization): two `linearGradient`s + 3 paths (see icons). Never themed.
- **Grey** (government/multilateral): single path, `fill="#829aab"`.
- **Affiliate badge** (after the check, e.g. @elonmusk → X logo, @Starlink → X logo): 13.94×13.94 org avatar image with a 1px border, square corners (radius ~2px), wrapped in a link to the org profile, 4px left margin.
- Clone has `VerifiedIcon` unused, `User` type lacks `verified`. Add `verified: "blue" | "gold" | "grey" | null` and optional `affiliate: {handle, avatarUrl} | null` to `UserSummary`.

**Ad / promoted posts:** the `· time` part is replaced by the word **`Ad`** (muted, 15px) pushed to the right before the caret (`Ad` at x 880, caret 906). No Grok button on ads. Caret menu items differ (see F2). Ads also show a large card with "From google.com" domain line. → recommend **OUT** for clone (no ads).

**Timestamp** (`a[href="/h/status/ID"] > time[datetime=ISO]`, link `aria-label` = "3 hours ago" / "Oct 2"):
- `< 1 min` → `Ns` (e.g. `12s`); `< 60 min` → `Nm`; `< 24 h` → `Nh`; same year → `Oct 4`; other year → `Sep 25, 2025`. (Observed: `3h`, `26m`, `7h`, `Oct 4`, `Dec 22, 2025`, `Sep 25, 2025`.) Clone `format-relative-time.ts` already matches except it returns `Now` under 5s (X shows `0s`/`1s`… — minor).
- Hover → tooltip (F5) with full date: **`8:21 PM · Oct 4, 2026`** (format `h:mm A · MMM D, YYYY`). Clone: MISSING (no tooltip).
- Hover → underline.

**Text entities** (all colour `rgb(29,155,240)`, no underline, underline on hover):
- URL: `href="https://t.co/xxxx"`, `target="_blank" rel="noopener noreferrer nofollow"`; display text = URL without protocol, the protocol is rendered in a visually hidden `<span aria-hidden>https://</span>` (font-size .001px); long URLs truncated with `…` after ~23 chars of path (e.g. `youtube.com/channel/UCzeZE…`).
- `@mention` → `/handle` (hover shows the user HoverCard, same as avatar).
- `#hashtag` → `/hashtag/Robotics?src=hashtag_click`.
- `$cashtag` → `/search?q=%24TSLA&src=cashtag_click` (no hover card observed).
- `pic.x.com/xxx` text appears when the media is not inline (e.g. in the reply-modal parent preview).
- Clone: MISSING — text is plain. Needs an entity parser util (`utils/parse-tweet-text.ts`) producing segments `{type:"text"|"url"|"mention"|"hashtag"|"cashtag", text, href}`. Mock data can carry `entities` or be parsed at render.

**"Show more" truncation** (`button[data-testid="tweet-text-show-more-link"]`):
- Appears on long posts (>280 chars, "note tweets"). Observed truncation at **~271–280 characters / max ~7 lines (140px)**; text ends mid-sentence (no ellipsis char), then the button on its own line.
- Style: 15px/20px `rgb(29,155,240)`, full-width block button, hover underline.
- Behaviour: it is a `<button>` (not a link). Click **expands the text inline** in the same card (observed: 271 → 333 chars, 140px → 200px), the button disappears, URL does not change, no "Show less". Expansion is instant (no height animation). On the detail page the full text is always shown.
- Clone: MISSING. Add `isLong` or compute by length > 280 and truncate at 280 chars.

**Translate line**: on posts in another language X auto-translates for this account and shows above the text: `Translated from French` + link `Show original` (13px muted / blue). Other accounts see `Translate post` link under the text. → P2.

**Grok button on card** (`button[aria-label="Grok actions"]`): Grok logo icon (viewBox 0 0 33 32, rendered ~19×20, muted), shown only on posts **with media** (photo/video/card) — not on text-only posts nor ads. Hover: blue + 34.75px blue 10% circle; tooltip **`Explain this post`**. Click opens the **Grok floating chat panel** (bottom-right, ~400×590, header icons history / expand / new chat / collapse chevron; body: embedded post preview + "Thinking about your request" stream; composer `Ask anything`, attach clip, model pill `Fast ⌄`, stop/voice button). The panel persists over navigation until collapsed. → owned by 04-grok; for the clone, P2 (render the button + open Grok page/panel with the post pre-attached). Screens: `screens/02-tweet/grok-actions-menu.png`.

**Not observed on this account's timelines**: "Edited" indicator (`Last edited 3:15 PM` + pencil icon, only on detail), reply-restriction note (`@x limited who can reply` / `Who can reply? People @x mentioned can reply`, detail page only), "Show this thread" (removed from X; threads now render as connected cards with the connector line), sensitive-media interstitial (`Content warning: Nudity` / `The post author flagged this post as showing sensitive content.` + `Show` button over a blurred thumbnail). These are documented from prior knowledge only → P2.

**Screenshots:** `screens/02-tweet/home-timeline.png`, `action-like-hover.png`, `card-pinned-quote.png`, `social-context-you-reposted.png`, `badge-grey-gov.png`, `show-more-before.png`, `show-more-after.png`, `tooltip-timestamp.png`.

<details><summary>Icons (SVG paths) — badges, social context, Grok</summary>

```
VerifiedBlueIcon (viewBox 0 0 22 22, fill currentColor, color #1d9bf0)
M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z

VerifiedGoldIcon (viewBox 0 0 22 22) — use exactly:
<g><linearGradient gradientUnits="userSpaceOnUse" id="gold-a" x1="4.411" x2="18.083" y1="2.495" y2="21.508"><stop offset="0" stop-color="#f4e72a"/><stop offset=".539" stop-color="#cd8105"/><stop offset=".68" stop-color="#cb7b00"/><stop offset="1" stop-color="#f4ec26"/><stop offset="1" stop-color="#f4e72a"/></linearGradient><linearGradient gradientUnits="userSpaceOnUse" id="gold-b" x1="5.355" x2="16.361" y1="3.395" y2="19.133"><stop offset="0" stop-color="#f9e87f"/><stop offset=".406" stop-color="#e2b719"/><stop offset=".989" stop-color="#e2b719"/></linearGradient><g clip-rule="evenodd" fill-rule="evenodd"><path d="M13.324 3.848L11 1.6 8.676 3.848l-3.201-.453-.559 3.184L2.06 8.095 3.48 11l-1.42 2.904 2.856 1.516.559 3.184 3.201-.452L11 20.4l2.324-2.248 3.201.452.559-3.184 2.856-1.516L18.52 11l1.42-2.905-2.856-1.516-.559-3.184zm-7.09 7.575l3.428 3.428 5.683-6.206-1.347-1.247-4.4 4.795-2.072-2.072z" fill="url(#gold-a)"/><path d="M13.101 4.533L11 2.5 8.899 4.533l-2.895-.41-.505 2.88-2.583 1.37L4.2 11l-1.284 2.627 2.583 1.37.505 2.88 2.895-.41L11 19.5l2.101-2.033 2.895.41.505-2.88 2.583-1.37L17.8 11l1.284-2.627-2.583-1.37-.505-2.88zm-6.868 6.89l3.429 3.428 5.683-6.206-1.347-1.247-4.4 4.795-2.072-2.072z" fill="url(#gold-b)"/><path d="M6.233 11.423l3.429 3.428 5.65-6.17.038-.033-.005 1.398-5.683 6.206-3.429-3.429-.003-1.405.005.003z" fill="#d18800"/></g></g>
(use unique gradient ids per instance, e.g. useId())

VerifiedGreyIcon (viewBox 0 0 22 22, fill #829aab, clip-rule/fill-rule evenodd)
M12.05 2.056c-.568-.608-1.532-.608-2.1 0l-1.393 1.49c-.284.303-.685.47-1.1.455L5.42 3.932c-.832-.028-1.514.654-1.486 1.486l.069 2.039c.014.415-.152.816-.456 1.1l-1.49 1.392c-.608.568-.608 1.533 0 2.101l1.49 1.393c.304.284.47.684.456 1.1l-.07 2.038c-.027.832.655 1.514 1.487 1.486l2.038-.069c.415-.014.816.152 1.1.455l1.392 1.49c.569.609 1.533.609 2.102 0l1.393-1.49c.283-.303.684-.47 1.099-.455l2.038.069c.832.028 1.515-.654 1.486-1.486L18 14.542c-.015-.415.152-.815.455-1.099l1.49-1.393c.608-.568.608-1.533 0-2.101l-1.49-1.393c-.303-.283-.47-.684-.455-1.1l.068-2.038c.029-.832-.654-1.514-1.486-1.486l-2.038.07c-.415.013-.816-.153-1.1-.456zm-5.817 9.367l3.429 3.428 5.683-6.206-1.347-1.247-4.4 4.795-2.072-2.072z

PinIcon (social context, viewBox 0 0 24 24, 16px)
M13 21l-1 2-1-2v-5H4.5v-2.287l.152-.243 2.306-3.69-.54-3.785C6.117 3.887 7.753 2 9.883 2h4.234c2.13 0 3.766 1.887 3.465 3.995l-.541 3.785 2.459 3.933V16H13v5z

RepostedContextIcon (social context + active "Reposted" state, viewBox 0 0 24 24)
M4.75 3.79l4.603 4.3-1.706 1.82L6 8.38v7.37c0 .97.784 1.75 1.75 1.75H13V20H7.75c-2.347 0-4.25-1.9-4.25-4.25V8.38L1.853 9.91.147 8.09l4.603-4.3zm11.5 2.71H11V4h5.25c2.347 0 4.25 1.9 4.25 4.25v7.37l1.647-1.53 1.706 1.82-4.603 4.3-4.603-4.3 1.706-1.82L18 15.62V8.25c0-.97-.784-1.75-1.75-1.75z

GrokIcon (card button / hover-card button, viewBox 0 0 33 32, fill currentColor)
M12.745 20.54l10.97-8.19c.539-.4 1.307-.244 1.564.38 1.349 3.288.746 7.241-1.938 9.955-2.683 2.714-6.417 3.31-9.83 1.954l-3.728 1.745c5.347 3.697 11.84 2.782 15.898-1.324 3.219-3.255 4.216-7.692 3.284-11.693l.008.009c-1.351-5.878.332-8.227 3.782-13.031L33 0l-4.54 4.59v-.014L12.743 20.544m-2.263 1.987c-3.837-3.707-3.175-9.446.1-12.755 2.42-2.449 6.388-3.448 9.852-1.979l3.72-1.737c-.67-.49-1.53-1.017-2.515-1.387-4.455-1.854-9.789-.931-13.41 2.728-3.483 3.523-4.579 8.94-2.697 13.561 1.405 3.454-.899 5.898-3.22 8.364C1.49 30.2.666 31.074 0 32l10.478-9.466
```
</details>

- **Data model needed:**
  - `UserSummary`: `verified: "blue" | "gold" | "grey" | null`, `affiliate: { handle: string; avatarUrl: string } | null`.
  - `Tweet`: `entities?` (or parse), `lang?: string`, `isLong: boolean` (or derive), `card: LinkCard | null`, `poll: Poll | null`, `editedAt: string | null`, `pinned` (derive from `user.pinnedTweetId`), `stats.views`, `stats.bookmarks`, `stats.quotes`.
  - `TimelineItem.socialContext: { type: "pinned" } | { type: "repost"; by: UserSummary } | null` (replaces `retweetedBy`).
- **Implementation notes:** keep the overlay-link card; badges inside the name link; entity links need `relative z-10` like the existing avatar link so they sit above the overlay. Use `-webkit-line-clamp` NOT for "Show more" (X cuts by characters, not lines).

### F2. "..." caret menu (`button[data-testid="caret"]`, `aria-label="More"`, `aria-haspopup="menu"`)

- **Level / route / entry points:** level 1 button on every card + focal tweet; menu = level 2.
- **Clone status:** VISUAL — `src/components/tweet/more-button.tsx` has no menu. Reuse `ui/dropdown-menu.tsx` + `use-dropdown-menu.ts` (already used by `repost-menu.tsx`).
- **Suggested priority:** P0 (menu + Follow/Unfollow, Add/remove from Lists, View post activity, Embed, Report/Block/Mute as dialogs/toasts), P1 for own-tweet menu (Delete / Pin).
- **Complexity:** M

**Items on someone else's post** (exact order and copy; observed on 4 posts):

| # | Text | Icon | Action / level-2 surface |
|---|---|---|---|
| 1 | `Not interested in this post` | sad-face circle | Feed feedback; card collapses into an inline notice with Undo _(not observed — click was not completed)_. Clone: hide card + toast "Thanks. You'll see fewer posts like this." with Undo. |
| 2 | `Follow @handle` / `Unfollow @handle` | person + plus / person + minus | Toggles follow (reuse `toggleFollow`). |
| 3 | `Add/remove from Lists` | list + plus | link `/i/lists/add_member` → modal **"Pick a List"** (600×650, header: close X, title 20px bold, `Save` pill top-right disabled grey). Empty state: `Your Lists are empty` (~31px 800, estimated from screenshot) / `You'll need to create a List before adding someone.` / blue pill `Create a List`. With lists: rows with checkbox per list (owned by 05-lists). |
| 4 | `Mute` (copy is just "Mute", newer X dropped the @handle here) | speaker-off | Not executed. X shows toast `@handle has been muted.` + `Undo` (not observed). |
| 5 | `Block @handle` | circle-slash | Confirmation sheet (see below). |
| 6 | `View post activity` | bar chart | link `/h/status/ID/quotes` → page **"Post activity"** (F7). (Older copy "View post engagements".) |
| 7 | `Embed post` | `</>` | Modal **"Embed this post"** (600×810, D bg `rgb(20,20,20)`): title, subtitle `Preview how this post looks when embedded on another website.`, gear button `Embed settings`, iframe preview of `platform.twitter.com/embed/Tweet.html?id=ID` (568×720), primary button `Copy code`, footer `By embedding X content in your website or app, you are agreeing to the Developer Agreement and Developer Policy.` (links to developer.x.com). Clone: P2 — modal with a static preview + Copy code (copy `<blockquote class="twitter-tweet">…`) + toast `Copied to clipboard`. |
| 8 | `Edit image` (**only on photo posts**) | magic-pencil | external `https://grok.com/imagine?parent_x_post_id=ID&media_url=…&action=img_edit` → OUT. |
| 9 | `Report post` | flag | Modal at `/i/safety/report_story_start` (600×650): `What are you reporting?` / `Please choose the category that best describes your issue.` radio list: `Spam`, `Hate, Abuse, or Harassment`, `Child Safety`, `Violent Speech`, `Graphic or Violent Media`, `Illegal and Regulated Behaviors`, `Impersonation`, `Adult Sexual Content`, `Private or Non-Consensual Content`, `Suicide or Self-Harm`, `Terrorism or Violent Extremism`, `Civic Integrity`; footer `You can learn more about our policies and additional reporting options in our Help Center.` + `Next` button (disabled until a choice). Clone: P2 (dialog that ends in a "Thanks for letting us know" state, no backend). |
| 10 | `Request Community Note` | megaphone | link `/i/communitynotes/noterequest/ID` (not opened — would register a request). OUT. |

Ads replace #1 with `Not interested in this ad`, add `Why this ad?` (→ `/i/about-this-ad/ID`) as #2 and `Report ad` instead of `Report post`.

**Block confirmation sheet** (`[data-testid="confirmationSheetDialog"]`, 320px wide, padding 32px, radius 16px, centered):
- Title `Block @handle?` (20px 700), body `They will be able to see your public posts, but will no longer be able to engage with them. @handle will also not be able to follow or message you, and you will not see notifications from them.` (15px muted).
- Buttons (stacked, 256×44, radius 9999, gap 12px): `Block` red `rgb(244,33,46)` bg + white text; `Cancel` transparent with 1px border **L** `rgb(207,217,222)` [D `rgb(83,100,113)`].
- Same component as the reply discard sheet (F3) — build one `ConfirmationSheet` primitive.

**Own post menu** — _not observable_: the account has no own posts (profile shows "2 posts" but both are reposts). From current X (not verified this session): `Delete` (red, trash) → confirmation sheet `Delete post?` / `This can’t be undone and it will be removed from your profile, the timeline of any accounts that follow you, and from search results.` / `Delete` (red) + `Cancel`; `Pin to your profile` / `Unpin from profile`; `Highlight on your profile` (Premium); `Add/remove @you from Lists`; `Change who can reply`; `View post engagements`; `Embed post`; `View post analytics`; `Request Community Note`. Recommend implementing Delete + Pin/Unpin (P1).

**Layout & measurements:**
- Menu box: width = content (250.28px for this list; min ~180), radius **12px**, `overflow:hidden`. **L** bg `#fff`, shadow `rgba(101,119,134,0.2) 0 0 15px, rgba(101,119,134,0.15) 0 0 3px 1px`. **D** bg `rgb(20,20,20)`, shadow `rgba(0,0,0,0.5) 0 4px 12px, rgba(0,0,0,0.35) 0 0 2px`.
- Item (`role=menuitem`): height 44px, padding `12px 16px`, icon 18.75px, gap 12px icon→text, text 15px/20px **700**, colour = foreground (no red items in this menu). Hover/focus bg **L** `rgba(0,0,0,0.03)` [D `rgba(255,255,255,0.03)`], `transition: background-color .2s`. When opened by click the first item gets focus styling.
- **Positioning:** the menu opens **on top of the anchor**, its top-right corner aligned with the caret's top-right (menu x 675.2 + 250.3 = caret right 925.5; menu top = caret top). Flips upward when there's no room below.
- **Motion:** height reveal from 0 → full height, top anchored, ~140ms ease-out (samples: 21ms 0px, 70ms 86, 88ms 227, 104ms 317, 121ms 366, 137ms 389, 154ms 396). No opacity/scale. Close: instant. Clone's `.t-dropdown` (scale .95→1 + fade 150ms) is close enough; to match X use `clip-path: inset(0 0 100% 0)` → `inset(0)` 150ms `cubic-bezier(0.2,0,0,1)`.
- **Screenshots:** `caret-menu-other.png` (D), `caret-menu-other-light.png` (L), `caret-lists-modal.png`, `caret-block-confirm.png`, `caret-report-modal.png`, `caret-embed-post.png`, `caret-view-post-activity.png`.

<details><summary>Icons (SVG paths, viewBox 0 0 24 24)</summary>

```
NotInterestedIcon (2 paths)
M12 13.6c1.64-.013 3.278.76 4.284 2.02.114.14.218.282.317.43l-1.202.9c-.088-.102-.177-.197-.272-.289-.844-.823-1.98-1.264-3.125-1.26-1.146-.002-2.282.441-3.129 1.263-.095.092-.185.186-.273.287l-1.2-.902c.1-.149.205-.29.319-.429C8.728 14.364 10.36 13.59 12 13.6zM9.25 8c.828 0 1.5.796 1.5 1.9 0 1.105-.672 1.85-1.5 1.85s-1.5-.745-1.5-1.85c0-1.104.672-1.9 1.5-1.9zm5.5 0c.828 0 1.5.796 1.5 1.9 0 1.105-.672 1.85-1.5 1.85s-1.5-.745-1.5-1.85c0-1.104.672-1.9 1.5-1.9z
M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 2c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8z
FollowUserIcon
M10 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM6 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4zm13 4v3h2v-3h3V8h-3V5h-2v3h-3v2h3zM3.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C13.318 13.65 11.838 13 10 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C5.627 11.85 7.648 11 10 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H1.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46z
ListAddIcon
M5.5 4c-.28 0-.5.22-.5.5v15c0 .28.22.5.5.5H12v2H5.5C4.12 22 3 20.88 3 19.5v-15C3 3.12 4.12 2 5.5 2h13C19.88 2 21 3.12 21 4.5V13h-2V4.5c0-.28-.22-.5-.5-.5h-13zM16 10H8V8h8v2zm-8 2h8v2H8v-2zm10 7v-3h2v3h3v2h-3v3h-2v-3h-3v-2h3z
MuteIcon (2 paths; also the video "Unmute" icon)
M16 22h-2.35l-.275-.219-3.842-3.073 1.424-1.424L14 19.72v-5.477l2-2V22z
M16 6.586l4.293-4.293 1.414 1.414-18 18-1.414-1.414 2.657-2.658C3.795 17.063 3 15.875 3 14.5v-5C3 7.567 4.567 6 6.5 6h2.148l4.727-3.781.274-.219H16v4.586zM9.625 7.78L9.351 8H6.5C5.672 8 5 8.672 5 9.5v5c0 .828.672 1.5 1.5 1.5h.086L14 8.586V4.28l-4.375 3.5z
BlockIcon
M12 3.75c-4.55 0-8.25 3.69-8.25 8.25 0 1.92.66 3.68 1.75 5.08L17.09 5.5C15.68 4.4 13.92 3.75 12 3.75zm6.5 3.17L6.92 18.5c1.4 1.1 3.16 1.75 5.08 1.75 4.56 0 8.25-3.69 8.25-8.25 0-1.92-.65-3.68-1.75-5.08zM1.75 12C1.75 6.34 6.34 1.75 12 1.75S22.25 6.34 22.25 12 17.66 22.25 12 22.25 1.75 17.66 1.75 12z
ActivityIcon (same as ViewsIcon)
M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z
EmbedIcon
M15.24 4.31l-4.55 15.93-1.93-.55 4.55-15.93 1.93.55zm-8.33 3.6L3.33 12l3.58 4.09-1.5 1.32L.67 12l4.74-5.41 1.5 1.32zm11.68-1.32L23.33 12l-4.74 5.41-1.5-1.32L20.67 12l-3.58-4.09 1.5-1.32z
ReportFlagIcon
M3 2h18.61l-3.5 7 3.5 7H5v6H3V2zm2 12h13.38l-2.5-5 2.5-5H5v10z
CommunityNoteIcon
M22 2.63v17.74l-7.05-2.27c-.29 1.65-1.72 2.9-3.45 2.9C9.57 21 8 19.43 8 17.5v-1.63l-1.15-.37H4.5C3.12 15.5 2 14.38 2 13v-3c0-1.38 1.12-2.5 2.5-2.5h2.35L22 2.63zM6 9.5H4.5c-.27 0-.5.22-.5.5v3c0 .28.23.5.5.5H6v-4zm2 4.27l12 3.86V5.37L8 9.23v4.54zm2 2.74v.99c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-.02l-3-.97z
```
</details>

- **Data model needed:** `Tweet.author.followedByViewer` (exists on `User`, add to summary or look up), lists mock (owned by 05), `mutedByViewer` / `blockedByViewer` booleans in mock (client-only).
- **Routing:** `/i/lists/add_member` and `/i/safety/report_story_start` are modal routes over the current page (intercept with `@modal`, page fallback = Home + modal). Embed + Block are local dialogs (no URL).
- **Implementation notes:** build items with the existing `menuItem` class; make the menu content a function of `isOwn` and `hasPhoto`.

### F3. Action bar (reply / repost / like / views / bookmark / share)

- **Clone status:** PARTIAL — `src/components/tweet/tweet-actions.tsx`. Like/Repost/Bookmark toggles work. Missing: reply modal, quote composer, views link + modal, share menu, bookmark toasts, tooltips. Delta: X has **no heart burst/particles** (see Like).
- **Suggested priority:** P0 (reply modal, quote composer, share menu Copy link, bookmark toast, tooltips); P1 (views modal, Send via Chat modal); OUT ("Share post via …" native share, Download/Post video).
- **Complexity:** L (reply + quote modals), S (rest)

**Layout (card):** `[role="group"]` with `aria-label="7 replies, 6 reposts, 143 likes, 396 bookmarks, 41589 views"`; margin-top 12px; height 20px; `gap:4px`. Children: Reply, Repost, Like, Views each `flex:1` (113.13px at 518px content); Bookmark (18.75px, `margin-right:8px`); Share (18.75px). Button: `min-height:20px`, icon 18.75px (viewBox 24), count = 13px/16px weight 400, `padding: 0 4px` (→ count starts 4px after icon). Default colour muted. Hover circle: 34.75×34.75 (`margin:-8px` around the icon), `border-radius:9999px`, `transition: background-color .2s, box-shadow .2s`.

| Action | aria-label (button) | Hover colour (icon+count) | Hover circle bg | Active state |
|---|---|---|---|---|
| Reply `data-testid="reply"` | `7 Replies. Reply` | `rgb(29,155,240)` | `rgba(29,155,240,0.1)` | — |
| Repost `retweet`/`unretweet` | `6 reposts. Repost` / `42 reposts. Reposted` | `rgb(0,186,124)` | `rgba(0,186,124,0.1)` | green icon (filled-arrows "reposted" path, see F1 icons) |
| Like `like`/`unlike` | `143 Likes. Like` / `70 Likes. Liked` | `rgb(249,24,128)` | `rgba(249,24,128,0.1)` | pink filled heart + pink count |
| Views (an `<a>` → `/h/status/ID/analytics`) | `41589 views. View post analytics` | blue | blue 10% | — |
| Bookmark `bookmark`/`removeBookmark` | `Bookmark` / `Remove Bookmark` (no count on cards) | blue | blue 10% | blue filled bookmark |
| Share | `Share post` | blue | blue 10% | — |

Tooltips (F5) on hover after ~600ms: `Reply`, `Repost` (`Undo repost` when active), `Like` (`Unlike`), `View`, `Bookmark`, `Share`, caret `More`, Grok `Explain this post`.

**Count formatting** (matches clone `formatCount`): `<1000` raw (`392`), then truncated one decimal under 10 (`1.1K`, `3.5K`, `7.3K`, `3.6M`, `61.7M` on detail), integer above (`13K`, `45K`, `89K`, `135K`, `61M` on card). Note: on the detail page the views figure keeps a decimal (`61.7M`) while the card showed `61M` → cards use the 2-significant style only under 10, detail timestamp row uses one decimal. Count changes animate: the count sits in `span[data-testid="app-text-transition-container"]` inside an `overflow:hidden` wrapper with `transition: transform .3s` (vertical roll). The clone's odometer (`AnimatedCount`) is fine.

**Like:** click → icon swaps instantly to the filled heart and colour goes pink; **no scale pop, no particle burst** (no CSS animation on any descendant; sampled every frame for 1s). Count roll 300ms. → Delta: the clone's `.t-like` pop + 8 particles is an embellishment; keep it only if desired (recommend reducing to colour swap + count roll for fidelity, or keep as intentional polish).

**Reply → reply modal** (opens over current page, URL becomes `/compose/post`; intercept route already exists for compose):
- Mask `[data-testid="mask"]` full-screen: **L** `rgba(180,180,182,0.5)`, **D** `rgba(0,0,0,0.5)` _(D value read during a theme flip; verify)_.
- Box: width **600px**, top **45px** (5vh), radius **16px**, bg **L** `#fff` **D** `rgb(20,20,20)`, `overflow:hidden`, height grows with content (346px empty, max ~90vh).
- App bar 53px: close X (`app-bar-close`, 36×36 at 8px inset, hover bg **L** `rgba(15,20,25,0.1)`), right `Drafts` text button (blue, 15px 700, 32px tall pill, `data-testid="unsentButton"`).
- **Parent tweet preview**: full `article` with avatar 40, name/badge/handle/· time, text (media shown only as `pic.x.com/…` link text), no action bar. Under the parent avatar a **connector line**: 2px wide, bg **L** `rgb(207,217,222)` [D `rgb(51,54,57)`], from 4px below the avatar down to the composer avatar.
- `Replying to @handle` row: 15px muted, `@handle` blue (it is a button that would open a "who to reply" picker), padding `0 16px`, row height 40px, left aligned with the text column (x = 64px).
- Composer row: own avatar 40, Draft.js textbox 20px/24px, min-height 96px, placeholder **`Post your reply`**.
- Toolbar (`data-testid="toolBar"`, 48px tall, aligned with the text column): icons Media, GIF, Poll, Emoji, Schedule, Location (disabled), Content disclosure (flag) — 36×36 each, blue; horizontally scrollable with Prev/Next 36px round buttons (`rgba(15,20,25,0.75)`, blur 4px) that appear when overflowing. In the reply modal there is **no** "Everyone can reply" row (that only exists on new posts / quote).
- Right: circular progress (after typing) + `Reply` button (`tweetButton`) 75×36 pill, bg foreground (**L** `rgb(15,20,25)`, white text), `opacity:0.5` + `cursor:default` while empty, opacity 1 after typing.
- Close/Escape with text → **"Save post?" sheet**: `Save post?` / `You can save this to send later from your drafts.` / buttons `Save` (filled foreground) and `Discard` (outline). Close with no text → closes immediately. Back navigation closes.
- Motion: modal and mask appear **instantly** (no fade/scale measured). Clone already does compose modal; add parent preview + connector + Replying to + save/discard sheet.
- Screens: `reply-modal.png` (L), `reply-modal-typed.png` (D), `reply-save-discard.png`.

**Repost menu** (`role=menu`, same menu styling as F2, width 113.95px, 2 items):
- `Repost` (`data-testid="retweetConfirm"`; when active `Undo repost`, `unretweetConfirm`) and `Quote` (an `<a href="/compose/post">`).
- Positioned over the button (top = button top). Screens: `repost-menu.png`.
- **Quote icon is new** (pencil with underline, 2 paths below) — clone's `QuoteIcon` differs.
- **Quote composer** (`/compose/post`, same modal shell): placeholder **`Add a comment`**; below the textbox the quoted post rendered as a compact quote card (radius 16, 1px border, header avatar 20 + name + handle + time, text, media full-width); then `Everyone can reply` (blue, globe icon, 15px 700) + 1px divider; toolbar; **`Post` button enabled even with empty text** (a bare quote is allowed). Screens: `quote-composer-modal.png` (D).

**Views → `/h/status/ID/analytics`** (others' posts): small modal (600 wide, ~329 tall, vertically centered, radius 16): close X top-left; content padding 0 100px: `Views` (~26px 800, estimated) / `Times this post was seen. To learn more, visit the Help Center.` (`Help Center` underlined link) / full-width 52px pill `Dismiss` (foreground bg). Own posts open the analytics page (not observable). Screen: `views-analytics-modal.png`.

**Bookmark:**
- Add → toast **`Added to your Bookmarks`** + action button **`Add to Folder`** (15px 700 white, `margin:0 12px`). `Add to Folder` for non-Premium navigates to `/i/verified-get-verified` (Premium upsell modal, level 3).
- Remove → toast **`Removed from your Bookmarks`** (no action).
- Screens: `toast-bookmark-added.png`, `toast-bookmark-removed.png`.

**Share menu** (same menu styling; width 180px; positioned over the share button, right-aligned to it):
- Text-only / photo posts: `Send via Chat` (chat bubble), `Copy link` (chain), `Share post via …` (upload arrow; calls `navigator.share`, no UI in desktop Chrome headless).
- Video posts add `Post Video` (pencil-square) and `Download video` (download arrow).
- `Copy link` → copies `https://x.com/h/status/ID` → toast **`Copied to clipboard`**.
- `Send via Chat` → modal **"Share"** (600×650 at top 125, back-arrow + centered title `Share`). For this account (no Chat passcode) it shows `Create Passcode` / `A personal key that secures your messages.` + 4 PIN circles (owned by 04-chat). Normal state (not observable): search field + recent conversations list with checkboxes + `Send` button. Clone: P1 — modal with search + user list (reuse `UserCell`) + "Send" → toast `Sent`.
- Screens: `share-menu.png`, `toast-copy-link.png`, `share-send-via-chat.png`.

<details><summary>Icons (SVG paths, viewBox 0 0 24 24)</summary>

```
QuoteIcon (new pencil, 2 paths)
M13.543 4.04275C15.3142 2.27164 18.1858 2.27164 19.957 4.04275C21.7282 5.81396 21.7282 8.68558 19.957 10.4568L11.2314 19.1834C10.4044 20.0104 9.31319 20.5208 8.14844 20.6267L2.89551 21.1043L3.37305 15.8513C3.47901 14.6866 3.99039 13.5953 4.81738 12.7683L13.543 4.04275ZM6.23145 14.1824C5.73525 14.6786 5.42881 15.3341 5.36523 16.033L5.10449 18.8943L7.9668 18.6346C8.66565 18.571 9.32019 18.2645 9.81641 17.7683L16.585 10.9988L13 7.41385L6.23145 14.1824ZM18.543 5.45682C17.5528 4.46675 15.9472 4.46675 14.957 5.45682L14.4141 5.99979L17.999 9.58475L18.543 9.04275C19.5331 8.05257 19.5331 6.44698 18.543 5.45682Z
M21 20.9998H12.207C12.3582 20.8723 12.5047 20.7382 12.6455 20.5974L14.2432 18.9998H21V20.9998Z
SendViaChatIcon
M12 4c-4.418 0-8 3.582-8 8 0 1.268.294 2.465.818 3.528.144.292.196.634.126.973l-.665 3.242 3.373-.63c.323-.061.647-.012.927.12C9.615 19.726 10.774 20 12 20c4.418 0 8-3.582 8-8s-3.582-8-8-8zM3.547 19.88zM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10c-1.473 0-2.874-.32-4.136-.893l-3.949.74c-1.047.195-1.96-.733-1.745-1.777l.781-3.808C2.341 14.968 2 13.522 2 12z
LinkIcon (Copy link)
M18.36 5.64c-1.95-1.96-5.11-1.96-7.07 0L9.88 7.05 8.46 5.64l1.42-1.42c2.73-2.73 7.16-2.73 9.9 0 2.73 2.74 2.73 7.17 0 9.9l-1.42 1.42-1.41-1.42 1.41-1.41c1.96-1.96 1.96-5.12 0-7.07zm-2.12 3.53l-7.07 7.07-1.41-1.41 7.07-7.07 1.41 1.41zm-12.02.71l1.42-1.42 1.41 1.42-1.41 1.41c-1.96 1.96-1.96 5.12 0 7.07 1.95 1.96 5.11 1.96 7.07 0l1.41-1.41 1.42 1.41-1.42 1.42c-2.73 2.73-7.16 2.73-9.9 0-2.73-2.74-2.73-7.17 0-9.9z
ShareIcon (Share post via … = same as action bar ShareIcon)
LikeActiveIcon (filled heart)
M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z
GlobeReplyIcon (Everyone can reply)
M12 1.75C6.34 1.75 1.75 6.34 1.75 12S6.34 22.25 12 22.25 22.25 17.66 22.25 12 17.66 1.75 12 1.75zm-.25 10.48L10.5 17.5l-2-1.5v-3.5L7.5 9 5.03 7.59c1.42-2.24 3.89-3.75 6.72-3.84L11 6l-2 .5L8.5 9l5 1.5-1.75 1.73zM17 14v-3l-1.5-3 2.88-1.23c1.17 1.42 1.87 3.24 1.87 5.23 0 1.3-.3 2.52-.83 3.61L17 14z
```
</details>

- **Data model needed:** `stats.views`, `stats.bookmarks`, `stats.quotes`; drop `derive-views.ts`.
- **Routing:** reply & quote reuse the `/compose/post` intercept, passing `?reply_to=ID` / `?quote=ID` (or a client store). `/h/status/ID/analytics` → `@modal` intercept with page fallback = status page + modal.
- **Implementation notes:** Views must become a `<Link>`; share/repost menus use the shared dropdown; toasts need an action-button variant (see Cross-cutting).

### F4. User hover card (`[data-testid="HoverCard"]`)

- **Level / entry points:** level 2 popover. Triggers: card avatar, display name link, handle link, `@mention` links in text and bios, user cells; also on the focal tweet and inside the photo-viewer side panel.
- **Clone status:** MISSING (inventory §4 "no hover cards").
- **Suggested priority:** P0 · **Complexity:** M (new shared `HoverCard` primitive + `UserHoverCard` content).
- **Layout & measurements** (measured **D**):
  - Card: width **300px**, height content (~300–322px), padding **16px**, radius **16px**. **D** bg `rgb(20,20,20)`, shadow `rgba(0,0,0,0.5) 0 4px 12px, rgba(0,0,0,0.35) 0 0 2px`. **L** (standard X, same as menus): bg `#fff`, shadow `rgba(101,119,134,0.2) 0 0 15px, rgba(101,119,134,0.15) 0 0 3px 1px`.
  - Row 1: avatar **64×64** (link 68×68 with a 2px ring in card bg colour), Follow button top-right: 36px tall pill, padding `0 16px`, 15px **700**; unfollowed = light pill (**D** bg `rgb(239,243,244)`, text `rgb(15,20,25)`), followed = outline `Following` (→ `Unfollow` red on hover, same as clone's FollowButton). `aria-label="Follow @handle"`.
  - Name: 17px/20px **700** + badge (17px) — 8px below avatar; handle 15px muted below.
  - Bio: 15px/20px with entities (blue mentions/links), 12px below handle.
  - Counts row (12px below bio): `1,245` 14px **700** foreground + ` Following` 14px muted; 20px gap; `8,372` + ` Followers`. Links → `/h/following` and **`/h/verified_followers`**. Hover underline.
  - `Followed by A, B, and N others you follow` row with stacked 20px avatars (not observed — viewer follows only 4 accounts; standard X).
  - Full-width **`Profile Summary`** button: 36px outline pill (1px border **D** `rgb(83,100,113)`), Grok icon 20px + 15px **700** text — opens Grok with a profile summary (04-grok). Clone: P2 (render as inert or link to `/i/grok`).
- **Behaviour:**
  - Open delay **≈600ms** after `mouseenter` (measured 616 / 635ms; a 250ms hover never opens it).
  - Close delay **≈600ms** after `mouseleave` (measured 604 / 612 / 616ms). Moving the pointer **into** the card keeps it open; leaving the card closes after the same delay.
  - Position: horizontally **centered on the anchor** (avatar center 379.5 = card center 379.5), **10px below** the anchor's bottom; clamps to viewport; flips above when no space below.
  - Only one card at a time. Clicking anywhere in the card (except buttons/links) navigates to the profile.
- **Motion:** fade-in only: opacity 0→1 over **~250ms ease-out**, starting ~40ms after insertion (samples 53ms .05, 86ms .29, 119ms .58, 153ms .77, 186ms .89, 219ms .95, 253ms .99, 286ms 1). No scale/translate. Close: instant removal.
- **Data model needed:** `UserSummary` + `bio`, `followingCount`, `followersCount`, `followedByViewer`, `verified`, `followedBy: UserSummary[]` (mutuals preview) — i.e. hover card needs full `User`; fetch lazily via a `getUserCard(handle)` api in `features/profile/api` or pass `User` in mocks.
- **Implementation notes:** new `components/ui/hover-card.tsx` (portal, open/close timers 600/600, pointer-safe area anchor+card, `prefers-reduced-motion` → no fade). Disable on touch. Must not trigger the card overlay link (render in portal).
- **Screenshots:** `hovercard-avatar.png`, `hovercard-avatar-light.png` (both captured while the theme was D).

### F5. Tooltip (`[role="tooltip"]` > `span[data-testid="HoverLabel"]`)

- **Clone status:** MISSING (no tooltip primitive). **Priority:** P0 · **Complexity:** S.
- **Spec:** bg `rgba(70,70,70,0.9)` (measured in L; D not measured), text **white 11px / 12px**, weight 400, padding `4px 8px`, height 20px, computed `border-radius:16px` (i.e. fully rounded pill ends at this height), `margin:1px 0`.
- **Copy:** actions `Reply`, `Repost`, `Like`, `View`, `Bookmark`, `Share`, `More`, `Explain this post`; timestamp → full date `8:21 PM · Oct 4, 2026`.
- **Delay:** ~**600ms** after mouseenter (measured 607–625ms). Hide: **immediately** on mouseleave (3ms). Re-entering re-applies the delay.
- **Placement:** default **below** the anchor, horizontally centered, 2px gap from the anchor's hit box (incl. the 34.75px hover circle); flips **above** when the anchor is near the viewport bottom (action bar at y 880 → tooltip above).
- **Motion:** opacity 0→1 + `scale(0.95)`→`scale(1)` over **~150ms** ease-out (X keyframe `r-12fruu6 { 0% {opacity:0; transform:scale(.95)} 100% {opacity:1; transform:scale(1)} }`).
- **Screenshot:** `tooltip-timestamp.png`, `action-like-hover.png`.

### F6. Media

- **Clone status:** PARTIAL — `tweet-photos.tsx`, `photo-carousel.tsx`, `quoted-tweet.tsx`. Single photo + carousel exist; MISSING: photo viewer route, video player, duration/ALT/GIF badges, link cards, polls, nested quote, article card.
- **Priority:** P0 photo viewer, link cards, polls (read-only + vote locally); P1 video player (use `<video>` with mp4 mocks), nested quote; P2 ALT/GIF badges, article card. **Complexity:** L overall.

**Single photo:** frame = content width **518px** incl. 1px border (**L** `rgb(207,217,222)`, **D** `rgb(47,51,54)`), radius **16px**. Height follows the natural aspect ratio (observed 518×165 for 3.16:1, 518×292 for 16:9, 518×518 square). **Portrait cap: inner height 510px** (frame 512) with width = aspect × 510 (e.g. 383×512, 235×512) — the frame shrinks and stays left-aligned. Clone matches (SINGLE_MAX_HEIGHT 510). Click → photo viewer.

**2–4 photos = horizontal carousel** (X no longer uses the 2×2 grid in timelines): `[data-testid="ScrollSnap-List"]` `role=tablist`, `scroll-snap-type:x mandatory`, `gap:4px`, `padding:2px 12px`, `margin:0 -10px` (bleeds 10px into the card padding), `scroll-padding-left:12px`. Tiles radius **8px**, 1px border (**L** `rgb(239,243,244)`), each linking to `/h/status/ID/photo/N`.
- **Row height rule:** the first two tiles exactly fill the row: `H = (rowWidth − 4px gap) / (aspect1 + aspect2)` — e.g. aspects .70+.72 → H 363.7 (tiles 253.7 + 260.3); 1.0 + .54 → H 334.6. When the two landscape aspects would make H too small it is clamped (observed 312.1px with 432px-wide tiles on the detail page) and tiles overflow → scroll. Clone uses a fixed 352.23px tile height → delta.
- Prev/Next buttons: `ScrollSnap-prev/nextButtonWrapper`, 36×36 round, bg `rgba(15,20,25,0.75)`, `backdrop-filter: blur(4px)`, white arrow icon, margin `0 4px`, vertically centered; wrapper `opacity:0` → 1 on carousel hover (`transition: opacity .2s`); hidden at the start/end. Clone already has this.

**Photo viewer** (`/h/status/ID/photo/N`, the author of the media tweet in the URL; rendered as a modal over the page you came from):
- Layers: full-screen mask `rgba(0,0,0,0.4)`; media pane **left 1050px** (= viewport − 350) bg `rgba(0,0,0,0.9)`; **right panel 350px** with the tweet + replies (bg = page bg; **L** `#fff`).
- Image: `object-fit: contain` inside the pane minus a **48px bottom action bar** (image box 852×852 for a square at 900px viewport height), centered.
- Top-left **Close** (36×36 at 12,12, bg `rgba(0,0,0,0.75)`, white X 20px). Top-right of the pane **Hide post** (double-chevron-right icon) → collapses the side panel: the pane becomes full width, image recenters, the button moves to the top-right of the viewport and becomes **View post** (double-chevron-left).
- Arrows: `Next slide` / `Previous slide` 36×36 round `rgba(0,0,0,0.75)` at the vertical middle, 12px from the pane edges; hidden at first/last. **Keyboard:** `→` / `←` change photo and the URL (`/photo/1` → `/photo/2`), **Esc** closes (history back to the origin URL). No visible counter ("1/4") — position only via URL.
- Bottom action bar (centered under the image, 48px tall): Reply, Repost, Like, Views, Share — white icons + white 13px counts, same hover tones.
- Side panel: compact focal post (avatar 40, name/badge/handle stacked, `Follow` pill 32px, Grok, caret), text 17px/24px, `8:17 AM · Aug 19, 2025 · 4M Views`, action bar **with** Bookmark count (`3.1K`), row `Relevant ⌄` + `View quotes ›`, inline `Post your reply` composer, replies list (scrolls independently).
- Motion: the overlay appears after data load (~170ms) with **no fade/zoom**; reply cells slide in (translateY) as they load. No pinch-zoom on desktop.
- Screens: `photo-viewer.png` (L), `photo-viewer-hover.png`, `photo-viewer-collapsed.png`, `photo-viewer-2.png`.

**Video (inline):**
- Same frame as photos (radius 16, 1px border). Landscape → full width at its aspect (516×290 for 16:9); portrait 9:16 → 284.88×505.77 (same 510 cap rule).
- **Autoplays muted** when in view (`<video>` `muted`, not looped, `poster` set), pauses when scrolled away.
- Idle overlays: **duration badge** bottom-left (12px inset): bg `rgba(0,0,0,0.77)`, radius 4px, padding `0 8px`, height 20px, text white 13px/16px (`2:54`, counts down while playing); **mute toggle** bottom-right: 40×40 button (`data-testid="mute-button"`, aria `Unmute`/`Mute`), round dark 32px circle with white speaker icon.
- On hover the control bar appears: scrubber (full width, 20px hit area, `data-testid="scrubber"`, `Seek slider` 32px thumb hit area), `Pause`/`Play` (36×36), elapsed `0:03 / 2:59` (white 13px), `Unmute` + `Volume slider` (vertical popover), `Video Settings` (gear: speed/quality), `Picture-in-Picture`, `Full screen`. Not-yet-started videos show a centered 60×60 play button (`aria-label="Play Video. 22 seconds long"`).
- Click on the video toggles play/pause — **no route change, no viewer** (observed). Full screen uses the browser Fullscreen API.
- `GIF` and `ALT` badges (re-checked 2026-10-08 on live X + its `bundle.Routes` source): 20px tall, `padding: 0 8px`, radius 4, 13px/700/16 white, bg **`rgba(0,0,0,0.3)`** (the `alt`/`gif` badge types fall through to `translucentBlack30`; duration badges use `rgba(0,0,0,0.77)` and regular weight). Absolute at `left: 12px; bottom: 12px` of each photo.
  - **ALT shows only when** the photo has `ext_alt_text` **and** (the post is the viewer's own, or it is the focal tweet on the detail page — `shouldShowAltLabelAlways`). It never shows on other people's posts in timelines.
  - ALT is a `role=button` (`aria-describedby` → hidden "read image description"). Click (not hover) opens a 360px popover with arrow (`M22 17H2L12 6l10 11z`, ~13.6×7.4), radius 16, padding 32, D shadow `0 0 15px rgba(255,255,255,.2), 0 0 3px 1px rgba(255,255,255,.15)`: `Image description` (26px/700/32), alt text (15/20 muted, `padding: 8px 0 20px`), `Dismiss` outline button (54px tall, `padding: 16px 32px`, 17px/700, hover `foreground` 10%). Escape and outside click close it. On narrow screens X uses a bottom sheet instead (not built).
- Screens: `video-inline.png`, `video-inline-hover.png` (controls), `video-inline-timeline.png`.

**Link preview cards** (`[data-testid="card.wrapper"]`, an `<a href="https://t.co/…">` overlay):
- **summary_large_image** (`card.layoutLarge.media`): frame 518 wide, radius 16, 1px border; image 516×270.2 (**1.91:1**) with **no text block below**; instead a **domain/title chip** overlaid bottom-left at 12px inset: bg `rgba(0,0,0,0.77)`, radius 4px, padding `0 8px`, height 20px, white 13px/16px text (e.g. `X Developer Platform`). Promoted cards add `From google.com` below (ads only).
- **summary** (`card.layoutSmall.media` + `card.layoutSmall.detail`): height **131px** (129 inner); square image **129×129** on the left, 1px divider; detail block padding **12px**: domain 15px/20px muted (`devcommunity.x.com`), title 15px/20px foreground (1 line, ellipsis), description 15px/20px muted (2 lines clamp).
- Video/broadcast card (`card.layoutLarge.detail`): image 516×290 with two joined chips bottom-left `48:10` | `22.9K views` (radius `4px 0 0 4px` / `0 4px 4px 0`), then a detail block (padding 12): 24px avatar + name 700 + handle muted, title on the next line.
- Hover: whole card bg **L** `rgba(0,0,0,0.03)`.
- Screens: `card-large.png`, `card-small.png`, `card-largeDetail.png`.

**Polls** (`[data-testid="cardPoll"]`):
- **Open** (`role=radiogroup aria-label="Poll options"`, hidden helper text `When you make a selection it c…`): options = full-width **32px pills** (`role=radio`), radius 9999, **1px solid `rgb(29,155,240)`**, padding `0 15px`, label centered **15px 700 blue**, 4px gap between options; hover bg blue 10% _(standard)_. Footer 13px below: `447 votes · 23 hours left` (15px muted; also `· 6 days left`, `· 12 minutes left`). Not voted (rule: do not vote).
- **Results / Final**: list of rows 32px tall, 4px gap; bar = `width: pct%` of the full row, radius **4px**, losing bars **L** `rgb(207,217,222)` [D `rgb(51,54,57)`], **winning bar `rgba(29,155,240,0.58)`**; label at 12px left padding 15px (winner **700**), percentage right-aligned 15px (winner **700**), one decimal when needed (`31%`, `24.1%`). Footer `29 votes · Final results`. After voting on an open poll, your choice gets a check icon after its label _(not observed)_.
- Screens: `poll-open.png` (D), `poll-final-results.png` (L).

**Quote card** (inside a tweet): radius 16, 1px border, `role=link`, hover bg `rgba(0,0,0,0.03)` / `rgba(255,255,255,0.03)`; header 12px padding: 20px avatar, name 700, badge, handle, `· time` (15px); text 15px/20px clamped; media full-bleed below the text. Already in clone.
- **Nested quote** (quote of a quote) is NOT rendered recursively: the inner one becomes `[data-testid="nestedQuotePreview"]`, a 108px-tall compact row inside the quote card (bg **D** `rgba(255,255,255,0.03)`, inset 12px): 64×64 thumbnail (radius 8, `nestedQuotePreviewMedia`) + name/handle/time + 2–3 lines of text. Clone: MISSING (P1).
- **Article card** (X Articles): inside the quote, cover image `[data-testid="article-cover-image"]` 492×196.8 (2.5:1) radius **12px**, then `Article` label + bold title + excerpt. P2.
- **Unavailable**: `This post is unavailable.` / `This post is from an account that no longer exists. Learn more` in a grey rounded box (bg **L** `rgb(247,249,249)`, radius 16, padding 16, 15px muted) — _not observed_, standard X.
- Screens: `quote-nested.png`, `quote-with-article.png`, `card-pinned-quote.png`.

- **Data model needed:**
  - `TweetMedia`: `type: "photo" | "video" | "gif"`, `durationMs?`, `videoUrl?`, `posterUrl?`, `alt` (exists).
  - `LinkCard = { kind: "summary" | "summary_large_image"; url: string; tcoUrl: string; domain: string; title: string; description?: string; imageUrl: string }`.
  - `Poll = { options: { label: string; votes: number }[]; endsAt: string; totalVotes: number; viewerChoice: number | null }`.
  - `QuotedTweet.quotedTweet?: { id, author, text, thumbUrl } | null` for the nested preview; `QuotedTweet.unavailable?: boolean`.
- **Routing:** `/[handle]/status/[id]/photo/[index]` → `@modal/(.)[handle]/status/[id]/photo/[index]` intercepted viewer; hard load = status page with the viewer open. `video/[index]` not needed (no viewer on click).

<details><summary>Icons (viewer)</summary>

```
CloseIcon (viewer, same as existing CloseIcon)
M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z
HidePanelIcon (double chevron right, "Hide post"); mirror horizontally for "View post"
M11.59 12L3.54 3.96l1.42-1.42L14.41 12l-9.45 9.46-1.42-1.42L11.59 12zm7 0l-8.05-8.04 1.42-1.42L21.41 12l-9.45 9.46-1.42-1.42L18.59 12z
ArrowRightIcon (Next slide / carousel next; exists in clone)
M12.957 4.54L20.414 12l-7.457 7.46-1.414-1.42L16.586 13H3v-2h13.586l-5.043-5.04 1.414-1.42z
PlayIcon (60px play overlay, viewBox 0 0 60 61)
M22.2275 17.1971V43.6465L43.0304 30.4218L22.2275 17.1971Z
```
</details>

### F7. Tweet detail page (`/h/status/ID`) and subpages

- **Clone status:** PARTIAL — `app/(app)/[handle]/status/[id]/page.tsx`, `features/tweet/components/focal-tweet.tsx`, `reply-composer.tsx`.
- **Priority:** P0 (focal layout deltas, sort control, post-activity pages); P1 (Show probable spam, likes page for own posts). **Complexity:** M.
- **Header:** `PageHeader` title **`Post`** (20px 700) + back arrow. (A hidden `Conversation` heading exists for a11y.)
- **Focal tweet** (measured **D**):
  - `article[tabindex="-1"]`, padding `0 16px`, 12px top.
  - Row: avatar 40 | name (15px 700 + badges) over handle (15px muted) | right: **`Follow` pill** (14px 700, 32px tall, light bg) when not following, Grok button, caret. Clone lacks the Follow pill and Grok.
  - Text **17px / 24px**, starts 16px below the avatar row. Media/quote/card margin-top 12px.
  - **Timestamp row** 16px below content: `5:38 AM · Oct 4, 2026 · 61.7M Views` — time 15px muted (link to the same status, hover underline), `·`, views count **14px 700 foreground** + ` Views` 14px muted. Clone shows `toLocaleString` (`61,724,945 Views`) → use one-decimal compact format.
  - Optional lines (not observed): `Last edited 3:15 PM · Oct 5, 2026` (edited posts), `Who can reply? People @x follows or mentioned can reply` box.
  - **No engagement-stats row** (Quotes / Reposts / Likes / Bookmarks counts row is gone). Instead the **action bar shows counts**: Reply `3.5K`, Repost `4.6K`, Like `89K`, Bookmark `7.3K`, Share (no Views button). Bar height **48px**, `padding:0 4px`, **border-top 1px** (D `rgb(47,51,54)`), icons **22.5px**, counts 13px muted; 5 equal columns (134px pitch). Clone has border-y and no bookmark count → delta.
  - Then a row (height ~29px, border-bottom 1px): left **`Relevant ⌄`** (14px **500** muted + 12px chevron; `aria-haspopup="menu"`), right **`View quotes ›`** (14px 500 muted, link → `/h/status/ID/quotes`).
- **Sort replies menu** (standard menu styling, 135px wide, opens over the button): header `Sort replies` (15px 700, ~53px row) then items `Relevant` (✓ check icon on the selected one), `Recent`, `Likes`. Selecting reorders replies; button label changes to the selection. Clone: MISSING (replies newest first only). Screen: `detail-reply-sort-menu.png`.
- **Inline reply composer**: collapsed row 56px: own avatar 40 + `Post your reply` placeholder (20px/24px) + `Reply` pill (75×36, disabled `opacity .5`, bg foreground-inverted **D** `rgb(239,243,244)`). Focus → expands: `Replying to @elonmusk` row appears above (15px muted, `@handle` blue), toolbar (48px, `toolBar`) appears below; whole block `data-testid="inline_reply_offscreen"`. Clone already does this (`reply-composer.tsx`) — keep.
- **Replies:** standard cards, default order **Relevant** (engagement-ranked; ads interleaved as `Ad` cards). Reply chains (author → reply → reply) render with the 2px connector between avatars (clone has `threaded`). At the end: a full-width 48px button row **`Show probable spam`** (15px blue, centered, border-bottom) that reveals hidden low-quality replies. Infinite scroll (clone: first 20 only).
- **"Discover more" / "More replies" sections:** _not observed_ this session (X sometimes appends a `Discover more` heading + `Sourced from across X` + recommended posts after replies).
- **Subpages ("Post activity")**:
  - `/h/status/ID/quotes` — header `Post activity` (20px 700) + back; tabs **`Quotes`** | **`Reposts`** (each 50% width, 53px tall, standard tab underline); quotes = timeline of tweet cards (each with the quoted original embedded). Empty: `No Quotes yet` / `You will find a list of everyone who quoted this post here.`
  - `/h/status/ID/retweets` — same header + tabs, list of `UserCell`s (avatar 40, name, handle, bio, `Follow` pill; row padding `12px 16px`).
  - `/h/status/ID/likes` — only for your own posts (likes are private); for others it **redirects to the status page**. Own: third tab `Likes` (not observable).
  - `/h/status/ID/analytics` — Views modal (F3) for others' posts.
- **Routing:** add `routes.tweetQuotes/tweetReposts/tweetLikes/tweetAnalytics/tweetPhoto`. Subpages are full pages (PageHeader + tabs) using the existing `ui/tab.tsx`.
- **Screens:** `detail-focal.png` (D), `detail-reply-sort-menu.png`, `detail-inline-reply-expanded.png`, `detail-bottom.png` (Show probable spam), `detail-sub-quotes.png`, `detail-sub-retweets.png`, `detail-sub-likes.png` (redirected), `caret-view-post-activity.png` (empty quotes state), `detail-multi-photo-carousel.png`.

<details><summary>Icons</summary>

```
ChevronDownSmall (Relevant ⌄)
M3.543 8.96l1.414-1.42L12 14.59l7.043-7.05 1.414 1.42L12 17.41 3.543 8.96z
ChevronRightSmall (View quotes ›)
M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z
CheckIcon (selected sort)
M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z
```
</details>

## Cross-cutting findings

1. **Elevated surface tokens (new in 2026 X):** in Lights-out, menus, hover cards, modals and the Grok panel use **`rgb(20,20,20)`** (not pure black) with shadow `rgba(0,0,0,0.5) 0 4px 12px, rgba(0,0,0,0.35) 0 0 2px`. Light: `#fff` with `rgba(101,119,134,0.2) 0 0 15px, rgba(101,119,134,0.15) 0 0 3px 1px`. Add tokens `--color-surface-elevated`, `--shadow-popover`.
2. **Menu primitive** (extend `ui/dropdown-menu.tsx`): radius 12, items 44px / `12px 16px` / 15px 700 / icon 18.75 + 12px gap, hover `rgba(fg,0.03)`, optional header row (`Sort replies`), optional check mark, destructive variant (red `rgb(244,33,46)`). Placement: **over the anchor**, top/right-aligned to it, flip up/left. Motion: height/clip reveal ~140ms ease-out, close instant.
3. **Tooltip primitive** (new `ui/tooltip.tsx`): see F5 — 600ms delay, instant hide, below-by-default with flip, 150ms fade+scale(.95→1), `rgba(70,70,70,0.9)` bg, 11px white text, padding 4×8.
4. **HoverCard primitive** (new `ui/hover-card.tsx`): see F4 — 600ms open / 600ms close, pointer can travel into the card, centered 10px below anchor, 250ms fade-in, portal.
5. **Modal primitive** (new `ui/modal.tsx`, replace ad-hoc ComposeModal/LogoutDialog scrims): mask `[data-testid=mask]` **L** `rgba(180,180,182,0.5)` / **D** `rgba(0,0,0,0.5)` (verify); box width **600px**, radius **16px**, positioned `top: 45px` for compose-type (grows with content) or vertically centered for fixed-height ones (650px tall Lists/Report/Share, 329px Views); app bar 53px with close X (36×36, 8px from left) + optional title (20px 700) + optional right action pill; **no enter/exit animation** (instant, as measured); Esc + mask click close; focus trap; body scroll lock. Variants: `ConfirmationSheet` (320px wide, padding 32, title 20px 700, body 15px muted, stacked 44px buttons with 12px gap: primary filled / destructive red / secondary outline).
6. **Toast** (extend `ui/toast.tsx`): bottom-center, **32px** from the bottom, bg **accent `rgb(29,155,240)`**, white 15px text, padding 12px, radius **4px**, height 44px, optional inline action button (15px **700** white, margin `0 12px`), `transition: opacity .17s linear` (fade in/out), lifetime ≈ 4s, one at a time (new replaces old). Copy list: `Copied to clipboard`, `Added to your Bookmarks` + `Add to Folder`, `Removed from your Bookmarks`, (`@x has been muted.` + `Undo`, `Your post was sent.` + `View` — existing).
7. **Media viewer modal** (new feature module `features/media-viewer`): see F6 — 1050/350 split, 48px bottom action bar, Close / Hide-post / arrows 36px `rgba(0,0,0,0.75)` buttons, keyboard ←/→/Esc, URL-driven index.
8. **Count formatting:** reuse `formatCount`; add `formatViewsDetail` (one decimal M/K: `61.7M`).
9. **Entity parser** + **badge** components are needed by profile, search, notifications, DMs too (shared `components/ui/verified-badge.tsx`, `components/tweet/tweet-text.tsx`).

## Community Notes and sensitive media (added 2026-10-08)

**Community Notes block** (`data-testid="birdwatch-pivot"`, observed live on a noted post, same in cards and on the detail page). Sits after the quote and before the action bar / timestamp.
- Box: `margin-top: 12px`, 1px border (D `border`), radius 16, `role=link` → `/i/birdwatch/n/{noteId}`; hover tints the whole box (L `rgba(0,0,0,.03)`, D derived `white/3`), `transition: background-color .2s`.
- Header (44px): padding 12, tinted bg (same value as hover), `icon-birdwatch-fill` 18.75px accent + 8px gap, `Readers added context they thought people might want to know` 14px/700/16 (`padding: 2px 0`).
- 12px gap, body `padding: 0 12px`, 15/20, note text with URL entities (accent, X display truncation), 12px gap.
- Footer (57px): border-top 1px, padding 12, `Do you find this helpful?` 14/16 left; `Rate it` outline pill right (32px, `padding: 0 16px`, 14px/700, D border `outline`) → same note URL.
- Below the box: `Context is written by people who use X, and appears when rated helpful by others. Find out more.` 13/16 muted, `padding: 12px 0`; `Find out more` (accent) → `/i/flow/join-birdwatch`.

**Sensitive-media interstitial** (from X's `RevealableTombstone` source; **not observed** live because it depends on the viewer's "Display media that may contain sensitive content" setting).
- Media layer `filter: blur(30px)`, container `min-height: 16em`, radius 16, overflow hidden; cover `rgba(0,0,0,.5)`, `padding: 12px 16px`, content column max 400px with `padding: 0 12px`.
- Eye-off icon 24px white (12px below), `Content warning: {list}` bold white (12px below), then `The post author flagged this post as showing sensitive content.` white. Categories: `adult_content` → Nudity, `graphic_violence` → Violence, `other` → Sensitive content (first capitalised, the rest lower-case, joined as an English list).
- `Show` button: small (32px), `padding: 0 12px`, right-aligned, 12px margin-top, bg `#F7F9F9` text `#0F1419`. After revealing, a `Hide` button sits at `top: 12px; right: 16px` (bg `#0F1419` opacity .75, `backdrop-filter: blur(4px)`, white).

## Open questions / not observed

- **Own-post caret menu** (Delete / Pin / Change who can reply / Edit…): the account has no own posts; listed from current X knowledge, not verified. Nothing was posted.
- `Not interested in this post` inline result, `Mute` toast, `Request Community Note`, `Edit image`: not executed (safety / external).
- Community-notes block, "Edited" label, reply-restriction box, sensitive-media interstitial, `ALT` and `GIF` badges, "This post is unavailable", "Discover more" section, "Followed by …" row in hover cards: not encountered on the sampled timelines.
- Send via Chat normal state (recipient picker) not visible because the account has no Chat passcode set (only the `Create Passcode` gate was seen; no passcode created).
- Repost was not executed (only the menu was opened); like and bookmark were executed and **reverted** (like → unlike, bookmark → remove; verified final state).
- Dark-mode mask colour `rgba(0,0,0,0.5)` was read once during a theme flip — verify. Tooltip `border-radius` computed as 16px on a 20px-tall label.
- Photo-viewer in Dark theme and the hover card in Light theme were not captured (values given from the other theme + standard X).
