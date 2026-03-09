import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useTheme } from '../context/ThemeContext';
import {
  Search, GitCompare, X, MapPin, DollarSign, TrendingUp,
  Award, Building, ChevronDown, ChevronUp, ExternalLink
} from 'lucide-react';
import {
  getAllColleges, formatFee, STREAMS, REGIONS, BUDGETS
} from '../data/collegeDatabase';

const CollegeComparison = () => {
  const { isDark } = useTheme();
  const allColleges = getAllColleges();
  const [search, setSearch] = useState('');
  const [streamFilter, setStreamFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [selected, setSelected] = useState([]);
  const [expanded, setExpanded] = useState(null);

  const filtered = useMemo(() => {
    let list = [...allColleges];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.shortName.toLowerCase().includes(q) || c.location.toLowerCase().includes(q));
    }
    if (streamFilter) list = list.filter(c => c.streams.includes(streamFilter));
    if (regionFilter && regionFilter !== 'All India') list = list.filter(c => c.region === regionFilter);
    return list.sort((a, b) => a.nirfRank - b.nirfRank);
  }, [search, streamFilter, regionFilter, allColleges]);

  const toggleSelect = (id) => {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 3) return [...prev.slice(1), id];
      return [...prev, id];
    });
  };

  const selectedColleges = selected.map(id => allColleges.find(c => c.id === id)).filter(Boolean);

  const comparisonFields = [
    { label: 'NIRF Rank', key: c => `#${c.nirfRank}` },
    { label: 'Location', key: c => c.location },
    { label: 'Established', key: c => c.established },
    { label: 'Fee / Year', key: c => formatFee(c.feePerYear) },
    { label: 'Total Fees (4yr)', key: c => formatFee(c.totalFees4Yr) },
    { label: 'Hostel / Year', key: c => formatFee(c.hostelFeePerYear) },
    { label: 'Avg Package', key: c => `${c.avgPackageLPA} LPA` },
    { label: 'Highest Package', key: c => `${c.highestPackageLPA} LPA` },
    { label: 'Median Package', key: c => `${c.medianPackageLPA} LPA` },
    { label: 'Placement %', key: c => `${c.placementPercent}%` },
    { label: 'Min Board %', key: c => `${c.minBoardPercent}%` },
    { label: 'Campus Size', key: c => c.campusSize },
    { label: 'Admission', key: c => c.admissionProcess },
    { label: 'Top Recruiters', key: c => c.topRecruiters.slice(0, 5).join(', ') },
    { label: 'Available Streams', key: c => c.streams.join(', ') },
  ];

  return (
    <div className="space-y-4" data-testid="college-comparison-tool">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>College Comparison Tool</h2>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Search, explore and compare up to 3 colleges side-by-side
          </p>
        </div>
        {selected.length > 0 && (
          <Button onClick={() => setSelected([])} variant="outline" size="sm" className={isDark ? 'border-gray-600' : ''}>
            <X className="h-4 w-4 mr-1" /> Clear ({selected.length})
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className={`absolute left-3 top-2.5 h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <Input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search colleges by name or location..."
              className={`pl-9 ${isDark ? 'bg-gray-800 border-gray-600 text-white' : ''}`}
              data-testid="college-search-input"
            />
          </div>
        </div>
        <select
          value={streamFilter} onChange={e => setStreamFilter(e.target.value)}
          className={`px-3 py-2 rounded-md border text-sm ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'border-gray-300'}`}
          data-testid="stream-filter"
        >
          <option value="">All Streams</option>
          {STREAMS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={regionFilter} onChange={e => setRegionFilter(e.target.value)}
          className={`px-3 py-2 rounded-md border text-sm ${isDark ? 'bg-gray-800 border-gray-600 text-white' : 'border-gray-300'}`}
          data-testid="region-filter"
        >
          {REGIONS.map(r => <option key={r} value={r === 'All India' ? '' : r}>{r}</option>)}
        </select>
      </div>

      {/* Comparison Table */}
      {selectedColleges.length >= 2 && (
        <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : ''} overflow-hidden`} data-testid="comparison-table">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3">
            <CardTitle className="text-base flex items-center gap-2">
              <GitCompare className="h-5 w-5" />
              Comparing {selectedColleges.map(c => c.shortName).join(' vs ')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
                  <th className={`p-3 text-left font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Feature</th>
                  {selectedColleges.map(c => (
                    <th key={c.id} className={`p-3 text-center font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      {c.shortName}
                      <button onClick={() => toggleSelect(c.id)} className="ml-1 text-red-400 hover:text-red-600">
                        <X className="h-3 w-3 inline" />
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonFields.map((field, i) => (
                  <tr key={field.label} className={`${i % 2 === 0 ? (isDark ? 'bg-gray-800' : 'bg-white') : (isDark ? 'bg-gray-750' : 'bg-gray-50')} border-t ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                    <td className={`p-3 font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{field.label}</td>
                    {selectedColleges.map(c => (
                      <td key={c.id} className={`p-3 text-center ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                        {field.key(c)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* College Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(college => {
          const isSelected = selected.includes(college.id);
          const isExp = expanded === college.id;

          return (
            <Card
              key={college.id}
              className={`transition-all ${isSelected ? 'ring-2 ring-blue-500' : ''} ${isDark ? 'bg-gray-800 border-gray-700' : ''} hover:shadow-lg`}
              data-testid={`comparison-card-${college.id}`}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{college.name}</h3>
                    <p className={`text-xs flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      <MapPin className="h-3 w-3" /> {college.location}
                    </p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 text-xs">#{college.nirfRank}</Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className={`text-center p-2 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <DollarSign className={`h-3 w-3 mx-auto mb-1 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                    <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{formatFee(college.feePerYear)}/yr</p>
                  </div>
                  <div className={`text-center p-2 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <TrendingUp className={`h-3 w-3 mx-auto mb-1 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                    <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{college.avgPackageLPA} LPA</p>
                  </div>
                  <div className={`text-center p-2 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <Award className={`h-3 w-3 mx-auto mb-1 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                    <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{college.placementPercent}%</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {college.streams.slice(0, 4).map(s => (
                    <span key={s} className={`text-[10px] px-1.5 py-0.5 rounded ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-blue-50 text-blue-600'}`}>{s}</span>
                  ))}
                  {college.streams.length > 4 && <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>+{college.streams.length - 4}</span>}
                </div>

                {isExp && (
                  <div className={`border-t pt-3 mt-2 space-y-2 text-xs ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                    <div className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                      <p className="font-semibold mb-1">Top Recruiters:</p>
                      <p>{college.topRecruiters.join(', ')}</p>
                    </div>
                    <div className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                      <p className="font-semibold mb-1">Admission:</p>
                      <p>{college.admissionProcess}</p>
                    </div>
                    <div className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                      <p className="font-semibold mb-1">Cutoffs:</p>
                      {Object.entries(college.cutoffs).map(([exam, data]) => (
                        <p key={exam}><span className="font-medium">{exam}:</span> {typeof data === 'object' ? Object.entries(data).map(([k, v]) => `${k}: ${v}`).join(' | ') : data}</p>
                      ))}
                    </div>
                    <div className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                      <p className="font-semibold mb-1">Highlights:</p>
                      <ul className="list-disc list-inside">{college.highlights.map(h => <li key={h}>{h}</li>)}</ul>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm" variant={isSelected ? "default" : "outline"}
                    onClick={() => toggleSelect(college.id)}
                    className={`flex-1 text-xs ${isSelected ? 'bg-blue-500 hover:bg-blue-600 text-white' : isDark ? 'border-gray-600' : ''}`}
                    data-testid={`select-compare-${college.id}`}
                  >
                    <GitCompare className="h-3 w-3 mr-1" />
                    {isSelected ? 'Selected' : 'Compare'}
                  </Button>
                  <Button
                    size="sm" variant="outline"
                    onClick={() => setExpanded(isExp ? null : college.id)}
                    className={`text-xs ${isDark ? 'border-gray-600' : ''}`}
                  >
                    {isExp ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Building className={`h-12 w-12 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
          <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>No colleges match your filters</p>
        </div>
      )}
    </div>
  );
};

export default CollegeComparison;
