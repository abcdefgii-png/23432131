import React, { useState, useEffect } from 'react';
import { AppStep, MoodType, CardContent, ToneType, HistoryItem } from './types';
import { MOODS, CARDS } from './constants';
import NoiseOverlay from './components/NoiseOverlay';
import CardRing from './components/CardRing';
import CardBack from './components/CardBack';

// Icons
const BookOpenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
);
const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);
const ShareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
);


export default function App() {
  const [step, setStep] = useState<AppStep>('mood');
  const [mood, setMood] = useState<MoodType | null>(null);
  const [ventText, setVentText] = useState('');
  const [selectedCard, setSelectedCard] = useState<CardContent | null>(null);
  const [tone, setTone] = useState<ToneType>('gentle');
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load History
  useEffect(() => {
    const saved = localStorage.getItem('oracle_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  // Save to history when a card is revealed
  const saveToHistory = (card: CardContent) => {
    if (!mood) return;
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      cardId: card.id,
      mood: mood,
      tone: 'gentle',
      userNote: ventText
    };
    const newHistory = [newItem, ...history];
    setHistory(newHistory);
    localStorage.setItem('oracle_history', JSON.stringify(newHistory));
  };

  const handleMoodSelect = (m: MoodType) => {
    setMood(m);
    setTimeout(() => setStep('vent'), 400);
  };

  const handleVentSubmit = () => {
    setStep('select');
  };

  const handleCardSelect = (index: number) => {
    // Randomly pick a card from the constant pool to simulate "Fate"
    // In a real app, this might be influenced by the mood
    const randomIndex = Math.floor(Math.random() * CARDS.length);
    const card = CARDS[randomIndex];
    setSelectedCard(card);
    setStep('reveal');
    saveToHistory(card);
  };

  const reset = () => {
    setStep('mood');
    setMood(null);
    setVentText('');
    setSelectedCard(null);
    setTone('gentle');
  };

  return (
    <div className="relative w-full h-screen bg-[#050505] text-[#cfcfcf] overflow-hidden flex flex-col font-serif">
      <NoiseOverlay />

      {/* Header */}
      <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-40 pointer-events-none">
        <div className="opacity-50 text-xs tracking-[0.3em] uppercase">The Quiet Oracle</div>
        <button 
          onClick={() => setShowHistory(true)}
          className="pointer-events-auto p-2 opacity-60 hover:opacity-100 transition-opacity"
        >
          <BookOpenIcon />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 w-full max-w-lg mx-auto px-6">
        
        {/* Step 1: Mood */}
        {step === 'mood' && (
          <div className="w-full animate-fadeIn flex flex-col items-center space-y-12">
            <h2 className="text-sm tracking-widest text-[#8a8a8a] mb-4">你现在的状态，更接近哪一种？</h2>
            <div className="grid grid-cols-2 gap-4 w-full">
              {MOODS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleMoodSelect(m.id)}
                  className={`
                    py-4 px-6 border border-[#2a2a2a] text-[#8a8a8a] hover:text-[#e0e0e0] hover:border-[#5a5a5a] 
                    transition-all duration-500 rounded-sm text-sm tracking-widest
                    ${mood === m.id ? 'bg-[#1a1a1a] border-[#8a7f6b] text-[#e0e0e0] shadow-[0_0_15px_rgba(138,127,107,0.2)]' : ''}
                  `}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Vent */}
        {step === 'vent' && (
          <div className="w-full animate-fadeIn flex flex-col items-center">
            <p className="text-[#e0e0e0] tracking-widest mb-2 text-center">如果你愿意，可以写下一点今天的事。</p>
            <p className="text-[#555] text-xs mb-10 text-center">几个词也可以，不用完整。</p>
            
            <textarea
              className="w-full h-40 bg-transparent border-none outline-none resize-none text-center text-[#e0e0e0] placeholder-[#333] text-lg leading-relaxed focus:ring-0"
              placeholder="今天发生了什么……"
              value={ventText}
              onChange={(e) => setVentText(e.target.value)}
              spellCheck={false}
            />

            <button
              onClick={handleVentSubmit}
              className="mt-12 py-3 px-10 border-b border-[#333] text-[#8a8a8a] hover:text-[#e0e0e0] hover:border-[#8a7f6b] transition-all duration-500 tracking-[0.2em] text-sm"
            >
              进入牌室
            </button>
          </div>
        )}

        {/* Step 3: Selection */}
        {step === 'select' && (
          <div className="w-full h-full flex flex-col justify-center animate-fadeIn">
             <CardRing onSelect={handleCardSelect} />
          </div>
        )}

        {/* Step 4: Reveal */}
        {step === 'reveal' && selectedCard && (
            <div className="w-full h-full absolute inset-0 bg-[#050505] z-50 flex flex-col items-center justify-center animate-slowReveal">
                {/* Card Container */}
                <div className="relative w-full max-w-md p-8 min-h-[70vh] flex flex-col items-center text-center">
                    
                    {/* Top decoration */}
                    <div className="w-px h-12 bg-gradient-to-b from-transparent to-[#8a7f6b]/50 mb-8"></div>

                    {/* Empathy Phase */}
                    <div className="mb-12 opacity-80 transition-opacity duration-1000 delay-300">
                        <p className="text-[#a0a0a0] text-sm tracking-widest leading-loose">
                            {selectedCard.empathy}
                        </p>
                    </div>

                    {/* Core Response */}
                    <div className="mb-16 relative">
                         {/* Subtle glowing backdrop for text */}
                        <div className="absolute inset-0 bg-[#8a7f6b]/5 blur-3xl rounded-full"></div>
                        <h1 className="relative text-xl md:text-2xl text-[#f0f0f0] font-light leading-relaxed tracking-widest transition-all duration-500">
                            {selectedCard.response[tone]}
                        </h1>
                    </div>

                    {/* Micro Action */}
                    <div className="mb-12">
                        <div className="w-4 h-px bg-[#333] mx-auto mb-6"></div>
                        <p className="text-[#8a8a8a] text-xs tracking-wider">
                            {selectedCard.action[tone]}
                        </p>
                    </div>

                    {/* Tag */}
                    <div className="mt-auto mb-8">
                        <span className="text-[10px] text-[#444] border border-[#222] px-2 py-1 rounded-full tracking-widest">
                            {selectedCard.tag}
                        </span>
                    </div>

                </div>

                {/* Footer Controls */}
                <div className="fixed bottom-10 left-0 w-full flex flex-col items-center gap-6 z-50">
                    {/* Tone Switcher */}
                    <div className="flex gap-6 text-xs tracking-widest text-[#555]">
                        {(['gentle', 'sober', 'light'] as ToneType[]).map((t) => (
                            <button
                                key={t}
                                onClick={() => setTone(t)}
                                className={`transition-colors duration-300 ${tone === t ? 'text-[#c0bba8]' : 'hover:text-[#888]'}`}
                            >
                                {t === 'gentle' ? '温柔' : t === 'sober' ? '清醒' : '轻松'}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-4">
                        <button onClick={reset} className="text-[#444] hover:text-[#8a8a8a] text-xs tracking-widest transition-colors py-2 px-4">
                            再次进入
                        </button>
                    </div>
                </div>
            </div>
        )}

      </main>

      {/* History Drawer */}
      {showHistory && (
          <div className="absolute inset-0 z-[60] flex justify-end">
              <div 
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={() => setShowHistory(false)}
              ></div>
              <div className="relative w-full max-w-sm h-full bg-[#0c0c0c] border-l border-[#222] p-6 overflow-y-auto no-scrollbar shadow-2xl transform transition-transform duration-300">
                  <div className="flex justify-between items-center mb-10">
                      <h3 className="text-[#8a7f6b] text-xs tracking-[0.2em] uppercase">我的卡册</h3>
                      <button onClick={() => setShowHistory(false)} className="text-[#666] hover:text-white">
                        <XIcon />
                      </button>
                  </div>
                  
                  <div className="space-y-6">
                      {history.length === 0 ? (
                          <div className="text-[#444] text-xs text-center mt-20">暂无记录</div>
                      ) : (
                          history.map((item) => {
                              const card = CARDS.find(c => c.id === item.cardId);
                              if (!card) return null;
                              return (
                                  <div key={item.id} className="border border-[#222] p-4 rounded-sm hover:border-[#333] transition-colors">
                                      <div className="flex justify-between items-center mb-3">
                                          <span className="text-[10px] text-[#555]">{new Date(item.timestamp).toLocaleDateString()}</span>
                                          <span className="text-[10px] text-[#8a7f6b] border border-[#8a7f6b]/20 px-1.5 py-0.5 rounded-full">
                                            {MOODS.find(m => m.id === item.mood)?.label}
                                          </span>
                                      </div>
                                      <div className="text-sm text-[#ccc] mb-2 font-light">{card.response.gentle}</div>
                                      <div className="text-[10px] text-[#555]">{card.tag}</div>
                                  </div>
                              )
                          })
                      )}
                  </div>
              </div>
          </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
            animation: fadeIn 1s ease-out forwards;
        }
        @keyframes slowReveal {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .animate-slowReveal {
            animation: slowReveal 1.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}