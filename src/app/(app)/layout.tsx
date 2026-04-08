import { BottomNav } from "@/components/app/bottom-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen justify-center bg-gray-100">
      <div className="flex min-h-screen w-full max-w-md flex-col bg-white">
        <main className="flex-1 overflow-y-auto pb-2 pt-3">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
