export type Id = string | number;

export type Column = {
  id: Id;
  title: string;
};

export type Priority = "Düşük" | "Orta" | "Yüksek";

export type Task = {
  id : Id;
  columnId: Id;
  content: string;
  description?: string;
  priority?: Priority; 
};