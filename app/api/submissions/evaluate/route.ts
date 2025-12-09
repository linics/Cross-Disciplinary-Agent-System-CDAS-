import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";

import openai from "@/lib/openai";
import { supabase } from "@/lib/supabase";
import { Submission, SubmissionEvaluation } from "@/types";

const requestSchema = z.object({
  assignment_context: z.object({ id: z.string().uuid() }).passthrough(),
  student_content: z.string().min(1, "student_content is required"),
  image_url: z.string().url().optional(),
  student_name: z.string().optional(),
});

const mentorSystemPrompt = `你是一名富有同理心的教师，负责评估学生作业并给出建设性反馈。请遵循以下要求：
1. 全部反馈使用简体中文。
2. 如果提供了图片链接，请将其中的图示或手写内容纳入评估。
3. 心理支持：若作品欠佳但有努力迹象，采用“鼓励式反馈”；表现优秀则给出“挑战式反馈”。
4. 输出 JSON 结构：
{
  "score": 数字(0-100),
  "feedback_summary": "字符串（中文）",
  "dimensions": {
    "accuracy": "High" | "Medium" | "Low",
    "creativity": "High" | "Medium" | "Low",
    "effort_detected": 布尔值
  },
  "detailed_comments": ["字符串（中文）"]
}`;

const buildMessages = (
  assignmentContext: Record<string, unknown>,
  studentContent: string,
  imageUrl?: string
): OpenAI.Chat.ChatCompletionMessageParam[] => {
  const userContent: OpenAI.Chat.Completions.ChatCompletionContentPart[] = [
    {
      type: "text",
      text: `以下是作业上下文和学生提交，请评估：\n作业上下文：${JSON.stringify(assignmentContext)}\n学生提交：${studentContent}`,
    },
  ];

  if (imageUrl) {
    userContent.push({ type: "image_url", image_url: { url: imageUrl } });
  }

  return [
    {
      role: "system",
      content: mentorSystemPrompt,
    },
    {
      role: "user",
      content: userContent,
    },
  ];
};

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = requestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues.map((i) => i.message).join(", ") }, { status: 400 });
    }

    const { assignment_context, student_content, image_url, student_name } = parsed.data;
    const messages = buildMessages(assignment_context, student_content, image_url);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: "模型未返回内容" }, { status: 502 });
    }

    const evaluation = JSON.parse(content) as SubmissionEvaluation;

    const { data, error } = await supabase
      .from("submissions")
      .insert({
        assignment_id: assignment_context.id,
        student_name: student_name ?? "Anonymous",
        content_text: student_content,
        image_url: image_url ?? null,
        ai_evaluation: evaluation,
      })
      .select("id, assignment_id, student_name, content_text, image_url, ai_evaluation, created_at")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ submission: data as Submission, evaluation }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "未知错误";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
