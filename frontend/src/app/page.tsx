import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-bold mb-4">CreoBot</h1>
        <p className="text-gray-400 text-xl mb-8">
          AI chatbot for small businesses. Zero hallucination. Human handoff. Live in minutes.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/signup"
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-lg transition"
          >
            Start free trial
          </Link>
          <Link
            href="/login"
            className="bg-gray-800 hover:bg-gray-700 text-white font-semibold px-8 py-3 rounded-lg transition"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}