import dayjs from "dayjs";
import { getServerSideSupabaseClient } from "~/supabase/client";
import type { Json } from "~/supabase/generated/supabase-types";
import { withDurationLog } from "~/util";
import type { ChromePapagoResponse } from "./chrome-papago";
import {
  getChromePapagoCode,
  getKorTranslated as getChromePapagoKorTranslated,
} from "./chrome-papago";
import type { OxfordDictionarySentencesResponse } from "./oxford-dictionary-client";
import {
  getOxfordDictionaryClient,
  getOxfordDictionarySentencesCode,
} from "./oxford-dictionary-client";
import type { PapagoResponse } from "./papago";
import { getPapagoClient, getPapagoCode } from "./papago";
import replace from "./replace";

export async function getCachedContent<Content>(
  code: string
): Promise<Content | null> {
  const db = getServerSideSupabaseClient();

  const cacheRes = await db
    .from("cached")
    .select("content, expires_in")
    .eq("code", code)
    .single();

  if (cacheRes.data) {
    const expires_in = dayjs(cacheRes.data.expires_in as string);
    if (expires_in.isAfter(dayjs())) {
      return cacheRes.data.content as Content;
    } else {
      await db.from("cached").delete().eq("code", code);
      return null;
    }
  }
  return null;
}

export async function getEngSentences(word: string) {
  const oxford = getOxfordDictionaryClient();
  const db = getServerSideSupabaseClient();

  const oxfordSentencesCode = getOxfordDictionarySentencesCode(word);
  const cached = await getCachedContent<OxfordDictionarySentencesResponse>(
    oxfordSentencesCode
  );
  let content: OxfordDictionarySentencesResponse;

  if (cached) {
    content = cached;
  } else if (!oxford) {
    throw new Error("Oxford Dictionary client is not available");
  } else {
    const oxfordSentencesRes = await oxford.getSentences(word);

    if (!oxfordSentencesRes.data) {
      throw new Error(oxfordSentencesRes.error);
    }

    content = oxfordSentencesRes.data;

    await withDurationLog(
      "cached.upsert",
      db.from("cached").upsert({
        code: oxfordSentencesCode,
        content: oxfordSentencesRes.data as Json,
        expires_in: dayjs().add(300, "day").toISOString(),
      })
    );
  }

  // get sentences
  return content.results
    .map((result) =>
      result.lexicalEntries.map((entry) =>
        entry.sentences.map((sentence) => sentence.text)
      )
    )
    .flat(20);
}

export async function getKorTranslated(engSentance: string) {
  const db = getServerSideSupabaseClient();

  const chromePapagoCode = getChromePapagoCode(engSentance);

  const chromePapagoCached = await getCachedContent<ChromePapagoResponse>(
    chromePapagoCode
  );
  if (chromePapagoCached) {
    return chromePapagoCached.translatedText;
  }

  const papagoCode = getPapagoCode(engSentance);
  const papagoCached = await getCachedContent<PapagoResponse>(papagoCode);
  if (papagoCached) {
    return papagoCached.message.result.translatedText;
  }

  const chromePapagoRes = await getChromePapagoKorTranslated(engSentance);
  if (chromePapagoRes.data) {
    await db.from("cached").upsert({
      code: chromePapagoCode,
      content: chromePapagoRes.data as Json,
      expires_in: dayjs().add(1600, "day").toISOString(),
    });

    return chromePapagoRes.data.translatedText;
  }

  const papago = getPapagoClient();
  if (papago) {
    const papagoRes = await papago.getKorTranslated(engSentance);
    if (papagoRes.data) {
      await db.from("cached").upsert({
        code: papagoCode,
        content: papagoRes.data as Json,
        expires_in: dayjs().add(1600, "day").toISOString(),
      });

      return papagoRes.data.message.result.translatedText;
    }
  }

  throw new Error("No translation available");
}

export async function generateEnglishQuestion(word: string) {
  const sentences = await getEngSentences(word);

  const sentence = sentences[Math.floor(Math.random() * sentences.length)];
  if (!sentence) {
    throw new Response("Unknown Error while fetching sentences", {
      status: 500,
    });
  }

  const translated = await getKorTranslated(sentence);

  const { extractedWords, replaced } = replace({
    sourceEngSentence: sentence,
    word,
  });

  return { sentence, translated, extractedWords, marked: replaced };
}
