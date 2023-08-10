import React, { useEffect, useRef, useState } from "react";
import Form from "../components/Form";
import Todos from "../components/Todos";
import { useNavigate } from "react-router-dom";

const TodosForm = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState();
  const [todos, setTodos] = useState([]);
  const [loadingTodos, setLoadingTodos] = useState(false);

  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [showMenu, setShowMenu] = useState(false);

  const menuRef = useRef();

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("user"));

    console.log(userDetails);
    if (!(userDetails && userDetails.token && userDetails.id)) {
      return navigate("/login");
    }
    setUser(userDetails);

    const allTodos = async () => {
      console.log(userDetails);
      try {
        setLoadingTodos(true);
        const res = await fetch("http://localhost:5000/todos", {
          headers: {
            Authorization: `Bearer ${userDetails.token}`,
          },
        });

        if (!res.ok) {
          setLoadingTodos(false);
          const errorData = res.json();
          throw new Error(errorData.msg);
        }
        const todos = await res.json();
        setTodos(todos);
        setLoadingTodos(false);
      } catch (err) {
        setError(err.message);
        setLoadingTodos(false);
      }
    };
    allTodos();
  }, []);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser({})
    navigate('/login')
  }

  const handleToggleComplete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/todos/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!res.ok) {
        const errorData = res.json();
        throw new Error(errorData.msg);
      }

      const data = await res.json();
      setTodos(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/todos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!res.ok) {
        const errorData = res.json();
        throw new Error(errorData.msg);
      }

      const data = await res.json();
      setTodos(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!value) return;
    console.log(value);

    try {
      const res = await fetch("http://localhost:5000/add-todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          name: value,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.msg);
      }

      const data = await res.json();
      console.log(data);
      setTodos(data);
      setValue("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-5 border-2 min-h-screen relative">
      <button
        className="profile-button absolute right-5 top-[10px] w-10 h-10 grid place-items-center rounded-full bg-indigo-600 text-white"
        onClick={() => setShowMenu(!showMenu)}
      >
        {user && user.name.charAt(0).toUpperCase()}
      </button>
      {showMenu && (
        <div
          ref={menuRef}
          id="menu"
          className="absolute right-5 top-[60px] border p-4 flex flex-col items-center shadow-lg rounded bg-white z-50"
        >
          <button className="bg-indigo-200 text-white py-2 px-4 hover:bg-indigo-400 transition rounded" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
      <div className="max-w-5xl my-10 mx-auto">
        <Form
          value={value}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
        <Todos
          todos={todos}
          loadingTodos={loadingTodos}
          handleToggleComplete={handleToggleComplete}
          handleDeleteTodo={handleDeleteTodo}
        />
      </div>
    </div>
  );
};

export default TodosForm;
