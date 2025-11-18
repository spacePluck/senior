import OpenAI from 'openai';
import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/types/database';
import { MedicationService } from './medication.service';
import { HealthService } from './health.service';
import { formatDate } from '@/lib/utils';

type AIConversation = Database['public']['Tables']['ai_conversations']['Row'];
type AIConversationInsert = Database['public']['Tables']['ai_conversations']['Insert'];

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export interface WeeklyHealthReport {
  period: string;
  medicationAdherence: {
    rate: number;
    totalDoses: number;
    takenDoses: number;
    missedDoses: number;
  };
  healthMetrics: {
    bloodPressure?: {
      average: string;
      status: string;
      count: number;
    };
    bloodSugar?: {
      average: number;
      status: string;
      count: number;
    };
    weight?: {
      current: number;
      change: number;
      count: number;
    };
  };
  recommendations: string[];
  summary: string;
}

/**
 * AI Service
 * OpenAI GPT-4를 사용한 건강 상담 및 리포트 생성
 */
export class AIService {
  private static openai: OpenAI | null = null;

  /**
   * OpenAI 클라이언트 초기화
   */
  private static getOpenAI(): OpenAI {
    if (!this.openai) {
      const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('OpenAI API key is not configured');
      }
      this.openai = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true, // 클라이언트 사이드에서 사용
      });
    }
    return this.openai;
  }

  /**
   * 시스템 프롬프트 생성
   */
  private static getSystemPrompt(): string {
    return `당신은 시니어 건강 관리를 위한 전문 AI 어시스턴트입니다.

역할:
- 따뜻하고 친절한 말투로 대화합니다
- 복약 관리, 건강 기록, 생활 습관에 대한 조언을 제공합니다
- 의학적 조언은 일반적인 정보만 제공하고, 심각한 증상은 반드시 의사 상담을 권장합니다
- 시니어 분들이 이해하기 쉽게 간단명료하게 설명합니다

주의사항:
- 진단이나 처방은 절대 하지 않습니다
- 응급 상황에는 즉시 119나 병원 방문을 권장합니다
- 개인정보 보호를 중요시합니다

답변 스타일:
- 존댓말 사용
- 짧고 명확한 문장
- 필요시 단계별 설명
- 긍정적이고 격려하는 톤`;
  }

  /**
   * 대화 생성
   */
  static async createConversation(userId: string, title?: string): Promise<AIConversation> {
    const { data, error } = await supabase
      .from('ai_conversations')
      .insert({
        user_id: userId,
        title: title || '새 대화',
        messages: [],
      })
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to create conversation');

    return data;
  }

  /**
   * 사용자의 대화 목록 조회
   */
  static async getConversations(userId: string): Promise<AIConversation[]> {
    const { data, error } = await supabase
      .from('ai_conversations')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * 특정 대화 조회
   */
  static async getConversation(conversationId: string): Promise<AIConversation> {
    const { data, error } = await supabase
      .from('ai_conversations')
      .select('*')
      .eq('id', conversationId)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Conversation not found');

    return data;
  }

  /**
   * 메시지 전송 및 AI 응답 받기
   */
  static async sendMessage(
    conversationId: string,
    userMessage: string,
    userId: string
  ): Promise<{ userMessage: ChatMessage; assistantMessage: ChatMessage }> {
    // 기존 대화 가져오기
    const conversation = await this.getConversation(conversationId);
    const messages = (conversation.messages as ChatMessage[]) || [];

    // 사용자 메시지 추가
    const newUserMessage: ChatMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
    };
    messages.push(newUserMessage);

    // 사용자의 건강 컨텍스트 가져오기
    const context = await this.getUserHealthContext(userId);

    // OpenAI API 호출
    const openai = this.getOpenAI();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: this.getSystemPrompt() },
        { role: 'system', content: `사용자 건강 정보:\n${context}` },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const assistantContent = completion.choices[0]?.message?.content || '죄송합니다. 응답을 생성하지 못했습니다.';

    // AI 응답 추가
    const newAssistantMessage: ChatMessage = {
      role: 'assistant',
      content: assistantContent,
      timestamp: new Date().toISOString(),
    };
    messages.push(newAssistantMessage);

    // 대화 업데이트 (제목도 첫 메시지로 자동 생성)
    const title = conversation.title === '새 대화' && messages.length === 2
      ? userMessage.slice(0, 30) + (userMessage.length > 30 ? '...' : '')
      : conversation.title;

    await supabase
      .from('ai_conversations')
      .update({
        title,
        messages,
        updated_at: new Date().toISOString(),
      })
      .eq('id', conversationId);

    return {
      userMessage: newUserMessage,
      assistantMessage: newAssistantMessage,
    };
  }

  /**
   * 사용자의 건강 컨텍스트 생성
   */
  private static async getUserHealthContext(userId: string): Promise<string> {
    try {
      // 복약 정보
      const medications = await MedicationService.getMedications(userId);
      const adherenceRate = await MedicationService.getAdherenceRate(userId, 7);

      // 최근 건강 기록
      const healthRecords = await HealthService.getHealthRecords(userId, undefined, 7);

      let context = '';

      // 복약 정보
      if (medications.length > 0) {
        context += `현재 복용 중인 약: ${medications.map((m) => `${m.name} (${m.dosage}${m.unit})`).join(', ')}\n`;
        context += `최근 7일 복약 순응도: ${adherenceRate.toFixed(1)}%\n`;
      }

      // 건강 기록
      const bloodPressureRecords = healthRecords.filter((r) => r.type === 'blood_pressure');
      if (bloodPressureRecords.length > 0) {
        const latest = bloodPressureRecords[0];
        const value = latest.value as { systolic: number; diastolic: number };
        context += `최근 혈압: ${value.systolic}/${value.diastolic} mmHg\n`;
      }

      const bloodSugarRecords = healthRecords.filter((r) => r.type === 'blood_sugar');
      if (bloodSugarRecords.length > 0) {
        const latest = bloodSugarRecords[0];
        context += `최근 혈당: ${latest.value} mg/dL\n`;
      }

      const weightRecords = healthRecords.filter((r) => r.type === 'weight');
      if (weightRecords.length > 0) {
        const latest = weightRecords[0];
        context += `최근 체중: ${latest.value} kg\n`;
      }

      return context || '건강 기록 정보가 없습니다.';
    } catch (error) {
      console.error('Error getting user health context:', error);
      return '건강 정보를 불러올 수 없습니다.';
    }
  }

  /**
   * 주간 건강 리포트 생성
   */
  static async generateWeeklyReport(userId: string): Promise<WeeklyHealthReport> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    // 복약 데이터
    const adherenceRate = await MedicationService.getAdherenceRate(userId, 7);
    const logs = await MedicationService.getTodayLogs(userId); // 최근 로그들
    const takenLogs = logs.filter((log) => log.status === 'taken');
    const totalLogs = logs.length;

    // 건강 기록 데이터
    const healthRecords = await HealthService.getHealthRecords(userId, undefined, 7);

    const bloodPressureRecords = healthRecords.filter((r) => r.type === 'blood_pressure');
    const bloodSugarRecords = healthRecords.filter((r) => r.type === 'blood_sugar');
    const weightRecords = healthRecords.filter((r) => r.type === 'weight');

    // 혈압 평균
    let bloodPressureMetrics;
    if (bloodPressureRecords.length > 0) {
      const avgSystolic =
        bloodPressureRecords.reduce((sum, r) => sum + (r.value as any).systolic, 0) / bloodPressureRecords.length;
      const avgDiastolic =
        bloodPressureRecords.reduce((sum, r) => sum + (r.value as any).diastolic, 0) / bloodPressureRecords.length;
      const status = HealthService.isBloodPressureNormal(avgSystolic, avgDiastolic);

      bloodPressureMetrics = {
        average: `${Math.round(avgSystolic)}/${Math.round(avgDiastolic)}`,
        status: status.message,
        count: bloodPressureRecords.length,
      };
    }

    // 혈당 평균
    let bloodSugarMetrics;
    if (bloodSugarRecords.length > 0) {
      const avgBloodSugar =
        bloodSugarRecords.reduce((sum, r) => sum + (r.value as number), 0) / bloodSugarRecords.length;
      const status = HealthService.isBloodSugarNormal(avgBloodSugar);

      bloodSugarMetrics = {
        average: Math.round(avgBloodSugar),
        status: status.message,
        count: bloodSugarRecords.length,
      };
    }

    // 체중 변화
    let weightMetrics;
    if (weightRecords.length > 1) {
      const current = weightRecords[0].value as number;
      const previous = weightRecords[weightRecords.length - 1].value as number;
      const change = current - previous;

      weightMetrics = {
        current,
        change: parseFloat(change.toFixed(1)),
        count: weightRecords.length,
      };
    }

    // AI로 요약 및 권장사항 생성
    const contextForAI = `
주간 건강 리포트 데이터:
- 기간: ${formatDate(startDate)} ~ ${formatDate(endDate)}
- 복약 순응도: ${adherenceRate.toFixed(1)}% (총 ${totalLogs}회 중 ${takenLogs.length}회 복용)
${bloodPressureMetrics ? `- 평균 혈압: ${bloodPressureMetrics.average} mmHg (${bloodPressureMetrics.count}회 측정)` : ''}
${bloodSugarMetrics ? `- 평균 혈당: ${bloodSugarMetrics.average} mg/dL (${bloodSugarMetrics.count}회 측정)` : ''}
${weightMetrics ? `- 체중 변화: ${weightMetrics.change > 0 ? '+' : ''}${weightMetrics.change} kg` : ''}

위 데이터를 바탕으로:
1. 3-5줄의 간단한 요약을 작성해주세요
2. 3-5개의 건강 관리 권장사항을 bullet point로 작성해주세요
`;

    const openai = this.getOpenAI();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: this.getSystemPrompt() },
        { role: 'user', content: contextForAI },
      ],
      temperature: 0.7,
      max_tokens: 600,
    });

    const aiResponse = completion.choices[0]?.message?.content || '';

    // AI 응답에서 요약과 권장사항 분리
    const lines = aiResponse.split('\n').filter((line) => line.trim());
    const recommendations: string[] = [];
    let summary = '';
    let inRecommendations = false;

    for (const line of lines) {
      if (line.includes('권장') || line.includes('추천') || line.includes('•') || line.includes('-')) {
        inRecommendations = true;
        const cleaned = line.replace(/^[•\-\*]\s*/, '').trim();
        if (cleaned) recommendations.push(cleaned);
      } else if (!inRecommendations && line.trim()) {
        summary += line.trim() + ' ';
      }
    }

    return {
      period: `${formatDate(startDate)} ~ ${formatDate(endDate)}`,
      medicationAdherence: {
        rate: adherenceRate,
        totalDoses: totalLogs,
        takenDoses: takenLogs.length,
        missedDoses: totalLogs - takenLogs.length,
      },
      healthMetrics: {
        bloodPressure: bloodPressureMetrics,
        bloodSugar: bloodSugarMetrics,
        weight: weightMetrics,
      },
      recommendations: recommendations.length > 0 ? recommendations : ['꾸준한 건강 관리를 계속해주세요!'],
      summary: summary.trim() || '이번 주도 건강 관리를 잘 하고 계십니다.',
    };
  }

  /**
   * 대화 삭제
   */
  static async deleteConversation(conversationId: string): Promise<void> {
    const { error } = await supabase.from('ai_conversations').delete().eq('id', conversationId);

    if (error) throw error;
  }

  /**
   * 간단한 건강 조언 받기 (대화 기록 없이)
   */
  static async getQuickAdvice(question: string, userId: string): Promise<string> {
    const context = await this.getUserHealthContext(userId);

    const openai = this.getOpenAI();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: this.getSystemPrompt() },
        { role: 'system', content: `사용자 건강 정보:\n${context}` },
        { role: 'user', content: question },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    return completion.choices[0]?.message?.content || '답변을 생성하지 못했습니다.';
  }
}
