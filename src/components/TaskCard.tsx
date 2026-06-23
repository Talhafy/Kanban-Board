import { useState } from "react";
import TrashIcon from "../icons/TrashIcon";
import type { Task, Id, Priority } from "../types";
import { useSortable } from "@dnd-kit/sortable"; 
import { CSS } from "@dnd-kit/utilities"; 

interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string, description?: string, priority?: Priority) => void;
}

const priorityColors = {
  "Düşük": "bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20",
  "Orta": "bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
  "Yüksek": "bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20",
};

function TaskCard({ task, deleteTask, updateTask }: Props) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const {
    setNodeRef, attributes, listeners, transform, transition, isDragging,
  } = useSortable({
    id: task.id, data: { type: "Task", task }, disabled: editMode,
  });

  const style = { transition, transform: CSS.Transform.toString(transform) };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef} style={style}
        className="opacity-50 bg-slate-100 dark:bg-slate-800/50 p-3 h-[100px] min-h-[100px] rounded-xl border-2 border-rose-500 cursor-grab relative"
      />
    );
  }

  if (editMode) {
    return (
      <div
        ref={setNodeRef} style={style} {...attributes} {...listeners}
        className="bg-white dark:bg-slate-800 p-3 min-h-[130px] flex flex-col rounded-xl border border-rose-500/50 cursor-grab relative gap-2 shadow-lg"
      >
        <input
          className="w-full bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none font-semibold text-sm placeholder-slate-400 dark:placeholder-slate-500"
          value={task.content} autoFocus placeholder="Görev Başlığı"
          onChange={(e) => updateTask(task.id, e.target.value, task.description, task.priority)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) toggleEditMode(); }}
        />
        <textarea
          className="w-full resize-none bg-transparent text-slate-600 dark:text-slate-400 focus:outline-none text-xs h-12 placeholder-slate-400 dark:placeholder-slate-600"
          value={task.description || ""} placeholder="Açıklama (Opsiyonel)"
          onChange={(e) => updateTask(task.id, task.content, e.target.value, task.priority)}
        ></textarea>
        
        <div className="flex gap-1 mb-1">
          {(["Düşük", "Orta", "Yüksek"] as Priority[]).map((p) => (
            <button
              key={p} onClick={() => updateTask(task.id, task.content, task.description, p)}
              className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                task.priority === p 
                  ? priorityColors[p] 
                  : "bg-transparent text-slate-500 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="flex justify-between w-full items-center pt-1 border-t border-slate-100 dark:border-slate-700">
           <button
            onClick={() => deleteTask(task.id)}
            className="stroke-slate-400 dark:stroke-slate-500 hover:stroke-rose-500 dark:hover:stroke-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded p-1 transition-colors"
           >
             <TrashIcon />
           </button>
           <button 
             onClick={toggleEditMode}
             className="bg-rose-500 hover:bg-rose-600 text-white rounded px-4 py-1 text-xs font-bold transition-colors shadow-md"
           >
             Kaydet
           </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={toggleEditMode}
      className="bg-white dark:bg-slate-800 p-3 min-h-[100px] flex flex-col text-left rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500 cursor-grab relative task group shadow-sm transition-colors"
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
    >
      <div className="h-full w-full overflow-y-auto overflow-x-hidden flex flex-col pr-6">
        {task.priority && (
          <span className={`text-[10px] px-2 py-0.5 rounded-md border w-fit mb-1.5 font-medium ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
        )}
        <p className="whitespace-pre-wrap font-semibold text-sm text-slate-800 dark:text-slate-200">{task.content}</p>
        {task.description && (
          <p className="whitespace-pre-wrap text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
            {task.description}
          </p>
        )}
      </div>
      {mouseIsOver && (
        <button
          onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
          className="stroke-slate-500 dark:stroke-slate-400 absolute right-3 top-3 bg-slate-100 dark:bg-slate-700/50 p-1.5 rounded hover:stroke-rose-500 dark:hover:stroke-rose-500 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors"
        >
          <TrashIcon />
        </button>
      )}
    </div>
  );
}

export default TaskCard;