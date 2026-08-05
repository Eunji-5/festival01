import React, { useState } from 'react';
import { FestivalItem } from '../types';
import { 
  X, MapPin, Calendar, Clock, Phone, ExternalLink, Heart, Share2, 
  Coins, Bus, Info, Navigation, Check, Copy, Sparkles, Building2 
} from 'lucide-react';

interface FestivalDetailModalProps {
  festival: FestivalItem | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (festival: FestivalItem) => void;
  onOpenAiPlannerForFestival?: (festival: FestivalItem) => void;
}

export const FestivalDetailModal: React.FC<FestivalDetailModalProps> = ({
  festival,
  onClose,
  isSaved,
  onToggleSave,
  onOpenAiPlannerForFestival,
}) => {
  const [copied, setCopied] = useState(false);

  if (!festival) return null;

  const handleCopyLink = () => {
    const textToCopy = `${festival.TITLE}\n기간: ${festival.USAGE_DAY}\n장소: ${festival.MAIN_PLACE || festival.ADDR1}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isFree = festival.USAGE_AMOUNT && (festival.USAGE_AMOUNT.includes('무료') || festival.USAGE_AMOUNT.includes('0원'));

  // Kakao Map & Naver Map search links
  const placeSearchTerm = encodeURIComponent(`${festival.TITLE} ${festival.GUGUN_NM}`);
  const kakaoMapUrl = `https://map.kakao.com/?q=${placeSearchTerm}`;
  const naverMapUrl = `https://map.naver.com/v5/search/${placeSearchTerm}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      
      <div 
        className="relative bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-100 my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Hero Image */}
        <div className="relative h-64 sm:h-72 w-full bg-slate-900 shrink-0">
          <img
            src={festival.MAIN_IMG_NORMAL || festival.MAIN_IMG_THUMB || 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?auto=format&fit=crop&w=1200&q=80'}
            alt={festival.TITLE}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?auto=format&fit=crop&w=1200&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />

          {/* Close & Action Buttons */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="w-10 h-10 rounded-full bg-slate-900/60 hover:bg-slate-900 backdrop-blur-md text-white flex items-center justify-center transition border border-white/20"
              title="축제 정보 공유/복사"
            >
              {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Share2 className="w-5 h-5" />}
            </button>

            <button
              onClick={() => onToggleSave(festival)}
              className="w-10 h-10 rounded-full bg-slate-900/60 hover:bg-slate-900 backdrop-blur-md text-white flex items-center justify-center transition border border-white/20"
              title={isSaved ? '관심 축제 삭제' : '관심 축제 저장'}
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'text-rose-500 fill-rose-500' : 'text-white'}`} />
            </button>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-slate-900/60 hover:bg-slate-900 backdrop-blur-md text-white flex items-center justify-center transition border border-white/20"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Title Banner on Hero */}
          <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="bg-blue-600 text-white font-bold px-2.5 py-1 rounded-full">
                📍 {festival.GUGUN_NM}
              </span>
              <span className="bg-sky-500/90 text-white font-bold px-2.5 py-1 rounded-full backdrop-blur-xs">
                🗓️ {festival.month}월 개최
              </span>
              {isFree && (
                <span className="bg-emerald-500 text-white font-bold px-2.5 py-1 rounded-full">
                  무료 입장
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight pt-1">
              {festival.TITLE}
            </h2>
            {festival.SUBTITLE && (
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                {festival.SUBTITLE}
              </p>
            )}
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          
          {/* Quick Info Grid Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Date / Time */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start gap-3">
              <div className="p-2 bg-blue-100 text-blue-700 rounded-xl shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="text-xs space-y-0.5">
                <span className="font-bold text-slate-500 uppercase tracking-wider block">축제 기간 및 시간</span>
                <p className="font-bold text-slate-900 text-sm">{festival.USAGE_DAY || '일정 문의'}</p>
                {festival.USAGE_DAY_WEEK_AND_TIME && (
                  <p className="text-slate-600">{festival.USAGE_DAY_WEEK_AND_TIME}</p>
                )}
              </div>
            </div>

            {/* Location & Address */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start gap-3">
              <div className="p-2 bg-rose-100 text-rose-700 rounded-xl shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="text-xs space-y-0.5">
                <span className="font-bold text-slate-500 uppercase tracking-wider block">개최 장소</span>
                <p className="font-bold text-slate-900 text-sm">{festival.MAIN_PLACE || festival.GUGUN_NM}</p>
                <p className="text-slate-600">{festival.ADDR1} {festival.ADDR2}</p>
              </div>
            </div>

            {/* Admission Fee */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start gap-3">
              <div className="p-2 bg-amber-100 text-amber-700 rounded-xl shrink-0">
                <Coins className="w-5 h-5" />
              </div>
              <div className="text-xs space-y-0.5">
                <span className="font-bold text-slate-500 uppercase tracking-wider block">입장료 및 관람료</span>
                <p className={`font-bold text-sm ${isFree ? 'text-emerald-700' : 'text-slate-900'}`}>
                  {festival.USAGE_AMOUNT || '무료'}
                </p>
              </div>
            </div>

            {/* Contact Phone */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start gap-3">
              <div className="p-2 bg-sky-100 text-sky-700 rounded-xl shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="text-xs space-y-0.5">
                <span className="font-bold text-slate-500 uppercase tracking-wider block">문의 전화</span>
                {festival.CNTCT_TEL ? (
                  <a href={`tel:${festival.CNTCT_TEL}`} className="font-bold text-blue-600 hover:underline text-sm">
                    {festival.CNTCT_TEL}
                  </a>
                ) : (
                  <p className="text-slate-500">정보 없음</p>
                )}
              </div>
            </div>

          </div>

          {/* Description Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
              <Info className="w-4 h-4 text-blue-600" />
              <span>축제 소개 및 행사 상세</span>
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {festival.ITEMCNTNTS ? festival.ITEMCNTNTS.replace(/<[^>]*>?/gm, '') : '상세 설명이 등록되지 않았습니다.'}
            </p>
          </div>

          {/* Traffic & Transit Info */}
          {festival.TRFC_INFO && (
            <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-100 space-y-1.5 text-xs text-sky-950">
              <div className="font-bold flex items-center gap-2 text-sky-800 text-sm">
                <Bus className="w-4 h-4" />
                <span>교통 및 오시는 길</span>
              </div>
              <p className="leading-relaxed">{festival.TRFC_INFO}</p>
            </div>
          )}

          {/* Direct Map Navigation Links */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-blue-600" />
                <span>길찾기 및 지도 연결</span>
              </span>
              <span className="text-[11px] text-slate-400">포털 지도로 이동</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={kakaoMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
              >
                <span>카카오맵 연결</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href={naverMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
              >
                <span>네이버지도 연결</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Official Website Link */}
          {festival.HOMEPAGE_URL && (
            <div className="pt-2">
              <a
                href={festival.HOMEPAGE_URL.startsWith('http') ? festival.HOMEPAGE_URL : `http://${festival.HOMEPAGE_URL}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-md"
              >
                <Building2 className="w-4 h-4" />
                <span>공식 홈페이지 바로가기</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
