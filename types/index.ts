import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type Todo = {
  id: number;
  title: string;
  completed: boolean;
  create_at: Date;
};

export type CustomModalType = "detail" | "modify" | "delete";

export type FocusedTodoType = {
  focusedTodo: Todo | null;
  modalType: CustomModalType;
};
