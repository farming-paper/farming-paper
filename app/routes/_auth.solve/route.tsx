import { BreadcrumbItem, Breadcrumbs, Button, Link } from "@nextui-org/react";
import type { MetaFunction } from "@remix-run/node";
import {
  useLoaderData,
  useRevalidator,
  useSearchParams,
} from "@remix-run/react";
import dayjs from "dayjs";
import { Provider } from "jotai";
import { useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import DefaultLayout from "~/common/components/DefaultLayout";
import SideMenuV2 from "~/common/components/SideMenuV2";
import { defaultMeta } from "~/meta";
import SolveQuestion from "~/question/SolveQuestion";
import SolveSubmitButton from "~/question/SolveSubmitButton";
import { QuestionProvider } from "~/question/context";
import type { Question } from "~/question/types";
import type { loader } from "./loader";
export { action } from "./action";
export { loader } from "./loader";

export const meta: MetaFunction = () => {
  return [...defaultMeta, { title: "Solve | Farming Paper" }];
};

export default function Solve() {
  const {
    question: q,
    todayCount,
    questionPoolCount,
    tagNames,
  } = useLoaderData<typeof loader>();

  const [params] = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const message = params.get("message");
    if (message === "update_success") {
      toast.success("문제가 성공적으로 수정되었습니다.", {
        toastId: message,
      });
    }
  }, []);

  const question: Question = useMemo(
    () => ({
      id: q.id,
      originalId: q.original_id,
      content: q.content,
      createdAt: dayjs(q.created_at),
      updatedAt: dayjs(q.updated_at),
      deletedAt: q.deleted_at ? dayjs(q.deleted_at) : null,
      publicId: q.public_id,
      tags: q.tags_questions_relation.map((t) => {
        return {
          name: t.tags.name || "",
          publicId: t.tags.public_id,
        };
      }),
    }),
    [q]
  );

  const revalidator = useRevalidator();

  return (
    <DefaultLayout
      header={
        <Breadcrumbs
          className="py-2 w-[700px] mx-auto pointer-events-auto"
          itemClasses={{
            item: "px-2 text-default-400",
            separator: "px-0",
          }}
        >
          <BreadcrumbItem href="/dashboard">홈</BreadcrumbItem>
          <BreadcrumbItem>문제 풀기({tagNames.join(",")})</BreadcrumbItem>
        </Breadcrumbs>
      }
      sidebarTop={<SideMenuV2 />}
    >
      <div className="box-border px-4 pt-20 mx-auto max-w-[700px] ">
        <div>
          문제는 총 {questionPoolCount}개, 당신은 {todayCount} 문제를
          풀었습니다. (최근 1달간. 문제 수정 시 초기화)
        </div>
        <QuestionProvider question={question} updateContent>
          <Provider>
            <SolveQuestion />
            <div className="flex flex-row-reverse flex-wrap justify-between gap-4 mt-3">
              <div>
                <SolveSubmitButton />
              </div>
              <div className="flex justify-center gap-2">
                <Button
                  href={`/pass?tags=${params.get("tags")}&question_public_id=${
                    question.publicId
                  }`}
                  as={Link}
                  variant="flat"
                >
                  Pass
                </Button>
                <Button
                  href={`/q/edit/${question.publicId}?tags=${params.get(
                    "tags"
                  )}&back=solve`}
                  as={Link}
                  color="default"
                  variant="flat"
                >
                  Edit
                </Button>
                <Button
                  onPress={() => {
                    revalidator.revalidate();
                  }}
                  color="default"
                  variant="flat"
                >
                  Reroll
                </Button>
              </div>
            </div>
          </Provider>
        </QuestionProvider>
      </div>
    </DefaultLayout>
  );
}
