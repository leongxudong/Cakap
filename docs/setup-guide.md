# Setup Guide

This guide documents the setup flow for Cakap, a Telegram English-Indonesian translation bot hosted on Cloudflare Workers and using Azure AI Translator.

Do not paste real API keys, tokens, tenant IDs, subscription IDs, or chat identifiers into this repository.

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

In BotFather:

```text
/setjoingroups
```

Select the bot and enable group joining.

For automatic group translation, disable privacy mode:

```text
/setprivacy
```

Select the bot and choose `Disable`.

If the bot was already added to a group before privacy mode was disabled, remove and re-add the bot.

## 3. Create Azure AI Translator

1. Open Azure Portal.
2. Create a Translator resource.
3. Use a separate resource group, for example:

```text
rg-telegram-translation-bot
```

4. Select the intended region, for example:

```text
southeastasia
```

5. Select the free tier if available for your subscription.
6. After deployment, open `Keys and Endpoint`.
7. Copy `KEY 1` and the `Location/Region` value.

Store them in Cloudflare as:

| Cloudflare variable | Type | Example |
|---|---|---|
| `AZURE_TRANSLATOR_KEY` | Secret | Do not commit |
| `AZURE_TRANSLATOR_REGION` | Text | `southeastasia` |

## 4. Create the Cloudflare Worker

1. Open Cloudflare Dashboard.
2. Go to `Workers & Pages`.
3. Click `Create application`.
4. Choose `Create Worker` or a basic `Hello World` Worker.
5. Name the Worker, for example:

```text
telegram-translation-bot
```

6. Deploy the initial Worker.
7. Open the Worker and go to `Settings` or `Bindings` depending on Cloudflare dashboard layout.
8. Open `Variables and secrets`.

Add the following:

| Name | Type | Value |
|---|---|---|
| `AZURE_TRANSLATOR_KEY` | Secret | Azure Translator key |
| `AZURE_TRANSLATOR_REGION` | Text | Azure region, for example `southeastasia` |
| `TELEGRAM_BOT_TOKEN` | Secret | BotFather token |
| `WEBHOOK_SECRET` | Secret | Random private string |

## 5. Deploy the Worker Code

1. Click `Edit code`.
2. Replace the default Worker code with [`src/worker.js`](../src/worker.js).
3. Click `Deploy`.
4. Open the Worker URL in a browser.

Expected response:

```text
Cakap Telegram translation bot is running.
```

## 6. Set the Telegram Webhook

Use this format in a browser:

```text
https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook?url=<WORKER_URL>&secret_token=<WEBHOOK_SECRET>
```

Example structure only:

```text
https://api.telegram.org/bot1234567890:ABC/setWebhook?url=https://telegram-translation-bot.example.workers.dev&secret_token=replace-with-private-secret
```

Do not commit or share the full webhook URL if it contains your real token.

Expected response:

```json
{"ok":true,"result":true,"description":"Webhook was set"}
```

## 7. Test in Direct Chat

Send an English message to the bot:

```text
hello
```

Expected response:

```text
🇮🇩 Indonesian:
halo
```

Send an Indonesian message:

```text
sudah makan?
```

Expected response:

```text
🇬🇧 English:
Have you eaten?
```

## 8. Test in Group Chat

1. Add the bot to the Telegram group.
2. Confirm privacy mode is disabled in BotFather.
3. Send an English or Indonesian message.
4. Confirm the bot replies to the original message.

## 9. Rotate Secrets After Testing

If any example secret was shared during testing, replace it with a new random value.

Steps:

1. Update `WEBHOOK_SECRET` in Cloudflare.
2. Re-deploy the Worker.
3. Run the Telegram `setWebhook` URL again with the new secret.
4. Confirm translation still works.
