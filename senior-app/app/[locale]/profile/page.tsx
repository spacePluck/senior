'use client';

import Card from '@/components/Card';
import BottomNav from '@/components/BottomNav';

export default function ProfilePage() {
  const menuItems = [
    { icon: '💳', label: '결제 수단 관리', path: '/profile/payment' },
    { icon: '👪', label: '가족 연결', path: '/profile/family' },
    { icon: '📍', label: '주소 관리', path: '/profile/address' },
    { icon: '💊', label: '약 관리', path: '/profile/medicine' },
    { icon: '🔔', label: '알림 설정', path: '/profile/notifications' },
    { icon: '❓', label: '고객센터', path: '/profile/support' },
    { icon: '⚙️', label: '설정', path: '/profile/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white px-4 py-6 shadow-sm">
        <div className="max-w-screen-sm mx-auto">
          <h1 className="text-2xl font-bold text-gray-600">내 정보</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-screen-sm mx-auto px-4 py-6 space-y-6">
        {/* Profile Section */}
        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-light to-primary rounded-full flex items-center justify-center text-3xl">
                👤
              </div>
              <div>
                <h2 className="text-xl font-bold">홍길동님</h2>
                <p className="text-base text-gray-500">010-1234-5678</p>
              </div>
            </div>
            <button className="text-sm text-primary font-bold px-4 py-2 rounded-lg hover:bg-gray-50">
              수정
            </button>
          </div>

          {/* Points */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-base text-gray-600">보유 포인트</span>
              <span className="text-xl font-bold text-primary">2,500P</span>
            </div>
          </div>
        </Card>

        {/* Menu Items */}
        <section className="space-y-3">
          {menuItems.map((item) => (
            <Card
              key={item.path}
              onClick={() => alert(`${item.label} 페이지로 이동`)}
              className="cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-lg">{item.label}</span>
                </div>
                <span className="text-2xl text-gray-400">→</span>
              </div>
            </Card>
          ))}
        </section>

        {/* Logout */}
        <button className="w-full py-4 text-base text-gray-500 hover:text-gray-700 font-medium">
          로그아웃
        </button>
      </main>

      <BottomNav />
    </div>
  );
}
