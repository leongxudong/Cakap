export default {
  async fetch(request, env) {
    try {
      if (request.method === "GET") {
        return new Response("Cakap Telegram translation bot is running.");
      }

      if (request.method !== "POST") {
        return new Response("Method not allowed", { status: 405 });
      }

      const telegramSecret = request.headers.get("X-Telegram-Bot-Api-Secret-Token");

      if (telegramSecret !== env.WEBHOOK_SECRET) {
        return new Response("Unauthorized", { status: 401 });
      }

      const update = await request.json();

      if (!update.message || !update.message.text) {
        return new Response("No text message to process.");
      }

      const message = update.message;
      const text = message.text.trim();

      // Avoid commands, empty text, and bot loops.
      if (!text || text.startsWith("/") || message.from?.is_bot) {
        return new Response("Ignored.");
      }

      // Cost and usability guardrail. Adjust if needed.
      if (text.length > 1000) {
        await sendTelegramMessage(
          env,
          message.chat.id,
          "Message too long to auto-translate.",
          message.message_id
        );
        return new Response("Message too long.");
      }

      const detectedLanguage = await detectLanguage(env, text);

      let targetLanguage = null;
      let label = "";

      if (detectedLanguage === "en") {
        targetLanguage = "id";
        label = "🇮🇩 Indonesian";
      } else if (detectedLanguage === "id") {
        targetLanguage = "en";
        label = "🇬🇧 English";
      } else {
        return new Response(`Ignored language: ${detectedLanguage}`);
      }

      const translatedText = await translateText(env, text, detectedLanguage, targetLanguage);

      if (!translatedText || translatedText.toLowerCase() === text.toLowerCase()) {
        return new Response("No useful translation.");
      }

      await sendTelegramMessage(
        env,
        message.chat.id,
        `${label}:\n${translatedText}`,
        message.message_id
      );

      return new Response("OK");
    } catch (error) {
      return new Response(`Error: ${error.message}`, { status: 500 });
    }
  }
};

async function detectLanguage(env, text) {
  const endpoint = "https://api.cognitive.microsofttranslator.com/detect?api-version=3.0";

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": env.AZURE_TRANSLATOR_KEY,
      "Ocp-Apim-Subscription-Region": env.AZURE_TRANSLATOR_REGION,
      "Content-Type": "application/json"
    },
    body: JSON.stringify([{ text }])
  });

  if (!response.ok) {
    throw new Error(`Language detection failed: ${response.status}`);
  }

  const data = await response.json();
  return data?.[0]?.language;
}

async function translateText(env, text, fromLanguage, toLanguage) {
  const endpoint =
    `https://api.cognitive.microsofttranslator.com/translate` +
    `?api-version=3.0&from=${encodeURIComponent(fromLanguage)}` +
    `&to=${encodeURIComponent(toLanguage)}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": env.AZURE_TRANSLATOR_KEY,
      "Ocp-Apim-Subscription-Region": env.AZURE_TRANSLATOR_REGION,
      "Content-Type": "application/json"
    },
    body: JSON.stringify([{ text }])
  });

  if (!response.ok) {
    throw new Error(`Translation failed: ${response.status}`);
  }

  const data = await response.json();
  return data?.[0]?.translations?.[0]?.text;
}

async function sendTelegramMessage(env, chatId, text, replyToMessageId) {
  const endpoint = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      reply_to_message_id: replyToMessageId,
      disable_web_page_preview: true
    })
  });

  if (!response.ok) {
    throw new Error(`Telegram sendMessage failed: ${response.status}`);
  }
}
