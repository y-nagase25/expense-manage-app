"use client";

import { useToast } from "@/hooks/useToast";
import { BaseResponse } from "@/lib/types";
import { useActionState, useEffect } from "react";
import { createJournalEntry } from "@/lib/actions";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { showToast } = useToast();

  const initialState: BaseResponse = {
    success: false,
    message: '',
  };
  // manage form state with a server action
  const [state, formAction] = useActionState(createJournalEntry, initialState);
  // useEffect to show a toast when the form state changes after submission
  useEffect(() => {
    if (state.message) {
      if (state.success) {
        showToast('success', '処理成功', state.message);
      } else {
        showToast('error', 'エラー', state.message);
      }
    }
  }, [state, showToast]);

  const { pending } = useFormStatus();

  return (
    <>
      <h2>Login</h2>
      <Link href="/login" className="text-blue-500">Login</Link>

      <h2 className="mt-8">Client Component</h2>
      <Button onClick={() => showToast("info", "新しいバージョンが利用可能です。", "ページをリロードしてください。")}>
        Default
      </Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>

      <h2 className="mt-8">Server Action Integration</h2>
      <form action={formAction}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text" id="name" name="name"
            className="mt-4 ml-4 p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            defaultValue="山田 太郎"
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email" id="email" name="email"
            className="mt-4 ml-4 p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            defaultValue="example@email.com"
            required
          />
        </div>
        <Button type="submit" disabled={pending} >
          {pending ? "送信中..." : "登録"}
        </Button>
      </form>
    </>
  );
}
