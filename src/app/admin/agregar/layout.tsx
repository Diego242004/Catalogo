import { redirect } from "next/navigation";
import { hasAdminSession } from "@/lib/admin-session";

export default async function AddJerseyLayout({ children }: { children: React.ReactNode }) {
  if (!(await hasAdminSession())) redirect("/admin/login");
  return children;
}
