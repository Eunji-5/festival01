import React from 'react';
import { FestivalItem } from '../types';
import { MapPin, Calendar, Heart, ExternalLink, ChevronRight, Coins, Phone, Tag } from 'lucide-react';

interface FestivalCardProps {
  festival: FestivalItem;
  isSaved: boolean;
  onToggleSave: (festival: FestivalItem) => void;
  onSelectFestival: (festival: FestivalItem) => void;
}

export const FestivalCard: React.FC<FestivalCardProps> = ({
  festival,
  isSaved,
  onToggleSave,
  onSelectFestival,
}) => {
  const isFree = festival.USAGE_AMOUNT && (festival.USAGE_AMOUNT.includes('무료') || festival.USAGE_AMOUNT.includes('0원'));

  // Status badge styling
  const getStatusBadge = () => {
    switch (festival.status) {
      case 'ONGOING':
        return <span className="bg-emerald-500 text-white px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs animate-pulse">● 진행중</span>;
      case 'UPCOMING':
        return <span className="bg-sky-600 text-white px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs">개최예정</span>;
      case 'ALL_YEAR':
        return <span className="bg-indigo-600 text-white px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs">상설/연중</span>;
      case 'ENDED':
      default:
        return <span className="bg-slate-600 text-white px-2.5 py-1 rounded-full text-[11px] font-semibold">종료</span>;
    }
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
      
      {/* Image & Overlay Header */}
      <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
        <img
          src={festival.MAIN_IMG_NORMAL || festival.MAIN_IMG_THUMB || 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?auto=format&fit=crop&w=800&q=80'}
          alt={festival.TITLE}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            // Fallback image if remote url fails
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            {getStatusBadge()}
            <span className="bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/20">
              📍 {festival.GUGUN_NM}
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(festival);
            }}
            className="pointer-events-auto w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-slate-700 hover:text-rose-500 flex items-center justify-center shadow-md transition hover:scale-110 active:scale-95"
            title={isSaved ? '관심 축제에서 제거' : '관심 축제로 저장'}
          >
            <Heart className={`w-5 h-5 transition ${isSaved ? 'text-rose-500 fill-rose-500' : 'text-slate-600'}`} />
          </button>
        </div>

        {/* Bottom Image Overlay Title */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[11px] text-sky-200 font-semibold uppercase tracking-wider bg-sky-950/60 px-2 py-0.5 rounded-md backdrop-blur-xs border border-sky-400/30">
              {festival.month}월 축제
            </span>
            {isFree && (
              <span className="text-[11px] text-emerald-300 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-md backdrop-blur-xs border border-emerald-400/30">
                무료
              </span>
            )}
          </div>
          <h3 className="text-base sm:text-lg font-bold leading-tight line-clamp-1 group-hover:text-sky-300 transition-colors">
            {festival.TITLE}
          </h3>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        
        <div className="space-y-2">
          {festival.SUBTITLE && (
            <p className="text-xs text-slate-500 font-medium line-clamp-1">
              {festival.SUBTITLE}
            </p>
          )}

          <div className="space-y-1.5 text-xs text-slate-600">
            {/* Date */}
            <div className="flex items-start gap-2">
              <Calendar className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span className="font-semibold text-slate-800 line-clamp-1">
                {festival.USAGE_DAY || '일정 확인'}
              </span>
            </div>

            {/* Place */}
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span className="line-clamp-1 text-slate-600">
                {festival.MAIN_PLACE || festival.ADDR1 || festival.GUGUN_NM}
              </span>
            </div>

            {/* Fee */}
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-500 shrink-0" />
              <span className={`font-medium ${isFree ? 'text-emerald-600 font-semibold' : 'text-slate-600'}`}>
                {festival.USAGE_AMOUNT || '무료'}
              </span>
            </div>
          </div>

          {/* Description Snippet */}
          {festival.ITEMCNTNTS && (
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed pt-1 border-t border-slate-100">
              {festival.ITEMCNTNTS.replace(/<[^>]*>?/gm, '')}
            </p>
          )}
        </div>

        {/* Card Footer Button */}
        <div className="pt-2">
          <button
            onClick={() => onSelectFestival(festival)}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 group-hover:bg-blue-600 group-hover:text-white"
          >
            <span>상세보기 및 위치</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
