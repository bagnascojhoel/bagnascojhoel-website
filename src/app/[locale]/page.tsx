import Hero from '@/app/_components/Hero';
import WorkSidebar from '@/app/_components/WorkSidebar';
import Experience from '@/app/_components/Experience';
import Contact from '@/app/_components/Contact';
import Footer from '@/app/_components/Footer';
import FloatingControls from '@/app/_components/FloatingControls';
import GeometricBackground from '@/app/_components/GeometricBackground';

import PublicWorkErrorBoundary from '@/app/_components/PublicWorkErrorBoundary';
import {
  PublicWorkApplicationService,
  PublicWorkApplicationServiceToken,
} from '@/core/application-services/PublicWorkApplicationService';
import { PublicWorkItem } from '@/core/domain/PublicWorkItem';
import { container } from '@/core/ContainerConfig';

export default async function Home() {
  let workItems: PublicWorkItem[] = [];
  let workError = false;
  try {
    const useCase = container.get<PublicWorkApplicationService>(PublicWorkApplicationServiceToken);
    workItems = await useCase.getAll();
  } catch (err) {
    console.error('Failed to load public work items:', err);
    workError = true;
  }

  return (
    <div className="relative min-h-screen">
      <GeometricBackground />
      <FloatingControls />

      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-start px-6 md:pl-6 md:pr-0">
        {/* Main Content Area */}
        <main className="flex-1 md:w-[calc(100%-var(--work-sidebar-width))] mt-24 md:pr-10">
          <Hero />
          <Experience />

          {/* Work Sidebar - Regular section on mobile, right after experience */}
          <div className="md:hidden">
            <PublicWorkErrorBoundary hasError={workError}>
              <WorkSidebar items={workItems} />
            </PublicWorkErrorBoundary>
          </div>

          <Contact />
          <Footer />
        </main>

        {/* Work Sidebar - Fixed on desktop within the layout constrained area */}
        <aside className="hidden md:block w-sidebar flex-shrink-0">
          <div className="fixed top-0 bottom-0 w-sidebar">
            <PublicWorkErrorBoundary hasError={workError}>
              <WorkSidebar items={workItems} />
            </PublicWorkErrorBoundary>
          </div>
        </aside>
      </div>
    </div>
  );
}
