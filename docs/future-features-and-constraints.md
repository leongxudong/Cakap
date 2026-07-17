# Future Features and Constraints

This page records potential enhancements for Cakap and explains why the current version is intentionally kept simple.

## Current Position

Cakap currently performs the core function:

```text
English → Indonesian
Indonesian → English
```

It runs through Telegram, Cloudflare Workers, and Azure AI Translator.

The current scope is sufficient for a small private or family-style Telegram group. Additional features are useful, but they should be added only when there is a clear need.

## Why Features Are Deferred

The project uses free-tier-friendly services. Making the bot more public or adding more automated behaviour can increase:

- Translation characters processed by Azure AI Translator
- Cloudflare Worker requests
- Telegram message volume
- Troubleshooting effort
- Security and privacy review effort
- User-support burden

This is why the project stops at the working minimum viable version for now.

The concern is not that the Telegram bot token will be "used up". The concern is that public or heavy usage can consume service quota or generate unexpected operating overhead.

## Potential Features

| Feature | Usefulness | Complexity | Current Decision |
|---|---|---:|---|
| `/help` command | Helps users understand the bot | Low | Deferred |
| `/privacy` command | Explains data handling and safe use | Low | Deferred |
| `/add` command | Gives an add-to-group link | Low | Deferred |
| `/mode` command | Shows current translation mode | Low | Deferred |
| English → Indonesian only mode | Reduces language-detection mistakes | Medium | Deferred |
| Indonesian → English only mode | Reduces language-detection mistakes | Medium | Deferred |
| `/auto` mode | Restores auto-detect behaviour | Medium | Deferred |
| `/off` mode | Pauses translation in a chat | Medium / High if persistent | Deferred |
| Group allowlist | Prevents unintended group usage | Medium | Deferred |
| Usage counter | Shows request volume without storing text | Medium | Deferred |
| Usage dashboard | Tracks adoption and quota usage | Medium / High | Deferred |
| Support Malay | Useful for nearby language needs | Low / Medium | Deferred |
| Support more languages | Broader usage | Medium | Deferred |
| Inline buttons | More polished user experience | Medium | Deferred |
| GitHub-to-Cloudflare deployment | Cleaner DevOps workflow | Medium | Deferred |

## Recommended Feature Order If Development Continues

### Phase 1: Basic User Experience

These features do not require database storage and are suitable first enhancements:

1. `/help`
2. `/privacy`
3. `/add`
4. `/mode`

### Phase 2: Translation Control

These features are useful when auto-detection causes confusion:

1. `/enid` — English to Indonesian only
2. `/iden` — Indonesian to English only
3. `/auto` — auto-detect English / Indonesian
4. `/off` — pause translation

Persistent modes require state storage, such as Cloudflare KV, D1, or another storage layer. Without storage, the mode would be temporary or hardcoded.

### Phase 3: Operating Control

These features are useful if the bot becomes public or receives high traffic:

1. Group allowlist
2. Usage counter
3. Basic quota monitoring
4. Admin-only commands
5. Rate limiting
6. Alerting when usage rises unexpectedly

## Why No Group Allowlist for Now

A group allowlist is useful when the bot is public or likely to be added to unknown groups.

For the current private use case, the project does not implement a group allowlist yet. The practical controls are:

- Keep the bot link semi-private
- Keep message length limited
- Avoid adding the bot to large public groups
- Monitor Azure and Cloudflare usage manually
- Rotate secrets if anything is exposed

## Why No Menu Yet

A menu would improve usability, but it is not required for the core translation workflow.

The current version works because Telegram users can simply type normal English or Indonesian messages. Adding a menu is useful only after the core use case is stable.

## Why No Persistent Language Switching Yet

Language switching sounds simple, but persistent settings need state.

Example:

```text
Group A wants auto mode.
Group B wants English → Indonesian only.
Group C wants translation paused.
```

To remember this across messages, the bot needs storage. That means introducing additional architecture, permissions, cost monitoring, and failure modes.

For now, auto-detection is kept as the default.

## Definition of Done for This Phase

This phase is considered complete when:

- Telegram bot exists
- Cloudflare Worker is deployed
- Azure Translator integration works
- English messages translate to Indonesian
- Indonesian messages translate to English
- Group translation works after privacy mode is disabled
- GitHub documentation explains setup, architecture, operations, privacy, and limitations
- No secrets or private identifiers are committed

## Future Decision Trigger

Revisit the roadmap if any of the following happens:

- The bot is added to more groups
- Usage becomes noisy
- Translation quota starts being consumed quickly
- Users ask for manual controls
- Auto-detection produces too many wrong translations
- The project is reused as a portfolio demonstration for bot operations, cost governance, or serverless deployment
