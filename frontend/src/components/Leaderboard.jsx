import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useTheme } from '../context/ThemeContext';
import {
  Trophy, Medal, Crown, Star, Flame, Phone, FileText, Target,
  Zap, Award as AwardIcon, RefreshCw, TrendingUp
} from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const badgeIconMap = {
  'file-text': FileText, 'phone': Phone, 'target': Target,
  'crown': Crown, 'award': AwardIcon, 'zap': Zap,
};

const medalEmoji = { gold: '1st', silver: '2nd', bronze: '3rd' };
const medalStyle = {
  gold: 'from-yellow-400 to-amber-500',
  silver: 'from-gray-300 to-gray-400',
  bronze: 'from-orange-400 to-orange-500',
};

const Leaderboard = ({ currentConsultantId = null }) => {
  const { isDark } = useTheme();
  const [data, setData] = useState([]);
  const [period, setPeriod] = useState('all');
  const [loading, setLoading] = useState(false);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/leaderboard?period=${period}`);
      if (res.data.success) setData(res.data.leaderboard);
    } catch (e) {
      console.error('Leaderboard fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeaderboard(); }, [period]);

  return (
    <div className="space-y-4" data-testid="leaderboard-section">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <Trophy className="h-6 w-6 text-yellow-500" /> Consultant Leaderboard
          </h2>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Rankings based on performance score</p>
        </div>
        <div className="flex items-center gap-2">
          {['all', 'monthly', 'weekly'].map(p => (
            <Button
              key={p} size="sm" variant={period === p ? 'default' : 'outline'}
              onClick={() => setPeriod(p)}
              className={`text-xs capitalize ${period === p ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : isDark ? 'border-gray-600' : ''}`}
              data-testid={`period-${p}`}
            >
              {p === 'all' ? 'All Time' : p}
            </Button>
          ))}
          <Button onClick={fetchLeaderboard} size="sm" variant="outline" disabled={loading} className={isDark ? 'border-gray-600' : ''}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-12">
          <Trophy className={`h-12 w-12 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
          <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>No data for this period</p>
        </div>
      ) : (
        <>
          {/* Top 3 Podium */}
          {data.length >= 3 && (
            <div className="grid grid-cols-3 gap-3 mb-4" data-testid="podium">
              {[data[1], data[0], data[2]].map((entry, idx) => {
                const podiumOrder = [1, 0, 2];
                const actualRank = podiumOrder[idx];
                const medal = ['silver', 'gold', 'bronze'][idx];
                const isMe = entry.consultant_id === currentConsultantId;

                return (
                  <Card
                    key={entry.consultant_id}
                    className={`text-center overflow-hidden ${idx === 1 ? 'transform -translate-y-2' : ''} ${
                      isMe ? 'ring-2 ring-yellow-400' : ''
                    } ${isDark ? 'bg-gray-800 border-gray-700' : ''}`}
                    data-testid={`podium-${medal}`}
                  >
                    <div className={`bg-gradient-to-r ${medalStyle[medal]} py-2`}>
                      <div className="w-10 h-10 mx-auto bg-white/30 rounded-full flex items-center justify-center">
                        {idx === 1 ? <Crown className="h-6 w-6 text-white" /> : <Medal className="h-5 w-5 text-white" />}
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{entry.consultant_name}</p>
                      <p className={`text-2xl font-black ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>{entry.score}</p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>points</p>
                      <div className="flex flex-wrap justify-center gap-1 mt-2">
                        {entry.badges.slice(0, 2).map(b => {
                          const Icon = badgeIconMap[b.icon] || Star;
                          return (
                            <span key={b.name} className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: b.color + '20', color: b.color }}>
                              <Icon className="h-2.5 w-2.5" /> {b.name}
                            </span>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Full Rankings Table */}
          <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
                    <th className={`p-3 text-left font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>#</th>
                    <th className={`p-3 text-left font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Consultant</th>
                    <th className={`p-3 text-center font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Score</th>
                    <th className={`p-3 text-center font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Reports</th>
                    <th className={`p-3 text-center font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Calls</th>
                    <th className={`p-3 text-center font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Success %</th>
                    <th className={`p-3 text-center font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Badges</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map(entry => {
                    const isMe = entry.consultant_id === currentConsultantId;
                    return (
                      <tr
                        key={entry.consultant_id}
                        className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-100'} ${
                          isMe ? (isDark ? 'bg-yellow-900/20' : 'bg-yellow-50') : (isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50')
                        }`}
                        data-testid={`leaderboard-row-${entry.consultant_id}`}
                      >
                        <td className="p-3">
                          <span className={`font-bold ${
                            entry.rank === 1 ? 'text-yellow-500' : entry.rank === 2 ? 'text-gray-400' : entry.rank === 3 ? 'text-orange-500' : isDark ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {entry.medal ? medalEmoji[entry.medal] : entry.rank}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold ${isMe ? 'text-yellow-600 dark:text-yellow-400' : isDark ? 'text-white' : 'text-gray-900'}`}>
                              {entry.consultant_name}
                            </span>
                            {isMe && <Badge className="bg-yellow-100 text-yellow-700 text-[10px]">You</Badge>}
                          </div>
                        </td>
                        <td className={`p-3 text-center font-bold ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>{entry.score}</td>
                        <td className={`p-3 text-center ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{entry.total_reports}</td>
                        <td className="p-3 text-center">
                          <span className="text-green-600">{entry.successful_calls}</span>
                          <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>/</span>
                          <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{entry.total_calls}</span>
                        </td>
                        <td className="p-3 text-center">
                          <Badge className={`text-xs ${
                            entry.success_rate >= 80 ? 'bg-green-100 text-green-700' : entry.success_rate >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                          }`}>{entry.success_rate}%</Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1 justify-center">
                            {entry.badges.map(b => {
                              const Icon = badgeIconMap[b.icon] || Star;
                              return (
                                <span key={b.name} title={b.name} className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: b.color + '20', color: b.color }}>
                                  <Icon className="h-2.5 w-2.5" /> {b.name}
                                </span>
                              );
                            })}
                            {entry.badges.length === 0 && <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>-</span>}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Scoring Guide */}
          <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
            <CardContent className="p-4">
              <h4 className={`font-semibold text-sm mb-2 flex items-center gap-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                <TrendingUp className="h-4 w-4 text-yellow-500" /> Scoring System
              </h4>
              <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <div className={`p-2 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}><span className="font-bold text-green-500">+10</span> per Report</div>
                <div className={`p-2 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}><span className="font-bold text-blue-500">+5</span> per Successful Call</div>
                <div className={`p-2 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}><span className="font-bold text-purple-500">+50</span> per Admission</div>
                <div className={`p-2 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}><span className="font-bold text-yellow-500">+2</span> per Attempted Call</div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Leaderboard;
