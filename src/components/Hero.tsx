import React from "react";
import { Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="pb-10" id="hero">
      <div className="flex flex-col gap-4">
        <span className="font-mono text-primary text-sm">@bagnascojhoel</span>

        <h1 className="text-4xl md:text-5xl font-bold font-mono">
          Hey, I am <span className="text-gradient">Jhoel</span>
        </h1>

        <div className="flex flex-col gap-4 text-base md:text-lg leading-relaxed text-foreground max-w-2xl">
          <p>
            I am a software engineer with more than{" "}
            <span className="font-bold underline decoration-primary/30 underline-offset-4 decoration-2">
              4 years of experience
            </span>
            , specialized in backend development.
          </p>

          <p>
            I have deep knowledge with{" "}
            <span className="text-primary font-bold">Java and Spring</span> for cloud-native HTTP/REST APIs, with
            production expertise in AWS, DDD, event-driven architecture, and CI/CD. I also know my way around Python and
            Node.js as well as CI tools like Concourse and GitHub Actions.
          </p>

          <p>
            As a front-end developer, I exceed with{" "}
            <span className="text-primary font-bold">React, Next.js, and Redux</span> while keeping an organized,
            strongly typed, code base with TypeScript, ESLint, and Prettier.
          </p>
        </div>

        <nav className="flex flex-wrap gap-4 mt-6" aria-label="Social links">
          <a
            href="https://blog.bagnascojhoel.com.br/"
            className="flex items-center gap-2 text-foreground transition-all hover:text-primary group"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="p-2 rounded-full border border-border group-hover:border-primary transition-all">
              <ArrowUpRight size={18} />
            </div>
            <span className="font-mono text-sm underline decoration-border group-hover:decoration-primary underline-offset-4">
              blog
            </span>
          </a>

          <a
            href="https://www.linkedin.com/in/bagnascojhoel"
            className="flex items-center gap-2 text-foreground transition-all hover:text-primary group"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="p-2 rounded-full border border-border group-hover:border-primary transition-all">
              <Linkedin size={18} />
            </div>
            <span className="font-mono text-sm underline decoration-border group-hover:decoration-primary underline-offset-4">
              linkedin
            </span>
          </a>

          <a
            href="https://github.com/bagnascojhoel"
            className="flex items-center gap-2 text-foreground transition-all hover:text-primary group"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="p-2 rounded-full border border-border group-hover:border-primary transition-all">
              <Github size={18} />
            </div>
            <span className="font-mono text-sm underline decoration-border group-hover:decoration-primary underline-offset-4">
              github
            </span>
          </a>

          <a
            href="mailto:bagnascojhoel@gmail.com"
            className="flex items-center gap-2 text-foreground transition-all hover:text-primary group"
          >
            <div className="p-2 rounded-full border border-border group-hover:border-primary transition-all">
              <Mail size={18} />
            </div>
            <span className="font-mono text-sm underline decoration-border group-hover:decoration-primary underline-offset-4">
              bagnascojhoel@gmail.com
            </span>
          </a>
        </nav>
      </div>
    </section>
  );
};

export default Hero;
