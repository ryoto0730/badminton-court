"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  // イベント一覧を読み込む
  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase.from("events").select("*");
      if (error) {
        console.error(error);
      } else {
        setEvents(data);
      }
    };
    load();
  }, []);

  // 参加登録
  const handleJoin = async (eventId: number) => {
    // 👇 ここは仮のユーザー情報（後でLINEログインに置き換える）
    const userId = "U123456"; 
    const displayName = "山田太郎";

    const { error } = await supabase.from("event_attendees").insert({
      event_id: eventId,
      user_id: userId,
      display_name: displayName,
    });

    if (error) {
      console.error(error);
      setMessage("参加登録に失敗しました…");
    } else {
      setMessage("参加登録が完了しました！");
    }
  };

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">イベント一覧</h1>
      {events.length === 0 ? (
        <p>イベントがありません</p>
      ) : (
        <ul className="space-y-4">
          {events.map((e) => (
            <li key={e.id} className="border p-3 rounded">
              <div>
                {e.title}（{e.date}）
              </div>
              <button
                onClick={() => handleJoin(e.id)}
                className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
              >
                参加する
              </button>
            </li>
          ))}
        </ul>
      )}
      {message && <p className="mt-4 text-blue-600">{message}</p>}
    </main>
  );
}
