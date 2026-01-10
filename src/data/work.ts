import { WorkItemType } from "@/types/work";

export const workItems: WorkItemType[] = [
  {
    id: "1",
    type: "Project",
    title: "Kwik: Ecommerce Platform Using Latest of my Knowledge",
    description: "Ecommerce application built with Java 17, Spring Boot, and Postgres. Management UI uses React, TypeScript, and Tailwind, deployed to AWS via GitHub Actions.",
    tags: ["Spring Boot", "React", "TypeScript", "AWS"],
    link: "https://github.com/bagnascojhoel/kwik-ecommerce",
  },
  {
    id: "2",
    type: "Project",
    title: "This Website: Built from Design to Deployment with Context Engineering (Vibe Coding)",
    description: "Monorepo including front-end, BFF, and blog. Built with Spring, Svelte, Java, and automated deployments via GitHub Actions.",
    tags: ["Java", "Svelte", "Monorepo"],
    link: "https://github.com/bagnascojhoel/portfolio-website-monorepo",
  },
  {
    id: "3",
    type: "Course",
    title: "Clean Code & Clean Architecture: Detailed Course on Complex Software Design Strategies",
    description: "Code implemented while doing a course on Clean Code, Clean Architecture, Design Patterns, DDD, and TDD written in node.",
    tags: ["Node.js", "Clean Architecture", "TDD"],
    link: "https://github.com/bagnascojhoel/neditor",
  },
  {
    id: "4",
    type: "Project",
    title: "Kwik Chat API: Chat Interface with LLMs on Python",
    description: "Python API for LLM-based chat interactions, using Flask and clean architecture, deployed on Fly.io.",
    tags: ["Python", "Flask", "Clean Architecture"],
    link: "https://github.com/bagnascojhoel/kwik-chat-api",
  },
];
