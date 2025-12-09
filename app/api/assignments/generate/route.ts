import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";

import openai from "@/lib/openai";
import { supabase } from "@/lib/supabase";
import { Assignment, AssignmentContent } from "@/types";

const requestSchema = z.object({
  topic: z.string().min(1, "topic is required"),
  subjects: z.array(z.string()).nonempty("subjects are required"),
  difficulty: z.enum(["basic", "challenge"]),
});

const architectSystemPrompt = `你是一名专注于现象式学习（PBL）的教育设计专家，负责生成跨学科作业。请严格遵循以下要求：
1. 输出语言：全部使用简体中文。
2. 深度融合：生成的情境必须需要所选学科的交叉知识来解决，不能仅是独立学科问题列表。
3. 结构：务必返回有效 JSON：
{
  "title": "字符串（中文）",
  "scenario": "字符串（中文情境描述）",
  "tasks": [
    { "id": 1, "question": "字符串（中文问题）", "subject_focus": "字符串（学科聚焦）" }
  ],
  "evaluation_criteria": {
    "knowledge_points": ["字符串"],
    "core_competencies": ["字符串"]
  }
}
4. 难度：当 difficulty 为 challenge 时，加入开放式探究任务；basic 则强调基础概念。`;

const buildMessages = ({ topic, subjects, difficulty }: z.infer<typeof requestSchema>): OpenAI.Chat.ChatCompletionMessageParam[] => [
  {
    role: "system",
    content: architectSystemPrompt,
  },
  {
    role: "user",
    content: `请基于以下输入生成跨学科作业：\n主题：${topic}\n学科：${subjects.join(", ")}\n难度：${difficulty}`,
  },
];

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = requestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues.map((i) => i.message).join(", ") }, { status: 400 });
    }

    const messages = buildMessages(parsed.data);
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: "模型未返回内容" }, { status: 502 });
    }

    const assignmentContent = JSON.parse(content) as AssignmentContent;

    const { data, error } = await supabase
      .from("assignments")
      .insert({
        topic: parsed.data.topic,
        subjects: parsed.data.subjects,
        difficulty: parsed.data.difficulty,
        content: assignmentContent,
      })
      .select("id, topic, subjects, difficulty, content, created_at")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ assignment: data as Assignment }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "未知错误";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
