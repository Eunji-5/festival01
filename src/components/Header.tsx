import React from 'react';
import { Sparkles, Heart, Search, MapPin, Waves, Calendar, Filter } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  savedCount: number;
  onOpenSavedDrawer: () => void;
  onOpenAiPlanner: () => void;
  activeView: 'grid' | 'calendar' | 'map';
  setActiveView: (view: 'grid' | 'calendar' | 'map') => void;
  totalCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  savedCount,
  onOpenSavedDrawer,
  onOpenAiPlanner,
  activeView,
  setActiveView,
  totalCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between py-3.5 gap-3">
          
          {/* Logo & Brand Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Waves className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                    부산 축제 나비게이터
                  </h1>
                  <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200 rounded-full">
                    Dynamic Busan
                  </span>
                </div>
                <p className="text-xs text-slate-5 font-medium text-slate-500 hidden sm:block">
                  지역별 · 날짜별로 쉽게 찾는 부산 해양·문화 축제 가이드 ({totalCount}개의 축제)
                </p>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={onOpenAiPlanner}
                className="p-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-medium flex items-center gap-1 shadow-xs"
              >
                <Sparkles className="w-4 h-4" />
                <span>AI 코스</span>
              </button>
              <button
                onClick={onOpenSavedDrawer}
                className="relative p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
              >
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500/20" />
                {savedCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {savedCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search Input & Controls */}
          <div className="flex items-center gap-2.5 flex-1 max-w-2xl">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="축제명, 구/군(해운대, 수영구 등), 키워드 검색..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition placeholder:text-slate-400 text-slate-800"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 rounded-full w-4 h-4 flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>

            {/* View Toggle Tabs */}
            <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
              <button
                onClick={() => setActiveView('grid')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                  activeView === 'grid'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                <span>목록</span>
              </button>
              <button
                onClick={() => setActiveView('calendar')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                  activeView === 'calendar'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>달력</span>
              </button>
              <button
                onClick={() => setActiveView('map')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                  activeView === 'map'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>지도</span>
              </button>
            </div>

            {/* Desktop Action Buttons */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={onOpenAiPlanner}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:opacity-95 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>AI 축제 코스</span>
              </button>

              <button
                onClick={onOpenSavedDrawer}
                className="relative px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
                <span>관심</span>
                {savedCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[11px] font-bold">
                    {savedCount}
                  </span>
                )}
              </button>
            </div>

          </div>

        </div>

        {/* Mobile View Switcher Row */}
        <div className="flex sm:hidden items-center justify-between pb-3 border-t border-slate-100 pt-2">
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 w-full justify-around text-xs">
            <button
              onClick={() => setActiveView('grid')}
              className={`flex-1 py-1.5 text-center font-medium rounded-md ${
                activeView === 'grid' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              카드 목록
            </button>
            <button
              onClick={() => setActiveView('calendar')}
              className={`flex-1 py-1.5 text-center font-medium rounded-md ${
                activeView === 'calendar' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              날짜 달력
            </button>
            <button
              onClick={() => setActiveView('map')}
              className={`flex-1 py-1.5 text-center font-medium rounded-md ${
                activeView === 'map' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              구/군 지도
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};
