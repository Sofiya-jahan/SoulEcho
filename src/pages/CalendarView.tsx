import React, { useEffect, useState } from 'react';
import { useAuth } from '../services/AuthContext';
import { getUserEntries, getEntryByDate, DiaryEntry } from '../services/entryService';
import CalendarWidget from '../components/CalendarWidget';
import { Calendar as CalendarIcon, BookOpen, Quote, Sparkles, Heart, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CalendarView: React.FC = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      if (user) {
        try {
          const fetched = await getUserEntries(user.uid);
          setEntries(fetched);
          checkEntryForDate(new Date(), fetched);
        } catch (error) {
          console.error('Error fetching entries:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchEntries();
  }, [user]);

  const checkEntryForDate = (date: Date, allEntries: DiaryEntry[]) => {
    const dateStr = date.toISOString().split('T')[0];
    const entry = allEntries.find(e => e.date === dateStr);
    setSelectedEntry(entry || null);
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    checkEntryForDate(date, entries);
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      <header>
        <h1 className="serif text-5xl font-light mb-2 tracking-tight">Calendar</h1>
        <p className="text-[#5A5A40] font-medium tracking-widest uppercase text-xs">
          Navigate through your emotional timeline
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-7">
          <CalendarWidget 
            entries={entries} 
            onDateChange={handleDateChange} 
            selectedDate={selectedDate} 
          />
        </div>

        <div className="lg:col-span-5">
          <AnimatePresence mode="wait">
            {selectedEntry ? (
              <motion.div
                key={selectedEntry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-[32px] shadow-xl shadow-black/5 border border-black/5 overflow-hidden"
              >
                 <div className="bg-[#5A5A40] p-6 text-white">
                    <span className="text-[10px] uppercase tracking-widest opacity-60">Reflection for</span>
                    <h2 className="serif text-xl font-medium">
                        {selectedDate.toLocaleDateString([], { dateStyle: 'long' })}
                    </h2>
                 </div>
                 
                 <div className="p-8 space-y-6">
                    <div className="relative">
                        <Quote className="absolute -top-2 -left-2 w-8 h-8 text-[#5A5A40]/5" />
                        <p className="serif text-lg text-gray-700 italic leading-relaxed pl-4 border-l-2 border-[#5A5A40]/10">
                            "{selectedEntry.entryText}"
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-[#f9f9f7] rounded-2xl border border-black/5 flex flex-col items-center">
                            <span className="text-[10px] text-gray-400 uppercase tracking-tighter mb-1">Mood</span>
                            <span className="serif text-2xl text-[#5A5A40]">{selectedEntry.analysis.moodScore}</span>
                        </div>
                        <div className="p-4 bg-[#f9f9f7] rounded-2xl border border-black/5 flex flex-col items-center text-center">
                            <span className="text-[10px] text-gray-400 uppercase tracking-tighter mb-1">Sentiment</span>
                            <span className="serif text-lg text-[#5A5A40] capitalize leading-none">{selectedEntry.analysis.overallSentiment.sentiment}</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {selectedEntry.analysis.detectedEmotions.slice(0, 3).map((e, idx) => (
                           <div key={idx} className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 font-medium">{e.emotion}</span>
                                <div className="w-32 h-1 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#5A5A40]" style={{ width: `${e.confidence * 100}%` }} />
                                </div>
                           </div>
                        ))}
                    </div>

                    <p className="text-sm text-gray-500 italic leading-relaxed pt-4 border-t border-black/5">
                        {selectedEntry.analysis.emotionalInsight.substring(0, 100)}...
                    </p>
                 </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/50 rounded-[32px] border border-dashed border-gray-200 p-12 text-center h-full flex flex-col items-center justify-center"
              >
                <BookOpen className="w-12 h-12 text-gray-200 mb-4" />
                <p className="text-gray-400 serif italic">
                  No entry found for {selectedDate.toLocaleDateString([], { dateStyle: 'long' })}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
