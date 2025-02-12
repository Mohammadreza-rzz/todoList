"use client";

import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import {
  Input,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  useDisclosure,
  Tab,
  Tabs,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";

import { VerticalDotsIcon } from "./icons";
import CustomModal from "./custom-modal";

import { CustomModalType, FocusedTodoType, Todo } from "@/types";

import useTodoStore from "@/store/useTodoStore";

import "react-toastify/dist/ReactToastify.css";

const TodosTable = () => {
  const [todoAddEnable, setTodoAddEnable] = useState(false);

  const [newTodoInput, setNewTodoInput] = useState("");

  const [isLoading, setIsLoading] = useState<Boolean>(false);

  const [filter, setFilter] = useState<"all" | "completed">("all");

  console.log(filter, "filter");

  const [currentModalData, setCurrentModalData] = useState<FocusedTodoType>({
    focusedTodo: null,
    modalType: "detail" as CustomModalType,
  });

  const { tasks, addTask, editTask, deleteTask } = useTodoStore();

  const router = useRouter();
  const addTodoHandler = async (title: string) => {
    if (!todoAddEnable) {
      return;
    }

    setTodoAddEnable(false);
    setIsLoading(true);

    await new Promise((f) => setTimeout(f, 600));
    addTask(title);
    setNewTodoInput("");
    setIsLoading(false);
    setTodoAddEnable(false);
    notifySuccessEvent("Succeed to add todo");
  };

  const editTodoHandler = async (
    id: number,
    modifiedTitle: string,
    modifiedIsDone: boolean
  ) => {
    setIsLoading(true);

    await new Promise((f) => setTimeout(f, 600));

    setNewTodoInput("");
    editTask(id, modifiedTitle, modifiedIsDone);
    setIsLoading(false);
    setTodoAddEnable(false);
    notifySuccessEvent("Succeed to modified todo");
  };

  const deleteTodoHandler = async (id: string) => {
    setIsLoading(true);

    await new Promise((f) => setTimeout(f, 600));

    await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/todos/${id}`, {
      method: "delete",
      cache: "no-store",
    });

    router.refresh();
    setIsLoading(false);
    notifySuccessEvent("Succeed to deleted todo");
    //console.log(`new to do job success: ${newTodoInput}`);
  };

  const DisabledTodoAddButton = () => {
    // <Button color="default" className="h-14">Enter</Button>
    <Popover placement="top" showArrow={true}>
      <PopoverTrigger>
        <Button className="h-14" color="default">
          Enter
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="px-1 py-2">
          <div className="text-small font-bold">Notice</div>
          <div className="text-tiny">Empty to do. input new things to do</div>
        </div>
      </PopoverContent>
    </Popover>;
  };

  const applyIsDoneCSS = (isDone: boolean) =>
    isDone ? "line-through text-gray-900/50 dark:text-white/40" : "";

  const TodoRow = (item: Todo) => {
    return (
      <TableRow key={item.id}>
        <TableCell className={applyIsDoneCSS(item.completed)}>
          {String(item.id).slice(0, 4)}
        </TableCell>
        <TableCell className={applyIsDoneCSS(item.completed)}>
          {item.title}
        </TableCell>
        <TableCell className={applyIsDoneCSS(item.completed)}>
          {item.completed ? "Done" : "Progress"}
        </TableCell>
        <TableCell
          className={applyIsDoneCSS(item.completed)}
        >{`${item.create_at}`}</TableCell>
        <TableCell>
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <VerticalDotsIcon className="text-default-300" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                onAction={(key) => {
                  setCurrentModalData({
                    focusedTodo: item,
                    modalType: key as CustomModalType,
                  });
                  onOpen();
                }}
              >
                <DropdownItem key="detail">View</DropdownItem>
                <DropdownItem key="modify">Modify</DropdownItem>
                <DropdownItem key="delete">Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </TableCell>
      </TableRow>
    );
  };

  const notifySuccessEvent = (msg: string) => toast.success(msg);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const ModalComponent = () => {
    return (
      <div>
        <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) =>
              currentModalData.focusedTodo && (
                <CustomModal
                  focusedTodo={currentModalData.focusedTodo}
                  modalType={currentModalData.modalType}
                  onClose={onClose}
                  onDelete={async (id) => {
                    deleteTask(id);
                    onClose();
                  }}
                  onEdit={async (id, title, isDone) => {
                    editTodoHandler(id, title, isDone);
                    onClose();
                  }}
                />
              )
            }
          </ModalContent>
        </Modal>
      </div>
    );
  };

  let div = (
    <>
      <div className="flex flex-col space-y-2">
        {ModalComponent()}
        <ToastContainer
          closeOnClick
          draggable
          pauseOnFocusLoss
          pauseOnHover
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          position="top-right"
          rtl={false}
          theme="dark"
        />
        <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
          <Input
            label="Add Task"
            placeholder="Enter new things to do"
            type="text"
            value={newTodoInput}
            onValueChange={(changedInput) => {
              setNewTodoInput(changedInput);
              setTodoAddEnable(changedInput.length > 0);
            }}
          />
          {todoAddEnable ? (
            <Button
              className="h-14"
              color="warning"
              onPress={async () => {
                await addTodoHandler(newTodoInput);
              }}
            >
              Enter
            </Button>
          ) : (
            void DisabledTodoAddButton()
          )}
        </div>
        <div className="h-6">
          {isLoading && <Spinner color="warning" size="sm" />}
        </div>

        <Tabs
          onSelectionChange={(selectedTitle) => {
            setFilter(
              selectedTitle.toString().toLocaleLowerCase() as
                | "all"
                | "completed"
            );
          }}
          className="pb-2 mx-auto "
          aria-label="Options"
        >
          <Tab onClick={() => setFilter("all")} key="All" title="All"></Tab>
          <Tab key="Completed" title="Completed"></Tab>
        </Tabs>

        <Table aria-label="Example static collection table">
          <TableHeader>
            <TableColumn>ID</TableColumn>
            <TableColumn>TODO</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>CREATED</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>

          <TableBody emptyContent={"There are no items to show."}>
            {tasks && filter == "all"
              ? tasks.map((item: Todo) => TodoRow(item))
              : tasks
                  .filter((item: Todo) => item.completed)
                  .map((item: Todo) => TodoRow(item))}
          </TableBody>
        </Table>
      </div>
    </>
  );
  return div;
};

export default TodosTable;
