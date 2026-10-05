# 00 — Clone inventory (state of x-web before v2)

Snapshot taken 2026-10-05 from `src/` (commit 44280d4 + OG metadata change). Paths are relative to `src/`.
Labels: **FUNCTIONAL** (works), **VISUAL** (renders, click does nothing — inert `<button>` without `onClick`), **MISSING** (not in code).
`docs/PROJECT.md` v1 scope deliberately left DMs, notifications, search, media upload, video, lists, communities, spaces and premium "Out". v2 revisits that.

## 1. Routes

`config/routes.ts`: `home "/"`, `login`, `register`, `logout "/logout"`, `landing "/i/landing"`, `expiredSession "/i/session-expired"`, `composePost "/compose/post"`, `profile(h) "/h"`, `profileReplies(h) "/h/with_replies"`, `tweet(h,id) "/h/status/id"`. Nothing else.

| Route | File | Status |
|---|---|---|
| `/` | `app/(app)/page.tsx` | FUNCTIONAL — TimelineHeader + inline Composer + TimelineFeed |
| `/[handle]` | `[handle]/page.tsx` | FUNCTIONAL — profile, Posts tab |
| `/[handle]/with_replies` | `[handle]/with_replies/page.tsx` | FUNCTIONAL — Replies tab |
| `/[handle]/status/[id]` | `[handle]/status/[id]/page.tsx` | FUNCTIONAL — redirects to canonical handle |
| `/compose/post` | `compose/post/page.tsx` | FUNCTIONAL — hard load = Home + ComposeModal (`dismiss="home"`) |
| `/logout` | `logout/page.tsx` | FUNCTIONAL — LogoutDialog |
| `(app)/layout.tsx` | | redirects to `/i/session-expired` without session (handled in `proxy.ts`) |

- `@modal`: `(.)compose/post` (ComposeModal, `dismiss="back"`), `(.)logout`, `[...catchAll]` + `default` → `null`.
- `@panel` (right column): `page.tsx` home panel (Premium, News, Trends, Who to follow); `[handle]` → "You might like" + Trends; `[handle]/status/[id]` → "Relevant people" + Trends; `logout`/`default`/`[...catchAll]` → home panel.
- Unknown single-segment routes (`/explore`, `/notifications`…) match `[handle]` → `notFound()`. No `not-found.tsx`, `error.tsx`, `loading.tsx` anywhere. Multi-segment (`/i/bookmarks`, `/h/followers`) 404.
- `findUserByHandle` is case-sensitive (`/elpepodev` 404s, X is case-insensitive).
- Signed-out: anything but `/`, `/login`, `/register` → `/`.

## 2. Left sidebar (`components/layout/sidebar.tsx`)

Fixed width 275px (`w-sidebar`), **no responsive/icon-only collapse**.

| Item | Icon | href | Status |
|---|---|---|---|
| X logo | XLogoIcon | `/` | FUNCTIONAL |
| Home | HomeIcon / HomeActiveIcon | `/` | FUNCTIONAL + active state |
| Explore, Notifications, Follow, Chat, Grok, History, Creator Studio, Premium | own icons | — | VISUAL |
| Profile | ProfileIcon / ProfileActiveIcon | `/{viewer.handle}` | FUNCTIONAL |
| More | MoreIcon | — | VISUAL, no popover |

- Active state = exact `usePathname() === href` (Profile not active on `/h/with_replies` or status pages).
- No unread badges. Filled active icons exist only for Home and Profile.
- Post button → `/compose/post` (intercepted modal). FUNCTIONAL.
- Account switcher (`account-menu.tsx`): 300px dropdown above trigger with arrow. "Add an existing account" VISUAL; "Log out @handle" FUNCTIONAL.

## 3. Home

- Timeline header (`features/feed/components/timeline-header.tsx`): "For you" hard-coded active; "Following" VISUAL; "+" (manage timelines / pinned lists) VISUAL.
- "For you" feed is really a following feed (followed + viewer, newest first, `get-timeline.ts`). No separate Following feed.
- Feed: infinite scroll FUNCTIONAL (IntersectionObserver, 1000px rootMargin, page size 10). MISSING: "Show N posts" pill, loading spinners (Suspense fallbacks are `null`).
- Composer (`features/compose/components/composer.tsx`):
  - textarea auto-size FUNCTIONAL; "Everyone can reply" VISUAL (inline variant reveals on focus, max-height/opacity 250ms).
  - Toolbar (`composer-toolbar.tsx`, no `onClick`): Media, GIF, Poll, Emoji, Schedule, Content disclosure → VISUAL; Location `disabled`.
  - Character counter FUNCTIONAL (SVG ring, warning ≤20, danger over 280, ring grows 20→30px).
  - Post: server action `createTweet` → toast "Your post was sent." + View. Static 3px progress bar while pending.
  - MISSING: thread "+", media attachments/preview, drafts.
- Compose modal (`compose-modal.tsx`): Close/Escape/backdrop/scroll lock/autofocus FUNCTIONAL; "Drafts" VISUAL; no focus trap, no enter/exit animation.

## 4. Tweet card (`components/tweet/tweet-card.tsx`)

- Whole card is an overlay link to the status page.
- "X reposted" header code exists but `mockRetweets` is empty and `toggleRetweet` doesn't feed it → never shown.
- Avatar/name/handle link to profile; **no hover cards**. No verified badge (`VerifiedIcon` exported, unused; type has no `verified`).
- Text is plain `whitespace-pre-wrap`: MISSING links/@mentions/#hashtags parsing, "Show more" truncation, translate. "Replying to" not rendered on cards (only in QuotedTweet).
- "..." (`more-button.tsx`) VISUAL, no menu.
- Actions (`tweet-actions.tsx`):
  - Reply VISUAL (no reply modal).
  - Repost dropdown (`repost-menu.tsx`): Repost/Undo FUNCTIONAL; Quote VISUAL.
  - Like FUNCTIONAL (optimistic, pop + particle burst + rolling count).
  - Views VISUAL, fake count `(replies+1)*1337` (`utils/derive-views.ts`).
  - Bookmark FUNCTIONAL (optimistic, icon swap), no toast, no bookmarks page.
  - Share VISUAL.
- Photos: single photo (portrait capped 510px) / carousel for 2+ (snap scroller, hover arrows). Clicking a photo opens the status page — **no photo viewer, no `/photo/N` route**.
- Videos: data has `type:"video"` but URLs are thumbnails; rendered as images. No player, play button or duration badge.
- Quoted tweets FUNCTIONAL (card, clamped text, media variants). No nested quotes, no "This post is unavailable".
- MISSING: polls, link-preview cards, community notes, "Edited", reply-restriction indicator, pinned tweets, sensitive media warning, "Show this thread".

## 5. Tweet detail (`app/(app)/[handle]/status/[id]/page.tsx`)

- PageHeader "Post" + back (history.back, home fallback). Ancestors threaded with connector; ScrollAnchor.
- Focal tweet (`features/tweet/components/focal-tweet.tsx`): 17px text, photos, quote, full date, "N Views" (not a link). Actions without Views. MISSING: "Replying to", Quotes/Reposts/Likes/Bookmarks counts row, "Who can reply", "View post analytics". "..." VISUAL.
- Reply composer (`reply-composer.tsx`) FUNCTIONAL (collapsed → expanded with "Replying to @x", toolbar VISUAL, counter, publishing increments reply count).
- Replies newest first, first 20 only, no pagination, no sort selector (Relevancy/Recent/Likes).
- Subpages `/quotes`, `/retweets`, `/likes`, `/analytics`, `/photo/N` MISSING.

## 6. Profile (`features/profile/*`)

- PageHeader with name + "N posts".
- Banner 3:1 (grey fallback, 107/124 users have none), not clickable. Avatar 133.5px, not clickable.
- Own profile "Edit profile" VISUAL. Others: "More" VISUAL, "Message" VISUAL, Follow FUNCTIONAL (hover "Unfollow" red).
- Bio plain text. Join date only. MISSING: location, website, birthday, "Follows you", "Followed by…", verified, professional category, subscribe.
- Following/Followers counts VISUAL (no pages).
- Tabs: Posts FUNCTIONAL, Replies FUNCTIONAL, Reposts VISUAL, Media VISUAL; Highlights, Articles, Likes MISSING.
- Inline "Who to follow" module after 5th post (Show more VISUAL). First 20 items only, no infinite scroll. No hover card.

## 7. Right panel (`components/layout/right-panel/*`)

- Search box in fixed top bar; sticky body that sticks top/bottom by scroll direction (`sticky-panel.tsx`).
- SearchBox VISUAL (bare input, no typeahead/results/route).
- PremiumCard VISUAL. NewsCard 3 hard-coded items, close X and rows VISUAL. TrendsCard 4 hard-coded trends, rows / "..." / "Show more" VISUAL.
- WhoToFollow FUNCTIONAL follows, "Show more" VISUAL. RelevantPeople FUNCTIONAL.
- PanelFooter all spans VISUAL.

## 8. Shared UI primitives

- `ui/button.tsx` (primary/outline/accent; sm/md/lg), `ui/icon-button.tsx` (34.8px round, accent/plain), `ui/avatar.tsx` (xs 24 / md 40 / xl 133.5), `ui/tab.tsx` (Link or inert button, 4px accent underline).
- `ui/dropdown-menu.tsx` + `hooks/use-dropdown-menu.ts`: portal, placement + 6 transform origins, open/closing/closed machine, Escape/backdrop/scroll close, keyboard Tab cycling, focus restore. Exported `menuItem` class.
- `ui/toast.tsx`: single toast, 6s, bottom-center, accent bg, no animation.
- `ui/animated-count.tsx` (odometer, WAAPI, reduced-motion aware), `ui/scroll-anchor.tsx`.
- Layout: `PageHeader` (sticky blurred + back), `BackButton`, `AppShell` (600px column), `UserCell`, `FollowButton`.
- Icons (`ui/icons.tsx`, 50): HomeIcon, ExploreIcon, NotificationsIcon, ChatIcon, HistoryIcon, ProfileIcon, MoreIcon, MoreHorizontalIcon, BackIcon, ArrowRightIcon, VerifiedIcon, ReplyIcon, RetweetIcon, QuoteIcon, RetweetActiveIcon, LikeIcon, LikeActiveIcon, ViewsIcon, ShareIcon, BookmarkIcon, BookmarkActiveIcon, XLogoIcon, HomeActiveIcon, ProfileActiveIcon, FollowIcon, GrokIcon, CreatorStudioIcon, PremiumIcon, CalendarIcon, ChevronDownIcon, CloseIcon, PlusIcon, MediaIcon, GifIcon, PollIcon, EmojiIcon, ScheduleIcon, LocationIcon, FlagIcon, GlobeIcon, PhoneIcon, GoogleIcon, AppleIcon, ErrorTriangleIcon, EyeIcon, EyeOffIcon, SearchIcon, SelectChevronIcon, DateChevronIcon, CheckCircleFillIcon, PopoverArrowIcon.
- Modals: (1) intercepting route + page fallback (compose, logout); (2) `ComposeModal` hand-rolled scrim, no focus trap; (3) `LogoutDialog` via `features/auth/hooks/use-modal-dialog.ts` + `use-escape-to-close.ts` + `features/auth/utils/trap-focus.ts`. **No generic Modal in `components/ui`.**

## 9. Animations

No motion library (deps: next, react, clsx, tailwind-merge, libphonenumber-js).

- `app/transitions.css`: `.t-reel*` rolling digits (450ms spring `linear()`), `.t-icon-swap` (250ms blur+scale crossfade, repost/bookmark), `.t-like` heart pop 350ms + 8 particles (`components/tweet/like-burst.ts`), `.t-dropdown` scale .95→1 + fade 150ms with `@starting-style`. Reduced-motion fallbacks.
- `app/globals.css`: `enter-fade`, `enter-fade-rise`, `caret-blink` (auth only).
- Inline: composer focus reveal 250ms, action hover circle scale .88→1 140ms, composer tool hover scale 1.12, carousel arrows fade.
- **Not animated**: modal enter/exit, toast, tab indicator, page transitions, Following→Unfollow swap, posting progress bar.

## 10. Data layer

- `types/user.ts`: `UserSummary {id, handle, displayName, avatarUrl}`; `User` + `{bio, bannerUrl|null, joinedAt, followingCount, followersCount, postsCount, followedByViewer}`. No verified/location/website/birthday/protected/pinnedTweetId/followsViewer.
- `types/tweet.ts`: `TweetMedia {type:"photo"|"video", url, width, height, alt}`; `Tweet {id, author, text, media, createdAt, replyingTo, stats{replies,retweets,likes}, likedByViewer, retweetedByViewer, bookmarkedByViewer, quotedTweet}`; `TimelineItem {tweet, retweetedBy}`. No views/quotes/bookmarks counts, poll, card, editedAt, conversationId, replySettings.
- `types/pagination.ts`: `Page<T> {items, nextCursor}` (`utils/paginate.ts`).
- Mocks (in-memory, mutable): 124 users (viewer `Elpepodev` first, 18 followed, 4 suggested), 249 tweets (180 replies, 69 top-level, 22 quotes, 36 photo + 24 "video" thumbnails), `mockRetweets` empty. Login `{handle}@example.com` / `password`.
- Server actions: `createTweet`, `toggleLike`, `toggleRetweet`, `toggleBookmark`, `toggleFollow` (mutate mocks + `refresh()`).
- **Not in data**: notifications, DMs, lists, bookmarks listing, trends/news (hard-coded in components), search, communities, polls, views, entities (hashtags/mentions/urls).
