import { redirect } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/server-runtime";
import { createServerClient } from "@supabase/auth-helpers-remix";
import { nanoid } from "nanoid";
import { getClientSideSupabaseConfig } from "~/config";
import { createQuestionContent } from "~/question/create";
import { QuestionContent } from "~/question/types";
import { getServerSideSupabaseClient } from "~/supabase/client";
import type { Database, Json } from "~/supabase/generated/supabase-types";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = new Response();
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  const { anonKey, url: supabaseUrl } = getClientSideSupabaseConfig();

  if (!code) {
    return redirect("/login?status=no_code", {
      headers: response.headers,
    });
  }

  const supabaseClientForAuth = createServerClient<Database>(
    supabaseUrl,
    anonKey,
    {
      request,
      response,
    }
  );

  const authResponse = await supabaseClientForAuth.auth.exchangeCodeForSession(
    code
  );

  const email = authResponse.data.user?.email;

  if (!email) {
    return redirect("/login?status=fail_get_email", {
      headers: response.headers,
    });
  }

  const db = getServerSideSupabaseClient();

  const existingUser = await db
    .from("profiles")
    .select("email", { count: "exact" })
    .eq("email", email)
    .is("deleted_at", null);

  // 이미 가입한 사용자는 /dashboard 로 보냄.
  if (typeof existingUser.count === "number" && existingUser.count > 0) {
    return redirect("/dashboard?status=already_joined", {
      headers: response.headers,
    });
  }

  const userRes = await db
    .from("profiles")
    .insert({
      email,
      public_id: nanoid(),
    })
    .select("id")
    .single();

  if (userRes.error) {
    throw new Response(
      "프로필 생성에 실패했습니다." + userRes.error?.message ?? "",
      {
        status: 401,
      }
    );
  }

  const user = userRes.data;
  const qs: Partial<QuestionContent>[] = [
    {
      type: "short_order",
      descendants: [
        {
          type: "paragraph",
          children: [
            { text: "제주도에서 가장 높은 산은 " },
            { type: "blank", children: [{ text: "한라산" }] },
            { text: "입니다." },
          ],
        },
      ],
    },
    {
      type: "short_order",
      descendants: [
        {
          type: "paragraph",
          children: [
            { text: "" },
            { type: "blank", children: [{ text: "서울" }] },
            { text: "은 대한민국의 수도입니다. 그리고 " },
            { type: "blank", children: [{ text: "부산" }] },
            { text: "은 한국의 최대 해양도시로, 해운대가 이곳에 있습니다." },
          ],
        },
      ],
    },
    {
      type: "short_order",
      descendants: [
        {
          type: "paragraph",
          children: [
            { text: "영화 '기생충'으로 전 세계 영화상을 휩쓴 " },
            { type: "blank", children: [{ text: "봉준호" }] },
            {
              text: "는 예술성과 오락성 그리고 대중성과 독창성을 모두 인정받은 영화감독 중 한 명으로 꼽힌다. 또한 ",
            },
            { type: "blank", children: [{ text: "봉준호" }] },
            { text: "는 겸손하고 따뜻한 인품을 가진 영화감독으로 유명하다." },
          ],
        },
      ],
    },
    {
      type: "short_order",
      descendants: [
        {
          type: "paragraph",
          children: [
            { text: "You’d " },
            { type: "blank", children: [{ text: "better" }] },
            { text: " get cleaned up." },
          ],
        },
        { type: "paragraph", children: [{ text: "너 좀 씻는 게 좋겠다." }] },
      ],
    },
    {
      type: "short_order",
      descendants: [
        {
          type: "paragraph",
          children: [
            { text: "" },
            { type: "blank", children: [{ text: "Thank" }] },
            { text: " you for your " },
            { type: "blank", children: [{ text: "kind" }] },
            { text: " invitation." },
          ],
        },
        {
          type: "paragraph",
          children: [{ text: "친절하게 초대해 주셔서 감사합니다." }],
        },
      ],
    },
    {
      type: "short_order",
      descendants: [
        {
          type: "paragraph",
          children: [
            { text: "다음 정의에 맞는 단어는 무엇일까요? \u003e " },
            { type: "blank", children: [{ text: "test" }] },
            { text: "" },
          ],
        },
        { type: "paragraph", children: [{ text: "" }] },
        {
          type: "paragraph",
          children: [
            {
              text: "1. NOUN a procedure intended to establish the quality, performance, or reliability of something, especially before it is taken into widespread use",
            },
          ],
        },
        {
          type: "paragraph",
          children: [
            {
              text: "2. NOUN a short written or spoken examination of a person's proficiency or knowledge",
            },
          ],
        },
        {
          type: "paragraph",
          children: [
            {
              text: "3. VERB take measures to check the quality, performance, or reliability of (something), especially before putting it into widespread use or practice",
            },
          ],
        },
        {
          type: "paragraph",
          children: [
            {
              text: "4. VERB give (someone) a short written or oral examination of their proficiency or knowledge",
            },
          ],
        },
      ],
    },
  ];

  const [questionsRes, tagsRes] = await Promise.all([
    db
      .from("questions")
      .insert(
        qs.map((questionContent) => {
          return {
            creator: user.id,
            public_id: nanoid(),
            content: createQuestionContent(questionContent) as unknown as Json,
          };
        })
      )
      .select("id"),
    db
      .from("tags")
      .insert([
        {
          creator: user.id,
          public_id: nanoid(),
          name: "상식",
        },
        {
          creator: user.id,
          public_id: nanoid(),
          name: "영어",
        },
      ])
      .select("id"),
  ]);

  if (questionsRes.error || tagsRes.error) {
    throw new Response(
      `질문 생성에 실패했습니다. ${questionsRes.error?.message ?? ""} ${
        tagsRes.error?.message ?? ""
      }`,
      {
        status: 400,
      }
    );
  }

  const createdQuestions = questionsRes.data;
  const createdTags = tagsRes.data;

  const questionTagsRes = await db.from("tags_questions_relation").insert([
    {
      q: createdQuestions[0]?.id ?? -1,
      tag: createdTags[0]?.id ?? -1,
    },
    {
      q: createdQuestions[1]?.id ?? -1,
      tag: createdTags[0]?.id ?? -1,
    },
    {
      q: createdQuestions[2]?.id ?? -1,
      tag: createdTags[0]?.id ?? -1,
    },
    {
      q: createdQuestions[3]?.id ?? -1,
      tag: createdTags[1]?.id ?? -1,
    },
    {
      q: createdQuestions[4]?.id ?? -1,
      tag: createdTags[1]?.id ?? -1,
    },
    {
      q: createdQuestions[5]?.id ?? -1,
      tag: createdTags[1]?.id ?? -1,
    },
  ]);

  if (questionTagsRes.error) {
    throw new Response(
      `질문 태그 연결에 실패했습니다. ${questionTagsRes.error?.message ?? ""}`,
      {
        status: 400,
      }
    );
  }

  return redirect("/dashboard?status=entry", { headers: response.headers });
};

export default function AuthCallback() {
  return (
    <div className="p-4">
      <h1 className="my-2 text-xl font-medium">로그인 중입니다...</h1>
    </div>
  );
}
