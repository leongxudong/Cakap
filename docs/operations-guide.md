# Operations Guide

This guide covers basic operation and troubleshooting for Cakap after the Workers AI migration.

## Normal Operation

1. User sends English or Indonesian text in Telegram.
2. Telegram sends a webhook update to the Cloudflare Worker.
3. Worker validates the webhook secret.
4. Worker ignores commands, bot messages, and non-text content.
5. Workers AI SEA-LION classifies the language.
6. Workers AI M2M100 translates English ↔ Indonesian.
7. Worker replies to the original Telegram message.

## Basic Health Check

Open the Worker URL in a browser.

Expected response:

```text
Cakap Telegram translation bot is running.
```

This confirms the Worker endpoint is deployed, but it does not by itself prove Workers AI inference or Telegram delivery is working.

## Telegram Webhook Check

Use Telegram Bot API's `getWebhookInfo` endpoint:

```text
https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/getWebhookInfo
```

Do not share the full URL because it contains the bot token.

Check that:

- `url` points to the Cloudflare Worker.
- `last_error_message` is empty during normal operation.
- `pending_update_count` does not continually increase.

## Common Issues

### Bot does not reply at all

Check:

- Worker is deployed.
- Webhook is set correctly.
- `TELEGRAM_BOT_TOKEN` is correct.
- `WEBHOOK_SECRET` matches the webhook configuration.
- Workers AI binding named `AI` exists.
- Worker logs do not show `Unauthorized` or a Workers AI error.

### Bot replies in direct chat but not group

Likely cause: Telegram bot privacy mode is enabled.

Fix:

1. Open BotFather.
2. Run `/setprivacy`.
3. Select the bot.
4. Choose `Disable`.
5. Remove and re-add the bot to the group.

### Worker reports missing AI binding

Cause: Workers AI has not been bound to the Worker.

Fix: add a Workers AI binding named exactly `AI`, then redeploy.

### Bot detects wrong language

Short or mixed-language messages can be ambiguous, for example:

- `ok`
- `ya`
- `can`
- Names, slang, Singlish, or Malay phrases

Test with a longer unambiguous English or Indonesian sentence before treating this as an outage.

### Workers AI inference fails

Check:

- Workers AI usage/quota in Cloudflare.
- Whether the configured models are still available.
- Cloudflare service status.
- Worker logs for model, quota, or capacity errors.

The configured models are:

```text
@cf/aisingapore/gemma-sea-lion-v4-27b-it
@cf/meta/m2m100-1.2b
```

If Cloudflare deprecates a model, replace the model identifier in `src/worker.js` and re-test.

### Worker returns Unauthorized

The Telegram webhook secret does not match `WEBHOOK_SECRET`.

1. Create or confirm a random `WEBHOOK_SECRET` in Cloudflare.
2. Deploy the Worker.
3. Set the Telegram webhook again with the same secret.

## Recommended Maintenance

| Task | Suggested frequency |
|---|---|
| Check Worker logs | During troubleshooting |
| Check Workers AI usage | Monthly or after unusual activity |
| Review model availability | When Cloudflare announces AI model changes |
| Rotate Telegram bot token | If exposed or suspected compromised |
| Rotate webhook secret | After exposure or major reconfiguration |
| Review group privacy notice | When adding new users |

## Secret Rotation

### Telegram Bot Token

1. Open BotFather.
2. Run `/revoke`.
3. Select the bot.
4. Copy the new token.
5. Update `TELEGRAM_BOT_TOKEN` in Cloudflare.
6. Redeploy and reset the webhook if required.
7. Re-test the bot.

### Webhook Secret

1. Update `WEBHOOK_SECRET` in Cloudflare.
2. Redeploy the Worker.
3. Run `setWebhook` again with the new secret.
4. Confirm replies in Telegram.

Workers AI does not require a separate AI API key when accessed through the native Worker binding.

## Free-Tier Behaviour

As of 17 August 2026, Workers AI provides a daily free allocation rather than a fixed-duration trial. If the daily allocation is exhausted, inference can fail until the allocation resets or the account is upgraded. Pricing, allocation, and model availability may change in the future.

## Suggested User Notice

```text
This group uses Cakap, an automatic English-Indonesian translation bot. Please do not send passwords, banking details, identity documents, medical information, or other sensitive information here.
```
