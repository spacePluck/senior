import { useState, useCallback, useEffect } from 'react';
import { AIService, type ChatMessage, type WeeklyHealthReport } from '@/lib/services/ai.service';
import { useUserStore } from '@/store/useUserStore';
import type { Database } from '@/types/database';

type AIConversation = Database['public']['Tables']['ai_conversations']['Row'];

export function useAIAssistant() {
  const { user } = useUserStore();
  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<AIConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * 대화 목록 불러오기
   */
  const loadConversations = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const data = await AIService.getConversations(user.id);
      setConversations(data);
    } catch (err) {
      console.error('Error loading conversations:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  /**
   * 특정 대화 불러오기
   */
  const loadConversation = useCallback(async (conversationId: string) => {
    setLoading(true);
    setError(null);

    try {
      const conversation = await AIService.getConversation(conversationId);
      setCurrentConversation(conversation);
      setMessages((conversation.messages as unknown as ChatMessage[]) || []);
    } catch (err) {
      console.error('Error loading conversation:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 새 대화 시작
   */
  const createConversation = useCallback(
    async (title?: string) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      setLoading(true);
      setError(null);

      try {
        const conversation = await AIService.createConversation(user.id, title);
        setCurrentConversation(conversation);
        setMessages([]);
        setConversations((prev) => [conversation, ...prev]);
        return conversation;
      } catch (err) {
        console.error('Error creating conversation:', err);
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user?.id]
  );

  /**
   * 메시지 전송
   */
  const sendMessage = useCallback(
    async (content: string, conversationId?: string) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      let targetConversationId = conversationId || currentConversation?.id;

      // 대화가 없으면 새로 생성
      if (!targetConversationId) {
        const newConversation = await createConversation();
        targetConversationId = newConversation.id;
      }

      setSending(true);
      setError(null);

      try {
        const { userMessage, assistantMessage } = await AIService.sendMessage(
          targetConversationId,
          content,
          user.id
        );

        // 메시지 추가
        setMessages((prev) => [...prev, userMessage, assistantMessage]);

        return { userMessage, assistantMessage };
      } catch (err) {
        console.error('Error sending message:', err);
        setError(err as Error);
        throw err;
      } finally {
        setSending(false);
      }
    },
    [user?.id, currentConversation, createConversation]
  );

  /**
   * 대화 삭제
   */
  const deleteConversation = useCallback(
    async (conversationId: string) => {
      setLoading(true);
      setError(null);

      try {
        await AIService.deleteConversation(conversationId);
        setConversations((prev) => prev.filter((c) => c.id !== conversationId));

        // 현재 대화가 삭제되면 초기화
        if (currentConversation?.id === conversationId) {
          setCurrentConversation(null);
          setMessages([]);
        }
      } catch (err) {
        console.error('Error deleting conversation:', err);
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentConversation]
  );

  /**
   * 간단한 조언 받기 (대화 기록 없이)
   */
  const getQuickAdvice = useCallback(
    async (question: string): Promise<string> => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      setSending(true);
      setError(null);

      try {
        const advice = await AIService.getQuickAdvice(question, user.id);
        return advice;
      } catch (err) {
        console.error('Error getting quick advice:', err);
        setError(err as Error);
        throw err;
      } finally {
        setSending(false);
      }
    },
    [user?.id]
  );

  /**
   * 주간 건강 리포트 생성
   */
  const generateWeeklyReport = useCallback(async (): Promise<WeeklyHealthReport> => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      const report = await AIService.generateWeeklyReport(user.id);
      return report;
    } catch (err) {
      console.error('Error generating weekly report:', err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  /**
   * 현재 대화 초기화
   */
  const clearCurrentConversation = useCallback(() => {
    setCurrentConversation(null);
    setMessages([]);
  }, []);

  // 컴포넌트 마운트 시 대화 목록 로드
  useEffect(() => {
    if (user?.id) {
      loadConversations();
    }
  }, [user?.id, loadConversations]);

  return {
    // State
    conversations,
    currentConversation,
    messages,
    loading,
    sending,
    error,

    // Actions
    loadConversations,
    loadConversation,
    createConversation,
    sendMessage,
    deleteConversation,
    getQuickAdvice,
    generateWeeklyReport,
    clearCurrentConversation,
  };
}
