"use client";
import { useState, useEffect } from "react";

// 1. นิยามโครงสร้างข้อมูลใหม่
interface Todo {
  id: number;
  task: string;
  assignee: string;
  dueDate: string;
  completed: boolean;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  
  // State สำหรับ Form
  const [task, setTask] = useState("");
  const [assignee, setAssignee] = useState("");
  const [date, setDate] = useState("");

  // โหลดข้อมูลจาก LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("workspace-tasks");
    if (saved) setTodos(JSON.parse(saved));
  }, []);

  // บันทึกข้อมูลเมื่อมีการเปลี่ยนแปลง
  useEffect(() => {
    localStorage.setItem("workspace-tasks", JSON.stringify(todos));
  }, [todos]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!task || !assignee || !date) return alert("กรุณากรอกข้อมูลให้ครบครับ");

    const newTodo: Todo = {
      id: Date.now(),
      task,
      assignee,
      dueDate: date,
      completed: false,
    };

    setTodos([...todos, newTodo]);
    setTask(""); setAssignee(""); setDate(""); // ล้างค่าหลังเพิ่มเสร็จ
  };

  const toggleStatus = (id: number) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: number) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-slate-50 rounded-2xl shadow-xl text-slate-800">
      <h1 className="text-3xl font-bold mb-8 text-center text-indigo-600">ตารางงาน 🚀</h1>

      {/* --- ส่วนฟอร์มเพิ่มงาน --- */}
      <form onSubmit={addTask} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8 bg-white p-4 rounded-xl shadow-sm">
        <input 
          className="border p-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="ชื่องาน..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <input 
          className="border p-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="ใครเป็นคนทำ?"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
        />
        <input 
          type="date"
          className="border p-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button type="submit" className="bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 transition">
          เพิ่มงาน
        </button>
      </form>

      {/* --- ส่วนตารางแสดงผล --- */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-indigo-50 border-b">
              <th className="p-4 font-semibold text-indigo-700">สถานะ</th>
              <th className="p-4 font-semibold text-indigo-700">ชื่องาน</th>
              <th className="p-4 font-semibold text-indigo-700">ผู้รับผิดชอบ</th>
              <th className="p-4 font-semibold text-indigo-700">กำหนดส่ง</th>
              <th className="p-4 font-semibold text-indigo-700 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {todos.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400 italic">ยังไม่มีงานในรายการ...</td>
              </tr>
            )}
            {todos.map((item) => (
              <tr key={item.id} className="border-b hover:bg-slate-50 transition">
                <td className="p-4">
                  <input 
                    type="checkbox" 
                    checked={item.completed}
                    onChange={() => toggleStatus(item.id)}
                    className="w-5 h-5 cursor-pointer accent-indigo-600"
                  />
                </td>
                <td className={`p-4 ${item.completed ? "line-through text-slate-400" : "font-medium"}`}>
                  {item.task}
                </td>
                <td className="p-4 text-slate-600">
                  <span className="bg-slate-100 px-2 py-1 rounded text-sm">{item.assignee}</span>
                </td>
                <td className="p-4 text-slate-600 text-sm">
                  {new Date(item.dueDate).toLocaleDateString('th-TH')}
                </td>
                <td className="p-4 text-center">
                  <button 
                    onClick={() => deleteTask(item.id)}
                    className="text-red-400 hover:text-red-600 font-bold px-2"
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}