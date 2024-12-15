import { Input, Button, Card, CardBody, CardFooter } from "@nextui-org/react";
import { useState } from "react";

interface Todo {
  text: string;
  completed: boolean;
}

const Todo: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([...todos, { text: inputValue, completed: false }]);
      setInputValue("");
    }
  };

  const deleteTodo = (index: number) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  // const toggleTodo = (index: number) => {
  //   const newTodos = todos.map((todo, i) =>
  //     i === index ? { ...todo, completed: !todo.completed } : todo,
  //   );
  //   setTodos(newTodos);
  // };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2>Todo List</h2>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <Input
          fullWidth
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new task"
        />
        <Button onClick={addTodo} color="primary">
          Add
        </Button>
      </div>
      {todos.map((todo, index) => (
        <Card key={index}>
          <CardBody>{todo.text}</CardBody>
          <CardFooter>
            <Button color="danger" onClick={() => deleteTodo(index)}>
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
export default Todo;
