# Screenshot Redaction Guide

Screenshots are useful for showing that the bot works, but they must be sanitized before publishing.

## Do Not Publish Raw Screenshots Containing

- Telegram bot token
- Azure Translator key
- Cloudflare Worker secret
- Webhook URL containing a real bot token
- Azure subscription ID
- Azure tenant ID
- Personal email address
- Phone number
- Private chat names
- Private group names
- Message content that reveals personal or family details
- Internal organization names or work-related content

## Recommended Screenshot Set

For this project, publish only sanitized screenshots showing:

1. BotFather bot creation page, with token hidden.
2. Azure Translator `Keys and Endpoint` page, with keys hidden.
3. Cloudflare Worker overview page, with account email hidden.
4. Cloudflare Worker variables page, with secret values hidden.
5. Telegram test conversation showing simple neutral phrases only.
6. Group test showing generic English and Indonesian messages only.

## Redaction Rules

| Item | Action |
|---|---|
| API keys and tokens | Fully blur or cover |
| Email addresses | Blur or cover |
| Bot token in webhook URL | Do not show |
| Azure subscription / tenant ID | Blur or cover |
| Private chat names | Blur or replace |
| Personal profile pictures | Crop or blur |
| Message content | Use neutral test phrases only |

## Example Safe Test Messages

```text
hello
```

```text
sudah makan?
```

```text
please buy rice later
```

```text
nanti saya masak jam 6
```

## Suggested Folder

If sanitized screenshots are added later, place them here:

```text
assets/screenshots/
```

Suggested filenames:

```text
01-botfather-created-redacted.png
02-azure-translator-keys-redacted.png
03-cloudflare-worker-overview-redacted.png
04-worker-secrets-redacted.png
05-telegram-direct-test-redacted.png
06-telegram-group-test-redacted.png
```

## Current Note

The initial working screenshot used during development showed the bot correctly translating:

- `hello` to `halo`
- `sudah makan?` to `Have you eaten?`

Before publishing that screenshot, remove or mask any personal Telegram identifiers, profile images, and private chat details.
