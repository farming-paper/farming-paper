import { getPapagoApiCredentials } from "~/config";

export type PapagoResponse = {
  message: {
    result: {
      srcLangType: string;
      tarLangType: string;
      translatedText: string;
      engineType: string;
      pivot: null;
      dict: null;
      tarDict: null;
    };
    "@type": "response";
    "@service": "naverservice.nmt.proxy";
    "@version": "1.0.0";
  };
};

let clientCached: ReturnType<typeof createPapagoClient> | null = null;

export function getPapagoClient() {
  if (!clientCached) {
    clientCached = createPapagoClient();
  }

  return clientCached;
}

export function createPapagoClient() {
  const { clientId, clientSecret } = getPapagoApiCredentials();

  if (!clientId || !clientSecret) {
    return null;
  }

  return {
    async getKoreanSentence(engSentence: string) {
      const headers = new Headers();
      headers.append(
        "Content-Type",
        "application/x-www-form-urlencoded; charset=UTF-8"
      );
      headers.append("X-Naver-Client-Id", clientId);
      headers.append("X-Naver-Client-Secret", clientSecret);

      const urlencoded = new URLSearchParams();
      urlencoded.append("source", "en");
      urlencoded.append("target", "ko");
      urlencoded.append("text", engSentence);

      const res = await fetch("https://openapi.naver.com/v1/papago/n2mt", {
        method: "POST",
        headers,
        body: urlencoded,
        redirect: "follow",
      });

      if (!res.ok) {
        return {
          data: null,
          error: (await res.json()).errorMessage,
        };
      }

      const data = (await res.json()) as PapagoResponse;

      return {
        data,
        error: null,
      };
    },
  };
}
