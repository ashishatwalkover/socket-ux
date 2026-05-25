import { redirect } from "next/navigation";
import { APP_BASE } from "@/lib/app-routes";

export default function RootPage() {
  redirect(APP_BASE);
}
