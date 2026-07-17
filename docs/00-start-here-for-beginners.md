# Start Here for Beginners

This page explains Cakap in plain language for readers who are new to Telegram bots, Cloudflare Workers, Azure Translator, or webhooks.

## What Cakap Does

Cakap is a Telegram translation bot.

When someone sends an English message, Cakap replies with an Indonesian translation.

When someone sends an Indonesian message, Cakap replies with an English translation.

Example:

```text
User: hello
Bot: 🇮🇩 Indonesian:
halo

User: sudah makan?
Bot: 🇬🇧 English:
Have you eaten?
```

## What Cakap Does Not Do

This project is intentionally simple.

Cakap does not:

- Store message history
- Keep a database of users
- Train an AI model
- Read images, voice notes, stickers, or files
- Translate every language
- Use WhatsApp
- Require a paid server

## The Four Main Parts

| Part | What it means | Why it is needed |
|---|---|---|
| Telegram Bot | The bot account users interact with | Receives messages and sends replies |
| Cloudflare Worker | Small serverless function | Hosts the webhook that receives Telegram updates |
| Azure AI Translator | Translation service | Detects English / Indonesian and translates text |
| GitHub | Documentation and source code | Shows how the project works without exposing secrets |

## Plain-English Architecture

1. A user sends a message to the Telegram bot or group.
2. Telegram sends that message to the Cloudflare Worker URL.
3. The Worker checks that the request came through the configured webhook secret.
4. The Worker ignores commands such as `/start` and ignores non-text messages.
5. The Worker asks Azure Translator to detect the language.
6. If the message is English, it translates to Indonesian.
7. If the message is Indonesian, it translates to English.
8. The Worker sends the translated text back to Telegram as a reply.

## What Is a Webhook?

A webhook is a public HTTPS URL that another system can call automatically.

For this project:

```text
Telegram message → Telegram webhook → Cloudflare Worker → Azure Translator → Telegram reply
```

The Worker URL must be public because Telegram needs to send messages to it.

## What Is a Secret?

A secret is a sensitive value that should not be written into source code.

This project uses these secrets:

| Secret | Why it matters |
|---|---|
| `TELEGRAM_BOT_TOKEN` | Controls the Telegram bot |
| `AZURE_TRANSLATOR_KEY` | Allows the Worker to call Azure Translator |
| `WEBHOOK_SECRET` | Helps confirm that webhook requests are intended for this bot |

These values are stored in Cloudflare Worker Variables and Secrets, not in GitHub.

## Beginner Setup Order

Follow this order. Do not skip around.

1. Create the Telegram bot using BotFather.
2. Create the Azure Translator resource.
3. Create the Cloudflare Worker.
4. Add the required Cloudflare variables and secrets.
5. Paste and deploy the Worker code.
6. Open the Worker URL to confirm it is running.
7. Set the Telegram webhook.
8. Test in a direct Telegram chat.
9. Disable Telegram privacy mode if group auto-translation is required.
10. Add the bot to the Telegram group.

The full technical steps are in [`setup-guide.md`](setup-guide.md).

## How to Know It Is Working

The Worker is working if the Worker URL opens in a browser and shows:

```text
Cakap Telegram translation bot is running.
```

The Telegram webhook is working if the `setWebhook` request returns:

```json
{"ok":true,"result":true,"description":"Webhook was set"}
```

The translation flow is working if:

```text
hello → halo
sudah makan? → Have you eaten?
```

## Common Beginner Mistakes

| Problem | Likely cause |
|---|---|
| Bot does not reply in group | Telegram privacy mode may still be enabled |
| Bot replies in private chat but not group | Remove and re-add the bot after disabling privacy mode |
| Worker URL works but Telegram does not reply | Webhook may not be set correctly |
| Translation fails | Azure key or region may be wrong |
| Unauthorized response | Webhook secret in Telegram does not match Cloudflare |
| No response to `/start` | Current code intentionally ignores commands |

## Why the Current Version Is Kept Simple

The current version already solves the main problem: automatic English and Indonesian translation in Telegram.

Additional features such as menus, persistent language switching, group allowlists, usage dashboards, or multi-language support can be added later. They are deferred for now because each extra feature increases complexity and may increase translation usage, Worker requests, or maintenance effort.

## Next Reading Order

1. [`setup-guide.md`](setup-guide.md) — build it step by step
2. [`architecture.md`](architecture.md) — understand the design
3. [`operations-guide.md`](operations-guide.md) — troubleshoot and maintain it
4. [`privacy-and-limitations.md`](privacy-and-limitations.md) — understand data handling
5. [`future-features-and-constraints.md`](future-features-and-constraints.md) — see what could be added later
