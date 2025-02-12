import React from "react";
import { create } from "zustand";
import { Todo } from "@/types";

interface IProps {
  tasks: Todo[];
  addTask: (title: string) => void;
  deleteTask: (id: number) => void;
  editTask: (
    id: number,
    modifiedTitle: string,
    modifiedIsDone: boolean
  ) => void;
}

const useTodoStore = create<IProps>((set) => ({
  tasks: [],

  addTask: (title: string) =>
    set((state: any) => ({
      tasks: [
        ...state.tasks,
        {
          id: Date.now(),
          title,
          completed: false,
          create_at: new Date(),
        },
      ],
    })),
  deleteTask: (id) =>
    set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) })),
  editTask: (id, modifiedTitle, modifiedIsDone) => {
    set((state) => ({
      tasks: [
        ...state.tasks.map((el) =>
          el.id === id
            ? {
                ...el,
                title: modifiedTitle,
                completed: modifiedIsDone,
              }
            : el
        ),
      ],
    }));
  },
}));

export default useTodoStore;
