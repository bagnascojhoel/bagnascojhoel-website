import React from "react";
import { WorkItemType } from "@/types/work";
import { workItems as localWorkItems } from "@/data/work";
import WorkItem from "./WorkItem";

async function getWorkItems(): Promise<WorkItemType[]> {
  // If we are in build time or server is not yet running, fetch will fail.
  // In Next.js, for internal data, it's better to use data directly or a shared service.
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/work`, {
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      return res.json();
    }
  } catch {
    console.warn("Could not fetch from API, falling back to local data during build/linkage.");
  }
  
  return localWorkItems;
}

const WorkSidebar = async () => {
  let workItems: WorkItemType[] = [];
  try {
    workItems = await getWorkItems();
  } catch (_error) {
    // Already logged in getWorkItems
  }

  return (
    <section 
      className="w-full h-auto md:h-full md:bg-card md:border-x border-border z-40 transition-all custom-scrollbar md:overflow-y-auto py-10 md:py-0" 
      id="work"
    >
      <div className="md:p-8 md:pt-20 md:pb-10">
        <div className="flex flex-col gap-4 mb-8">
          <h2 className="text-3xl font-bold font-mono text-foreground">Work</h2>
          <p className="text-muted-foreground leading-relaxed max-w-2xl">
            Projects, articles, and certifications reflecting my passion for clean code and continuous learning
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {workItems.map((item) => (
            <WorkItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkSidebar;
