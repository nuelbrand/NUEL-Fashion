import { useState, useEffect } from 'react'
import { useXP } from '@/hooks/useXP'
import { useStreaks } from '@/hooks/useStreaks'
import { Card, Pill } from '@/components/shared/UI'
import { toast } from 'sonner'

const WORKER_URL = import.meta.env.VITE_AI_WORKER_URL as string

const BOOKS_OLD = [
  'Genesis','Exodus','Leviticus','Numbers','Deuteronomy',
  'Joshua','Judges','Ruth','1 Samuel','2 Samuel',
  '1 Kings','2 Kings','1 Chronicles','2 Chronicles',
  'Ezra','Nehemiah','Esther','Job','Psalms','Proverbs',
  'Ecclesiastes','Song of Solomon','Isaiah','Jeremiah',
  'Lamentations','Ezekiel','Daniel','Hosea','Joel','Amos',
  'Obadiah','Jonah','Micah','Nahum','Habakkuk','Zephaniah',
  'Haggai','Zechariah','Malachi',
]
const BOOKS_NEW = [
  'Matthew','Mark','Luke','John','Acts',
  'Romans','1 Corinthians','2 Corinthians','Galatians',
  'Ephesians','Philippians','Colossians',
  '1 Thessalonians','2 Thessalonians','1 Timothy','2 Timothy',
  'Titus','Philemon','Hebrews','James',
  '1 Peter','2 Peter','1 John','2 John','3 John',
  'Jude','Revelation',
]

const CHAPTER_COUNTS: Record<string, number> = {
  Genesis:150,Exodus:40,Leviticus:27,Numbers:36,Deuteronomy:34,
  Joshua:24,Judges:21,Ruth:4,'1 Samuel':31,'2 Samuel':24,
  '1 Kings':22,'2 Kings':25,'1 Chronicles':29,'2 Chronicles':36,
  Ezra:10,Nehemiah:13,Esther:10,Job:42,Psalms:150,Proverbs:31,
  Ecclesiastes:12,'Song of Solomon':8,Isaiah:66,Jeremiah:52,
  Lamentations:5,Ezekiel:48,Daniel:12,Hosea:14,Joel:3,Amos:9,
  Obadiah:1,Jonah:4,Micah:7,Nahum:3,Habakkuk:3,Zephaniah:3,
  Haggai:2,Zechariah:14,Malachi:4,
  Matthew:28,Mark:16,Luke:24,John:21,Acts:28,
  Romans:16,'1 Corinthians':16,'2 Corinthians':13,Galatians:6,
  Ephesians:6,Philippians:4,Colossians:4,
  '1 Thessalonians':5,'2 Thessalonians':3,'1 Timothy':6,'2 Timothy':4,
  Titus:3,Philemon:1,Hebrews:13,James:5,
  '1 Peter':5,'2 Peter':3,'1 John':5,'2 John':1,'3 John':1,
  Jude:1,Revelation:22,
}

interface Verse {
  book_id: string
  book_name: string
  chapter: number
  verse: number
  text: string
}

interface PassageData {
  reference: string
  verses: Verse[]
  text: string
  translation_name: string
}

export default function BiblePage() {
  const { awardXP } = useXP()
  const { logStreak } = useStreaks()

  const [tab, setTab] = useState<'read' | 'search' | 'verse'>('read')
  const [testament, setTestament] = useState<'old' | 'new'>('new')
  const [selectedBook, setSelectedBook] = useState('John')
  const [selectedChapter, setSelectedChapter] = useState(1)
  const [passage, setPassage] = useState<PassageData | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchRef, setSearchRef] = useState('')
  const [searchResult, setSearchResult] = useState<PassageData | null>(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const [fontSize, setFontSize] = useState(16)
  const [marked, setMarked] = useState<Set<number>>(new Set())

  const books = testament === 'old' ? BOOKS_OLD : BOOKS_NEW
  const chapterCount = CHAPTER_COUNTS[selectedBook] || 1

  useEffect(() => {
    loadPassage(selectedBook, selectedChapter)
  }, [selectedBook, selectedChapter])

  async function loadPassage(book: string, chapter: number) {
    setLoading(true)
    setPassage(null)
    try {
      const ref = `${book}+${chapter}`
      const res = await fetch(
        `https://bible-api.com/${encodeURIComponent(`${book} ${chapter}`)}?translation=kjv`
      )
      const data = await res.json()
      setPassage(data)
    } catch {
      toast.error('Could not load passage. Check your connection.')
    }
    setLoading(false)
  }

  async function searchPassage() {
    if (!searchRef.trim()) return
    setSearchLoading(true)
    setSearchResult(null)
    try {
      const res = await fetch(
        `https://bible-api.com/${encodeURIComponent(searchRef.trim())}?translation=kjv`
      )
      const data = await res.json()
      if (data.error) {
        toast.error(`Not found: "${searchRef}". Try "John 3:16" or "Psalm 23"`)
      } else {
        setSearchResult(data)
      }
    } catch {
      toast.error('Search failed. Try again.')
    }
    setSearchLoading(false)
  }

  function markRead() {
    awardXP('bible_reading', 'faith')
    logStreak('faith')
    toast.success('Reading marked complete! +20 XP')
  }

  function toggleVerseHighlight(verseNum: number) {
    setMarked(prev => {
      const next = new Set(prev)
      if (next.has(verseNum)) next.delete(verseNum)
      else next.add(verseNum)
      return next
    })
  }

  function nextChapter() {
    if (selectedChapter < chapterCount) {
      setSelectedChapter(c => c + 1)
    } else {
      const allBooks = [...BOOKS_OLD, ...BOOKS_NEW]
      const idx = allBooks.indexOf(selectedBook)
      if (idx < allBooks.length - 1) {
        const nextBook = allBooks[idx + 1]
        setSelectedBook(nextBook)
        setSelectedChapter(1)
        setTestament(BOOKS_NEW.includes(nextBook) ? 'new' : 'old')
        toast(`Now reading ${nextBook}`)
      }
    }
  }

  function prevChapter() {
    if (selectedChapter > 1) {
      setSelectedChapter(c => c - 1)
    } else {
      const allBooks = [...BOOKS_OLD, ...BOOKS_NEW]
      const idx = allBooks.indexOf(selectedBook)
      if (idx > 0) {
        const prevBook = allBooks[idx - 1]
        const prevChapCount = CHAPTER_COUNTS[prevBook] || 1
        setSelectedBook(prevBook)
        setSelectedChapter(prevChapCount)
        setTestament(BOOKS_NEW.includes(prevBook) ? 'new' : 'old')
      }
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--purple) 0%, var(--primary) 100%)',
        borderRadius: 20, padding: '24px', color: '#fff',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.85, marginBottom: 4 }}>HOLY BIBLE</div>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>
          {passage ? passage.reference : `${selectedBook} ${selectedChapter}`}
        </h2>
        <div style={{ marginTop: 8, fontSize: 13, opacity: 0.85 }}>
          King James Version
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Pill label="📖 Read" active={tab === 'read'} onClick={() => setTab('read')} />
        <Pill label="🔍 Search" active={tab === 'search'} onClick={() => setTab('search')} />
      </div>

      {/* READ TAB */}
      {tab === 'read' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Testament selector */}
          <div style={{ display: 'flex', gap: 8 }}>
            <Pill label="Old Testament" active={testament === 'old'} onClick={() => setTestament('old')} />
            <Pill label="New Testament" active={testament === 'new'} onClick={() => setTestament('new')} />
          </div>

          {/* Book selector */}
          <Card>
            <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-muted)', marginBottom: 10 }}>
              SELECT BOOK
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {books.map(book => (
                <button
                  key={book}
                  onClick={() => { setSelectedBook(book); setSelectedChapter(1) }}
                  style={{
                    padding: '5px 10px', borderRadius: 8, border: 'none',
                    background: selectedBook === book ? 'var(--purple)' : 'var(--bg-accent)',
                    color: selectedBook === book ? '#fff' : 'var(--text-muted)',
                    fontSize: 12, fontWeight: selectedBook === book ? 700 : 500,
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >{book}</button>
              ))}
            </div>
          </Card>

          {/* Chapter selector */}
          <Card style={{ padding: '14px 16px' }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-muted)', marginBottom: 10 }}>
              CHAPTER
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {Array.from({ length: chapterCount }, (_, i) => i + 1).map(ch => (
                <button
                  key={ch}
                  onClick={() => setSelectedChapter(ch)}
                  style={{
                    width: 36, height: 36, borderRadius: 8, border: 'none',
                    background: selectedChapter === ch ? 'var(--purple)' : 'var(--bg-accent)',
                    color: selectedChapter === ch ? '#fff' : 'var(--text-muted)',
                    fontSize: 13, fontWeight: selectedChapter === ch ? 700 : 500,
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >{ch}</button>
              ))}
            </div>
          </Card>

          {/* Font size control */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Text size:</span>
            {[14, 16, 18, 20, 22].map(size => (
              <button
                key={size}
                onClick={() => setFontSize(size)}
                style={{
                  padding: '4px 10px', borderRadius: 8, border: 'none',
                  background: fontSize === size ? 'var(--primary)' : 'var(--bg-accent)',
                  color: fontSize === size ? '#fff' : 'var(--text-muted)',
                  fontSize: 12, cursor: 'pointer', fontWeight: 600,
                }}
              >A{size - 14 > 0 ? '+' : ''}{size === 14 ? '' : size - 14}</button>
            ))}
          </div>

          {/* Passage content */}
          <Card>
            {loading ? (
              <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
                <div className="animate-pulse">Loading passage...</div>
              </div>
            ) : passage && passage.verses ? (
              <div>
                <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--purple)', marginBottom: 20 }}>
                  {passage.reference}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {passage.verses.map((v: Verse) => (
                    <div
                      key={v.verse}
                      onClick={() => toggleVerseHighlight(v.verse)}
                      style={{
                        padding: '8px 10px',
                        borderRadius: 8,
                        background: marked.has(v.verse) ? 'var(--accentLight, #FEF3C7)' : 'transparent',
                        cursor: 'pointer',
                        transition: 'background 0.15s',
                        display: 'flex',
                        gap: 10,
                        alignItems: 'flex-start',
                      }}
                    >
                      <span style={{
                        fontSize: 11, fontWeight: 700, color: 'var(--purple)',
                        minWidth: 22, paddingTop: 3, flexShrink: 0,
                      }}>{v.verse}</span>
                      <span style={{
                        fontSize: fontSize, lineHeight: 1.85, color: 'var(--text)',
                        fontFamily: 'Georgia, serif',
                      }}>{v.text}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-muted)' }}>
                  Tap any verse to highlight it
                </div>
              </div>
            ) : passage && (passage as any).error ? (
              <div style={{ padding: '30px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📖</div>
                <div style={{ fontWeight: 600 }}>Passage not found</div>
                <div style={{ fontSize: 13, marginTop: 4 }}>Try a different book or chapter</div>
              </div>
            ) : null}
          </Card>

          {/* Navigation */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={prevChapter}
              style={{
                flex: 1, padding: '12px', borderRadius: 12, border: 'none',
                background: 'var(--bg-accent)', color: 'var(--text)',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }}
            >Previous Chapter</button>
            <button
              onClick={markRead}
              style={{
                flex: 1, padding: '12px', borderRadius: 12, border: 'none',
                background: 'var(--purple)', color: '#fff',
                fontSize: 14, fontWeight: 700, cursor: 'pointer',
              }}
            >Mark Read +20 XP</button>
            <button
              onClick={nextChapter}
              style={{
                flex: 1, padding: '12px', borderRadius: 12, border: 'none',
                background: 'var(--bg-accent)', color: 'var(--text)',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }}
            >Next Chapter</button>
          </div>
        </div>
      )}

      {/* SEARCH TAB */}
      {tab === 'search' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>
              Search any passage or verse
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
              Examples: "John 3:16" or "Psalm 23" or "Romans 8:28"
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                className="input-base"
                value={searchRef}
                onChange={e => setSearchRef(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && searchPassage()}
                placeholder="e.g. John 3:16"
                style={{ flex: 1, boxSizing: 'border-box' }}
              />
              <button
                onClick={searchPassage}
                disabled={searchLoading}
                style={{
                  background: 'var(--purple)', color: '#fff',
                  border: 'none', borderRadius: 12,
                  padding: '0 20px', fontSize: 15,
                  cursor: 'pointer', flexShrink: 0,
                  opacity: searchLoading ? 0.6 : 1,
                }}
              >{searchLoading ? '...' : '→'}</button>
            </div>

            {/* Quick references */}
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>
                QUICK VERSES
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {[
                  'John 3:16', 'Psalm 23', 'Romans 8:28',
                  'Philippians 4:13', 'Isaiah 40:31', 'Proverbs 3:5-6',
                  'Jeremiah 29:11', 'Matthew 5:1-12', 'Psalm 91',
                ].map(ref => (
                  <button
                    key={ref}
                    onClick={() => { setSearchRef(ref); searchPassage() }}
                    style={{
                      padding: '5px 12px', borderRadius: 8, border: 'none',
                      background: 'var(--bg-accent)', color: 'var(--text-muted)',
                      fontSize: 12, cursor: 'pointer', fontWeight: 600,
                    }}
                  >{ref}</button>
                ))}
              </div>
            </div>
          </Card>

          {searchLoading && (
            <Card>
              <div className="animate-pulse" style={{ color: 'var(--text-muted)', fontSize: 14, textAlign: 'center', padding: '20px 0' }}>
                Loading passage...
              </div>
            </Card>
          )}

          {searchResult && searchResult.verses && (
            <Card>
              <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--purple)', marginBottom: 20 }}>
                {searchResult.reference}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {searchResult.verses.map((v: Verse) => (
                  <div key={v.verse} style={{ padding: '8px 10px', display: 'flex', gap: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--purple)', minWidth: 22, paddingTop: 3, flexShrink: 0 }}>{v.verse}</span>
                    <span style={{ fontSize: 16, lineHeight: 1.85, color: 'var(--text)', fontFamily: 'Georgia, serif' }}>{v.text}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={markRead}
                style={{
                  marginTop: 16, width: '100%', padding: '11px', borderRadius: 12,
                  border: 'none', background: 'var(--purple)', color: '#fff',
                  fontSize: 14, fontWeight: 700, cursor: 'pointer',
                }}
              >Mark Read +20 XP</button>
            </Card>
          )}

          {searchResult && (searchResult as any).error && (
            <Card style={{ textAlign: 'center', padding: 32 }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>🔍</div>
              <div style={{ fontWeight: 600 }}>Not found</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                Try "Book Chapter:Verse" format e.g. "John 3:16"
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
