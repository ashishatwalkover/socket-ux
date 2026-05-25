import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Design4() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Design 4</h1>
          <p className="text-sm text-muted-foreground">Placeholder for your next UX design</p>
        </div>
        <Button>Add Content</Button>
      </div>

      <Card>
        <CardContent className="p-12 text-center">
          <div className="text-6xl mb-4">✨</div>
          <h2 className="text-lg font-medium mb-2">Your Design Goes Here</h2>
          <p className="text-sm text-muted-foreground">
            Replace this placeholder with your actual design components
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
