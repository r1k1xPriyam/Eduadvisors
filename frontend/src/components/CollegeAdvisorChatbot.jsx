import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, RotateCcw, ChevronDown, ChevronUp, GitCompare, Phone, BookOpen } from 'lucide-react';
import {
  getCollegeRecommendations, getTierLabel, formatFee,
  STREAMS, REGIONS, BUDGETS, BOARDS, SUBJECT_GROUPS, SUBJECT_COURSE_MAP,
  getCollegeById
} from '../data/collegeDatabase';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CollegeAdvisorChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState({ board: '', marks: '', stream: '', region: '', budget: '', subjects: '' });
  const [results, setResults] = useState([]);
  const [expandedCutoff, setExpandedCutoff] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareList, setCompareList] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactData, setContactData] = useState({ name: '', email: '', phone: '', message: '' });
  const [inputValue, setInputValue] = useState('');
  const [submittingContact, setSubmittingContact] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, expandedCutoff, showCompare, showContactForm]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { from: 'bot', text: "Hi there! I'm your College Advisor from Edu Advisors. Let me help you find the best colleges & courses for you!", type: 'text' },
        { from: 'bot', text: "First, which board are you from?", type: 'options', options: BOARDS }
      ]);
      setStep(1);
    }
  }, [isOpen, messages.length]);

  const addMessage = (from, text, type = 'text', extra = {}) => {
    setMessages(prev => [...prev, { from, text, type, ...extra }]);
  };

  // FLOW: Board(1) → Marks(2) → Subjects(3) → Stream(4) → Region(5) → Budget(6) → Results(7)
  const handleOptionSelect = (value) => {
    if (step === 1) {
      setUserData(p => ({ ...p, board: value }));
      addMessage('user', value);
      setTimeout(() => {
        addMessage('bot', `Great, ${value} board! Now, what's your 10+2 percentage? (Enter a number)`, 'input');
        setStep(2);
      }, 300);
    } else if (step === 3) {
      // Subject group selection
      setUserData(p => ({ ...p, subjects: value }));
      addMessage('user', value);
      const courses = SUBJECT_COURSE_MAP[value] || [];
      setTimeout(() => {
        if (courses.length > 0) {
          addMessage('bot', `Based on your ${value} subjects, here are the best courses available for you:`, 'text');
          setTimeout(() => {
            addMessage('bot', '', 'courses', { courses, subjectGroup: value });
            setTimeout(() => {
              addMessage('bot', "Now, would you also like college recommendations? Pick your preferred engineering stream (or skip):", 'options', { options: ['Skip - No College Search', ...STREAMS] });
              setStep(4);
            }, 500);
          }, 400);
        } else {
          addMessage('bot', "Which engineering stream are you interested in?", 'options', { options: ['Any', ...STREAMS] });
          setStep(4);
        }
      }, 300);
    } else if (step === 4) {
      if (value === 'Skip - No College Search') {
        addMessage('user', 'Skip college search');
        setTimeout(() => {
          addMessage('bot', "No worries! If you need further guidance, feel free to contact our consultant.", 'text');
          addMessage('bot', "What would you like to do next?", 'options', { options: ['Restart', 'Contact Consultant'] });
          setStep(8);
        }, 300);
        return;
      }
      setUserData(p => ({ ...p, stream: value }));
      addMessage('user', value);
      setTimeout(() => {
        addMessage('bot', "Which region do you prefer?", 'options', { options: REGIONS });
        setStep(5);
      }, 300);
    } else if (step === 5) {
      setUserData(p => ({ ...p, region: value }));
      addMessage('user', value);
      setTimeout(() => {
        addMessage('bot', "And your yearly budget for fees?", 'options', { options: BUDGETS });
        setStep(6);
      }, 300);
    } else if (step === 6) {
      const newData = { ...userData, budget: value };
      setUserData(newData);
      addMessage('user', value);
      setTimeout(() => generateResults(newData), 400);
    }
  };

  const handleTextSubmit = () => {
    const val = inputValue.trim();
    if (!val) return;
    setInputValue('');

    if (step === 2) {
      const marks = parseFloat(val);
      if (isNaN(marks) || marks < 0 || marks > 100) {
        addMessage('bot', "Please enter a valid percentage (0-100).", 'input');
        return;
      }
      setUserData(p => ({ ...p, marks }));
      addMessage('user', `${marks}%`);
      const tierInfo = getTierLabel(marks);
      setTimeout(() => {
        addMessage('bot', `${marks}% — that puts you in the ${tierInfo.tier} category! Now, what were your Class 12th subjects?`, 'options', { options: SUBJECT_GROUPS });
        setStep(3);
      }, 300);
    }
  };

  const generateResults = (data) => {
    const colleges = getCollegeRecommendations(data.marks, data.stream, data.region, data.budget);
    setResults(colleges);
    const tierInfo = getTierLabel(data.marks);

    if (colleges.length === 0) {
      addMessage('bot', `Hmm, based on your ${data.marks}% in ${data.board} with ${data.stream} in ${data.region} under ${data.budget}/yr budget, I couldn't find exact matches. Consider broadening your location or budget preference.`, 'text');
      addMessage('bot', "Would you like to try again with different preferences?", 'options', { options: ['Restart', 'Contact Consultant'] });
      setStep(8);
      return;
    }

    const regionLabel = data.region === 'All India' ? 'across India' : `in ${data.region} India`;
    addMessage('bot', `Based on your ${data.marks}% (${tierInfo.tier}) in ${data.board} for ${data.stream === 'Any' ? 'any stream' : data.stream} ${regionLabel} within ${data.budget}/yr — here are my top picks:`, 'text');
    setTimeout(() => {
      addMessage('bot', '', 'results', { colleges });
      setStep(7);
    }, 400);
  };

  const handlePostResult = (action) => {
    if (action === 'Restart') restart();
    else if (action === 'Contact Consultant') setShowContactForm(true);
    else if (action === 'Compare Colleges') {
      setCompareMode(true);
      setCompareList([]);
      addMessage('bot', "Select 2 colleges from the list above to compare side-by-side. Click on college cards to select them.", 'text');
    }
  };

  const toggleCompareCollege = (id) => {
    setCompareList(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  useEffect(() => {
    if (compareMode && compareList.length === 2) {
      setShowCompare(true);
      setCompareMode(false);
    }
  }, [compareList, compareMode]);

  const restart = () => {
    setMessages([]);
    setStep(0);
    setUserData({ board: '', marks: '', stream: '', region: '', budget: '', subjects: '' });
    setResults([]);
    setExpandedCutoff(null);
    setCompareMode(false);
    setCompareList([]);
    setShowCompare(false);
    setShowContactForm(false);
    setTimeout(() => {
      setMessages([
        { from: 'bot', text: "Let's start fresh! Which board are you from?", type: 'options', options: BOARDS }
      ]);
      setStep(1);
    }, 100);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSubmittingContact(true);
    try {
      // Submit as student query to backend
      const queryPayload = {
        name: contactData.name,
        phone: contactData.phone || 'N/A',
        email: contactData.email || 'noreply@chatbot.edu',
        current_institution: userData.board ? `${userData.board} Board Student` : 'Chatbot Inquiry',
        course: userData.subjects || userData.stream || 'General Counselling',
        message: `[Chatbot Query] ${contactData.message || 'Student requested consultant callback.'}${userData.marks ? ` | Marks: ${userData.marks}%` : ''}${userData.subjects ? ` | Subjects: ${userData.subjects}` : ''}${userData.stream ? ` | Stream: ${userData.stream}` : ''}${userData.region ? ` | Region: ${userData.region}` : ''}${userData.budget ? ` | Budget: ${userData.budget}` : ''}`
      };
      await axios.post(`${API}/queries`, queryPayload);
      addMessage('bot', `Thanks ${contactData.name}! Your query has been submitted. Our counsellor will reach out to you at ${contactData.phone || contactData.email} shortly. You can also email us at info@eduadvisors.in`, 'text');
    } catch (err) {
      console.error('Failed to submit chatbot query:', err);
      addMessage('bot', `Thanks ${contactData.name}! Our counsellor will reach out to you at ${contactData.phone || contactData.email} shortly. You can also email us at info@eduadvisors.in`, 'text');
    }
    setShowContactForm(false);
    setContactData({ name: '', email: '', phone: '', message: '' });
    setSubmittingContact(false);
  };

  // Course Card Component
  const CourseCard = ({ course, index }) => (
    <div className="rounded-lg border border-gray-200 bg-white p-3 mb-2 hover:border-emerald-300 transition-all" data-testid={`course-card-${index}`}>
      <div className="flex items-start gap-2">
        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
          <BookOpen className="h-4 w-4 text-emerald-600" />
        </div>
        <div>
          <h4 className="font-bold text-sm text-gray-900">{course.name}</h4>
          <p className="text-xs text-gray-500 mt-0.5">{course.description}</p>
        </div>
      </div>
    </div>
  );

  // College Card
  const CollegeCard = ({ college }) => {
    const isExpanded = expandedCutoff === college.id;
    const isSelected = compareList.includes(college.id);
    const streamCutoffs = college.cutoffsByStream?.[userData.stream] || college.cutoffsByStream?.['ECE'] || {};

    return (
      <div
        className={`rounded-lg border p-3 mb-2 transition-all cursor-pointer ${
          isSelected ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-300' : 'border-gray-200 bg-white hover:border-emerald-300'
        }`}
        onClick={() => compareMode && toggleCompareCollege(college.id)}
        data-testid={`college-card-${college.id}`}
      >
        <div className="flex justify-between items-start mb-1">
          <div>
            <h4 className="font-bold text-sm text-gray-900">{college.name}</h4>
            <p className="text-xs text-gray-500">{college.location}</p>
          </div>
          <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
            NIRF #{college.nirfRank}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
          <div className="text-center p-1.5 bg-gray-50 rounded">
            <p className="font-bold text-emerald-600">{formatFee(college.totalFees4Yr)}</p>
            <p className="text-gray-400">4yr Fees</p>
          </div>
          <div className="text-center p-1.5 bg-gray-50 rounded">
            <p className="font-bold text-blue-600">{college.avgPackageLPA} LPA</p>
            <p className="text-gray-400">Avg Pkg</p>
          </div>
          <div className="text-center p-1.5 bg-gray-50 rounded">
            <p className="font-bold text-purple-600">{college.placementPercent}%</p>
            <p className="text-gray-400">Placed</p>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {college.topRecruiters.slice(0, 4).map(r => (
            <span key={r} className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">{r}</span>
          ))}
          {college.topRecruiters.length > 4 && (
            <span className="text-[10px] text-gray-400">+{college.topRecruiters.length - 4} more</span>
          )}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); setExpandedCutoff(isExpanded ? null : college.id); }}
          className="mt-2 flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-800 font-semibold"
          data-testid={`cutoff-toggle-${college.id}`}
        >
          {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          {isExpanded ? 'Hide' : 'View'} Cutoffs & Details
        </button>
        {isExpanded && (
          <div className="mt-2 border-t pt-2 space-y-2 text-xs">
            <div>
              <p className="font-semibold text-gray-700 mb-1">Entrance Cutoffs ({userData.stream || 'General'}):</p>
              <table className="w-full text-xs">
                <thead><tr className="bg-gray-100"><th className="p-1 text-left">Exam</th><th className="p-1 text-left">Cutoff</th></tr></thead>
                <tbody>
                  {Object.entries(streamCutoffs).map(([exam, cutoff]) => (
                    <tr key={exam} className="border-b border-gray-100">
                      <td className="p-1 font-medium">{exam}</td>
                      <td className="p-1 text-gray-600">{cutoff}</td>
                    </tr>
                  ))}
                  {Object.entries(college.cutoffs).map(([exam, data]) => (
                    !streamCutoffs[exam] && <tr key={exam} className="border-b border-gray-100">
                      <td className="p-1 font-medium">{exam}</td>
                      <td className="p-1 text-gray-600">{typeof data === 'object' ? Object.values(data).join(' / ') : data}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Admission:</p>
              <p className="text-gray-600">{college.admissionProcess}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Hostel:</p>
              <p className="text-gray-600">{formatFee(college.hostelFeePerYear)}/yr</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Highlights:</p>
              <ul className="list-disc list-inside text-gray-600">
                {college.highlights.map(h => <li key={h}>{h}</li>)}
              </ul>
            </div>
          </div>
        )}
        {compareMode && (
          <div className={`mt-1 text-center text-xs font-semibold ${isSelected ? 'text-emerald-600' : 'text-gray-400'}`}>
            {isSelected ? 'Selected for comparison' : 'Click to select'}
          </div>
        )}
      </div>
    );
  };

  // Compare view
  const CompareView = () => {
    const c1 = getCollegeById(compareList[0]);
    const c2 = getCollegeById(compareList[1]);
    if (!c1 || !c2) return null;

    const rows = [
      ['NIRF Rank', `#${c1.nirfRank}`, `#${c2.nirfRank}`],
      ['Location', c1.location, c2.location],
      ['Total Fees (4yr)', formatFee(c1.totalFees4Yr), formatFee(c2.totalFees4Yr)],
      ['Fee/Year', formatFee(c1.feePerYear), formatFee(c2.feePerYear)],
      ['Avg Package', `${c1.avgPackageLPA} LPA`, `${c2.avgPackageLPA} LPA`],
      ['Highest Pkg', `${c1.highestPackageLPA} LPA`, `${c2.highestPackageLPA} LPA`],
      ['Placement %', `${c1.placementPercent}%`, `${c2.placementPercent}%`],
      ['Campus', c1.campusSize, c2.campusSize],
      ['Hostel/yr', formatFee(c1.hostelFeePerYear), formatFee(c2.hostelFeePerYear)],
      ['Admission', c1.admissionProcess, c2.admissionProcess],
    ];

    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden" data-testid="compare-view">
        <div className="grid grid-cols-3 bg-emerald-500 text-white text-xs font-bold">
          <div className="p-2">Feature</div>
          <div className="p-2 text-center">{c1.shortName}</div>
          <div className="p-2 text-center">{c2.shortName}</div>
        </div>
        {rows.map(([label, v1, v2], i) => (
          <div key={label} className={`grid grid-cols-3 text-xs ${i % 2 ? 'bg-gray-50' : 'bg-white'}`}>
            <div className="p-2 font-semibold text-gray-700">{label}</div>
            <div className="p-2 text-center text-gray-600">{v1}</div>
            <div className="p-2 text-center text-gray-600">{v2}</div>
          </div>
        ))}
        <div className="p-2 flex justify-center">
          <button onClick={() => { setShowCompare(false); setCompareList([]); }} className="text-xs text-emerald-600 font-semibold hover:underline">Close Comparison</button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Chat Bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110"
          data-testid="chatbot-bubble"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">1</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-[380px] max-w-[calc(100vw-32px)] h-[580px] max-h-[calc(100vh-32px)] flex flex-col rounded-2xl shadow-2xl border border-gray-200 overflow-hidden bg-white" data-testid="chatbot-window">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm">College Advisor</h3>
                <p className="text-[10px] text-emerald-100">by Edu Advisors</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={restart} className="p-1.5 hover:bg-white/20 rounded-full transition-colors" title="Restart" data-testid="chatbot-restart">
                <RotateCcw className="h-4 w-4" />
              </button>
              <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/20 rounded-full transition-colors" data-testid="chatbot-close">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50" data-testid="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.from === 'bot' ? (
                  <div className="max-w-[90%]">
                    {msg.type === 'text' && (
                      <div className="bg-white rounded-xl rounded-tl-sm px-3 py-2 text-sm text-gray-800 shadow-sm border border-gray-100">
                        {msg.text}
                      </div>
                    )}
                    {msg.type === 'options' && (
                      <div className="space-y-2">
                        {msg.text && <div className="bg-white rounded-xl rounded-tl-sm px-3 py-2 text-sm text-gray-800 shadow-sm border border-gray-100">{msg.text}</div>}
                        <div className="flex flex-wrap gap-1.5">
                          {msg.options.map(opt => (
                            <button
                              key={opt}
                              onClick={() => handleOptionSelect(opt)}
                              className="px-3 py-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full hover:bg-emerald-100 transition-colors"
                              data-testid={`option-${opt.replace(/[\s()\/,]+/g, '-').toLowerCase()}`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {msg.type === 'input' && (
                      <div className="bg-white rounded-xl rounded-tl-sm px-3 py-2 text-sm text-gray-800 shadow-sm border border-gray-100">
                        {msg.text}
                      </div>
                    )}
                    {msg.type === 'courses' && (
                      <div className="space-y-1" data-testid="course-suggestions">
                        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg p-2 mb-2 border border-emerald-200">
                          <p className="text-xs font-semibold text-emerald-800 flex items-center gap-1">
                            <BookOpen className="h-3 w-3" /> Recommended Courses for {msg.subjectGroup}
                          </p>
                        </div>
                        {msg.courses.map((course, idx) => (
                          <CourseCard key={idx} course={course} index={idx} />
                        ))}
                      </div>
                    )}
                    {msg.type === 'results' && (
                      <div className="space-y-2">
                        {msg.colleges.map(c => <CollegeCard key={c.id} college={c} />)}
                        <div className="flex flex-wrap gap-2 mt-3">
                          <button onClick={() => handlePostResult('Compare Colleges')} className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded-full hover:bg-blue-100" data-testid="compare-btn">
                            <GitCompare className="h-3 w-3" /> Compare 2 Colleges
                          </button>
                          <button onClick={() => handlePostResult('Contact Consultant')} className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200 rounded-full hover:bg-orange-100" data-testid="contact-consultant-btn">
                            <Phone className="h-3 w-3" /> Contact Consultant
                          </button>
                          <button onClick={() => handlePostResult('Restart')} className="px-3 py-1.5 text-xs font-semibold bg-gray-50 text-gray-600 border border-gray-200 rounded-full hover:bg-gray-100" data-testid="restart-btn">
                            <RotateCcw className="h-3 w-3 inline mr-1" /> Start Over
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-emerald-500 text-white rounded-xl rounded-tr-sm px-3 py-2 text-sm max-w-[80%] shadow-sm">
                    {msg.text}
                  </div>
                )}
              </div>
            ))}

            {/* Compare View */}
            {showCompare && <CompareView />}

            {/* Contact Form */}
            {showContactForm && (
              <div className="bg-white rounded-lg border border-gray-200 p-3" data-testid="contact-form">
                <h4 className="font-bold text-sm text-gray-800 mb-2 flex items-center gap-1">
                  <Phone className="h-4 w-4 text-emerald-500" /> Get Expert Counselling
                </h4>
                <form onSubmit={handleContactSubmit} className="space-y-2">
                  <input
                    required value={contactData.name} onChange={e => setContactData(p => ({ ...p, name: e.target.value }))}
                    placeholder="Your Name *" className="w-full px-3 py-1.5 text-xs border rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    data-testid="contact-name"
                  />
                  <input
                    type="email" value={contactData.email} onChange={e => setContactData(p => ({ ...p, email: e.target.value }))}
                    placeholder="Email" className="w-full px-3 py-1.5 text-xs border rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    data-testid="contact-email"
                  />
                  <input
                    required value={contactData.phone} onChange={e => setContactData(p => ({ ...p, phone: e.target.value }))}
                    placeholder="Phone Number *" className="w-full px-3 py-1.5 text-xs border rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    data-testid="contact-phone"
                  />
                  <textarea
                    value={contactData.message} onChange={e => setContactData(p => ({ ...p, message: e.target.value }))}
                    placeholder="Any specific questions?" rows={2} className="w-full px-3 py-1.5 text-xs border rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none resize-none"
                  />
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setShowContactForm(false)} className="flex-1 px-3 py-1.5 text-xs border rounded-lg hover:bg-gray-50">Cancel</button>
                    <button type="submit" disabled={submittingContact} className="flex-1 px-3 py-1.5 text-xs bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-semibold disabled:opacity-50" data-testid="contact-submit">
                      {submittingContact ? 'Sending...' : 'Send'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Input Area */}
          {step === 2 && (
            <div className="flex-shrink-0 p-3 bg-white border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleTextSubmit()}
                  placeholder="Enter your percentage (e.g., 88)"
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  type="number" min="0" max="100"
                  data-testid="marks-input"
                />
                <button
                  onClick={handleTextSubmit}
                  className="px-3 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
                  data-testid="send-btn"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Powered by */}
          <div className="flex-shrink-0 px-3 py-1.5 bg-gray-100 text-center">
            <p className="text-[10px] text-gray-400">Powered by Edu Advisors | info@eduadvisors.in</p>
          </div>
        </div>
      )}
    </>
  );
};

export default CollegeAdvisorChatbot;
