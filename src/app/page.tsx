import Hero from "@/components/Hero";
import WorkSidebar from "@/components/WorkSidebar";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FloatingControls from "@/components/FloatingControls";
import GeometricBackground from "@/components/GeometricBackground";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <GeometricBackground />
      <FloatingControls />

      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-start px-6 md:px-0">
        {/* Main Content Area */}
        <main className="flex-1 md:w-[calc(100%-var(--work-sidebar-width))] md:mt-20 md:pr-10">
          <Hero />
          <Experience />
          
          {/* Work Sidebar - Regular section on mobile, right after experience */}
          <div className="md:hidden">
            <WorkSidebar />
          </div>

          <Contact />
          <Footer />
        </main>

        {/* Work Sidebar - Fixed on desktop within the layout constrained area */}
        <aside className="hidden md:block w-sidebar flex-shrink-0">
          <div className="fixed top-0 bottom-0 w-sidebar">
            <WorkSidebar />
          </div>
        </aside>
      </div>
    </div>
  );
}
