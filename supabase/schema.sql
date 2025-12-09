-- Table: assignments (Stores the generated homework)
create table assignments (
  id uuid default gen_random_uuid() primary key,
  topic text not null,                -- e.g., "Carbon Emission"
  subjects text[] not null,           -- e.g., ["Math", "Geography"]
  difficulty text not null,           -- 'basic' | 'challenge'
  content jsonb not null,             -- Structured homework data (Scenario, Tasks, Criteria)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: submissions (Stores student work & AI feedback)
create table submissions (
  id uuid default gen_random_uuid() primary key,
  assignment_id uuid references assignments(id) not null,
  student_name text default 'Anonymous',
  content_text text,                  -- Student's written answer
  image_url text,                     -- URL from Supabase Storage
  ai_evaluation jsonb,                -- AI Feedback (Scores, Comments, Dimensions)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
