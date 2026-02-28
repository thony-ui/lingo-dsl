import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MousePointer, ArrowRight } from "lucide-react";
import type { EventBlock } from "@lingo-dsl/compiler";
import { formatAction } from "@/utils/actionFormatters";

interface EventHandlersCardProps {
  eventBlocks: EventBlock[];
}

export function EventHandlersCard({ eventBlocks }: EventHandlersCardProps) {
  return (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <MousePointer className="w-4 h-4 text-green-600 dark:text-green-400" />
          <CardTitle className="text-sm">Event Handlers</CardTitle>
        </div>
        <CardDescription className="text-xs">User interaction logic</CardDescription>
      </CardHeader>
      <CardContent>
        {eventBlocks.length > 0 ? (
          <EventHandlersList eventBlocks={eventBlocks} />
        ) : (
          <EmptyState />
        )}
      </CardContent>
    </Card>
  );
}

interface EventHandlersListProps {
  eventBlocks: EventBlock[];
}

function EventHandlersList({ eventBlocks }: EventHandlersListProps) {
  return (
    <div className="space-y-3">
      {eventBlocks.map((event, index) => (
        <EventHandlerItem key={index} event={event} />
      ))}
    </div>
  );
}

interface EventHandlerItemProps {
  event: EventBlock;
}

function EventHandlerItem({ event }: EventHandlerItemProps) {
  const widgetLabel =
    event.widgetRef.type === "literal"
      ? `"${event.widgetRef.label}"`
      : event.widgetRef.identifier;

  return (
    <div className="p-3 rounded-lg border bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900">
      <EventHeader verb={event.verb} widgetLabel={widgetLabel} />
      <ActionsList actions={event.actions} />
    </div>
  );
}

interface EventHeaderProps {
  verb: string;
  widgetLabel: string;
}

function EventHeader({ verb, widgetLabel }: EventHeaderProps) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <MousePointer className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
      <code className="text-xs font-semibold text-green-700 dark:text-green-300">
        {verb} {widgetLabel}
      </code>
    </div>
  );
}

interface ActionsListProps {
  actions: EventBlock["actions"];
}

function ActionsList({ actions }: ActionsListProps) {
  return (
    <div className="ml-5 space-y-1">
      {actions.map((actionStmt, i) => {
        const actionText = formatAction(actionStmt.action);
        return (
          <div key={i} className="flex items-center gap-2 text-xs">
            <ArrowRight className="w-3 h-3 text-green-500" />
            <code className="text-zinc-700 dark:text-zinc-300">{actionText}</code>
          </div>
        );
      })}
    </div>
  );
}

function EmptyState() {
  return (
    <p className="text-xs text-zinc-500 dark:text-zinc-400 italic">
      No event handlers defined
    </p>
  );
}
