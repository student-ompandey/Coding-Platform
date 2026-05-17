import { FileQuestion } from "lucide-react";

export function EmptyState({ icon: Icon = FileQuestion, title = "No data found", description = "There's nothing to display here yet." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="rounded-2xl bg-muted/50 p-5 mb-4">
        <Icon className="size-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
    </div>
  );
}
