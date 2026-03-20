import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Sparkles, 
  BookOpen, 
  Send, 
  Loader2, 
  AlertCircle,
  RefreshCw,
  Quote,
  Save,
  CheckCircle2
} from 'lucide-react';
import { analyzeDiaryEntryWithNLP, AnalysisResult } from '../services/nlpEngine';
import { saveEntry } from '../services/entryService';
import { useAuth } from '../services/AuthContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const WriteEntry: React.FC = () => {
  const { user } = useAuth();
  const [entry, setEntry] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleAnalyze = async () => {
    if (!entry.trim()) return;
    
    setIsAnalyzing(true);
    setError(null);
    setSaveSuccess(false);
    try {
      const analysis = await analyzeDiaryEntryWithNLP(entry);
      setResult(analysis);
      
      // Automatically save after successful analysis
      if (user) {
        setIsSaving(true);
        await saveEntry({
          userId: user.uid,
          date: new Date().toISOString().split('T')[0],
          entryText: entry,
          analysis: analysis
        });
        setSaveSuccess(true);
        setIsSaving(false);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'I encountered an issue while reflecting on your entry. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!result || !user) return;
    
    setIsSaving(true);
    setError(null);
    try {
      await saveEntry({
        userId: user.uid,
        date: new Date().toISOString().split('T')[0],
        entryText: entry,
        analysis: result
      });
      setSaveSuccess(true);
      // Optional: Redirect to history or dashboard after some delay
    } catch (err: any) {
      console.error(err);
      setError('Failed to save your entry. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const reset = () => {
    setEntry('');
    setResult(null);
    setError(null);
    setSaveSuccess(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div
            key="input"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-white rounded-[32px] shadow-xl shadow-black/5 p-8 border border-black/5"
          >
            <div className="flex items-center gap-2 mb-6 text-[#5A5A40]">
              <BookOpen className="w-5 h-5" />
              <h2 className="serif text-2xl font-medium">Dear Diary...</h2>
            </div>
            
            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="How are you feeling today? Share your thoughts, events, or anything on your mind..."
              className="w-full h-64 p-6 rounded-2xl bg-[#f9f9f7] border-none focus:ring-2 focus:ring-[#5A5A40]/20 resize-none text-lg leading-relaxed placeholder:text-gray-400 serif"
            />

            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-400 italic">
                Your words are safe here. We use AI to help you understand your journey.
              </p>
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !entry.trim()}
                className={cn(
                  "flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
                  "bg-[#5A5A40] hover:bg-[#4a4a34] text-white rounded-full px-8 py-4 font-medium shadow-lg shadow-[#5A5A40]/20"
                )}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Reflecting...
                  </>
                ) : (
                  <>
                    Analyze Entry
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 text-sm"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-[32px] shadow-xl shadow-black/5 overflow-hidden border border-black/5">
              <div className="bg-[#5A5A40] p-8 text-white flex justify-between items-center">
                <div>
                  <h2 className="serif text-3xl font-light">Diary Analysis Report</h2>
                  <p className="text-white/60 text-xs uppercase tracking-widest mt-1">Insights generated by AI</p>
                </div>
                <div className="flex gap-2">
                    <button 
                      onClick={reset}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors"
                      title="New Entry"
                    >
                      <RefreshCw className="w-6 h-6" />
                    </button>
                  </div>
              </div>

              <div className="p-8 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <section>
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                      <Heart className="w-3 h-3" /> Detected Emotions
                    </h3>
                    <div className="space-y-4">
                      {result.detectedEmotions.map((item, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-sm font-medium">
                            <span>{item.emotion}</span>
                            <span className="text-gray-400">{(item.confidence * 100).toFixed(0)}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${item.confidence * 100}%` }}
                              transition={{ duration: 1, delay: 0.2 + idx * 0.1 }}
                              className="h-full bg-[#5A5A40]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                      <Sparkles className="w-3 h-3" /> Mood & Sentiment
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-[#f9f9f7] rounded-2xl border border-black/5 flex flex-col items-center justify-center text-center">
                        <span className="serif text-3xl font-light text-[#5A5A40] mb-1">{result.overallSentiment.sentiment}</span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-tighter">Sentiment</span>
                      </div>
                      <div className="p-4 bg-[#f9f9f7] rounded-2xl border border-black/5 flex flex-col items-center justify-center text-center">
                        <span className="serif text-3xl font-light text-[#5A5A40] mb-1">{result.moodScore}</span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-tighter">Mood Score</span>
                      </div>
                    </div>
                  </section>
                </div>

                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Key Emotional Triggers</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.keyEmotionalTriggers.map((trigger, idx) => (
                      <span 
                        key={idx}
                        className="px-4 py-2 bg-gray-50 text-gray-600 rounded-full text-sm border border-gray-100 italic"
                      >
                        "{trigger}"
                      </span>
                    ))}
                  </div>
                </section>

                <section className="space-y-6">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Emotional Understanding</h3>
                    <p className="text-gray-700 leading-relaxed">{result.emotionalUnderstanding}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Context & Reasoning</h3>
                    <p className="text-gray-600 leading-relaxed italic">{result.explanationOfContext}</p>
                  </div>

                  <div className="relative pt-4">
                    <Quote className="absolute -top-1 -left-4 w-12 h-12 text-[#5A5A40]/5" />
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Empathetic Reflection</h3>
                    <p className="serif text-xl leading-relaxed text-[#5A5A40] italic">
                      {result.empatheticReflection}
                    </p>
                  </div>
                </section>

                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Supportive Guidance</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {result.supportiveSuggestions.map((advice, idx) => (
                      <div key={idx} className="flex gap-3 p-4 bg-[#f9f9f7] rounded-xl border border-black/5">
                        <div className="w-6 h-6 rounded-full bg-[#5A5A40]/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-[10px] font-bold text-[#5A5A40]">{idx + 1}</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-snug">{advice}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="bg-[#f9f9f7] p-8 border-t border-black/5 text-center">
                <p className="serif text-lg text-[#5A5A40] italic">
                  "{result.encouragingClosing}"
                </p>
              </div>
            </div>

            <div className="flex justify-center flex-col items-center gap-6 mt-8">
                 {saveSuccess && (
                     <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center gap-4"
                     >
                        <div className="p-4 bg-green-50 text-green-700 rounded-2xl border border-green-100 flex items-center gap-2">
                           <CheckCircle2 className="w-5 h-5" />
                           <span className="font-medium">Reflection saved to your soul's history.</span>
                        </div>
                        <div className="flex gap-4">
                           <Link 
                             to="/" 
                             className="px-6 py-2 bg-[#5A5A40] text-white rounded-full text-sm font-medium hover:bg-[#4a4a34] transition-colors"
                           >
                             Go to Dashboard
                           </Link>
                           <button
                             onClick={reset}
                             className="px-6 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                           >
                             Write Another
                           </button>
                        </div>
                     </motion.div>
                 )}
                 {!saveSuccess && !isSaving && (
                    <button
                      onClick={reset}
                      className="flex items-center gap-2 text-gray-400 hover:text-[#5A5A40] transition-colors text-sm font-medium uppercase tracking-widest"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Discard and Write Another
                    </button>
                 )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WriteEntry;
