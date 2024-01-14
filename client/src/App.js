import { useState, useEffect } from "react";

const API_BASE = "http://localhost:5000";

function App() {
  const [todos, setTodos] = useState([]);
  const [popupactive, setPopupactive] = useState(false);
  const [newtodo, setNewtodo] = useState("");

  const getTodos = async () => {
    await fetch("http://localhost:5000/todos")
      .then((result) => result.json())
      .then((data) => setTodos(data))
      .catch((err) => console.log(err));
  };

  const completeTodo = async (id) => {
    const data = await fetch("http://localhost:5000/todos/complete/" + id)
      .then((res) => res.json())
      .catch((err) => console.log(err));

    setTodos((todos) =>
      todos.map((todo) => {
        if (todo._id === data._id) {
          todo.complete = data.complete;
        }

        return todo;
      })
    );
  };

  const deleteTodo = async (id) => {
    const data = await fetch("http://localhost:5000/todos/delete/" + id, {
      method: "DELETE",
    })
      .then((data) => data.json())
      .catch((err) => console.log(err));
  
    setTodos((todos) => todos.filter((todo) => 
      todo._id !== data._id
    ));
  };

  const addTodo = async () => {
    const data = await fetch("http://localhost:5000/todos/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: newtodo,
      }),
    }).then((res) => res.json());
    console.log(data);
    setTodos([...todos, data]);
    setPopupactive(false);
    setNewtodo("")
  };

  useEffect(() => {
    getTodos();

    console.log(todos);
  }, []);

  return (
    <div className="App">
      <h1>Welcome!!!</h1>
      <h4>Your Tasks</h4>

      <div className="todos">
        {todos.map((todo) => (
          <div
            className={"todo " + (todo.complete ? "is-complete" : "")}
            key={todo._id}
          >
            <div
              className="checkbox"
              onClick={() => completeTodo(todo._id)}
            ></div>
            <div className="text">{todo.title}</div>
            <div
              className="delete-todo"
              onClick={() => deleteTodo(todo._id)}
            ></div>
          </div>
        ))}
      </div>

      <div className="addpopup" onClick={() => setPopupactive(true)}>
        +
      </div>
      {popupactive ? (
        <div className="popup">
          <div className="closepopup" onClick={() => setPopupactive(false)}>
            X
          </div>
          <div className="content">
            <h3>Add Task</h3>
            <input
              type="text"
              className="add-title-input"
              onChange={(e) => {
                setNewtodo(e.target.value);
              }}
              value={newtodo}
            />
            <div className="button" onClick={addTodo}>
              Create Task
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
