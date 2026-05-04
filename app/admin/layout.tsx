import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminShell from "./AdminShell";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = cookies().get("admin_session")?.value;
  if (!session || session !== process.env.ADMIN_SESSION_TOKEN) {
    redirect("/admin-login");
  }
  return <AdminShell>{children}</AdminShell>;
}
