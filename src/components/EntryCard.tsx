import React from 'react';
import { Heart, Sparkles, ChevronRight, MessageCircle } from 'lucide-react';
import { DiaryEntry } from '../services/entryService';
import { motion } from 'framer-motion';

interface EntryCardProps {
  entry: DiaryEntry;
  onClick?: () => void;
}

const EntryCard: React.FC<EntryCardProps> = ({ entry, onClick }) => {
  const formattedDate = new Date(entry.createdAt.toDate()).toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      className="bg-white p-8 rounded-[32px] shadow-xl shadow-black/5 border border-black/5 hover:shadow-black/10 transition-all cursor-pointer group"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest block mb-1">
            {formattedDate}
          </span>
          <h3 className="serif text-xl font-medium text-[#5A5A40]">
            Emotional Reflection
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {entry.analysis.detectedEmotions.slice(0, 3).map((e, i) => (
              <div 
                key={i} 
                className="w-8 h-8 rounded-full bg-[#f9f9f7] border border-black/5 flex items-center justify-center text-[10px] text-[#5A5A40] shadow-sm font-bold"
                title={`${e.emotion} (${(e.confidence * 100).toFixed(0)}%)`}
              >
                {e.emotion.substring(0, 2)}
              </div>
            ))}
          </div>
          <div className="h-8 w-px bg-black/5 mx-2" />
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-400 uppercase tracking-tighter">Mood Score</span>
            <span className="serif text-xl font-light text-[#5A5A40]">{entry.analysis.moodScore}</span>
          </div>
        </div>
      </div>

      <div className="relative mb-6">
        <p className="text-gray-600 line-clamp-2 italic serif text-lg leading-relaxed pl-6 border-l-2 border-[#5A5A40]/10">
          "{entry.entryText}"
        </p>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="uppercase tracking-widest font-medium">{entry.analysis.overallSentiment.sentiment}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="uppercase tracking-widest font-medium">{entry.analysis.keyEmotionalTriggers.length} Triggers</span>
          </div>
        </div>
        <div className="group-hover:translate-x-1 transition-transform text-[#5A5A40] flex items-center gap-1 font-bold">
          Full Report <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </motion.div>
  );
};

export default EntryCard;
