'use client';

import Card from '@/components/Card';
import Button from '@/components/Button';
import BottomNav from '@/components/BottomNav';
import { useState } from 'react';

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');

  const upcomingBookings = [
    {
      id: 1,
      time: '11:00',
      icon: '💈',
      title: '명성이발관',
      service: '일반 이발',
      status: 'arrived',
    },
    {
      id: 2,
      time: '14:00',
      icon: '🧹',
      title: '깨끗한 청소',
      service: '일반 청소 (3시간)',
      status: 'scheduled',
    },
  ];

  const completedBookings = [
    {
      id: 3,
      date: '1월 19일',
      icon: '💈',
      title: '명성이발관',
      service: '일반 이발',
      rating: 5,
    },
    {
      id: 4,
      date: '1월 15일',
      icon: '🏥',
      title: '천호 정형외과',
      service: '무릎 진료',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white px-4 py-6 shadow-sm">
        <div className="max-w-screen-sm mx-auto">
          <h1 className="text-2xl font-bold text-gray-600">내 예약</h1>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-screen-sm mx-auto flex">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 py-4 text-lg font-bold border-b-2 transition-colors ${
              activeTab === 'upcoming'
                ? 'text-primary border-primary'
                : 'text-gray-400 border-transparent'
            }`}
          >
            예정
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-4 text-lg font-bold border-b-2 transition-colors ${
              activeTab === 'completed'
                ? 'text-primary border-primary'
                : 'text-gray-400 border-transparent'
            }`}
          >
            완료
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-screen-sm mx-auto px-4 py-6 space-y-6">
        {activeTab === 'upcoming' ? (
          <>
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-gray-600">오늘</h2>

              {upcomingBookings.map((booking) => (
                <Card key={booking.id}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-primary-light to-primary rounded-xl text-2xl">
                          {booking.icon}
                        </div>
                        <div>
                          <div className="text-lg font-bold">{booking.time}</div>
                          <div className="text-base text-gray-600">{booking.title}</div>
                          <div className="text-sm text-gray-500">{booking.service}</div>
                        </div>
                      </div>
                      {booking.status === 'arrived' && (
                        <span className="px-3 py-1 bg-success text-white rounded-full text-sm font-bold">
                          도착
                        </span>
                      )}
                    </div>

                    {booking.status === 'arrived' ? (
                      <div className="pt-4 border-t border-gray-100">
                        <div className="text-center mb-3">
                          <p className="text-sm text-gray-500 mb-2">
                            사장님께 이 코드를 보여주세요
                          </p>
                          <div className="inline-block px-6 py-3 bg-gray-100 rounded-xl">
                            <span className="text-2xl font-mono font-bold">MS-2025-001</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          fullWidth
                          onClick={() => alert('위치 보기')}
                        >
                          위치 보기
                        </Button>
                        <Button fullWidth onClick={() => alert('도착했어요')}>
                          도착했어요
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </section>
          </>
        ) : (
          <>
            <section className="space-y-4">
              {completedBookings.map((booking) => (
                <Card key={booking.id} variant="completed">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 flex items-center justify-center bg-gray-300 rounded-xl text-2xl">
                        {booking.icon}
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">{booking.date}</div>
                        <div className="text-base font-bold text-gray-600">{booking.title}</div>
                        <div className="text-sm text-gray-500">{booking.service}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {'⭐'.repeat(booking.rating)}
                    </div>
                  </div>
                </Card>
              ))}
            </section>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
