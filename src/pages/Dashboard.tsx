import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { getUserEntries, DiaryEntry } from '../services/entryService';
import { 
  PlusCircle, 
  Calendar as CalendarIcon, 
  History, 
  ChevronRight, 
  Heart,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [recentEntries, setRecentEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      if (user) {
        try {
          const entries = await getUserEntries(user.uid);
          setRecentEntries(entries.slice(0, 3));
        } catch (error) {
          console.error('Error fetching recent entries:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchEntries();
  }, [user]);

  const welcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      <header>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="serif text-5xl font-light mb-2 tracking-tight">
            {welcomeMessage()}, {user?.email?.split('@')[0]}
          </h1>
          <p className="text-[#5A5A40] font-medium tracking-widest uppercase text-xs">
            How is your soul today?
          </p>
        </motion.div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ActionCard 
          to="/write"
          icon={<PlusCircle className="w-8 h-8" />}
          title="New Entry"
          description="Reflect on your day and discover deep emotional insights."
          color="bg-[#5A5A40]"
        />
        <ActionCard 
          to="/calendar"
          icon={<CalendarIcon className="w-8 h-8" />}
          title="Calendar View"
          description="See your emotional journey mapped out across the month."
          color="bg-[#7A7A60]"
        />
        <ActionCard 
          to="/analysis"
          icon={<Sparkles className="w-8 h-8" />}
          title="Monthly Analysis"
          description="Understand your patterns and growth over time."
          color="bg-[#8A8A70]"
        />
      </section>

      <section>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="serif text-3xl font-light">Recent Reflections</h2>
            <p className="text-gray-400 text-xs uppercase tracking-widest mt-1">Your latest journey steps</p>
          </div>
          <Link to="/history" className="text-[#5A5A40] text-sm font-medium flex items-center gap-1 hover:underline">
            View All History <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="h-48 bg-white rounded-[32px] animate-pulse shadow-sm" />)}
          </div>
        ) : recentEntries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentEntries.map((entry, idx) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-[32px] shadow-xl shadow-black/5 border border-black/5 flex flex-col justify-between"
              >
                <div>
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                            {new Date(entry.createdAt.toDate()).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                        <div className="flex gap-1">
                            {entry.analysis.detectedEmotions.slice(0, 2).map((e, i) => (
                                <span key={i} className="px-2 py-0.5 bg-[#f9f9f7] text-[10px] rounded-full text-[#5A5A40] border border-black/5">
                                    {e.emotion}
                                </span>
                            ))}
                        </div>
                    </div>
                    <p className="text-gray-600 line-clamp-3 italic serif italic leading-relaxed">
                        "{entry.entryText}"
                    </p>
                </div>
                <div className="mt-6 pt-4 border-t border-black/5 flex justify-between items-center text-xs text-gray-400 uppercase tracking-widest">
                    <span>Mood: {entry.analysis.moodScore}</span>
                    <Heart className="w-3 h-3 text-red-300" />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-[32px] text-center border border-dashed border-gray-200">
            <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 serif italic text-lg">No entries yet. Start your journey today.</p>
            <Link to="/write" className="inline-block mt-4 text-[#5A5A40] font-medium hover:underline">
              Write your first entry
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

interface ActionCardProps {
  to: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const ActionCard: React.FC<ActionCardProps> = ({ to, icon, title, description, color }) => (
  <Link to={to} className="group">
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white p-8 rounded-[32px] shadow-xl shadow-black/5 border border-black/5 h-full transition-shadow hover:shadow-black/10"
    >
      <div className={`p-4 ${color} rounded-2xl w-fit text-white mb-6 shadow-lg shadow-black/5 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="serif text-2xl font-medium mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </motion.div>
  </Link>
);

export default Dashboard;
