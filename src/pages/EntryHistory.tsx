import React, { useEffect, useState } from 'react';
import { useAuth } from '../services/AuthContext';
import { getUserEntries, DiaryEntry } from '../services/entryService';
import EntryCard from '../components/EntryCard';
import { History, Search, Filter, Loader2, BookOpen, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EntryHistory: React.FC = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);

  useEffect(() => {
    const fetchEntries = async () => {
      if (user) {
        try {
          const fetched = await getUserEntries(user.uid);
          setEntries(fetched);
          setFilteredEntries(fetched);
        } catch (error) {
          console.error('Error fetching entries:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchEntries();
  }, [user]);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setFilteredEntries(
      entries.filter(e => 
        e.entryText.toLowerCase().includes(term) || 
        e.analysis.detectedEmotions.some(em => em.emotion.toLowerCase().includes(term))
      )
    );
  }, [searchTerm, entries]);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="serif text-5xl font-light mb-2 tracking-tight">Entry History</h1>
          <p className="text-[#5A5A40] font-medium tracking-widest uppercase text-xs">
            Reflect on your emotional evolution
          </p>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search entries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-full bg-white border border-black/5 focus:ring-2 focus:ring-[#5A5A40]/10 text-sm shadow-sm"
          />
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#5A5A40]" />
          <p className="text-gray-400 serif italic">Recalling your reflections...</p>
        </div>
      ) : filteredEntries.length > 0 ? (
        <div className="space-y-6">
          {filteredEntries.map((entry, idx) => (
            <EntryCard 
                key={entry.id} 
                entry={entry} 
                onClick={() => setSelectedEntry(entry)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white p-24 rounded-[32px] text-center border border-dashed border-gray-200">
          <History className="w-16 h-16 text-gray-200 mx-auto mb-6" />
          <p className="text-gray-400 serif italic text-xl">No entries found matching your search.</p>
        </div>
      )}

      {/* Detail Overlay */}
      <AnimatePresence>
        {selectedEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSelectedEntry(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white/80 backdrop-blur-md px-8 py-6 border-b border-black/5 flex justify-between items-center z-10">
                 <div>
                    <h2 className="serif text-2xl font-medium text-[#5A5A40]">Memory Record</h2>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                        {new Date(selectedEntry.createdAt.toDate()).toLocaleDateString([], { dateStyle: 'full' })}
                    </p>
                 </div>
                 <button 
                    onClick={() => setSelectedEntry(null)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                 >
                    <X className="w-6 h-6 text-gray-400" />
                 </button>
              </div>

              <div className="p-8 space-y-8">
                 <section>
                    <p className="serif text-2xl leading-relaxed text-gray-700 italic border-l-4 border-[#5A5A40]/10 pl-8">
                        "{selectedEntry.entryText}"
                    </p>
                 </section>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-[#f9f9f7] rounded-3xl border border-black/5">
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest block mb-2">Mood Score</span>
                        <div className="serif text-4xl font-light text-[#5A5A40]">{selectedEntry.analysis.moodScore}</div>
                    </div>
                    <div className="p-6 bg-[#f9f9f7] rounded-3xl border border-black/5">
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest block mb-2">Sentiment</span>
                        <div className="serif text-4xl font-light text-[#5A5A40] capitalize">{selectedEntry.analysis.overallSentiment.sentiment}</div>
                    </div>
                 </div>

                 <section>
                    <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Emotional Breakdown</h4>
                    <div className="space-y-4">
                        {selectedEntry.analysis.detectedEmotions.map((item, idx) => (
                           <div key={idx} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium text-gray-600">{item.emotion}</span>
                                    <span className="text-gray-400">{(item.confidence * 100).toFixed(0)}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-[#5A5A40]"
                                        style={{ width: `${item.confidence * 100}%` }}
                                    />
                                </div>
                           </div>
                        ))}
                    </div>
                 </section>

                 <section>
                    <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Triggers & Insights</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {selectedEntry.analysis.keyEmotionalTriggers.map((t, i) => (
                            <span key={i} className="px-3 py-1.5 bg-gray-50 text-gray-500 text-xs rounded-full border border-gray-100 italic">"{t}"</span>
                        ))}
                    </div>
                    <p className="serif text-lg text-gray-600 leading-relaxed italic">
                        {selectedEntry.analysis.emotionalInsight}
                    </p>
                 </section>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EntryHistory;
