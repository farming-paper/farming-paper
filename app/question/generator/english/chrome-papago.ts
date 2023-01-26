export type ChromePapagoResponse = {
  translatedText: string;
  text: string;
  source: string;
  target: string;
};

const headers = new Headers();
headers.append("Content-Type", "application/json; charset=UTF-8");
headers.append("Accept", "application/json, text/javascript, */*; q=0.01");
headers.append(
  "User-Agent",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
);
headers.append("Origin", "https://www.google.com");

export function getChromePapagoCode(engSentence: string) {
  return `chrome-papago-en-to-ko-${engSentence.replace(/ /g, "-")}`;
}

export async function getKorTranslated(engSentence: string) {
  const body = JSON.stringify({
    source: "en",
    target: "ko",
    text: engSentence,
  });

  const res = await fetch(
    "https://api.papago-chrome.com/v2/translate/openapi",
    {
      method: "POST",
      headers,
      body,
      redirect: "follow",
    }
  );

  if (!res.ok) {
    return {
      data: null,
      error: `${res.status} chrome papago failed`,
    };
  }

  const data = (await res.json()) as ChromePapagoResponse;

  return {
    data,
    error: null,
  };
}
