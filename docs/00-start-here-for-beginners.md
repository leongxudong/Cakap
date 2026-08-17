# Start Here for Beginners

Cakap is a Telegram bot that automatically translates between English and Indonesian.

## What Happens When Someone Sends a Message

```text
English message → Indonesian reply
Indonesian message → English reply
```

Example:

```text
User: hello
Bot: 🇮🇩 Indonesian:
halo

User: sudah makan?
Bot: 🇬🇧 English:
Have you eaten?
```

## The Main Parts

| Part | What it does |
|---|---|
| Telegram Bot | Receives messages and sends replies |
| Cloudflare Worker | Runs the bot logic and receives Telegram webhooks |
| Cloudflare Workers AI | Detects English/Indonesian and translates the text |
| GitHub | Stores sanitized source code and documentation |

The original version used Azure AI Translator. The current version does not require Azure.

## Plain-English Architecture

1. A user sends a Telegram message.
2. Telegram sends the message to the Cloudflare Worker.
3. The Worker checks the webhook secret.
4. Commands, bot messages, and non-text content are ignored.
5. Cloudflare Workers AI classifies the message as English, Indonesian, or other.
6. English is translated to Indonesian; Indonesian is translated to English.
7. The Worker sends the translated reply through Telegram.

```text
Telegram → Cloudflare Worker → Cloudflare Workers AI → Telegram
```

## What Is a Webhook?

A webhook is a public HTTPS endpoint that Telegram calls automatically when a message arrives. For Cakap, the webhook URL is the Cloudflare Worker URL.

## What Is a Secret?

Cakap uses two secrets:

| Secret | Purpose |
|---|---|
| `TELEGRAM_BOT_TOKEN` | Controls the Telegram bot |
| `WEBHOOK_SECRET` | Helps validate incoming Telegram webhook requests |

Workers AI does not require a separate API key when it is connected to the Worker using an AI binding.

## What Is the AI Binding?

The Worker must have a Cloudflare Workers AI binding named:

```text
AI
```

The source code accesses it as:

```javascript
env.AI
```

## Setup Order

1. Create or reuse the Telegram bot.
2. Create or reuse the Cloudflare Worker.
3. Add a Workers AI binding named `AI`.
4. Add `TELEGRAM_BOT_TOKEN` and `WEBHOOK_SECRET` as Worker secrets.
5. Deploy `src/worker.js`.
6. Confirm the Worker health URL loads.
7. Confirm or reset the Telegram webhook.
8. Test English → Indonesian.
9. Test Indonesian → English.
10. Disable Telegram privacy mode for automatic group translation.

See [`setup-guide.md`](setup-guide.md) for full steps.

## How to Know It Is Working

Opening the Worker URL should show:

```text
Cakap Telegram translation bot is running.
```

Then verify actual translation:

```text
hello → halo
sudah makan? → Have you eaten?
```

The health message only confirms the Worker endpoint is alive; live Telegram testing confirms the full flow.

## Common Beginner Problems

| Problem | Likely cause |
|---|---|
| Bot does not reply in group | Telegram privacy mode may still be enabled |
| Worker URL works but bot does not translate | AI binding, webhook, or secret may be wrong |
| Worker reports missing AI binding | Workers AI binding named `AI` is not configured |
| Translation fails after heavy usage | Workers AI free allocation may be exhausted |
| Short word translated strangely | Language classification is ambiguous |
| Unauthorized response | Telegram webhook secret does not match Cloudflare |

## Does the Free AI Service Expire?

As of 17 August 2026, Cloudflare Workers AI uses a daily free allocation rather than a fixed-duration trial. There is no configured Azure-style subscription expiry date for this design. However, Cloudflare can change free-tier limits, pricing, or model availability in the future.

## Next Reading

1. [`setup-guide.md`](setup-guide.md)
2. [`architecture.md`](architecture.md)
3. [`operations-guide.md`](operations-guide.md)
4. [`privacy-and-limitations.md`](privacy-and-limitations.md)
5. [`future-features-and-constraints.md`](future-features-and-constraints.md)
