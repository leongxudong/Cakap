# Future Features and Constraints

This page records potential enhancements for Cakap and explains why the current version is intentionally kept simple.

## Current Position

Cakap performs the core function:

```text
English → Indonesian
Indonesian → English
```

It runs through Telegram, Cloudflare Workers, and Cloudflare Workers AI. The Azure Translator dependency has been removed.

The current scope is intended for a small private or family-style Telegram group. Additional features should be added only when there is a clear need.

## Why Features Are Deferred

Making the bot more public or more automated can increase:

- Workers AI inference usage
- Cloudflare Worker requests
- Telegram message volume
- Troubleshooting effort
- Security and privacy review effort
- User-support burden

The concern is not that the Telegram bot token will be "used up". The concern is service quota and operating overhead.

## Potential Features

| Feature | Usefulness | Complexity | Current Decision |
|---|---|---:|---|
| `/help` command | Helps users understand the bot | Low | Deferred |
| `/privacy` command | Explains data handling and safe use | Low | Deferred |
| `/add` command | Gives an add-to-group link | Low | Deferred |
| `/mode` command | Shows current translation mode | Low | Deferred |
| English → Indonesian only mode | Reduces classification mistakes | Medium | Deferred |
| Indonesian → English only mode | Reduces classification mistakes | Medium | Deferred |
| `/auto` mode | Restores auto-detect behaviour | Medium | Deferred |
| `/off` mode | Pauses translation in a chat | Medium / High if persistent | Deferred |
| Group allowlist | Prevents unintended group usage | Medium | Deferred |
| Usage counter | Shows request volume without storing text | Medium | Deferred |
| Usage dashboard | Tracks adoption and quota usage | Medium / High | Deferred |
| Malay support | Useful for nearby language needs | Low / Medium | Deferred |
| More languages | Broader usage | Medium | Deferred |
| Inline buttons | More polished user experience | Medium | Deferred |
| GitHub-to-Cloudflare deployment | Cleaner DevOps workflow | Medium | Deferred |
| AI model fallback | Reduces impact of model deprecation/capacity issues | Medium | Recommended next reliability feature |

## Recommended Development Order

### Phase 1: Basic User Experience

1. `/help`
2. `/privacy`
3. `/add`
4. `/mode`

### Phase 2: Translation Control

1. `/enid` — English to Indonesian only
2. `/iden` — Indonesian to English only
3. `/auto` — auto-detect English / Indonesian
4. `/off` — pause translation

Persistent modes require storage such as Cloudflare KV or D1.

### Phase 3: Operating Control

1. Group allowlist
2. Usage counter
3. Workers AI quota monitoring
4. Admin-only commands
5. Rate limiting
6. Alerting on unusual usage
7. Fallback model configuration

## Reliability Consideration

The current design avoids a fixed-duration Azure subscription dependency. As of 17 August 2026, Workers AI provides a daily free allocation rather than a promotional trial with a configured expiry date.

This does not mean the service is guaranteed to remain free forever. Cloudflare can change pricing, quotas, or model availability. The architecture therefore treats AI model identifiers as replaceable components rather than permanent dependencies.

## Why No Group Allowlist Yet

For the current private use case, practical controls are:

- Keep the bot link semi-private.
- Keep message length limited.
- Avoid adding the bot to large public groups.
- Monitor Cloudflare usage.
- Rotate secrets if exposed.

## Why No Persistent Language Switching Yet

Persistent settings need state. For example:

```text
Group A wants auto mode.
Group B wants English → Indonesian only.
Group C wants translation paused.
```

Remembering these settings requires a storage layer and additional operational complexity.

## Definition of Done for This Migration

The Workers AI migration is complete when:

- Telegram bot still exists.
- Existing Cloudflare Worker is reused or redeployed.
- Workers AI binding named `AI` is configured.
- Azure Translator variables are no longer required.
- English messages translate to Indonesian.
- Indonesian messages translate to English.
- Group translation works after privacy mode is disabled.
- GitHub documentation reflects the Workers AI architecture.
- No secrets or private identifiers are committed.

## Future Decision Triggers

Revisit the roadmap if:

- The bot is added to more groups.
- Workers AI quota is regularly exhausted.
- Cloudflare announces deprecation of either configured AI model.
- Users request manual language controls.
- Auto-detection produces too many wrong translations.
- The project is reused as a portfolio demonstration for serverless AI, bot operations, or cost governance.
