# Privacy and Limitations

Cakap is a lightweight translation bot. It should be treated as a convenience tool, not as a secure channel for sensitive information.

## Privacy Posture

The current implementation:

- Does not store Telegram message text in a database.
- Does not intentionally log translated content.
- Uses Cloudflare Worker secrets for Telegram credentials.
- Sends message text to Cloudflare Workers AI for language classification and translation.
- Does not send message text to Azure Translator, Gemini, DeepL, or another external translation API.

Cloudflare states that Customer Content submitted to Workers AI is not used to train Workers AI models or improve Cloudflare or third-party services unless the customer explicitly consents.

## User Notice

Group members should be told that an automatic translation bot is present and that message text is processed by an AI/translation service.

Suggested notice:

```text
This group uses Cakap, an automatic English-Indonesian translation bot. Please avoid sending passwords, banking details, identity documents, medical information, or other sensitive information here.
```

## Data Handling Boundary

| Data type | Stored in repo? | Persistently stored by Worker? | Sent to Workers AI? |
|---|---:|---:|---:|
| Telegram bot token | No | Secret only | No |
| Webhook secret | No | Secret only | No |
| Telegram message text | No | No | Yes |
| Chat ID | No | No | No |
| Basic Telegram message metadata | No | No | Not intentionally |

## Limitations

### 1. Short messages may be misclassified

Very short words such as `ok`, `ya`, `can`, names, or slang can be ambiguous.

### 2. Mixed-language messages may be imperfect

English, Indonesian, Malay, Singlish, names, slang, and emojis may appear in the same message. The classifier chooses a dominant language where possible.

### 3. Translation is machine-generated

The translation model can make mistakes. Important instructions, legal text, medical advice, financial information, or other consequential content should not rely on the bot as the sole translation source.

### 4. Text only

The current implementation ignores images, voice notes, stickers, documents, videos, and location messages.

### 5. No chat allowlist yet

The webhook is validated, but the bot does not currently restrict translation to an approved Telegram chat ID.

### 6. No audit trail

The current version does not store a translation history. This reduces retained data but limits usage reporting and troubleshooting.

### 7. Free-tier and model availability can change

Workers AI currently provides a daily free allocation, but free-tier limits, pricing, and individual model availability are not permanent contractual guarantees. If a selected model is deprecated or moved behind a paid plan, the Worker configuration or model identifier may need to be changed.

### 8. Not suitable for confidential or regulated data by default

Do not use this implementation for confidential or regulated information without an appropriate privacy, security, and legal review.

## Recommended Improvements Before Wider Use

- Add an approved-chat allowlist.
- Add privacy-preserving usage counters.
- Add a health/admin command.
- Add fallback handling for model deprecation or temporary AI capacity errors.
- Keep error logging free of message content and credentials.
