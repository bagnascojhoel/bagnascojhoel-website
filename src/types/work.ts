export interface WorkItemType {
  id: string;
  type: "Project" | "Article" | "Course" | "Certification";
  title: string;
  description: string;
  tags: string[];
  link: string;
}
