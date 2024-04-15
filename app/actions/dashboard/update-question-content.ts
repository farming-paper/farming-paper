import { nanoid } from "nanoid";
import prisma from "~/prisma-client.server";
import { getObjBigintToNumber } from "~/util";

export default async function updateQuestionContent({
  content,
  public_id,
  creator,
}: {
  intent: "update_question_content";
  public_id: string;
  content: string;
  creator: number;
}) {
  const parsedContent = JSON.parse(content);

  const deleted = await prisma.questions.update({
    where: {
      public_id,
      creator,
      // dele ted_at: null, // 삭제가 연속으로 됐을 때 업데이트 대상을 찾지 못하므로 삭제 조건을 제외
    },
    data: {
      deleted_at: new Date(),
    },
    select: {
      created_at: true,
      creator: true,
      id: true,
      original_id: true,
      tags_questions_relation: {
        select: {
          q: true,
          tag: true,
        },
      },
    },
  });

  const created = await prisma.questions.create({
    data: {
      content: parsedContent,
      creator: deleted.creator,
      created_at: deleted.created_at,
      public_id: nanoid(),
      original_id: deleted.original_id ? deleted.original_id : deleted.id,
      tags_questions_relation: {
        create: deleted.tags_questions_relation.map((tqr) => ({
          tag: tqr.tag,
        })),
      },
    },
    select: {
      content: true,
      created_at: true,
      creator: true,
      id: true,
      original_id: true,
      tags_questions_relation: {
        select: {
          tags: {
            select: {
              name: true,
              public_id: true,
            },
          },
        },
      },
    },
  });

  return getObjBigintToNumber({
    ...created,
    tags: created.tags_questions_relation.map((tqr) => tqr.tags),
  });
}
