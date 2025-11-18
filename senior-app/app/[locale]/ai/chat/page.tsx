'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Icon from '@/components/icons/Icon';
import SeniorButton from '@/components/ui/SeniorButton';
import SeniorCard from '@/components/ui/SeniorCard';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { formatTime } from '@/lib/utils';
import type { ChatMessage } from '@/lib/services/ai.service';

export default function AIChatPage() {
  const t = useTranslations();
  const router = useRouter();
  const { messages, sending, sendMessage, createConversation } = useAIAssistant();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;

    const userInput = input.trim();
    setInput('');

    try {
      await sendMessage(userInput);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('메시지 전송에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 빠른 질문 템플릿
  const quickQuestions = [
    '오늘 약은 어떻게 먹어야 하나요?',
    '혈압이 높을 때 어떻게 해야 하나요?',
    '건강한 식습관은 무엇인가요?',
    '운동은 어떻게 시작해야 하나요?',
  ];

  const handleQuickQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg)' }}>
      {/* Header */}
      <header className="spacing-responsive flex-shrink-0" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="responsive-container">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="w-11 h-11 md:w-12 md:h-12 flex items-center justify-center transition-all hover:scale-105 touch-area"
                style={{
                  background: 'var(--color-bg)',
                  borderRadius: '50%',
                }}
              >
                <Icon name="arrowLeft" size={20} color="var(--color-text-primary)" />
              </button>
              <div>
                <h1
                  className="text-responsive-xl font-bold"
                  style={{ color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}
                >
                  AI 건강 상담
                </h1>
                <p className="text-sm md:text-base" style={{ color: 'var(--color-text-tertiary)' }}>
                  건강에 대해 무엇이든 물어보세요
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto responsive-container py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12">
            <div
              className="w-20 h-20 md:w-24 md:h-24 mb-6 flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent-pink) 100%)',
                borderRadius: 'var(--radius-xl)',
              }}
            >
              <Icon name="messageCircle" size={40} color="white" />
            </div>
            <h2
              className="text-xl md:text-2xl font-bold mb-3 text-center"
              style={{ color: 'var(--color-text-primary)' }}
            >
              안녕하세요! 👋
            </h2>
            <p
              className="text-base md:text-lg text-center mb-8 px-4"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              건강에 대해 궁금한 점을 물어보세요.
              <br />
              친절하게 답변해 드리겠습니다.
            </p>

            {/* Quick Questions */}
            <div className="w-full max-w-2xl space-y-2 px-4">
              <p
                className="text-sm md:text-base font-bold mb-3"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                이런 질문은 어때요?
              </p>
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  className="w-full text-left spacing-responsive transition-all hover:scale-[1.02] active:scale-98"
                  style={{
                    background: 'var(--color-bg-card)',
                    borderRadius: 'var(--radius-lg)',
                    border: '2px solid rgba(102, 126, 234, 0.15)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Icon name="messageCircle" size={18} color="var(--color-primary)" />
                    <span
                      className="text-sm md:text-base font-medium"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {question}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] md:max-w-[75%] ${
                    message.role === 'user' ? 'order-2' : 'order-1'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                        style={{
                          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent-pink) 100%)',
                          borderRadius: '50%',
                        }}
                      >
                        <Icon name="sparkles" size={16} color="white" />
                      </div>
                      <span className="text-sm font-bold" style={{ color: 'var(--color-text-secondary)' }}>
                        AI 어시스턴트
                      </span>
                    </div>
                  )}

                  <div
                    className="spacing-responsive"
                    style={{
                      background:
                        message.role === 'user'
                          ? 'var(--color-primary)'
                          : 'var(--color-bg-card)',
                      borderRadius:
                        message.role === 'user'
                          ? 'var(--radius-lg) var(--radius-lg) 4px var(--radius-lg)'
                          : 'var(--radius-lg) var(--radius-lg) var(--radius-lg) 4px',
                      boxShadow: message.role === 'assistant' ? 'var(--shadow-card)' : 'none',
                    }}
                  >
                    <p
                      className="text-base md:text-lg leading-relaxed whitespace-pre-wrap"
                      style={{
                        color:
                          message.role === 'user'
                            ? 'white'
                            : 'var(--color-text-primary)',
                      }}
                    >
                      {message.content}
                    </p>
                    {message.timestamp && (
                      <p
                        className="text-xs md:text-sm mt-2"
                        style={{
                          color:
                            message.role === 'user'
                              ? 'rgba(255, 255, 255, 0.7)'
                              : 'var(--color-text-tertiary)',
                        }}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {sending && (
              <div className="flex justify-start">
                <div className="max-w-[85%] md:max-w-[75%]">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent-pink) 100%)',
                        borderRadius: '50%',
                      }}
                    >
                      <Icon name="sparkles" size={16} color="white" />
                    </div>
                    <span className="text-sm font-bold" style={{ color: 'var(--color-text-secondary)' }}>
                      AI 어시스턴트
                    </span>
                  </div>
                  <div
                    className="spacing-responsive"
                    style={{
                      background: 'var(--color-bg-card)',
                      borderRadius: 'var(--radius-lg) var(--radius-lg) var(--radius-lg) 4px',
                      boxShadow: 'var(--shadow-card)',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{ background: 'var(--color-primary)', animationDelay: '0ms' }}
                      />
                      <div
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{ background: 'var(--color-primary)', animationDelay: '150ms' }}
                      />
                      <div
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{ background: 'var(--color-primary)', animationDelay: '300ms' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </main>

      {/* Input */}
      <div
        className="flex-shrink-0 spacing-responsive border-t-2"
        style={{
          background: 'var(--color-bg-secondary)',
          borderColor: 'rgba(102, 126, 234, 0.1)',
        }}
      >
        <div className="responsive-container">
          <div className="flex gap-2 md:gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="건강에 대해 물어보세요..."
              rows={1}
              disabled={sending}
              className="flex-1 bg-white px-4 md:px-5 py-4 md:py-5 text-base md:text-lg font-medium touch-area transition-all focus:outline-none focus:ring-2 focus:ring-opacity-20 border-2 rounded-xl resize-none"
              style={{
                color: 'var(--color-text-primary)',
                borderColor: 'rgba(102, 126, 234, 0.15)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                minHeight: '60px',
                maxHeight: '120px',
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
              style={{
                background: input.trim() && !sending
                  ? 'var(--color-primary)'
                  : 'var(--color-bg-tertiary)',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <Icon name="send" size={24} color="white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
