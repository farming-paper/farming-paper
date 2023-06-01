import { redirect } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { createServerClient } from "@supabase/auth-helpers-remix";
import { nanoid } from "nanoid";
import { getClientSideSupabaseConfig } from "~/config";
import { createQuestion } from "~/question/create";
import { getServerSideSupabaseClient } from "~/supabase/client";
import type { Database, Json } from "~/supabase/generated/supabase-types";

export const loader = async ({ request }: LoaderArgs) => {
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

  // 이미 가입한 사용자는 /q/solve 로 보냄.
  if (typeof existingUser.count === "number" && existingUser.count > 0) {
    return redirect("/q/solve?status=already_joined", {
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
  const qs = [
    {
      message: "제주도에서 가장 높은 산의 이름은?",
      corrects: ["한라산"],
    },
    {
      message:
        "___ 은 대한민국의 수도입니다. 그리고 ___ 은 한국의 최대 해양도시로, 해운대가 이곳에 있습니다. (답변의 구분은 쉼표(,)로 합니다. 추후 업데이트 예정)",
      corrects: ["서울", "부산"],
    },
    {
      message:
        "___ : 대한민국의 7인조 보이그룹으로, 'Dynamite'로 빌보드 핫 100 1위를 했었다.",
      corrects: ["방탄소년단"],
    },
    {
      message: "You’d ___ get cleaned up. (너 좀 씻는 게 좋겠다.)",
      corrects: ["better"],
    },
    {
      message:
        "___ you for your ___ invitation. (**친절**하게 초대해 주셔서 **감사**합니다.) (답변의 구분은 쉼표(,)로 합니다. 추후 업데이트 예정)",
      corrects: ["Thank", "kind"],
    },
    {
      message: `다음 정의에 맞는 단어를 쓰세요.

1. NOUN a procedure intended to establish the quality, performance, or reliability of something, especially before it is taken into widespread use
2. NOUN a short written or spoken examination of a person's proficiency or knowledge
3. VERB take measures to check the quality, performance, or reliability of (something), especially before putting it into widespread use or practice
4. VERB give (someone) a short written or oral examination of their proficiency or knowledge`,
      corrects: ["test"],
    },
  ];

  const [questionsRes, tagsRes] = await Promise.all([
    db
      .from("questions")
      .insert(
        qs.map(({ message, corrects }) => {
          return {
            creator: user.id,
            public_id: nanoid(),
            content: createQuestion({
              type: "short_order",
              corrects,
              message,
            }) as Json,
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

  return redirect("/q/solve?status=entry", { headers: response.headers });
};

export default function AuthCallback() {
  return (
    <div className="p-4">
      <h1 className="my-2 text-xl font-medium">로그인 중입니다...</h1>
    </div>
  );
}
