import { title } from "@/components/primitives";
import TodosTable from "@/components/todos-table";

export default async function TodosPage() {
  return (
    <div className="flex flex-col space-y-8">
      <h1 className={title()}>Todos</h1>
      <TodosTable />
    </div>
  );
}
