# Setup Guide

This guide documents the setup flow for Cakap, a Telegram English-Indonesian translation bot hosted on Cloudflare Workers and using Cloudflare Workers AI.

Do not paste real bot tokens, webhook secrets, chat identifiers, or other credentials into this repository.

## 1. Create the Telegram Bot

1. Open Telegram.
2. Search for `@BotFather`.
3. Send `/newbot`.
4. Provide a display name, for example `Cakap`.
5. Provide a bot username ending in `bot`.
6. Copy the bot token.

Store the bot token as a Cloudflare Worker secret named:

```text
TELEGRAM_BOT_TOKEN
```

## 2. Allow Group Use

In BotFather, enable group joining with:

```text
/setjoingroups
```

For automatic group translation, disable privacy mode:

```text
/setprivacy
```

Select the bot and choose `Disable`. If the bot was already in the group, remove and re-add it after changing privacy mode.

## 3. Open or Create the Cloudflare Worker

If the existing Cakap Worker still exists, reuse it so the Worker URL can remain unchanged.

For a new Worker:

1. Open Cloudflare Dashboard.
2. Go to `Workers & Pages`.
3. Create a Worker application.
4. Give it an appropriate name.
5. Deploy the initial Worker.

## 4. Enable Workers AI

The Worker must have a Workers AI binding named exactly:

```text
AI
```

Create the Workers AI binding in the Cloudflare dashboard for the Worker. The application accesses it as:

```javascript
env.AI
```

No Azure key, Gemini key, DeepL key, or other translation-service credential is required.

If deploying with Wrangler instead of the dashboard, the equivalent configuration is:

```toml
[ai]
binding = "AI"
```

## 5. Add Worker Secrets

Add only these runtime secrets:

| Name | Type | Purpose |
|---|---|---|
| `TELEGRAM_BOT_TOKEN` | Secret | BotFather token |
| `WEBHOOK_SECRET` | Secret | Random private string used to validate Telegram webhook requests |

The previous Azure variables are no longer used:

```text
AZURE_TRANSLATOR_KEY
AZURE_TRANSLATOR_REGION
```

They can be deleted from the Worker after the new version is confirmed working.

## 6. Deploy the Worker Code

1. Open the Worker code editor.
2. Replace the deployed Worker code with [`src/worker.js`](../src/worker.js).
3. Deploy.
4. Open the Worker URL in a browser.

Expected response:

```text
Cakap Telegram translation bot is running.
```

The Worker now uses two Cloudflare-hosted models:

- `@cf/aisingapore/gemma-sea-lion-v4-27b-it` for English / Indonesian / other language classification.
- `@cf/meta/m2m100-1.2b` for English ↔ Indonesian translation.

## 7. Keep or Reset the Telegram Webhook

If the Worker URL did not change and `WEBHOOK_SECRET` did not change, the existing Telegram webhook can normally remain in place.

If the Worker URL or webhook secret changed, set the webhook again using:

```text
https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook?url=<WORKER_URL>&secret_token=<WEBHOOK_SECRET>
```

Do not commit or share the full URL because it contains the bot token.

Expected response:

```json
{"ok":true,"result":true,"description":"Webhook was set"}
```

## 8. Test Direct Chat

Send:

```text
hello
```

Expected:

```text
🇮🇩 Indonesian:
halo
```

Then send:

```text
sudah makan?
```

Expected:

```text
🇬🇧 English:
Have you eaten?
```

## 9. Test Group Chat

1. Confirm BotFather privacy mode is disabled.
2. Add or re-add the bot to the Telegram group if required.
3. Send an English message.
4. Confirm an Indonesian reply.
5. Send an Indonesian message.
6. Confirm an English reply.
7. Test a short or mixed-language message and confirm the behaviour is acceptable.

## 10. Clean Up the Old Azure Dependency

After live testing succeeds:

1. Delete `AZURE_TRANSLATOR_KEY` from Cloudflare Worker variables/secrets.
2. Delete `AZURE_TRANSLATOR_REGION` from Cloudflare Worker variables/secrets.
3. The Azure Translator resource may be left expired or removed because Cakap no longer calls it.

## Free-Tier Note

As of 17 August 2026, Workers AI is available on the Workers Free plan with a daily free allocation rather than a fixed-duration promotional trial. Usage limits, model availability, and pricing can change, so monitor Cloudflare release notes if this bot becomes operationally important.
