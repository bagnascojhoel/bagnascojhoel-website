import React from "react";
import { Mail, Linkedin, Github, ArrowUpRight } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-20">
      <div className="container px-0">
        <h2 className="text-3xl font-bold font-mono text-foreground mb-2">Let&apos;s Connect</h2>
        <p className="text-lg text-muted-foreground mb-12">
          Feel free to reach out for collaborations or just a friendly chat
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="mailto:bagnascojhoel@gmail.com"
            className="flex flex-col items-center justify-center gap-4 p-6 bg-card border border-border rounded-xl transition-all hover:border-primary hover:shadow-warm group text-center"
          >
            <Mail className="text-primary" size={24} />
            <span className="font-mono text-sm font-medium">Email</span>
          </a>

          <a
            href="https://www.linkedin.com/in/bagnascojhoel/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-4 p-6 bg-card border border-border rounded-xl transition-all hover:border-primary hover:shadow-warm group text-center"
          >
            <Linkedin className="text-primary" size={24} />
            <span className="font-mono text-sm font-medium">LinkedIn</span>
          </a>

          <a
            href="https://github.com/bagnascojhoel"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-4 p-6 bg-card border border-border rounded-xl transition-all hover:border-primary hover:shadow-warm group text-center"
          >
            <Github className="text-primary" size={24} />
            <span className="font-mono text-sm font-medium">GitHub</span>
          </a>

          <a
            href="https://blog.bagnascojhoel.com.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-4 p-6 bg-card border border-border rounded-xl transition-all hover:border-primary hover:shadow-warm group text-center"
          >
            <ArrowUpRight className="text-primary" size={24} />
            <span className="font-mono text-sm font-medium">Blog</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
