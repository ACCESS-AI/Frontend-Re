declare interface CourseOverview {
  id: number;
  slug: string;
  logo: string;
  overrideStart: string;
  overrideEnd: string;
  studentsCount: number;
  onlineCount: number;
  maxPoints: number;
  points: number;
  information: Record<string, CourseInformation>;
  supervisors: Array<{ name: string }>;
  assistants: Array<{ name: string }>;
}

declare interface CourseInformation {
  id: number;
  language: string;
  title: string;
  description: string;
  university: string;
  period: string;
}

declare interface CourseProps extends CourseOverview {
  assignments: Array<AssignmentProps>;
  events: Array<CourseEventProps>;
  rank: number;
}

declare interface CourseMetaProps {
  header?: string;
  description?: string;
  slug?: string;
  repository?: string;
  repositoryUser?: string;
  repositoryPassword?: string;
  webhookSecret?: string;
}

declare interface CourseEventProps {
  id: number;
  category: string;
  description: string;
  date: string;
  time: string;
}

declare interface AssignmentProps {
  id: number;
  slug: string;
  information: Record<string, AssignmentInformation>;
  ordinalNum: number;
  start: string;
  end: string;
  publishedDate: string;
  publishedTime: string;
  dueDate: string;
  dueTime: string;
  countDown: Array<TimerProps>;
  published: boolean;
  pastDue: boolean;
  active: boolean;
  maxPoints: number;
  points: number;
  tasks: Array<TaskOverview>;
}

declare interface AssignmentInformation {
  id: number;
  language: string;
  title: string;
  description: string;
}


declare interface TaskOverview {
  id: number;
  slug: string;
  information: Record<string, TaskInformation>;
  ordinalNum: number;
  maxPoints: number;
  maxAttempts: number;
  timeLimit: number;
  active: boolean;
  avgPoints: number;
  remainingAttempts: number;
  points: number;
}

declare interface TaskInformation {
  id: number;
  language: string;
  title: string;
  instructionsFile: string;
}

declare interface TaskProps extends TaskOverview {
  testable: boolean;
  instructions: string;
  files: Array<TaskFileProps>;
  submissions: Array<SubmissionProps>;
  nextAttemptAt: string;
  deadline: string;
}

declare interface TaskFileProps {
  id: number;
  path: string;
  name: string;
  mimeType: string;
  editable: boolean;
  binary: boolean;
  template: string;
  templateBinary: string;
  content: string;
}

declare interface TaskInfo {
  id: number;
  assignmentId: number;
  slug: string;
  ordinalNum: number;
  title: string;
  maxPoints: number;
  maxAttempts: number;
  attemptRefill: number;
  dockerImage: string;
  runCommand: string;
  testCommand: string;
  gradeCommand: string;
  timeLimit: number;
  taskFiles: Array<TaskFileInfo>;
}

declare interface TaskFileInfo {
  id: number;
  context: string;
  editable: boolean;
  templateId: string;
  templatePath: string;
}

declare interface TemplateFileProps {
  id: number;
  path: string;
  name: string;
  mimeType: string;
  image: boolean;
  content: string;
  link: string;
  updatedAt: string;
}

declare interface SubmissionProps {
  id: number;
  ordinalNum: number;
  name: string;
  command: string;
  valid: boolean;
  graded: boolean;
  createdAt: string;
  points: number;
  maxPoints: number;
  output: string;
  files: Array<SubmissionFileProps>;
  persistentResultFiles: Array<PersistenResultFileProps>;
}

declare interface NewSubmissionProps {
  restricted: boolean,
  command: string,
  files: Array<{ taskFileId: number, content: string }>
}

declare type WorkspaceProps = Partial<SubmissionProps>

declare interface SubmissionFileProps {
  id: number;
  content: string;
  taskFileId: number;
}

declare interface PersistentResultFileProps {
  id: number;
  path: string;
  mimeType: string;
  content: string;
  contentBinary: string;
  binary: boolean;
}


declare interface TimerProps {
  name: string;
  current: number;
  max: number;
}

declare interface StudentProps {
  firstName: string;
  lastName: string;
  email: string;
  points: number;
  registrationId?: string;
  username?: string;
}

declare interface UserContext {
  isCreator: boolean;
  user: CurrentUser;
  isAssistant: boolean;
  isSupervisor: boolean;
}

declare interface CurrentUser {
  given_name: string;
  email: string;
}



// CHATBOT TYPES
declare interface ChatbotResponseI {
  llmOutput: string | undefined;
  metadata: MetadataI[];
  llmTimestamp: string;
  finalPrompt: string | undefined;
}

declare interface MessageI {
  message: string;
  type: string;
  timestamp: Date;
  metadata: MetadataI[] | undefined;
  finalPrompt: string | undefined;
}

declare interface MetadataI {
  source: string;
  pages: string;
  score: number;
}

declare interface CourseFilesUploadStatusI {
  courseSlug: string;
  status: FilesUploadStatusI;
}

declare interface FilesUploadStatusI {
  successfullFiles: string[];
  unsuccessfullFiles: string[];
  timestamp: integer;
}


declare interface StatusProps {
  

}


declare interface PromptChatbotProps{


}