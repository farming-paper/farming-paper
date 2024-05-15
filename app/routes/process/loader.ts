import { json, type LoaderFunctionArgs } from "@remix-run/node";
import type { ObjectId } from "mongodb";
import { requireAuth } from "~/auth/get-session";
import mongo from "~/mongodb-client.server";
import prisma from "~/prisma-client.server";
import { searchParamsSchema } from "./searchParamsSchema";

const isAdmin = (email: string) =>
  email === "eszqsc112@gmail.com" || email === "app.farming.paper@gmail.com";

export default async function pingMongoDB() {}

export async function loader({ request }: LoaderFunctionArgs) {
  const { profile } = await requireAuth(request);
  const validation = searchParamsSchema.safeParse(
    Object.fromEntries(new URL(request.url).searchParams)
  );

  if (!validation.success) {
    throw new Response(JSON.stringify({ error: validation.error }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  const code = validation.data.code;

  if (!isAdmin(profile.email)) {
    throw new Response(null, { status: 403 });
  }

  switch (code) {
    case "uJpMC1njtBiiDYw52o0RKehbxLmgT4th": {
      await mongo.connect();
      const res = await mongo.db("admin").command({ ping: 1 });
      return json({ success: true, data: res });
    }

    case "zrkBmmfYHRac1YGGcgi4OndKugXOxLAz": {
      const questions = await prisma.questions.findMany({
        where: {
          deleted_at: null,
        },
        select: {
          id: true,
          original_id: true,
          content: true,
          public_id: true,
          profiles: true,
          tags_questions_relation: {
            select: { tags: { select: { name: true, public_id: true } } },
          },
        },
      });
      // insert all question to mongo
      await mongo.connect();

      const res = await mongo
        .db("search")
        .collection("questions")
        .bulkWrite(
          questions.map((q) => {
            const _id = Number(q.id.toString()) as unknown as ObjectId;
            return {
              updateOne: {
                filter: { _id },
                update: {
                  $set: {
                    ...q,
                  },
                },
                upsert: true,
              },
            };
          })
        );

      return json({ success: true, data: res });
    }
  }
}
