import React from "react";

const experiences = [
  {
    period: "December 2024 - Present",
    title: "Senior Software Developer",
    company: "ADP Brazil Labs",
    description:
      "Working with Java 21 and Spring Boot, integrating the latest enterprise payroll engine with existing products and embedded MFEs.",
  },
  {
    period: "April 2024 - December 2024",
    title: "Senior Full-Stack Developer",
    company: "Petlove",
    description:
      "Enhanced a multi-tenancy ERP for Petlove and SaaS Clients. Maintained the legacy monolithic system and led its modernization with microservices using Java (8 & 11), Spring Boot, JSF, Vue 3, and Google Cloud Platform.",
  },
  {
    period: "June 2022 - April 2024",
    title: "Backend Developer",
    company: "ADP Brazil Labs",
    description:
      "Developed microservices with Java 17 and Spring Boot using BDD, DDD, and Ports and Adapters architecture. Implemented a multi-language text search feature.",
  },
  {
    period: "July 2021 - June 2022",
    title: "Backend Developer",
    company: "CWI Software",
    description:
      "Led the development of a real-time user-data analysis system for a telecom provider to understand user behavior on the customer page.",
  },
];

const Experience = () => {
  return (
    <section id="experience" className="py-20">
      <div>
        <h2 className="text-3xl font-bold font-mono text-foreground mb-2">Experience</h2>
        <p className="text-lg text-muted-foreground mb-12 max-w-xl">
          Building scalable solutions across different organizations
        </p>

        <div className="flex flex-col gap-12 sm:gap-16">
          {experiences.map((exp, index) => (
            <div key={index} className="relative pl-10 group">
              {/* Timeline marker and dashed line */}
              <div className="absolute left-0 top-0 h-full w-3 flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-primary z-10 mt-2 shrink-0" />
                {index !== experiences.length - 1 && (
                  <div className="absolute top-5 bottom-[-4rem] sm:bottom-[-5rem] w-0 border-l-[3px] border-dashed border-border" />
                )}
              </div>
              
              <div className="flex flex-col gap-1">
                <p className="text-sm font-mono text-muted-foreground">{exp.period}</p>
                <h3 className="text-xl font-bold font-mono text-foreground">{exp.title}</h3>
                <p className="text-primary font-medium">{exp.company}</p>
                <p className="text-muted-foreground leading-relaxed mt-2 max-w-2xl">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
