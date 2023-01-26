import { getOxfordDictionaryApiCredentials } from "~/config";

export type OxfordDictionarySentencesResponse = {
  id: string;
  metadata: unknown;
  results: {
    id: string;
    language: string;
    lexicalEntries: {
      grammaticalFeatures?: {
        id: string;
        text: string;
        type: string;
      }[];
      language: string;
      text: string;
      lexicalCategory: {
        id: string;
        text: string;
      };
      sentences: {
        definitions?: string[];
        domains?: {
          id: string;
          text: string;
        }[];
        notes?: {
          id: string;
          text: string;
          type: string;
        }[];
        regions?: {
          id: string;
          text: string;
        }[];
        registers?: {
          id: string;
          text: string;
        }[];
        senseIds: string[];
        text: string;
      }[];
    }[];
    type: string;
    word: string;
  }[];
  [key: string]: unknown;
};

export function getOxfordDictionarySentencesCode(word: string) {
  return `oxford-dictionary-sentences-${word}`;
}

let clientCached: ReturnType<typeof createOxfordDictionaryClient> | null = null;

export function getOxfordDictionaryClient() {
  if (!clientCached) {
    clientCached = createOxfordDictionaryClient();
  }

  return clientCached;
}

export function createOxfordDictionaryClient() {
  const { appId, appKey } = getOxfordDictionaryApiCredentials();

  if (!appId || !appKey) {
    return null;
  }

  return {
    async getSentences(word: string) {
      const res = await fetch(
        `https://od-api.oxforddictionaries.com/api/v2/sentences/en/${word}`,
        {
          headers: {
            app_id: appId,
            app_key: appKey,
            Accept: "application/json",
          },
        }
      );

      if (!res.ok) {
        return {
          data: null,
          error: "No sentences found matching supplied source_lang and word",
        };
      }

      const data = (await res.json()) as OxfordDictionarySentencesResponse;

      return {
        data,
        error: null,
      };
    },
  };
}
