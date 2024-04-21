// BEST PRACTICE
import { Button } from "@nextui-org/react";
import type { MetaFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import dayjs from "dayjs";
import { deepEqual } from "fast-equals";
import { Plus, Tag, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { z } from "zod";
import editSingleQuestionAction from "~/actions/editSingleQuestion";
import { requireAuth } from "~/auth/get-session";
import { SetTagModal } from "~/common/components/AddTagModal";
import DefaultLayout from "~/common/components/DefaultLayout";
import { DeleteQuestionModalWithButton } from "~/common/components/DeleteQuestionModalWithButton";
import SideMenuV2 from "~/common/components/SideMenuV2";
import prisma from "~/prisma-client.server";
import { QuestionProvider } from "~/question/context";
import { createQuestionContent } from "~/question/create";
import ParagrahEditor from "~/question/edit-components/ParagraphEditor";
import type { Question, QuestionContent } from "~/question/types";
import type { ITagWithCount } from "~/types";
import { getObjBigintToNumber } from "~/util";

export const meta: MetaFunction = () => {
  return [
    {
      title: "문제 편집 | Farming Paper",
    },
  ];
};

const searchParamsSchema = z.object({
  back: z.literal("solve"),
  tags: z
    .string()
    .optional()
    .transform((v) => v?.split(",")),
});

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { profile } = await requireAuth(request);

  const { publicId: questionPublicId } = params;
  if (!questionPublicId) {
    throw new Response("Public Id Not Found", {
      status: 404,
    });
  }

  const validation = searchParamsSchema.safeParse(
    Object.fromEntries(new URL(request.url).searchParams)
  );

  if (!validation.success) {
    throw new Response(JSON.stringify({ error: validation.error }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const [question, allTags] = await Promise.all([
    prisma.questions.findUniqueOrThrow({
      where: {
        public_id: questionPublicId,
        creator: profile.id,
        deleted_at: null,
      },
      select: {
        id: true,
        original_id: true,
        content: true,
        created_at: true,
        updated_at: true,
        deleted_at: true,
        public_id: true,
        tags_questions_relation: {
          select: { tags: { select: { name: true, public_id: true } } },
        },
      },
    }),

    // 모든 태그
    prisma.tags.findMany({
      where: {
        creator: profile.id,
        deleted_at: null,
      },
      orderBy: { created_at: "asc" },
      select: {
        public_id: true,
        name: true,
        desc: true,
        _count: {
          select: {
            tags_questions_relation: true,
          },
        },
      },
    }),
  ]);

  return json({
    question: {
      ...getObjBigintToNumber(question),
      content: createQuestionContent(
        question.content as Partial<QuestionContent>
      ),
    },

    activeTagPublicIds: question.tags_questions_relation.map(
      (t) => t.tags.public_id
    ),

    allTags: allTags.map((tag): ITagWithCount => {
      const result: ITagWithCount = {
        name: tag.name || "",
        publicId: tag.public_id,
        count: tag._count.tags_questions_relation,
      };
      if (tag.desc) {
        result.desc = tag.desc;
      }
      return result;
    }),
  });
}

export default function Page() {
  const loaded = useLoaderData<typeof loader>();

  const [editingContent, setEditingContent] = useState<QuestionContent>(
    loaded.question.content
  );

  const question: Question = {
    id: loaded.question.id,
    originalId: loaded.question.original_id,
    content: loaded.question.content,
    createdAt: dayjs(loaded.question.created_at),
    updatedAt: dayjs(loaded.question.updated_at),
    deletedAt: loaded.question.deleted_at
      ? dayjs(loaded.question.deleted_at)
      : null,
    publicId: loaded.question.public_id,
    tags: loaded.question.tags_questions_relation.map((t) => {
      return {
        name: t.tags.name || "",
        publicId: t.tags.public_id,
      };
    }),
  };

  const isDirty = useMemo(() => {
    return !deepEqual(editingContent, question.content);
  }, [editingContent, question.content]);

  return (
    <DefaultLayout sidebarTop={<SideMenuV2 />}>
      <div
        className="box-border px-10 mx-auto mt-20"
        style={{ width: "calc(700px + 3rem)" }}
      >
        <h1 className="mb-10 text-xl font-bold">Edit Question</h1>
        <QuestionProvider question={question}>
          <div className="flex items-center justify-between">
            <div
              className="flex items-center py-1 text-xs text-gray-400 gap-2.5 overflow-hidden select-none"
              style={{ backgroundColor: "rgba(249, 250, 251, 0.3)" }}
            >
              <span className="font-mono font-bold">
                {question.createdAt.format("YYYY.MM.DD.")}
              </span>
              {question.tags.length > 0 && (
                <div className="flex items-center gap-0.5">
                  <Tag className="w-2.5 h-2.5 text-gray-300" />
                  <span>{question.tags.map((t) => t.name).join(", ")}</span>
                </div>
              )}
              <SetTagModal
                tags={loaded.allTags}
                TriggerButton={({ onPress }) => (
                  <Button
                    onPress={onPress}
                    variant="light"
                    className="h-auto min-w-0 pl-0.5 py-0.5 pr-1  text-xs font-bold rounded-sm text-inherit gap-0.5"
                    startContent={<Plus className="w-3 h-3 text-gray-300 " />}
                    disableRipple
                  >
                    태그 추가
                  </Button>
                )}
              />
              <DeleteQuestionModalWithButton
                TriggerButton={({ onPress }) => (
                  <Button
                    onPress={onPress}
                    variant="light"
                    className="h-auto min-w-0 px-1 py-1 rounded-sm text-inherit"
                  >
                    <Trash2 className="w-3.5 h-3.5 " />
                  </Button>
                )}
              />
            </div>
            <div>
              {isDirty && (
                <div className="text-xs text-gray-400">
                  수정사항이 있습니다.
                </div>
              )}
            </div>
          </div>

          <ParagrahEditor
            key={question.originalId || question.id}
            onContentChange={setEditingContent}
          />
          <div className="flex flex-row-reverse mt-10">
            <Form method="post" className="flex">
              <input
                type="hidden"
                name="intent"
                value="update_question_content"
              />
              <input
                type="hidden"
                name="content"
                value={JSON.stringify(editingContent)}
              />
              <Button color="primary" type="submit">
                Update
              </Button>
            </Form>
          </div>
        </QuestionProvider>
      </div>
    </DefaultLayout>
  );
}

export const action = editSingleQuestionAction;
