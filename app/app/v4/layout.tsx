import { LeftNavV4 } from "@/components/left-nav-v4";

export default function V4Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <LeftNavV4 />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
