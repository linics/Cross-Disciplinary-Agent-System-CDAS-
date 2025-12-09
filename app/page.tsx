export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 py-16 text-zinc-900">
      <section className="w-full max-w-3xl rounded-2xl border border-zinc-200 bg-white p-10 shadow-sm">
        <p className="text-sm font-medium text-blue-600">Cross-Disciplinary Agent System</p>
        <h1 className="mt-2 text-3xl font-semibold leading-tight">跨学科多智能体作业系统</h1>
        <p className="mt-3 text-base leading-7 text-zinc-600">
          这是一个使用 Next.js App Router 构建的 MVP，提供作业生成与提交评估的多智能体接口。
          所有输出均为简体中文，并遵循 Supabase 存储的结构化数据格式。
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5">
            <h2 className="text-lg font-semibold">作业生成 API</h2>
            <p className="mt-2 text-sm text-zinc-600">POST /api/assignments/generate</p>
            <p className="text-sm text-zinc-600">输入主题、学科与难度，返回结构化的跨学科作业 JSON 并写入 Supabase。</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5">
            <h2 className="text-lg font-semibold">提交评估 API</h2>
            <p className="mt-2 text-sm text-zinc-600">POST /api/submissions/evaluate</p>
            <p className="text-sm text-zinc-600">支持文字与可选图片链接，输出分数、维度评价及鼓励式反馈。</p>
          </div>
        </div>
        <p className="mt-6 text-sm text-zinc-500">
          请在 .env.local 中配置 OpenAI 与 Supabase 凭证后，通过 API 或未来的最小前端页进行体验。
        </p>
      </section>
    </main>
  );
}
