import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { getUserEntries, DiaryEntry } from '../services/entryService';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Activity, 
  Loader2, 
  PieChart as PieChartIcon,
  Heart
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { motion } from 'framer-motion';

const MonthlyAnalysis: React.FC = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      if (user) {
        try {
          const fetched = await getUserEntries(user.uid);
          // Filter for current month using a more robust comparison
          const now = new Date();
          const currentMonth = now.getMonth();
          const currentYear = now.getFullYear();
          
          const currentMonthEntries = fetched.filter(e => {
            const entryDate = e.createdAt.toDate();
            return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
          });
          
          // If no entries for this month, but there are entries in history, 
          // we could show the most recent ones as a placeholder or just stay empty.
          // For now, let's just use what we have.
          setEntries(currentMonthEntries);
        } catch (error) {
          console.error('Error fetching entries for analysis:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchEntries();
  }, [user]);

  // Calculations
  const totalEntries = entries.length;
  
  const calculateStreak = () => {
    if (entries.length === 0) return 0;
    const sortedDates = [...new Set(entries.map(e => e.date))].sort().reverse();
    let streak = 0;
    let today = new Date().toISOString().split('T')[0];
    let yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    if (sortedDates[0] !== today && sortedDates[0] !== yesterday) return 0;
    
    for (let i = 0; i < sortedDates.length; i++) {
        const d1 = new Date(sortedDates[i]);
        const d2 = i + 1 < sortedDates.length ? new Date(sortedDates[i+1]) : null;
        streak++;
        if (d2) {
            const diff = (d1.getTime() - d2.getTime()) / (1000 * 3600 * 24);
            if (diff > 1) break;
        }
    }
    return streak;
  };

  const streak = calculateStreak();

  const sentimentData = () => {
    const counts: Record<string, number> = {};
    entries.forEach(e => {
      const s = e.analysis.overallSentiment.sentiment;
      counts[s] = (counts[s] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const moodTrendData = () => {
    return [...entries].reverse().map(e => ({
      date: new Date(e.createdAt.toDate()).toLocaleDateString([], { day: 'numeric', month: 'short' }),
      score: e.analysis.moodScore
    }));
  };

  const COLORS = ['#5A5A40', '#8A8A70', '#A0A080', '#D1D5DB'];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#5A5A40]" />
        <p className="text-gray-400 serif italic">Analyzing your emotional patterns...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      <header>
        <h1 className="serif text-5xl font-light mb-2 tracking-tight">Monthly Analysis</h1>
        <p className="text-[#5A5A40] font-medium tracking-widest uppercase text-xs">
          Your emotional intelligence report
        </p>
      </header>

      {/* Stats Overview */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Calendar className="w-5 h-5" />} label="Total Entries" value={totalEntries} />
        <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Current Streak" value={`${streak} Days`} />
        <StatCard icon={<Activity className="w-5 h-5" />} label="Avg Mood" value={(entries.reduce((a, b) => a + b.analysis.moodScore, 0) / (entries.length || 1)).toFixed(1)} />
        <StatCard icon={<PieChartIcon className="w-5 h-5" />} label="Sentiment" value={entries.length > 0 ? entries[0].analysis.overallSentiment.sentiment : 'N/A'} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Mood Trend Chart */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-[32px] shadow-xl shadow-black/5 border border-black/5"
        >
          <div className="flex items-center gap-2 mb-8">
            <Heart className="w-5 h-5 text-[#5A5A40]" />
            <h3 className="serif text-2xl font-medium">Mood Progression</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={moodTrendData()}>
                <defs>
                  <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5A5A40" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#5A5A40" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <YAxis hide domain={[0, 10]} />
                <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontFamily: 'serif' }}
                />
                <Area type="monotone" dataKey="score" stroke="#5A5A40" strokeWidth={3} fillOpacity={1} fill="url(#colorMood)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Sentiment Distribution */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-8 rounded-[32px] shadow-xl shadow-black/5 border border-black/5"
        >
          <div className="flex items-center gap-2 mb-8">
            <PieChartIcon className="w-5 h-5 text-[#5A5A40]" />
            <h3 className="serif text-2xl font-medium">Emotional Balance</h3>
          </div>
          <div className="h-64 w-full flex flex-col md:flex-row items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData()}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sentimentData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', fontFamily: 'serif' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 p-4 min-w-[120px]">
                {sentimentData().map((e, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">{e.name}</span>
                    </div>
                ))}
            </div>
          </div>
        </motion.div>
      </div>

      {!loading && entries.length === 0 && (
         <div className="bg-white p-12 rounded-[32px] text-center border border-dashed border-gray-200">
            <p className="text-gray-400 serif italic text-lg">Not enough data for this month yet. Keep writing!</p>
         </div>
      )}
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string | number }> = ({ icon, label, value }) => (
  <div className="bg-white p-6 rounded-[32px] shadow-xl shadow-black/5 border border-black/5">
    <div className="p-2 bg-[#f9f9f7] rounded-xl w-fit text-[#5A5A40] mb-4">
        {icon}
    </div>
    <div className="text-gray-400 text-[10px] uppercase tracking-widest mb-1 font-semibold">{label}</div>
    <div className="serif text-3xl font-light text-[#5A5A40]">{value}</div>
  </div>
);

export default MonthlyAnalysis;
