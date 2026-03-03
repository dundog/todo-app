"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Todo {
  id: number;
  task: string;
  assignee: string;
  due_date: string;
  completed: boolean;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [task, setTask] = useState("");
  const [assignee, setAssignee] = useState("");
  const [date, setDate] = useState("");

  // ✅ โหลดข้อมูลจาก Supabase
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setTodos(data || []);
    }
  };

  // ✅ เพิ่มงาน
  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task || !assignee || !date)
      return alert("กรุณากรอกข้อมูลให้ครบครับ");

    const { error } = await supabase.from("todos").insert([
      {
        task,
        assignee,
        due_date: date,
        completed: false,
      },
    ]);

    if (error) {
      console.error(error);
    } else {
      setTask("");
      setAssignee("");
      setDate("");
      fetchTodos();
    }
  };

  // ✅ เปลี่ยนสถานะ
  const toggleStatus = async (id: number, current: boolean) => {
    await supabase
      .from("todos")
      .update({ completed: !current })
      .eq("id", id);

    fetchTodos();
  };

  // ✅ ลบงาน
  const deleteTask = async (id: number) => {
    await supabase.from("todos").delete().eq("id", id);
    fetchTodos();
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-slate-50 rounded-2xl shadow-xl text-slate-800">
      <h1 className="text-3xl font-bold mb-8 text-center text-indigo-600">
        ตารางงาน 🚀
      </h1>

      <form
        onSubmit={addTask}
        className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8 bg-white p-4 rounded-xl shadow-sm"
      >
        <input
          className="border p-2 rounded-lg"
          placeholder="ชื่องาน..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <input
          className="border p-2 rounded-lg"
          placeholder="ใครเป็นคนทำ?"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
        />
        <input
          type="date"
          className="border p-2 rounded-lg"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white font-bold py-2 rounded-lg"
        >
          เพิ่มงาน
        </button>
      </form>

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-indigo-50 border-b">
              <th className="p-4">สถานะ</th>
              <th className="p-4">ชื่องาน</th>
              <th className="p-4">ผู้รับผิดชอบ</th>
              <th className="p-4">กำหนดส่ง</th>
              <th className="p-4 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {todos.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400 italic">
                  ยังไม่มีงานในรายการ...
                </td>
              </tr>
            )}

            {todos.map((item) => (
              <tr key={item.id} className="border-b hover:bg-slate-50">
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() =>
                      toggleStatus(item.id, item.completed)
                    }
                    className="w-5 h-5 cursor-pointer accent-indigo-600"
                  />
                </td>

                <td
                  className={`p-4 ${
                    item.completed
                      ? "line-through text-slate-400"
                      : "font-medium"
                  }`}
                >
                  {item.task}
                </td>

                <td className="p-4 text-slate-600">
                  <span className="bg-slate-100 px-2 py-1 rounded text-sm">
                    {item.assignee}
                  </span>
                </td>

                <td className="p-4 text-slate-600 text-sm">
                  {new Date(item.due_date).toLocaleDateString("th-TH")}
                </td>

                <td className="p-4 text-center">
                  <button
                    onClick={() => deleteTask(item.id)}
                    className="text-red-500 font-bold px-2"
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