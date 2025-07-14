import axios from 'axios'
import cheerio from 'cheerio'
import { MongoClient } from 'mongodb'
import { createClient } from '@supabase/supabase-js'

// ✅ Replace with your actual credentials:
const supabase = createClient(
  'https://ombdvsxrapwbjhhkwdxg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tYmR2c3hyYXB3YmpoaGt3ZHhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0ODM3MjAsImV4cCI6MjA2ODA1OTcyMH0.ZVaD5y7hRSMsj6zouNz1F8y-axJgAuP3_ZjAs3Z09Ew'
)

// ✅ Replace with your encoded Mongo URI
const mongo = new MongoClient(
  'mongodb+srv://mudasir:mudasir%40123@cluster0.ydbzikc.mongodb.net/?retryWrites=true&w=majority'
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method allowed' })
  }

  const { url } = req.body || {}

  try {
    const response = await axios.get(url)
    const $ = cheerio.load(response.data)
    const fullText = $('body').text().replace(/\s+/g, ' ').trim()

    const summary = fullText.split('. ').slice(0, 3).join('. ') + '.'

    const translationDict = {
      This: 'یہ',
      is: 'ہے',
      a: 'ایک',
      summary: 'خلاصہ',
      blog: 'بلاگ',
      about: 'کے بارے میں',
      the: 'یہ',
      post: 'تحریر',
    }

    const translateToUrdu = (text) =>
      text
        .split(' ')
        .map((word) => translationDict[word] || word)
        .join(' ')

    const summaryUrdu = translateToUrdu(summary)

    await mongo.connect()
    const db = mongo.db('blogDB')
    await db.collection('blogs').insertOne({ url, fullText })

    await supabase.from('summaries').insert([{ url, summary, summaryUrdu }])

    return res.status(200).json({ summary, summaryUrdu })
  } catch (err) {
    console.error('❌ API Error:', err)
    return res.status(500).json({ error: 'Something went wrong.' })
  }
}

// ✅ Tell Next.js to parse JSON
export const config = {
  api: {
    bodyParser: true,
  },
}
