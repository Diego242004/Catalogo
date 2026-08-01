import { redirect } from "next/navigation";
import { hasAdminSession } from "@/lib/admin-session";
import LoginForm from "./LoginForm";

export default async function AdminLoginPage() {
  if (await hasAdminSession()) redirect("/admin/agregar");
  return <LoginForm />;
}
