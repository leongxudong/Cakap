# Operations Guide

This guide covers basic operation and troubleshooting for Cakap.

## Normal Operation

A normal successful flow looks like this:

1. User sends English or Indonesian text in Telegram.
2. Telegram sends a webhook update to the Cloudflare Worker.
3. Worker validates the webhook secret.
4. Worker ignores commands and non-text messages.
5. Worker detects language using Azure Translator.
6. Worker translates English to Indonesian or Indonesian to English.
7. Worker replies to the original Telegram message.

## Basic Health Check

Open the Worker URL in a browser.

Expected response:

```text
Cakap Telegram translation bot is running.
```

If this does not work, the Worker is not deployed correctly or the Worker URL is wrong.

## Telegram Webhook Check

Use Telegram Bot API's `getWebhookInfo` endpoint:

```text
https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/getWebhookInfo
```

Do not share the full URL because it contains the bot token.

Useful checks:

- `url` should show the Cloudflare Worker URL.
- `last_error_message` should be empty during normal operation.
- `pending_update_count` should not keep increasing.

## Common Issues

### Bot does not reply at all

Check:

- Worker is deployed.
- Webhook was set successfully.
- `TELEGRAM_BOT_TOKEN` is correct.
- `WEBHOOK_SECRET` in Telegram webhook matches Cloudflare secret.
- Worker logs do not show `Unauthorized`.

### Bot replies in direct chat but not group

Likely cause:

- Telegram bot privacy mode is still enabled.

Fix:

1. Open BotFather.
2. Run `/setprivacy`.
3. Select the bot.
4. Choose `Disable`.
5. Remove and re-add the bot to the group.

### Bot detects wrong language

This can happen with short or mixed-language messages.

Examples:

- `ok`
- `ya`
- `can`
- Names or slang

Possible improvement:

- Add a minimum message length.
- Add manual command mode, such as `/en` or `/id`.
- Add language override rules for common household phrases.

### Azure translation fails

Check:

- `AZURE_TRANSLATOR_KEY` is correct.
- `AZURE_TRANSLATOR_REGION` is correct.
- Azure Translator resource is active.
- The subscription is still valid.
- The free tier or quota has not been exceeded.

### Worker returns Unauthorized

Cause:

- `WEBHOOK_SECRET` sent by Telegram does not match the Cloudflare environment secret.

Fix:

1. Create a new random `WEBHOOK_SECRET` in Cloudflare.
2. Re-deploy the Worker.
3. Set Telegram webhook again using the same secret.

## Recommended Maintenance

| Task | Suggested frequency |
|---|---|
| Check Worker logs | During troubleshooting |
| Check Azure usage | Monthly |
| Rotate Telegram bot token | If exposed or suspected compromised |
| Rotate Azure Translator key | If exposed or suspected compromised |
| Rotate webhook secret | After testing or suspected exposure |
| Review group privacy notice | When adding new users |

## Secret Rotation

### Rotate Telegram Bot Token

1. Open BotFather.
2. Run `/revoke`.
3. Select the bot.
4. Copy the new token.
5. Update `TELEGRAM_BOT_TOKEN` in Cloudflare.
6. Re-deploy the Worker.
7. Re-test the bot.

### Rotate Azure Translator Key

1. Open Azure Translator resource.
2. Go to `Keys and Endpoint`.
3. Regenerate one key at a time.
4. Update `AZURE_TRANSLATOR_KEY` in Cloudflare.
5. Re-deploy the Worker.
6. Re-test translation.

### Rotate Webhook Secret

1. Update `WEBHOOK_SECRET` in Cloudflare.
2. Re-deploy the Worker.
3. Run `setWebhook` again with the new secret.
4. Confirm the bot replies in Telegram.

## Suggested User Notice

For group deployment, pin or send a short notice:

```text
This group uses Cakap, an automatic English-Indonesian translation bot. Please do not send passwords, banking details, identity documents, medical information, or other sensitive information here.
```
