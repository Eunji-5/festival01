import React, { useState } from 'react';
import { FestivalItem } from '../types';
import { BUSAN_GUGUNS } from '../data/fallbackFestivals';
import { MapPin, Navigation, Calendar, ChevronRight, Layers, Sparkles } from 'lucide-react';

interface FestivalMapViewProps {
  festivals: FestivalItem[];
  selectedGugun: string;
  setSelectedGugun: (gugun: string) => void;
  onSelectFestival: (festival: FestivalItem) => void;
}

export const FestivalMapView: React.FC<FestivalMapViewProps> = ({
  festivals,
  selectedGugun,
  setSelectedGugun,
  onSelectFestival,
}) => {
  const activeGugun = selectedGugun === 'ALL' ? '전체' : selectedGugun;

  // Count festivals per district
  const countsByGugun = BUSAN_GUGUNS.reduce((acc, g) => {
    if (g === '전체') {
      acc[g] = festivals.length;
    } else {
      acc[g] = festivals.filter((f) => f.GUGUN_NM.includes(g)).length;
    }
    return acc;
  }, {} as Record<string, number>);

  const displayedFestivals = activeGugun === '전체'
    ? festivals
    : festivals.filter((f) => f.GUGUN_NM.includes(activeGugun));

  return (
    <div className="space-y-6">
      
      {/* Interactive Map Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-sky-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-sky-500/30 text-sky-200 border border-sky-400/30 rounded-full text-xs font-bold backdrop-blur-md">
              📍 부산광역시 16개 구·군
            </span>
            <span className="text-xs text-slate-300">
              클릭하여 구·군별 축제 지도 보기
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            {activeGugun === '전체' ? '부산 전지역 축제 지형도' : `${activeGugun} 축제 모아보기`}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            해운대·광안리 해변부터 자갈치 수산시장, 센텀시티, 기장 대변항, 삼락생태공원까지 부산 구·군별 명소 축제를 탐색하세요.
          </p>
        </div>
      </div>

      {/* Busan District Selection Grid */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-500" />
            <span>부산 구·군 지역 선택</span>
          </h3>
          <span className="text-xs text-slate-500">
            선택 지역: <strong className="text-blue-600">{activeGugun}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {BUSAN_GUGUNS.map((gugun) => {
            const count = countsByGugun[gugun] || 0;
            const isSelected = (gugun === '전체' && activeGugun === '전체') || activeGugun === gugun;
            return (
              <button
                key={gugun}
                onClick={() => setSelectedGugun(gugun === '전체' ? 'ALL' : gugun)}
                className={`p-2.5 rounded-2xl text-left transition flex flex-col justify-between border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-[1.02]'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200/80'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-extrabold">{gugun}</span>
                  <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-200' : 'text-slate-400'}`} />
                </div>
                <div className="mt-2 text-[11px] flex items-center justify-between">
                  <span className={isSelected ? 'text-blue-100' : 'text-slate-500'}>축제</span>
                  <span className={`font-bold px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                    {count}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* District Festival List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            {activeGugun} 지역 축제 ({displayedFestivals.length}개)
          </h3>
        </div>

        {displayedFestivals.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-2">
            <p className="text-slate-600 font-medium text-sm">
              {activeGugun}에 검색 조건과 일치하는 축제가 없습니다.
            </p>
            <button
              onClick={() => setSelectedGugun('ALL')}
              className="text-xs text-blue-600 font-bold hover:underline"
            >
              전체 지역 보기로 돌아가기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedFestivals.map((festival) => (
              <div
                key={festival.UC_SEQ}
                onClick={() => onSelectFestival(festival)}
                className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-lg transition cursor-pointer flex flex-col justify-between space-y-3 group"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={festival.MAIN_IMG_THUMB || festival.MAIN_IMG_NORMAL}
                    alt={festival.TITLE}
                    className="w-20 h-20 rounded-xl object-cover shrink-0 bg-slate-100 group-hover:scale-105 transition"
                  />
                  <div className="space-y-1 min-w-0 flex-1">
                    <span className="text-[10px] font-bold bg-rose-50 text-rose-700 px-2 py-0.5 rounded-md">
                      📍 {festival.GUGUN_NM}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 line-clamp-1 group-hover:text-blue-600 transition">
                      {festival.TITLE}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {festival.MAIN_PLACE || festival.ADDR1}
                    </p>
                    <p className="text-xs text-blue-600 font-semibold flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{festival.USAGE_DAY}</span>
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>{festival.USAGE_AMOUNT || '무료'}</span>
                  <span className="text-blue-600 group-hover:translate-x-1 transition flex items-center gap-0.5">
                    상세보기 <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
