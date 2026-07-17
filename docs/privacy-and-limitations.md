# Privacy and Limitations

Cakap is a lightweight translation bot. It should be treated as a convenience tool, not as a secure channel for sensitive information.

## Privacy Posture

The current implementation:

- Does not store Telegram message text.
- Does not write messages to a database.
- Does not log translated content intentionally.
- Uses Cloudflare Worker environment secrets for runtime credentials.
- Sends message text to Azure AI Translator for language detection and translation.

## User Notice

Group members should be told that a translation bot is present and that messages may be processed by a translation service.

Suggested group notice:

```text
This group uses Cakap, an automatic English-Indonesian translation bot. Please avoid sending passwords, banking details, identity documents, medical information, or other sensitive information here.
```

## Data Handling Boundary

| Data type | Stored in this repo? | Stored by Worker? | Sent for translation? |
|---|---:|---:|---:|
| Bot token | No | Secret only | No |
| Azure key | No | Secret only | No |
| Webhook secret | No | Secret only | No |
| Telegram message text | No | No persistent storage | Yes, to translation API |
| Chat ID | No | Used only for reply | No direct storage |
| User profile data | No | Not intentionally processed | No |

## Limitations

### 1. Short messages may be misdetected

Very short words such as `ok`, `ya`, `can`, or names may be detected incorrectly or ignored.

### 2. Mixed-language messages may produce imperfect output

Messages containing English, Indonesian, Singlish, Malay, names, slang, or emojis may not translate cleanly.

### 3. The bot only handles text

The current implementation ignores:

- Images
- Voice notes
- Stickers
- Documents
- Videos
- Location messages

### 4. No authentication by chat ID yet

The current version validates Telegram webhook requests but does not restrict usage to a specific Telegram group ID.

Recommended enhancement:

- Add an allowlist for approved chat IDs.

### 5. No audit trail yet

The current version does not store usage logs. This is privacy-friendly but limits reporting.

Possible future enhancement:

- Count messages translated without storing message content.

### 6. Not suitable for confidential or regulated data

Do not use this implementation for sensitive information unless a proper privacy, legal, and security review is completed.

## Recommended Improvements Before Wider Use

- Add chat ID allowlisting.
- Add a usage counter without storing message text.
- Add clear group notice.
- Add secret rotation procedure.
- Add error logging that avoids storing user message content.
- Add administrative commands for health checks.
