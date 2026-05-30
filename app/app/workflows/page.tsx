"use client";

import { useRouter } from "next/navigation";
import { APP_BASE } from "@/lib/app-routes";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { VersionSelector } from "@/components/version-selector";

const Icon = {
  search: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" {...props}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
  ),
  folder: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" {...props}><path d="M3 7h5l2 2h11v8a2 2 0 0 1-2 2H3z"/><path d="M3 7V5a2 2 0 0 1 2-2h3l2 2h9a2 2 0 0 1 2 2"/></svg>
  ),
  close: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" {...props}><path d="M18 6L6 18M6 6l12 12"/></svg>
  ),
  play: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}><path d="M8 5v14l11-7z"/></svg>
  ),
  pause: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>
  ),
  edit: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" {...props}><path d="M12 20h9"/><path d="M16.5 3.5l4 4L7 21l-4 1 1-4L16.5 3.5z"/></svg>
  ),
  alert: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" {...props}><path d="M10.3 3.9l-8 13.9A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3.2l-8-13.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4"/><circle cx="12" cy="17" r="1"/></svg>
  ),
  sparkles: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" {...props}><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/><path d="M5 17l.75 2.25L8 20l-2.25.75L5 23l-.75-2.25L2 20l2.25-.75L5 17z"/><path d="M19 3l.5 1.5L21 5l-1.5.5L19 7l-.5-1.5L17 5l1.5-.5L19 3z"/></svg>
  ),
};

export default function WorkflowsControlCenter() {
  const router = useRouter();
  return (
    <div className="p-6 space-y-6">

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">Workflows</h1>
          <VersionSelector />
        </div>
        <div className="flex gap-2">
          <Button variant="outline">CMD + K</Button>
          <Button>Create Flow</Button>
        </div>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto">
        <Button variant="secondary" className="flex items-center gap-2"><Icon.folder/> All</Button>
        <Button variant="outline" className="flex items-center gap-2"><Icon.folder/> CrowdSourceTrials</Button>
        <Button variant="outline" className="flex items-center gap-2"><Icon.folder/> Customer Support</Button>
        <Button variant="outline" className="flex items-center gap-2"><Icon.folder/> Finance & Accounting</Button>
        <Button variant="outline" className="flex items-center gap-2"><Icon.folder/> Information Tech</Button>
        <Button variant="outline" className="flex items-center gap-2"><Icon.folder/> My-Space</Button>
        <Button variant="outline" className="flex items-center gap-2"><Icon.folder/> One_time</Button>
        <Button variant="outline" className="flex items-center gap-2"><Icon.folder/> Parakh Testing</Button>
      </div>

      <div className="grid grid-cols-5 gap-4 items-stretch">
        <Card className="col-span-1">
          <CardContent className="p-0 h-full">
            <div className="flex items-center h-full px-3 gap-2">
              <Icon.search />
              <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-md text-lg font-bold">
                <Icon.folder />
                <span>All</span>
                <button className="ml-1 text-muted-foreground"><Icon.close/></button>
              </div>
              <input className="flex-1 outline-none text-base" />
            </div>
          </CardContent>
        </Card>

        <Card><CardContent className="p-4 flex items-center gap-2"><Icon.alert/> 3 Errors</CardContent></Card>
        <Card><CardContent className="p-4">⏸ 40 Paused</CardContent></Card>
        <Card><CardContent className="p-4">🧪 120 Unused</CardContent></Card>
        <Card><CardContent className="p-4">✅ 125 Active</CardContent></Card>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        <Button variant="outline">Suyash Singh (531)</Button>
        <Button variant="outline">Naman Tamrakar (82)</Button>
        <Button variant="outline">swapnil soni (52)</Button>
        <Button variant="outline">Chirag Devlani (48)</Button>
        <Button variant="outline">ankita bhatt (42)</Button>
        <Button variant="outline">View All</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr className="text-left">
                <th className="p-4">Name</th>
                <th>Status</th>
                <th>Health</th>
                <th>Runs</th>
                <th>Updated</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => router.push(`${APP_BASE}/flows/1`)}>
                <td className="p-4">
                  <div className="font-medium">Spreadsheet Update Trigger</div>
                  <div className="text-muted-foreground text-xs">Sheet updated trigger</div>
                </td>
                <td><Badge>Active</Badge></td>
                <td>100%</td>
                <td>10</td>
                <td>28m ago</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Button size="icon"><Icon.play/></Button>
                    <Button size="icon"><Icon.pause/></Button>
                    <Button size="icon"><Icon.edit/></Button>
                  </div>
                </td>
              </tr>

              <tr className="border-b cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => router.push(`${APP_BASE}/flows/2`)}>
                <td className="p-4">
                  <div className="font-medium">Always True Function</div>
                  <div className="text-muted-foreground text-xs">All runs failed</div>
                </td>
                <td><Badge>Active</Badge></td>
                <td className="text-red-500">0%</td>
                <td>6</td>
                <td>3d ago</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Button size="icon"><Icon.play/></Button>
                    <Button size="icon"><Icon.alert/></Button>
                    <Button size="icon"><Icon.edit/></Button>
                  </div>
                </td>
              </tr>

              <tr className="border-b cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => router.push(`${APP_BASE}/flows/3`)}>
                <td className="p-4">
                  <div className="font-medium">Cron at 11:55</div>
                  <div className="text-muted-foreground text-xs">Not triggered yet</div>
                </td>
                <td><Badge>Active</Badge></td>
                <td>—</td>
                <td>0</td>
                <td>1d ago</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Button size="icon"><Icon.play/></Button>
                    <Button size="icon"><Icon.edit/></Button>
                  </div>
                </td>
              </tr>

              <tr className="border-b cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => router.push(`${APP_BASE}/master-slide`)}>
                <td className="p-4">
                  <div className="font-medium">Master Slide</div>
                  <div className="text-muted-foreground text-xs">Linear summary of all flows</div>
                </td>
                <td><Badge>Active</Badge></td>
                <td>—</td>
                <td>0</td>
                <td>just now</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Button size="icon"><Icon.play/></Button>
                    <Button size="icon"><Icon.edit/></Button>
                  </div>
                </td>
              </tr>

              <tr className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => router.push(`${APP_BASE}/flow-by-ai`)}>
                <td className="p-4">
                  <div className="flex items-center gap-2 font-medium">
                    Flow by AI
                  </div>
                  <div className="text-muted-foreground text-xs">AI-generated workflow</div>
                </td>
                <td><Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">AI</Badge></td>
                <td>—</td>
                <td>0</td>
                <td>just now</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Button size="icon"><Icon.sparkles/></Button>
                    <Button size="icon"><Icon.edit/></Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

    </div>
  );
}
