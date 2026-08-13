"use client"

import Link from "next/link"
import { useState, useEffect, useCallback } from "react"
import {
  Heart,
  Home,
  BookOpen,
  MessageCircle,
  Clock,
  Sparkles,
  Star,
  Search,
  RotateCcw,
  Compass,
  Leaf,
  Lightbulb,
  MapPin,
  Code,
  TrendingUp,
  LayoutDashboard,
  Flower2,
} from "lucide-react"

/* ========================================================================
   BloomLab 404 — Find the Hidden Page
   ======================================================================== */

type ElsaState = "searching" | "thinking" | "shrug" | "found" | "happy" | "sad"
type GameState = "playing" | "won" | "lost"
type SpotContent = "empty" | "page" | "clue" | "butterfly" | "mushroom"

const TIPS = [
  "Bloom one lesson at a time.",
  "Every step you take helps you grow.",
  "The best discoveries begin with curiosity.",
]

const SPEECH: Record<ElsaState, string> = {
  searching: "Hmm... where could it be? Let me help you search! 🔍",
  thinking: "I think we're getting closer! 🤔",
  shrug: "Not there! Let's keep looking! 💪",
  found: "You found it! Amazing detective work! 🌸",
  happy: "Yay! We did it together! ✨",
  sad: "Oh no... we ran out of tries. Don't give up! 🌱",
}

const CONFETTI = Array.from({ length: 40 }).map((_, i) => ({
  id: i,
  color: ["#ffcce0", "#ffd700", "#c1e1c1", "#e6e6fa", "#ffb3d1", "#ffeb99"][i % 6],
  left: `${(i * 2.5) % 100}%`,
  delay: (i % 10) * 0.05,
}))

function generateBoard(): { content: SpotContent; revealed: boolean }[] {
  const board = Array.from({ length: 9 }, () => ({ content: "empty" as SpotContent, revealed: false }))
  const pageIdx = Math.floor(Math.random() * 9)
  board[pageIdx].content = "page"
  const neighbors = [
    pageIdx - 1, pageIdx + 1, pageIdx - 3, pageIdx + 3,
    pageIdx - 4, pageIdx - 2, pageIdx + 2, pageIdx + 4,
  ].filter(i => i >= 0 && i < 9 && i !== pageIdx && Math.abs((i % 3) - (pageIdx % 3)) <= 1)
  for (let i = 0; i < Math.min(2, neighbors.length); i++) {
    const idx = neighbors[i]
    if (board[idx].content === "empty") board[idx].content = "clue"
  }
  const remaining = board.map((s, i) => s.content === "empty" ? i : -1).filter(i => i !== -1)
  const shuffled = remaining.sort(() => 0.5 - Math.random())
  if (shuffled[0] !== undefined) board[shuffled[0]].content = "butterfly"
  if (shuffled[1] !== undefined) board[shuffled[1]].content = "butterfly"
  if (shuffled[2] !== undefined) board[shuffled[2]].content = "mushroom"
  if (shuffled[3] !== undefined) board[shuffled[3]].content = "mushroom"
  return board
}

export default function NotFound() {
  const [timeOnPage, setTimeOnPage] = useState(0)
  const [hearts, setHearts] = useState(3)
  const [gameState, setGameState] = useState<GameState>("playing")
  const [board, setBoard] = useState<{ content: SpotContent; revealed: boolean }[]>([])
  const [mounted, setMounted] = useState(false)
  const [elsaState, setElsaState] = useState<ElsaState>("searching")
  const [rewardClaimed, setRewardClaimed] = useState(false)
  const [showReward, setShowReward] = useState(false)
  const [currentTipIdx, setCurrentTipIdx] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [showConfetti, setShowConfetti] = useState(false)
  const [foundSpots, setFoundSpots] = useState(0)
  const [level] = useState(12)
  const [xp, setXp] = useState(650)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    setBoard(generateBoard())
    setMounted(true)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => setTimeOnPage(t => t + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => setCurrentTipIdx(i => (i + 1) % TIPS.length), 6000)
    return () => clearInterval(interval)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 15
    const y = (e.clientY / window.innerHeight - 0.5) * 15
    setMousePos({ x, y })
  }, [])

  const handleSpotClick = (idx: number) => {
    if (gameState !== "playing" || board[idx].revealed) return
    const newBoard = [...board]
    newBoard[idx] = { ...newBoard[idx], revealed: true }
    setBoard(newBoard)
    setFoundSpots(f => f + 1)
    const content = newBoard[idx].content
    if (content === "page") {
      setGameState("won")
      setElsaState("found")
      setShowReward(true)
      setXp(x => x + 50)
    } else if (content === "clue") {
      setElsaState("thinking")
    } else {
      const newHearts = hearts - 1
      setHearts(newHearts)
      if (newHearts <= 0) {
        setGameState("lost")
        setElsaState("sad")
        const pageIdx = newBoard.findIndex(s => s.content === "page")
        if (pageIdx !== -1) {
          newBoard[pageIdx] = { ...newBoard[pageIdx], revealed: true }
          setBoard([...newBoard])
        }
      } else {
        setElsaState("shrug")
      }
    }
  }

  const handleClaimReward = () => {
    setRewardClaimed(true)
    setElsaState("happy")
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
  }

  const handleRetry = () => {
    setHearts(3)
    setGameState("playing")
    setBoard(generateBoard())
    setMounted(true)
    setElsaState("searching")
    setFoundSpots(0)
    setRewardClaimed(false)
    setShowReward(false)
    setShowConfetti(false)
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0")
    const sec = (s % 60).toString().padStart(2, "0")
    return `${m}:${sec}`
  }

  const getElsaImage = (): string => {
    switch (elsaState) {
      case "searching": return "/elsa-searching.png"
      case "thinking": return "/elsa-thinking.png"
      case "shrug": return "/elsa-shrug.png"
      case "found": return "/elsa-found-page.png"
      case "happy": return "/elsa-happy-jump.png"
      case "sad": return "/elsa-thinking.png"
      default: return "/elsa-searching.png"
    }
  }

  const getEmoji = (c: SpotContent) => {
    switch (c) {
      case "page": return "📜"
      case "clue": return "👣"
      case "butterfly": return "🦋"
      case "mushroom": return "🍄"
      default: return "🌿"
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden overflow-y-auto" onMouseMove={handleMouseMove}>
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="w-full h-full" style={{ transform: `translate(${mousePos.x * 0.15}px, ${mousePos.y * 0.15}px) scale(1.05)`, transition: "transform 0.3s ease-out" }}>
          <img src="/404-back.png" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      </div>

      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
          {CONFETTI.map(c => (
            <div key={c.id} className="absolute top-0 w-2 h-2 rounded-sm" style={{ left: c.left, backgroundColor: c.color, animation: `confettiFall 2.5s ease-out ${c.delay}s forwards` }} />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">

        {/* ===== HEADER ===== */}
        <header className="flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌸</span>
            <span className="text-lg font-bold text-white drop-shadow-lg">BloomLab</span>
          </div>

          {/* Top Right HUD */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm border border-[#e8b4b4]/30 rounded-full px-3 py-1.5 shadow-lg">
              <Heart className="w-3.5 h-3.5 text-[#e88484] fill-[#e88484]" />
              <span className="text-xs font-bold text-[#8b4a4a]">{hearts}</span>
            </div>
            <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm border border-[#d4c4a8]/30 rounded-full px-3 py-1.5 shadow-lg">
              <Clock className="w-3.5 h-3.5 text-[#a09080]" />
              <span className="text-xs font-bold text-[#6b5a4a] font-mono">{formatTime(timeOnPage)}</span>
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-[#c9a86c] overflow-hidden bg-[#f0e6d3] shadow-lg">
              <img src="/elsa-searching.png" alt="" className="w-full h-full object-cover object-top scale-125" />
            </div>
          </div>
        </header>

        {/* ===== MAIN CONTENT ===== */}
        <main className="flex-1 flex items-center justify-center px-6 py-4">
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 lg:gap-16 w-full max-w-6xl">

            {/* ─── LEFT COLUMN - 404 Text and Description ─── */}
            <div className="flex flex-col items-start gap-6 lg:-mt-8 lg:ml-4 max-w-md w-full">
              {/* 404 Title */}
              <div>
                <h1 className="text-[120px] sm:text-[150px] font-black leading-none tracking-tighter"
                  style={{
                    fontFamily: "Georgia, serif",
                    background: "linear-gradient(to bottom, #f0e0ff 0%, #e0c8f0 30%, #d0b0e8 60%, #c0a0e0 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    filter: "drop-shadow(0 4px 0 #8b6fa8) drop-shadow(0 8px 8px rgba(0,0,0,0.3))",
                  }}
                >404</h1>
              </div>

              {/* Subtitle */}
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
                  Oops! This page wandered off
                </p>
                <p className="text-xl font-bold text-[#e0d0f0] drop-shadow-lg mt-1">
                  into Bloom Forest <span className="text-2xl">🌸</span>
                </p>
                <p className="text-sm text-white/90 drop-shadow-lg mt-2 max-w-sm">
                  The page you&apos;re looking for might have been moved, deleted, or is hiding somewhere in our world.
                </p>
              </div>
            </div>

            {/* ─── CENTER COLUMN - Mini Quest Game ─── */}
            <div className="flex flex-col items-center gap-4 w-full max-w-md">
              <div className="w-full bg-white/90 backdrop-blur-md rounded-2xl border border-white/50 shadow-[0_8px_32px_rgba(139,105,70,0.2)] p-5">
                <p className="text-sm font-semibold text-[#8b6fa8] mb-3">Let&apos;s find it together!</p>

                {/* Mini Quest Game */}
                <div className="bg-[#faf6ff]/80 rounded-xl p-4 mb-4 border border-[#e8e0f0]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5 text-[#8b6fa8]" />
                      <span className="text-xs font-bold text-[#5c4a3a]">Mini Quest</span>
                    </div>
                    {gameState === "playing" && (
                      <span className="text-[10px] text-[#a09080]">{foundSpots}/9 searched</span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#7a6a5a] mb-3">
                    Help me find the lost page! Click spots to search. Find it before you run out of hearts!
                  </p>

                  {/* Game Grid */}
                  <div className="grid grid-cols-3 gap-2 mb-3 max-w-[240px] mx-auto">
                    {!mounted && (
                      <div className="col-span-3 aspect-[3/1] flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-[#d4c4a8] border-t-[#8b6fa8] rounded-full animate-spin" />
                      </div>
                    )}
                    {mounted && board.map((spot, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSpotClick(idx)}
                        disabled={gameState !== "playing" || spot.revealed}
                        className={`
                          relative aspect-square rounded-lg border-2 transition-all duration-200 flex items-center justify-center text-2xl
                          ${spot.revealed
                            ? spot.content === "page"
                              ? "bg-[#e6c86e]/50 border-[#e6c86e] scale-105"
                              : spot.content === "clue"
                              ? "bg-[#c4a8e0]/50 border-[#c4a8e0]"
                              : "bg-[#e8ddd0]/50 border-[#d4c4a8]/50"
                            : gameState === "lost"
                            ? "bg-[#e8ddd0]/30 border-[#d4c4a8]/30 cursor-default"
                            : "bg-white/80 border-[#d4c4a8]/30 hover:bg-[#f0e6ff] hover:border-[#c4a8e0] hover:scale-105 active:scale-95 cursor-pointer"
                          }
                        `}
                      >
                        {spot.revealed ? (
                          <span className="drop-shadow-sm">{getEmoji(spot.content)}</span>
                        ) : gameState === "lost" ? (
                          <span className="opacity-30">❓</span>
                        ) : (
                          <Leaf className="w-4 h-4 text-[#a09080]/30" />
                        )}
                        {gameState === "lost" && spot.content === "page" && (
                          <div className="absolute inset-0 rounded-lg bg-[#e6c86e]/20 animate-pulse" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Status */}
                  <div className="text-center">
                    {gameState === "playing" && (
                      <p className="text-[10px] text-[#8b6fa8] font-medium">
                        {hearts === 3 ? "3 tries remaining — choose wisely!" : `${hearts} ${hearts === 1 ? "try" : "tries"} remaining`}
                      </p>
                    )}
                    {gameState === "won" && !rewardClaimed && (
                      <p className="text-[10px] text-[#5a965a] font-bold">You found the page! Claim your reward! 🎉</p>
                    )}
                    {gameState === "won" && rewardClaimed && (
                      <p className="text-[10px] text-[#5a965a] font-bold">Quest complete! +50 XP earned!</p>
                    )}
                    {gameState === "lost" && (
                      <div className="flex items-center justify-center gap-2">
                        <p className="text-[10px] text-[#c45c5c] font-bold">Out of hearts!</p>
                        <button onClick={handleRetry} className="flex items-center gap-1 px-2 py-1 bg-[#f5ecd6] hover:bg-[#e8ddd0] border border-[#d4c4a8] rounded-md text-[10px] font-bold text-[#5c4a3a] transition-all hover:scale-105">
                          <RotateCcw className="w-3 h-3" /> Try Again
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Popular Places */}
                <div className="border-t border-[#e8e0f0] pt-4">
                  <p className="text-xs font-semibold text-[#5c4a3a] mb-1">Navigate to:</p>
                  <p className="text-xs font-semibold text-[#5c4a3a] mb-3">Popular Places to Explore</p>
                  <div className="flex items-center justify-between gap-2">
                    <Link href="/garden" className="flex flex-col items-center gap-1 p-2 rounded-xl transition-colors group">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e8ddd0] to-[#f5ecd6] flex items-center justify-center border border-[#d4c4a8]/30 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-[#d4c4a8] group-hover:to-[#e8ddd0] transition-all">
                        <Home className="w-5 h-5 text-[#b89a7a]" />
                      </div>
                      <span className="text-[10px] font-medium text-[#6b5a4a]">Home</span>
                    </Link>
                    <Link href="/learn" className="flex flex-col items-center gap-1 p-2 rounded-xl transition-colors group">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ffe4b5] to-[#fff0d4] flex items-center justify-center border border-[#e8d4a8]/30 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-[#e8d4a8] group-hover:to-[#ffe4b5] transition-all">
                        <BookOpen className="w-5 h-5 text-[#d4a030]" />
                      </div>
                      <span className="text-[10px] font-medium text-[#6b5a4a]">Learn</span>
                    </Link>
                    <Link href="/archive" className="flex flex-col items-center gap-1 p-2 rounded-xl transition-colors group">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c1e1c1] to-[#d8f0d8] flex items-center justify-center border border-[#a8d4a8]/30 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-[#a8d4a8] group-hover:to-[#c1e1c1] transition-all">
                        <Code className="w-5 h-5 text-[#5a965a]" />
                      </div>
                      <span className="text-[10px] font-medium text-[#6b5a4a]">Projects</span>
                    </Link>
                    <Link href="/path" className="flex flex-col items-center gap-1 p-2 rounded-xl transition-colors group">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d8c8e8] to-[#e8ddf5] flex items-center justify-center border border-[#c4a8e0]/30 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-[#c4a8e0] group-hover:to-[#d8c8e8] transition-all">
                        <TrendingUp className="w-5 h-5 text-[#8b6fa8]" />
                      </div>
                      <span className="text-[10px] font-medium text-[#6b5a4a]">Skill Map</span>
                    </Link>
                    <Link href="/dashboard" className="flex flex-col items-center gap-1 p-2 rounded-xl transition-colors group">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ffcce0] to-[#ffe0ec] flex items-center justify-center border border-[#ffb3d1]/30 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-[#ffb3d1] group-hover:to-[#ffcce0] transition-all">
                        <LayoutDashboard className="w-5 h-5 text-[#d080a0]" />
                      </div>
                      <span className="text-[10px] font-medium text-[#6b5a4a]">Dashboard</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── RIGHT COLUMN ─── */}
            <div className="flex flex-col items-center gap-4 lg:pt-8">
              {/* Speech Bubble */}
              <div key={elsaState + gameState} className="relative bg-white/95 backdrop-blur-sm border border-[#e8ddd0] rounded-2xl rounded-bl-sm px-4 py-3 shadow-lg max-w-[200px]" style={{ animation: "bubblePop 0.3s ease" }}>
                <p className="text-xs text-[#5c4a3a] leading-snug font-medium text-center">{SPEECH[elsaState]}</p>
                <div className="absolute -bottom-1.5 left-4 w-3 h-3 bg-white border-b border-r border-[#e8ddd0] rotate-45" />
              </div>

              {/* Signpost */}
              <div className="relative w-36 -mb-2 z-10">
                <img src="/wooden-sign.png" alt="" className="w-full h-auto object-contain drop-shadow-lg" />
              </div>

              {/* Elsa */}
              <div className="relative w-[220px] h-[300px] sm:w-[260px] sm:h-[360px]" style={{ animation: "elsaFloat 3.5s ease-in-out infinite" }}>
                <img src={getElsaImage()} alt="Elsa" className="w-full h-full object-contain drop-shadow-xl transition-all duration-500" />
                {(elsaState === "found" || elsaState === "happy") && (
                  <div className="absolute inset-0 rounded-full bg-yellow-200/15 blur-2xl animate-pulse" />
                )}
              </div>
            </div>
          </div>
        </main>

        
      </div>

      {/* Reward Popup */}
      {showReward && !rewardClaimed && (
        <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/15 backdrop-blur-sm" onClick={() => setShowReward(false)} />
          <div className="relative bg-gradient-to-b from-[#fff8ee] to-[#faf0d8] border-2 border-[#e6c86e] rounded-2xl p-5 shadow-xl max-w-[260px] w-full" style={{ animation: "popIn 0.4s ease" }}>
            <div className="flex flex-col items-center text-center">
              <div className="mb-3 relative">
                <div className="absolute inset-0 bg-yellow-300/20 blur-lg rounded-full animate-pulse" />
                <img src="/reward-star.png" alt="" className="w-14 h-14 object-contain relative" style={{ animation: "gentleSpin 3s ease-in-out infinite" }} />
              </div>
              <h3 className="text-base font-bold text-[#5c4a3a] mb-0.5">Quest Complete!</h3>
              <p className="text-[11px] text-[#8b7d6b] mb-3">You found the hidden page!</p>
              <h4 className="text-base font-bold mb-0.5"
                style={{
                  background: "linear-gradient(to bottom, #d4b8e8 0%, #c4a8e0 30%, #b098d0 60%, #9a80c0 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >Navigate to one of the popular pages</h4>
              <p>🌸</p>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex flex-col items-center bg-[#f5ecd6] rounded-lg px-3 py-1.5 border border-[#e0d4c0]">
                  <Star className="w-4 h-4 text-[#e6c86e] fill-[#e6c86e] mb-0.5" />
                  <span className="text-[10px] font-bold text-[#5c4a3a]">+50 XP</span>
                </div>
                <div className="flex flex-col items-center bg-[#f5ecd6] rounded-lg px-3 py-1.5 border border-[#e0d4c0]">
                  <MapPin className="w-4 h-4 text-[#8b6fa8] mb-0.5" />
                  <span className="text-[10px] font-bold text-[#5c4a3a]">Pathfinder</span>
                </div>
              </div>
              <button onClick={handleClaimReward} className="w-full py-2 bg-gradient-to-r from-[#e6c86e] to-[#f0d880] hover:from-[#d4b85c] hover:to-[#e0c870] text-[#5c4a2a] font-bold rounded-lg shadow-md transition-all hover:scale-[1.02] text-sm border border-[#c9a85a]/50">
                <span className="flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Claim Reward
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Over Popup */}
      {gameState === "lost" && (
        <div className="fixed inset-0 z-40 flex items-center justify-center px-4 pointer-events-none">
          <div className="relative bg-[#fff8ee]/95 backdrop-blur-sm border-2 border-[#e8b4b4] rounded-2xl p-4 shadow-xl max-w-[220px] w-full pointer-events-auto" style={{ animation: "popIn 0.4s ease" }}>
            <div className="flex flex-col items-center text-center">
              <p className="text-sm font-bold text-[#8b4a4a] mb-1">Out of Hearts!</p>
              <p className="text-[11px] text-[#a09080] mb-3">The page was hiding in the forest. Want to try again?</p>
              <button onClick={handleRetry} className="w-full py-2 bg-[#f5ecd6] hover:bg-[#e8ddd0] border border-[#d4c4a8] text-[#5c4a3a] font-bold rounded-lg shadow-sm transition-all hover:scale-[1.02] text-sm flex items-center justify-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5" /> Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes elsaFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes bubblePop { 0%{transform:scale(0.8) translateY(5px);opacity:0} 100%{transform:scale(1) translateY(0);opacity:1} }
        @keyframes popIn { 0%{transform:scale(0.9) translateY(20px);opacity:0} 100%{transform:scale(1) translateY(0);opacity:1} }
        @keyframes gentleSpin { 0%,100%{transform:rotate(-3deg)} 50%{transform:rotate(3deg)} }
        @keyframes fadeIn { 0%{opacity:0} 100%{opacity:1} }
        @keyframes confettiFall { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(100vh) rotate(720deg);opacity:0} }
      `}</style>
    </div>
  )
}