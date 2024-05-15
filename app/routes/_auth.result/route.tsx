import { BreadcrumbItem, Breadcrumbs, Button, Link } from "@nextui-org/react";
import type { MetaFunction } from "@remix-run/node";
import { Form, useLoaderData, useSearchParams } from "@remix-run/react";
import dayjs from "dayjs";
import { ArrowRight } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import DefaultLayout from "~/common/components/DefaultLayout";
import SideMenuV2 from "~/common/components/SideMenuV2";
import { defaultMeta } from "~/meta";
import ResultQuestion from "~/question/ResultQuestion";
import { QuestionProvider } from "~/question/context";
import type { Question } from "~/question/types";
import type { loader } from "./loader";
export { action } from "./action";
export { loader } from "./loader";

export const meta: MetaFunction = () => {
  return [...defaultMeta, { title: "Result | Farming Paper" }];
};

export default function Result() {
  const data = useLoaderData<typeof loader>();
  const [params] = useSearchParams();
  const q = data.question;
  const { success, incorrects, tags } = data;

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

  const nextButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (nextButtonRef.current) {
      nextButtonRef.current.focus();
    }
  }, []);

  return (
    <DefaultLayout
      header={
        <Breadcrumbs
          className="pointer-events-auto"
          itemClasses={{
            item: "px-2 text-default-400",
            separator: "px-0",
          }}
        >
          <BreadcrumbItem href="/dashboard">Home</BreadcrumbItem>
          <BreadcrumbItem href={`/solve?tags=${tags}`}>
            Solve({data.tagNames.join(",")})
          </BreadcrumbItem>
          <BreadcrumbItem>Result</BreadcrumbItem>
        </Breadcrumbs>
      }
      sidebarTop={<SideMenuV2 />}
    >
      <QuestionProvider question={question}>
        <div className="px-3 mx-auto pt-10 box-content max-w-[700px] w-full">
          <h1 className="mb-4 text-xl font-bold">
            {success ? (
              <span className="text-green-800">Correct</span>
            ) : (
              <span className="text-red-800">Incorrect</span>
            )}
          </h1>

          <ResultQuestion incorrects={incorrects} />

          <div className="flex flex-row-reverse flex-wrap items-center justify-between gap-4 mt-3">
            <div className="flex items-center">
              <Button
                as={Link}
                href={`/solve?tags=${tags}`}
                endContent={<ArrowRight size={16} />}
                color="primary"
                ref={nextButtonRef}
              >
                Next
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {success ? (
                <Form className="flex" method="post">
                  <input
                    type="hidden"
                    name="intent"
                    value="regard_as_incorrect"
                  />
                  <Button variant="flat" type="submit">
                    Regard as Incorrect
                  </Button>
                </Form>
              ) : (
                <Form className="flex" method="post">
                  <input
                    type="hidden"
                    name="intent"
                    value="regard_as_correct"
                  />
                  <Button variant="flat" type="submit">
                    Regard as Correct
                  </Button>
                </Form>
              )}

              <Form className="flex" method="post">
                <input type="hidden" name="intent" value="ignore" />
                <Button variant="flat" type="submit">
                  Ignore This Try
                </Button>
              </Form>

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
            </div>
          </div>
        </div>
      </QuestionProvider>
    </DefaultLayout>
  );
}
