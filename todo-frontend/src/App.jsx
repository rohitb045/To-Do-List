import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import "./index.css";

function App() {
  // STATES
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [editId, setEditId] = useState(null);

  // ✅ POPUP STATE (for ADD only)
  const [showPopup, setShowPopup] = useState(false);

  const API = "http://127.0.0.1:8000/tasks";

  // FETCH
  const fetchTasks = async () => {
    const res = await axios.get(API);
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ADD + UPDATE
  const addTask = async () => {
    if (!title) return;

    if (editId) {
      // UPDATE
      await axios.put(`${API}/${editId}`, {
        title,
        description,
        status,
      });

      const updatedTasks = tasks.map((task) =>
        task.id === editId
          ? { ...task, title, description, status }
          : task
      );

      setTasks(updatedTasks);
      setEditId(null);

      // ✅ ALERT for update
      alert("Task Updated Successfully ✅");
    } else {
      // ADD
      const res = await axios.post(API, {
        title,
        description,
        status,
      });

      const newTask = {
        id: res.data.id,
        title,
        description,
        status,
      };

      setTasks([...tasks, newTask]);

      // ✅ POPUP (not alert)
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
    }

    setTitle("");
    setDescription("");
    setStatus("Pending");
  };

  // DELETE
  const deleteTask = async (id) => {
    await axios.delete(`${API}/${id}`);
    setTasks(tasks.filter((task) => task.id !== id));

    // ✅ ALERT for delete
    alert("Task Deleted ❌");
  };

  // FILTER
  const filteredTasks = tasks.filter((task) => {
    if (filter === "All") return true;
    return task.status === filter;
  });

  return (
    <main className="min-h-screen bg-gray-100 px-4 relative">
      
      {/* ✅ POPUP MESSAGE */}
      {showPopup && (
        <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
          Task Added Successfully 🎉
        </div>
      )}

      {/* Title */}
      <h1 className="text-center pt-10 text-4xl font-bold text-gray-800">
        To-Do List
      </h1>

      {/* FORM */}
      <section className="mt-6 flex flex-col items-center gap-4">
        <div className="flex flex-col md:flex-row gap-3 w-full max-w-2xl">
          
          <input
            className="border p-2 rounded w-full"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="border p-2 rounded w-full"
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <select
            className="border p-2 rounded w-full"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>Pending</option>
            <option>Complete</option>
          </select>

          <button
            onClick={addTask}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {editId ? "Update" : "Add"}
          </button>
        </div>

        {/* Filter */}
        <select
          className="border p-2 rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option>All</option>
          <option>Pending</option>
          <option>Complete</option>
        </select>
      </section>

      {/* TABLE */}
      <section className="mt-8 flex justify-center">
        <table className="w-full max-w-3xl border bg-white">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task.id}>
                <td className="p-2 border">{task.title}</td>
                <td className="p-2 border">{task.description}</td>

                <td
                  className={`p-2 border font-semibold ${
                    task.status === "Complete"
                      ? "text-green-600"
                      : "text-yellow-500"
                  }`}
                >
                  {task.status}
                </td>

                <td className="p-2 border flex gap-2 justify-center">
                  <button
                    onClick={() => {
                      setTitle(task.title);
                      setDescription(task.description);
                      setStatus(task.status);
                      setEditId(task.id);
                    }}
                    className="bg-green-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}

export default App;