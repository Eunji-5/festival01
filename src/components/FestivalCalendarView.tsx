import React, { useState } from 'react';
import { FestivalItem } from '../types';
import { Calendar, ChevronLeft, ChevronRight, MapPin, Sparkles, Filter } from 'lucide-react';

interface FestivalCalendarViewProps {
  festivals: FestivalItem[];
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  onSelectFestival: (festival: FestivalItem) => void;
}

export const FestivalCalendarView: React.FC<FestivalCalendarViewProps> = ({
  festivals,
  selectedMonth,
  setSelectedMonth,
  onSelectFestival,
}) => {
  const [activeMonthNum, setActiveMonthNum] = useState<number>(
    selectedMonth === 'ALL' ? new Date().getMonth() + 1 : parseInt(selectedMonth, 10)
  );

  const monthsList = Array.from({ length: 12 }, (_, i) => i + 1);

  // Group festivals by month
  const festivalsByMonth = monthsList.map((m) => {
    return {
      month: m,
      items: festivals.filter((item) => item.month === m)
    };
  });

  const currentMonthData = festivalsByMonth.find((m) => m.month === activeMonthNum) || {
    month: activeMonthNum,
    items: []
  };

  const handlePrevMonth = () => {
    const prev = activeMonthNum === 1 ? 12 : activeMonthNum - 1;
    setActiveMonthNum(prev);
    setSelectedMonth(String(prev));
  };

  const handleNextMonth = () => {
    const next = activeMonthNum === 12 ? 1 : activeMonthNum + 1;
    setActiveMonthNum(next);
    setSelectedMonth(String(next));
  };

  return (
    <div className="space-y-6">
      
      {/* Month Navigation & Selector */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                2026년 {activeMonthNum}월 부산 축제 달력
              </h2>
              <p className="text-xs text-slate-500">
                해당 월에 개최되는 부산 대표 문화·해양 축제 모음
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
              title="이전 달"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-extrabold text-blue-600 px-3 py-1 bg-blue-50 rounded-xl border border-blue-200">
              {activeMonthNum}월
            </span>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
              title="다음 달"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 12 Months Quick Switcher Pills */}
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-1.5 pt-2">
          {monthsList.map((m) => {
            const count = festivals.filter((f) => f.month === m).length;
            const isSelected = activeMonthNum === m;
            return (
              <button
                key={m}
                onClick={() => {
                  setActiveMonthNum(m);
                  setSelectedMonth(String(m));
                }}
                className={`py-2 px-1 rounded-xl text-center transition flex flex-col items-center justify-center border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-md'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <span className="text-xs font-bold">{m}월</span>
                <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                  {count}건
                </span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Selected Month Festival List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <span>{activeMonthNum}월의 부산 축제 ({currentMonthData.items.length}개)</span>
          </h3>
        </div>

        {currentMonthData.items.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <p className="text-slate-600 font-medium text-sm">
              {activeMonthNum}월에 해당하는 축제 검색 결과가 없거나 등록된 축제가 없습니다.
            </p>
            <p className="text-xs text-slate-400">
              상단의 월 선택 버튼을 누르시거나 검색 필터를 변경해보세요.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentMonthData.items.map((festival) => (
              <div
                key={festival.UC_SEQ}
                onClick={() => onSelectFestival(festival)}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 hover:shadow-lg transition cursor-pointer hover:border-blue-300 flex items-start gap-3 group"
              >
                <img
                  src={festival.MAIN_IMG_THUMB || festival.MAIN_IMG_NORMAL}
                  alt={festival.TITLE}
                  className="w-20 h-20 rounded-xl object-cover shrink-0 bg-slate-100 group-hover:scale-105 transition"
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                      📍 {festival.GUGUN_NM}
                    </span>
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                      {festival.USAGE_AMOUNT || '무료'}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition truncate">
                    {festival.TITLE}
                  </h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-blue-500 shrink-0" />
                    <span className="truncate">{festival.USAGE_DAY}</span>
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                    <span className="truncate">{festival.MAIN_PLACE || festival.ADDR1}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
