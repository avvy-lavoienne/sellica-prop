import Sidebar from "@/components/Sidebar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 md:ml-64 md:pl-0 pl-16 md:pt-6 pt-16">{children}</main>
    </div>
  );
}