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
  )
};

export default function WorkflowsFocusView() {
  return (
    <div className="p-6 space-y-6">

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-semibold">Workflows</h1>
            <p className="text-sm text-muted-foreground">Focus on what needs attention</p>
          </div>
          <VersionSelector />
        </div>
        <Button>Create Flow</Button>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold">Filter</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Icon.folder className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search folders..." className="pl-9 w-64" />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">👤</span>
            <Input placeholder="Search users..." className="pl-9 w-64" />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-md text-sm">
            <Icon.folder className="w-4 h-4" />
            <span>Finance & Accounting</span>
            <button className="ml-1 text-muted-foreground hover:text-foreground">
              <Icon.close />
            </button>
          </div>
          <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-md text-sm">
            <span>👤</span>
            <span>Suyash Singh</span>
            <button className="ml-1 text-muted-foreground hover:text-foreground">
              <Icon.close />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-2">
            <Icon.alert className="text-red-500" /> 3 Errors
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">⏸ 40 Paused</CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">🧪 120 Unused</CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">✅ 125 Active</CardContent>
        </Card>
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
              <tr className="border-b">
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

              <tr className="border-b">
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

              <tr>
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
            </tbody>
          </table>
        </CardContent>
      </Card>

    </div>
  );
}
