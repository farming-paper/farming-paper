import dayjs from "dayjs";
import { getServerSideSupabaseClient } from "~/supabase/client";
import type { Json } from "~/supabase/generated/supabase-types";
import type { OxfordDictionarySentencesResponse } from "./oxford-dictionary-client";
import { getOxfordDictionaryClient } from "./oxford-dictionary-client";
import type { PapagoResponse } from "./papago-client";
import { getPapagoClient } from "./papago-client";

export function getOxfordDictionarySentencesCode(word: string) {
  return `oxford-dictionary-sentences-${word}`;
}

export function getPapagoCode(engSentence: string) {
  return `papago-en-to-ko-${engSentence.replace(/ /g, "-")}`;
}

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

    await db.from("cached").upsert({
      code: oxfordSentencesCode,
      content: oxfordSentencesRes.data as Json,
      expires_in: dayjs().add(300, "day").toISOString(),
    });
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

  const papagoCode = getPapagoCode(engSentance);
  const papago = getPapagoClient();
  const cached = await getCachedContent<PapagoResponse>(papagoCode);

  let content: PapagoResponse;

  if (cached) {
    content = cached;
  } else if (!papago) {
    throw new Error("Papago client is not available");
  } else {
    const papagoRes = await papago.getKoreanSentence(engSentance);
    if (!papagoRes.data) {
      throw new Error(papagoRes.error);
    }

    content = papagoRes.data;

    await db.from("cached").upsert({
      code: papagoCode,
      content: papagoRes.data as Json,
      expires_in: dayjs().add(300, "day").toISOString(),
    });
  }

  return content.message.result.translatedText;
}
