"use client";

import { useState } from "react";
import { DndContext, DragOverlay, closestCorners, type DragEndEvent, type DragStartEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { KANBAN_STAGES } from "@/lib/constants";
import { KanbanCard } from "./kanban-card";
import type { Lead, KanbanStage } from "@/lib/types";

function DroppableColumn({ stage, children }: { stage: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });
  return (
    <div
      ref={setNodeRef}
      className={`min-h-[200px] space-y-3 transition-colors rounded-xl p-2 ${isOver ? "bg-white/5" : ""}`}
    >
      {children}
    </div>
  );
}

function SortableCard({ lead }: { lead: Lead }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: lead.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <KanbanCard lead={lead} />
    </div>
  );
}

interface KanbanBoardProps {
  initialLeads: Lead[];
}

export function KanbanBoard({ initialLeads }: KanbanBoardProps) {
  const [leads, setLeads] = useState(initialLeads);
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeLead = leads.find((l) => l.id === activeId);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const leadId = active.id as string;
    const newStage = over.id as KanbanStage;

    if (!KANBAN_STAGES.some((s) => s.key === newStage)) return;

    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, kanban_stage: newStage } : l)),
    );

    await fetch(`/api/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kanban_stage: newStage }),
    });
  }

  return (
    <DndContext collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {KANBAN_STAGES.map((stage) => {
          const stageLeads = leads.filter((l) => l.kanban_stage === stage.key);
          return (
            <div key={stage.key} className="min-w-[280px] flex-shrink-0">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full" style={{ background: stage.color }} />
                <span className="text-xs font-semibold" style={{ color: stage.color }}>
                  {stage.label}
                </span>
                <span className="text-zinc-600 text-xs">({stageLeads.length})</span>
              </div>
              <DroppableColumn stage={stage.key}>
                <SortableContext items={stageLeads.map((l) => l.id)} strategy={verticalListSortingStrategy}>
                  {stageLeads.map((lead) => (
                    <SortableCard key={lead.id} lead={lead} />
                  ))}
                </SortableContext>
              </DroppableColumn>
            </div>
          );
        })}
      </div>

      <DragOverlay>
        {activeLead ? <KanbanCard lead={activeLead} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
