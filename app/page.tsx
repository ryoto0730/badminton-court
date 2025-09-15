"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useLiff } from "@/lib/useLiff";

type Event = {
  id: number;
  title: string;
  date: string;
};

export default function Home() {
  const { ready, profile } = useLiff();
  const [events, setEvents] = useState<Event[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase.from("events").select("*");
      if (!error && data) setEvents(data as Event[]);
    };
    load();
  }, []);

  const handleJoin = async (eventId: number) => {
    if (!profile) {
      setMessage("ログインしてください");
      return;
    }

    const { error } = await supabase.from("event_attendees").insert({
      event_id: eventId,
      user_id: profile.userId,
      display_name: profile.displayName,
    });

    if (error) {
      console.error(error);
      setMessage("参加登録に失敗しました…");
    } else {
      setMessage("参加登録が完了しました！");
    }
  };

  if (!ready) return <p>LIFFを初期化中...</p>;

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">イベント一覧</h1>
      {profile && <p className="mb-4">ようこそ {profile.displayName} さん！</p>}
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
