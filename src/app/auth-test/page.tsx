"use client";

import { useState } from "react";

export default function AuthTestPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [result, setResult] = useState("");

  const call = async (path: string, body: any) => {
    const res = await fetch(`/api/auth/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setResult(JSON.stringify(data, null, 2));
  };

  const checkMe = async () => {
    const res = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    setResult(JSON.stringify(data, null, 2));
  };

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-xl font-bold">Auth Test</h1>

      <div className="space-y-2">
        <input
          placeholder="email"
          className="border p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="username (register only)"
          className="border p-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            onClick={() => call("register", { email, password, username })}
            className="bg-green-600 px-4 py-2 text-white"
          >
            Register
          </button>
          <button
            onClick={() => call("login", { email, password })}
            className="bg-blue-600 px-4 py-2 text-white"
          >
            Login
          </button>
          <button
            onClick={checkMe}
            className="bg-gray-700 px-4 py-2 text-white"
          >
            Check /me
          </button>
          <button
            onClick={async () => {
              const res = await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include",
              });
              const data = await res.json();
              setResult(JSON.stringify(data, null, 2));
            }}
            className="bg-red-600 px-4 py-2 text-white"
          >
            Logout
          </button>
        </div>
      </div>

      <pre className="bg-black p-4 text-green-400">{result}</pre>
    </div>
  );
}
