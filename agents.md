# **Cross-Disciplinary Agent System (CDAS) \- Implementation Blueprint**

## **1\. Project Context & Objectives**

We are building a **Cross-Disciplinary Homework System** based on a multi-agent architecture.

* **Goal:** Replace the Coze low-code platform with a custom "Ambient Programming" solution.  
* **Core Philosophy:** Minimalist Frontend (MVP) \+ Robust AI Backend.  
* **Future Proofing:** The frontend logic must be decoupled to allow a future UI overhaul by Gemini 1.5 Pro.

## **2\. Tech Stack Requirements**

* **Framework:** Next.js 14+ (App Router).  
* **Language:** TypeScript (Strict mode).  
* **Database:** Supabase (PostgreSQL).  
* **AI Provider:** OpenAI SDK (Model: gpt-4o for vision/reasoning).  
* **Styling:** Tailwind CSS (Use standard utility classes only, no custom CSS files).

## **3\. Database Schema (Supabase)**

*Instruction for AI: Use this exact schema for SQL generation.*

\-- Table: assignments (Stores the generated homework)  
create table assignments (  
  id uuid default gen\_random\_uuid() primary key,  
  topic text not null,                \-- e.g., "Carbon Emission"  
  subjects text\[\] not null,           \-- e.g., \["Math", "Geography"\]  
  difficulty text not null,           \-- 'basic' | 'challenge'  
  content jsonb not null,             \-- Structured homework data (Scenario, Tasks, Criteria)  
  created\_at timestamp with time zone default timezone('utc'::text, now()) not null  
);

\-- Table: submissions (Stores student work & AI feedback)  
create table submissions (  
  id uuid default gen\_random\_uuid() primary key,  
  assignment\_id uuid references assignments(id) not null,  
  student\_name text default 'Anonymous',  
  content\_text text,                  \-- Student's written answer  
  image\_url text,                     \-- URL from Supabase Storage  
  ai\_evaluation jsonb,                \-- AI Feedback (Scores, Comments, Dimensions)  
  created\_at timestamp with time zone default timezone('utc'::text, now()) not null  
);

## **4\. Agent Personas & Prompts (Backend Logic)**

*Instruction for AI: Embed these prompts into the API Route Handlers.*

### **Agent A: The Architect (Cross-Disciplinary Generator)**

* **Endpoint:** POST /api/generate-assignment  
* **Input:** { topic: string, subjects: string\[\], difficulty: string }  
* **Role:** "You are an expert educational designer specializing in Phenomenon-based Learning (PBL)."  
* **System Prompt Requirements:**  
  1. **Language:** All generated content (Title, Scenario, Tasks, Criteria) MUST be in Simplified Chinese (zh-CN).  
  2. **Deep Integration:** Do not just list questions. Create a scenario that *requires* knowledge from all selected subjects to solve.  
  3. **Structure:** Output MUST be valid JSON:  
     {  
       "title": "String (Chinese)",  
       "scenario": "String (The context in Chinese)",  
       "tasks": \[  
         { "id": 1, "question": "String (Chinese)", "subject\_focus": "String" }  
       \],  
       "evaluation\_criteria": {  
         "knowledge\_points": \["String"\],  
         "core\_competencies": \["String"\]  
       }  
     }

  4. **Difficulty:** If 'challenge', include open-ended inquiry tasks. If 'basic', focus on foundational concepts.

### **Agent B: The Mentor (Evaluator & Feedback)**

* **Endpoint:** POST /api/evaluate-submission  
* **Input:** { assignment\_context: json, student\_content: string, image\_url?: string }  
* **Role:** "You are an empathetic teacher focusing on both academic accuracy and student psychological growth."  
* **System Prompt Requirements:**  
  1. **Language:** All feedback, comments, and summaries MUST be in Simplified Chinese (zh-CN).  
  2. **Multi-modal:** If image\_url is provided, analyze the image as part of the answer (e.g., a diagram or hand-written calculation).  
  3. **Psychological Support:** Detect frustration or effort. If the work is poor but shows effort, use "Encouraging Feedback". If good, use "Challenge Feedback".  
  4. **Output JSON:**  
     {  
       "score": Number (0-100),  
       "feedback\_summary": "String (Chinese)",  
       "dimensions": {  
         "accuracy": "High/Medium/Low",  
         "creativity": "High/Medium/Low",  
         "effort\_detected": "Boolean"  
       },  
       "detailed\_comments": \["String (Chinese)"\]  
     }

## **5\. Execution Plan (Step-by-Step)**

### **Step 1: Initialization**

1. Initialize a Next.js project with TypeScript and Tailwind.  
2. Install dependencies: @supabase/supabase-js, openai, zod (for validation).  
3. Create the .env.local file structure (placeholders).  
4. Generate the Supabase setup SQL file supabase/schema.sql.

### **Step 2: Backend Implementation (The Core)**

1. Create lib/supabase.ts and lib/openai.ts clients.  
2. **Implement Agent A:** Create app/api/assignments/generate/route.ts. Use the prompt defined in Section 4\. Ensure it saves to DB.  
3. **Implement Agent B:** Create app/api/submissions/evaluate/route.ts. Ensure it handles both text and image inputs (if image provided, use Vision capabilities).

### **Step 3: Minimalist Frontend (The Skeleton)**

*Constraint:* Use bare-minimum HTML structures. Do not spend tokens on beautiful UI components.

1. **Teacher Page (/teacher):** Simple HTML Form (Topic, Checkboxes for Subjects, Select for Difficulty). Display the generated JSON result in a raw \<pre\> tag or simple card.  
2. **Student Page (/student/\[assignmentId\]):** Fetch assignment details. Provide a Textarea and a basic File Input (for images).  
3. **Result View:** Show the AI's feedback directly below the submission form after processing.

### **Step 4: Storage Integration**

1. Implement a simple upload helper in lib/storage.ts to upload images to Supabase Storage bucket 'homework-images'.  
2. Connect the File Input on the Student Page to this uploader.

## **6\. Coding Standards**

* **Error Handling:** All API routes must return standard error messages { error: string }.  
* **Type Safety:** Define shared interfaces in types/index.ts (e.g., Assignment, Submission).  
* **Simplicity:** Do not add authentication (Auth.js/Clerk) yet. Hardcode a userId if needed for DB constraints, or keep tables public for MVP.