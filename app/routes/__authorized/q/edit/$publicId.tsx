import { useFetcher, useLoaderData } from "@remix-run/react";
import type {
  ActionArgs,
  LoaderArgs,
  MetaFunction,
} from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { Button, message } from "antd";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import type { PartialDeep } from "type-fest";
import { getSessionWithProfile } from "~/auth/get-session";
import { createQuestion } from "~/question/create";
import QuestionForm from "~/question/edit-components/QuestionForm";
import questionFormResolver from "~/question/question-form-resolver";
import type { Question, QuestionRow } from "~/question/types";
import { getServerSideSupabaseClient } from "~/supabase/client";
import type { Database, Json } from "~/supabase/generated/supabase-types";
import type { ITag } from "~/types";
import { removeNullDeep } from "~/util";

export const meta: MetaFunction = () => {
  return {
    title: "문제 편집 | Farming Paper",
  };
};

export async function getQuestionRow({
  profileId,
  publicId,
}: {
  profileId: number;
  publicId: string;
}) {
  const db = getServerSideSupabaseClient();
  const questionRes = await db
    .from("questions")
    .select("*")
    .eq("creator", profileId)
    .eq("public_id", publicId)
    .single();

  if (!questionRes.data) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  const tags = await db
    .from("tags_questions_relation")
    .select("tag (*)")
    .eq("q", questionRes.data.id);

  if (!tags.data) {
    throw new Response("Unknown Error", {
      status: 500,
    });
  }

  const row: QuestionRow = {
    content: createQuestion(questionRes.data?.content as PartialDeep<Question>),
    publicId: questionRes.data.public_id,
    updatedAt: questionRes.data.updated_at,
    tags: tags.data.map((t) => {
      const tag = t.tag as Database["public"]["Tables"]["tags"]["Row"];
      return removeNullDeep({
        name: tag.name || "",
        publicId: tag.public_id,
        desc: tag.desc,
      });
    }),
  };

  return row;
}

export async function getAllTags({ profileId }: { profileId: number }) {
  const db = getServerSideSupabaseClient();
  const tagsRes = await db
    .from("tags")
    .select("name, public_id, desc")
    .eq("creator", profileId);

  if (!tagsRes.data) {
    throw new Response("Unknown Error", {
      status: 500,
    });
  }

  const tags: ITag[] = tagsRes.data.map((t) => {
    return removeNullDeep({
      name: t.name || "",
      publicId: t.public_id,
      desc: t.desc,
    });
  });

  return tags;
}

export async function loader({ request, params }: LoaderArgs) {
  const publicId = params.publicId;
  if (!publicId) {
    throw new Response("Public Id Not Found", {
      status: 400,
    });
  }
  const response = new Response();
  const { profile } = await getSessionWithProfile({ request, response });

  const [row, tags] = await Promise.all([
    getQuestionRow({ profileId: profile.id, publicId }),
    getAllTags({ profileId: profile.id }),
  ]);

  return json({
    row,
    tags,
  });
}

export default function QuestionEdit() {
  const createNewFetch = useFetcher<typeof action>();
  const loaded = useLoaderData<typeof loader>();

  const { handleSubmit, formState, control, watch, setValue, setFocus } =
    useForm({
      resolver: questionFormResolver,
      defaultValues: { question: loaded.row.content, tags: loaded.row.tags },
    });

  const onSubmit = useMemo(
    () =>
      handleSubmit(async (formData) => {
        const q = createQuestion(formData.question);
        createNewFetch.submit(
          {
            formValues: JSON.stringify(q),
          },
          {
            method: "post",
            action: `/q/edit/${loaded.row.publicId}`,
          }
        );
      }),
    [createNewFetch, handleSubmit, loaded.row.publicId]
  );

  const values = watch();

  useEffect(() => {
    console.log("values", values);
  }, [values]);

  useEffect(() => {
    if (createNewFetch?.data?.data) {
      message.success({
        key: "creating",
        content: "성공적으로 수정되었습니다.",
      });
    } else if (createNewFetch?.data?.error) {
      message.error({ key: "creating", content: "문제 수정이 실패했습니다." });
      // eslint-disable-next-line no-console
      console.error("createNewFetch?.data?.error", createNewFetch?.data?.error);
    }
  }, [createNewFetch?.data?.data, createNewFetch?.data?.error]);

  useEffect(() => {
    if (createNewFetch.state === "submitting") {
      message.loading({
        key: "creating",
        content: "문제를 수정하는 중입니다...",
      });
    }
  }, [createNewFetch.state, setFocus, setValue]);

  /** keyboard shortcut */
  useEffect(() => {
    const submitShortcut = (e: KeyboardEvent) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        onSubmit();
      }
    };
    document.addEventListener("keydown", submitShortcut);
    return () => {
      document.removeEventListener("keydown", submitShortcut);
    };
  }, [onSubmit]);

  return (
    <div className="p-2">
      <h1 className="my-2 text-xl font-medium">문제 편집</h1>
      <QuestionForm
        control={control}
        formState={formState}
        setValue={setValue}
        values={values}
        existingTags={loaded.tags}
      />
      <div className="flex justify-end">
        <Button htmlType="submit" onClick={onSubmit} type="primary">
          수정
        </Button>
      </div>
    </div>
  );
}

export const action = async ({ request, params }: ActionArgs) => {
  const publicId = params.publicId;
  const data = Object.fromEntries(await request.formData()) as {
    formValues: string;
  };

  const question = JSON.parse(data.formValues) as Question;

  const response = new Response();
  const { profile } = await getSessionWithProfile({
    request,
    response,
  });

  const db = getServerSideSupabaseClient();

  const updated = await db
    .from("questions")
    .update({
      content: question as unknown as Json,
    })
    .eq("creator", profile.id)
    .eq("public_id", publicId)
    .select("*")
    .single();

  if (!updated.data) {
    return json({
      data: null,
      error: updated.error?.message || "",
    });
  } else {
    return json({
      data: updated.data,
      error: null,
    });
  }
};
