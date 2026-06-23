import { useMemo, useState } from "react";
import type { Column, Id, Task, Priority } from "../types";
import TrashIcon from "../icons/TrashIcon";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import PlusIcon from "../icons/PlusIcon";
import TaskCard from "./TaskCard";

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  createTask: (columnId: Id) => void;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string, description?: string, priority?: Priority) => void; 
  sortTasks: (columnId: Id) => void; 
  tasks: Task[];
}

function ColumnContainer(props: Props) {
  const { column, deleteColumn, updateColumn, createTask, tasks, deleteTask, updateTask, sortTasks } = props;
  const [editMode, setEditMode] = useState(false);

  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef, attributes, listeners, transform, transition, isDragging,
  } = useSortable({
    id: column.id,
    data: { type: "Column", column },
    disabled: editMode,
  });

  const style = { transition, transform: CSS.Transform.toString(transform) };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-slate-200 dark:bg-slate-900/40 opacity-60 border-2 border-rose-500/50 rounded-xl flex flex-col backdrop-blur-sm w-[85vw] sm:w-[350px] h-[400px] sm:h-[500px] max-h-[75vh] sm:max-h-[500px]"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md border border-slate-300 dark:border-slate-800 rounded-xl flex flex-col shadow-xl w-[85vw] sm:w-[350px] h-[400px] sm:h-[500px] max-h-[75vh] sm:max-h-[500px]"
    >
      <div
        {...attributes}
        {...listeners}
        onClick={() => setEditMode(true)}
        className="text-md h-[60px] cursor-grab p-4 font-bold border-b border-slate-200 dark:border-slate-800 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors rounded-t-xl"
      >
        <div className="flex gap-3 items-center">
          <div className="flex justify-center items-center bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-0.5 text-xs rounded-full font-semibold shadow-inner">
            {tasks.length}
          </div>
          {!editMode && <span className="text-slate-800 dark:text-slate-100 tracking-wide">{column.title}</span>}
          {editMode && (
            <input
              className="bg-white dark:bg-slate-950 border border-rose-500/50 text-slate-900 dark:text-white rounded outline-none px-2 py-1 w-full font-normal"
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              autoFocus
              onBlur={() => setEditMode(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setEditMode(false);
              }}
            />
          )}
        </div>
        
        <div className="flex gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); sortTasks(column.id); }}
            title="Önceliğe Göre Sırala"
            className="text-slate-400 dark:text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/10 rounded p-1.5 transition-colors flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); deleteColumn(column.id); }}
            title="Sütunu Sil"
            className="stroke-slate-400 dark:stroke-slate-500 hover:stroke-rose-500 dark:hover:stroke-rose-500 hover:bg-rose-100 dark:hover:bg-rose-500/10 rounded p-1.5 transition-colors flex items-center justify-center"
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      <div className="flex flex-grow flex-col gap-3 p-3 overflow-x-hidden overflow-y-auto">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} deleteTask={deleteTask} updateTask={updateTask} />
          ))}
        </SortableContext>
      </div>

      <div className="p-3 border-t border-slate-200 dark:border-slate-800">
        <button
          className="flex w-full gap-2 items-center justify-center bg-transparent border border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-500 dark:hover:text-rose-400 transition-all active:scale-[0.98]"
          onClick={() => createTask(column.id)}
        >
          <PlusIcon />
          Görev Ekle
        </button>
      </div>
    </div>
  );
}

export default ColumnContainer;