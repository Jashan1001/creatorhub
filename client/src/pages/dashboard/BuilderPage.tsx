import { Card } from "@/components/ui/Card";
import { Layers } from "lucide-react";

export default function BuilderPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-(--text-primary)">Builder</h1>
        <p className="text-sm text-(--text-secondary) mt-1">
          Drag and drop to build your page
        </p>
      </div>
      <Card className="flex flex-col items-center justify-center py-24 gap-3">
        <Layers size={32} className="text-(--text-muted)" />
        <p className="text-(--text-secondary) text-sm">
          Port your dnd-kit builder here from the Next.js client
        </p>
      </Card>
    </div>
  );
}

