export interface AssignmentTask {
  id: number;
  question: string;
  subject_focus: string;
}

export interface EvaluationCriteria {
  knowledge_points: string[];
  core_competencies: string[];
}

export interface AssignmentContent {
  title: string;
  scenario: string;
  tasks: AssignmentTask[];
  evaluation_criteria: EvaluationCriteria;
}

export interface Assignment {
  id: string;
  topic: string;
  subjects: string[];
  difficulty: string;
  content: AssignmentContent;
  created_at: string;
}

export interface SubmissionEvaluation {
  score: number;
  feedback_summary: string;
  dimensions: {
    accuracy: "High" | "Medium" | "Low";
    creativity: "High" | "Medium" | "Low";
    effort_detected: boolean;
  };
  detailed_comments: string[];
}

export interface Submission {
  id: string;
  assignment_id: string;
  student_name: string;
  content_text: string | null;
  image_url: string | null;
  ai_evaluation: SubmissionEvaluation | null;
  created_at: string;
}
