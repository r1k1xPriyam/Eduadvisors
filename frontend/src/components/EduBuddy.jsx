import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Bot, 
  Send, 
  Sparkles, 
  GraduationCap, 
  MessageCircle, 
  Zap, 
  BookOpen,
  X,
  Minimize2,
  Maximize2,
  User,
  RefreshCw,
  ChevronRight
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const EduBuddy = ({ consultantId, consultantName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeMode, setActiveMode] = useState('auto');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [popularQueries, setPopularQueries] = useState([]);
  const [sessionId] = useState(() => `edu-buddy-${consultantId}-${Date.now()}`);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchPopularQueries();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchPopularQueries = async () => {
    try {
      const response = await axios.get(`${API}/edu-buddy/popular-queries`);
      if (response.data.success) {
        setPopularQueries(response.data.queries);
      }
    } catch (error) {
      console.error('Error fetching popular queries:', error);
    }
  };

  const sendMessage = async (message) => {
    if (!message.trim()) return;

    const userMessage = {
      type: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API}/edu-buddy/chat`, {
        message: message,
        session_id: sessionId,
        consultant_id: consultantId
      });

      if (response.data.success) {
        const botMessage = {
          type: 'bot',
          content: response.data.response,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to get response from EDU BUDDY');
      const errorMessage = {
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuery = (query) => {
    sendMessage(query);
    setActiveMode('manual');
  };

  const clearChat = () => {
    setMessages([]);
  };

  const formatMessage = (content) => {
    // Convert markdown-like formatting to JSX
    return content.split('\n').map((line, index) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={index} className="font-bold text-gray-900 mt-2">{line.replace(/\*\*/g, '')}</p>;
      }
      if (line.startsWith('- ') || line.startsWith('• ')) {
        return <li key={index} className="ml-4 text-gray-700">{line.substring(2)}</li>;
      }
      if (line.match(/^\d+\./)) {
        return <li key={index} className="ml-4 text-gray-700 list-decimal">{line.substring(line.indexOf('.') + 1).trim()}</li>;
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      return <p key={index} className="text-gray-700">{line}</p>;
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 flex items-center gap-2 group"
      >
        <Bot className="h-6 w-6" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
          EDU BUDDY
        </span>
        <Sparkles className="h-4 w-4 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${isMinimized ? 'w-72' : 'w-[450px]'}`}>
      <Card className="shadow-2xl border-2 border-blue-200 overflow-hidden">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  EDU BUDDY
                  <Sparkles className="h-4 w-4 text-yellow-300" />
                </CardTitle>
                <p className="text-blue-100 text-xs">AI Counselling Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white/80 hover:text-white transition-colors"
              >
                {isMinimized ? <Maximize2 className="h-5 w-5" /> : <Minimize2 className="h-5 w-5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0">
            {/* Mode Tabs */}
            <Tabs value={activeMode} onValueChange={setActiveMode} className="w-full">
              <TabsList className="w-full rounded-none bg-gray-100 p-1">
                <TabsTrigger
                  value="auto"
                  className="flex-1 data-[state=active]:bg-blue-500 data-[state=active]:text-white text-sm"
                >
                  <Zap className="h-4 w-4 mr-1" />
                  Auto Mode
                </TabsTrigger>
                <TabsTrigger
                  value="manual"
                  className="flex-1 data-[state=active]:bg-purple-500 data-[state=active]:text-white text-sm"
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Manual Help
                </TabsTrigger>
              </TabsList>

              {/* Auto Mode - Popular Queries */}
              <TabsContent value="auto" className="m-0 p-4">
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 font-medium">Popular Queries:</p>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {popularQueries.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickQuery(item.question)}
                        className="w-full text-left p-3 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-all group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <Badge className="mb-1 text-xs bg-blue-100 text-blue-700">
                              {item.category}
                            </Badge>
                            <p className="text-sm text-gray-700 group-hover:text-blue-700">
                              {item.question}
                            </p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Manual Mode - Chat Interface */}
              <TabsContent value="manual" className="m-0">
                {/* Messages Area */}
                <div className="h-[350px] overflow-y-auto p-4 bg-gray-50">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <GraduationCap className="h-12 w-12 mb-3 text-blue-300" />
                      <p className="text-sm font-medium">Ask me anything about:</p>
                      <ul className="text-xs mt-2 space-y-1 text-center">
                        <li>• Entrance exam cut-offs</li>
                        <li>• Course recommendations</li>
                        <li>• College fees & placements</li>
                        <li>• Career guidance</li>
                      </ul>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((msg, index) => (
                        <div
                          key={index}
                          className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-lg p-3 ${
                              msg.type === 'user'
                                ? 'bg-blue-500 text-white'
                                : msg.isError
                                ? 'bg-red-100 text-red-700 border border-red-200'
                                : 'bg-white border border-gray-200 shadow-sm'
                            }`}
                          >
                            {msg.type === 'bot' && (
                              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
                                <Bot className="h-4 w-4 text-blue-500" />
                                <span className="text-xs font-medium text-blue-600">EDU BUDDY</span>
                              </div>
                            )}
                            <div className="text-sm">
                              {msg.type === 'user' ? msg.content : formatMessage(msg.content)}
                            </div>
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              <span className="text-xs text-gray-500 ml-2">EDU BUDDY is thinking...</span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="p-3 border-t border-gray-200 bg-white">
                  <div className="flex gap-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !isLoading && sendMessage(inputMessage)}
                      placeholder="Ask about cut-offs, courses, colleges..."
                      className="flex-1"
                      disabled={isLoading}
                    />
                    <Button
                      onClick={() => sendMessage(inputMessage)}
                      disabled={isLoading || !inputMessage.trim()}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  {messages.length > 0 && (
                    <button
                      onClick={clearChat}
                      className="text-xs text-gray-500 hover:text-red-500 mt-2 flex items-center gap-1"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Clear chat
                    </button>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default EduBuddy;
