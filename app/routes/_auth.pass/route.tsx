import { BreadcrumbItem, Button, Link } from "@nextui-org/react";
import type { MetaFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";
import { ArrowRight } from "lucide-react";
import { useMemo } from "react";
import DefaultBreadcrumbs from "~/common/components/DefaultBreadcrumbs";
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
  return [...defaultMeta, { title: "Pass | Farming Paper" }];
};

const emptyArray: {
  pathStr: string;
  expect: string;
  actual: string;
}[] = [];

export default function Pass() {
  const data = useLoaderData<typeof loader>();
  const tags = data.tags;

  const q = data.question;

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

  return (
    <DefaultLayout
      header={
        <DefaultBreadcrumbs>
          <BreadcrumbItem href="/dashboard">Home</BreadcrumbItem>
          <BreadcrumbItem href={`/solve?tags=${tags.join(",")}`}>
            Solve({data.tagNames.join(",")})
          </BreadcrumbItem>
          <BreadcrumbItem>Pass</BreadcrumbItem>
        </DefaultBreadcrumbs>
      }
      sidebarTop={<SideMenuV2 />}
    >
      <QuestionProvider question={question}>
        <div className="box-border px-3 pt-10 mx-auto max-w-[700px] ">
          <ResultQuestion
            incorrects={emptyArray}
            correctClassname="text-black"
          />
          <div className="flex flex-row-reverse flex-wrap justify-between gap-4 mt-3">
            <Button
              as={Link}
              href={`/solve?tags=${tags}`}
              color="primary"
              endContent={<ArrowRight size={16} />}
            >
              Next
            </Button>

            <div className="flex flex-wrap items-center gap-2">
              <Form method="post">
                <input
                  type="hidden"
                  name="intent"
                  value="regard_as_incorrect"
                />
                <Button type="submit" color="default" variant="flat">
                  Regard as Incorrect
                </Button>
              </Form>
              <Form method="post">
                <input type="hidden" name="intent" value="regard_as_correct" />
                <Button type="submit" color="default" variant="flat">
                  Regard as Correct
                </Button>
              </Form>
              <Button
                href={`/q/edit/${question.publicId}?tags=${tags.join(
                  ","
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
