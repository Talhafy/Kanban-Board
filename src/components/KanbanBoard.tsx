import { useMemo, useState, useEffect } from "react";
import PlusIcon from "../icons/PlusIcon";
import type { Column, Id, Task, Priority } from "../types";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
  useSensors,
  useSensor,
  PointerSensor,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable"; 
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard"; 

function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>(() => {
    const savedColumns = localStorage.getItem("kanban-columns");
    if (savedColumns) {
      return JSON.parse(savedColumns);
    }
    return [];
  });
  
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem("kanban-tasks");
    if (savedTasks) {
      return JSON.parse(savedTasks);
    }
    return [];
  });
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const [newTaskColumnId, setNewTaskColumnId] = useState<Id | null>(null);
  const [newTaskContent, setNewTaskContent] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>("Düşük"); 

  useEffect(() => {
    localStorage.setItem("kanban-columns", JSON.stringify(columns));
  }, [columns]);

  useEffect(() => {
    localStorage.setItem("kanban-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 3 },
    })
  );

  return (
    <div className="m-auto flex w-full items-start overflow-x-auto overflow-y-auto px-4 sm:px-8 py-4 sm:py-10 h-full">
      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
        <div className="flex gap-6">
          <SortableContext items={columnsId}>
            {columns.map((col) => (
              <ColumnContainer
                key={col.id}
                column={col}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={openTaskModal}
                deleteTask={deleteTask}
                updateTask={updateTask}
                sortTasks={sortTasksByPriority}
                tasks={tasks.filter((task) => task.columnId === col.id)}
              />
            ))}
          </SortableContext>
          
          {/*"ADD COLUMN" BUTONU */}
          <button
            onClick={() => createNewColumn()}
            className="
            h-[60px] w-[85vw] sm:w-[350px] min-w-[85vw] sm:min-w-[350px] cursor-pointer rounded-xl
            bg-slate-200/50 dark:bg-white/5 
            border-2 border-dashed border-slate-300 dark:border-white/20 p-4
            text-slate-600 dark:text-white/60 font-semibold tracking-wide
            hover:bg-slate-300/50 dark:hover:bg-white/10 
            hover:text-slate-900 dark:hover:text-white 
            hover:border-slate-400 dark:hover:border-white/40
            transition-all flex items-center justify-center gap-2
            "
          >
            <PlusIcon />
            Yeni Sütun Ekle
          </button>
        </div>

        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={openTaskModal}
                deleteTask={deleteTask}
                updateTask={updateTask}
                sortTasks={sortTasksByPriority}
                tasks={tasks.filter((task) => task.columnId === activeColumn.id)}
              />
            )}
            {activeTask && (
              <TaskCard task={activeTask} deleteTask={deleteTask} updateTask={updateTask} />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>

      {/* TEMA UYUMLU GÖREV OLUŞTURMA PENCERESİ */}
      {newTaskColumnId !== null && (
        <div className="fixed inset-0 bg-slate-500/50 dark:bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl w-full max-w-md flex flex-col gap-5 shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Yeni Görev</h2>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Görev İsmi</label>
              <input 
                autoFocus
                className="bg-slate-50 dark:bg-slate-950/50 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg p-3 outline-none focus:border-rose-500 transition-colors" 
                value={newTaskContent}
                onChange={(e) => setNewTaskContent(e.target.value)}
                placeholder="Örn: Veritabanı testleri"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) onConfirmCreateTask();
                }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Öncelik Seviyesi</label>
              <div className="flex gap-2">
                {(["Düşük", "Orta", "Yüksek"] as Priority[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setNewTaskPriority(p)}
                    className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${
                      newTaskPriority === p 
                      ? p === "Düşük" ? "bg-blue-100 dark:bg-blue-500/20 border-blue-400 dark:border-blue-500/50 text-blue-700 dark:text-blue-400"
                      : p === "Orta" ? "bg-amber-100 dark:bg-amber-500/20 border-amber-400 dark:border-amber-500/50 text-amber-700 dark:text-amber-400"
                      : "bg-rose-100 dark:bg-rose-500/20 border-rose-400 dark:border-rose-500/50 text-rose-700 dark:text-rose-400"
                      : "bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Açıklama (Opsiyonel)</label>
              <textarea 
                className="bg-slate-50 dark:bg-slate-950/50 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg p-3 outline-none focus:border-rose-500 resize-none h-28 transition-colors" 
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="Detaylar, notlar..."
              />
            </div>

            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button 
                onClick={() => setNewTaskColumnId(null)}
                className="px-5 py-2 rounded-lg text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium"
              >
                İptal
              </button>
              <button 
                onClick={onConfirmCreateTask}
                className="px-5 py-2 bg-rose-600 rounded-lg hover:bg-rose-500 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!newTaskContent.trim()}
              >
                Oluştur
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function sortTasksByPriority(columnId: Id) {
    setTasks((currentTasks) => {
      const priorityWeight: Record<string, number> = { "Yüksek": 3, "Orta": 2, "Düşük": 1 };
      const columnTasks = currentTasks.filter((t) => t.columnId === columnId);
      const otherTasks = currentTasks.filter((t) => t.columnId !== columnId);
      columnTasks.sort((a, b) => {
        const weightA = a.priority ? priorityWeight[a.priority] : 0;
        const weightB = b.priority ? priorityWeight[b.priority] : 0;
        return weightB - weightA; 
      });
      return [...otherTasks, ...columnTasks];
    });
  }

  function deleteTask(id: Id) {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  }

  function updateTask(id: Id, content: string, description?: string, priority?: Priority) {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content, description, priority };
    });
    setTasks(newTasks);
  }

  function openTaskModal(columnId: Id) {
    setNewTaskColumnId(columnId);
    setNewTaskContent("");
    setNewTaskDescription("");
    setNewTaskPriority("Düşük");
  }

  function onConfirmCreateTask() {
    if (!newTaskContent.trim() || newTaskColumnId === null) return;
    const newTask: Task = {
      id: generateId(),
      columnId: newTaskColumnId,
      content: newTaskContent,
      description: newTaskDescription.trim() || undefined,
      priority: newTaskPriority,
    };
    setTasks([...tasks, newTask]);
    setNewTaskColumnId(null); 
  }

  function createNewColumn() {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Sütun ${columns.length + 1}`,
    };
    setColumns([...columns, columnToAdd]);
  }

  function deleteColumn(id: Id) {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);
  }

  function updateColumn(id: Id, title: string) {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });
    setColumns(newColumns);
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;
    const isActiveAColumn = active.data.current?.type === "Column";
    if (!isActiveAColumn) return;
    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === active.id);
      const overColumnIndex = columns.findIndex((col) => col.id === over.id);
      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;
    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === active.id);
        const overIndex = tasks.findIndex((t) => t.id === over.id);

        if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
          const newTasks = [...tasks];
          newTasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(newTasks, activeIndex, overIndex);
        }
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === active.id);
        const newTasks = [...tasks];
        newTasks[activeIndex].columnId = over.id;
        return arrayMove(newTasks, activeIndex, activeIndex);
      });
    }
  }
}

function generateId() {
  return Math.floor(Math.random() * 10001);
}

export default KanbanBoard;