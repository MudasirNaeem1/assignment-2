'use client'

import { useState } from 'react'

export default function Home() {
  const [url, setUrl] = useState('')
  const [summary, setSummary] = useState('')
  const [summaryUrdu, setSummaryUrdu] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    const res = await fetch('/api/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    })

    const data = await res.json()

    if (res.ok) {
      setSummary(data.summary)
      setSummaryUrdu(data.summaryUrdu)
    } else {
      setSummary('Error occurred while summarizing.')
      setSummaryUrdu('')
    }
  }

  return (
    <main className="p-10 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">📝 Blog Summariser</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Blog URL"
          className="border px-4 py-2 w-full mb-4"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button type="submit" className="bg-black text-white px-4 py-2">
          Summarize
        </button>
      </form>

      {summary && (
        <div className="mt-6 space-y-4">
          <div>
            <h2 className="font-semibold text-lg">English Summary:</h2>
            <p>{summary}</p>
          </div>
          <div>
            <h2 className="font-semibold text-lg">Urdu Summary:</h2>
            <p>{summaryUrdu}</p>
          </div>
        </div>
      )}
    </main>
  )
}
