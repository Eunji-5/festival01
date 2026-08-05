import React, { useState } from 'react';
import { Sparkles, X, Compass, Calendar, MapPin, Users, Heart, Loader2 } from 'lucide-react';
import { BUSAN_GUGUNS, MONTHS } from '../data/fallbackFestivals';
import { FestivalItem } from '../types';

interface AiPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFestival?: FestivalItem | null;
}

export const AiPlannerModal: React.FC<AiPlannerModalProps> = ({
  isOpen,
  onClose,
  initialFestival,
}) => {
  const [gugun, setGugun] = useState(initialFestival ? initialFestival.GUGUN_NM : '전체');
  const [month, setMonth] = useState(initialFestival ? String(initialFestival.month) : '전체');
  const [companion, setCompanion] = useState('가족/연인');
  const [preference, setPreference] = useState('해양/야경/먹거리');
  const [keyword, setKeyword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/festivals/ai-recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gugun,
          month,
          companion,
          preference,
          keyword,
        }),
      });

      const data = await response.json();
      if (response.ok && data.recommendation) {
        setResult(data.recommendation);
      } else {
        setError(data.error || 'AI 추천을 생성하는 도중 오류가 발생했습니다.');
      }
    } catch (err: any) {
      setError('서버 연결 실패: ' + (err.message || '다시 시도해주세요.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 my-auto flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Sparkles className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
                AI 부산 축제 맞춤 여행 가이드
              </h2>
              <p className="text-xs text-amber-100">
                원하는 구·군과 스타일에 맞춰 나만의 부산 축제 코스를 설계해 드립니다.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-800 flex-1">
          
          <form onSubmit={handleGenerate} className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Gugun Selector */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>희망 지역 (구/군)</span>
                </label>
                <select
                  value={gugun}
                  onChange={(e) => setGugun(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-orange-500/30 outline-none"
                >
                  {BUSAN_GUGUNS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              {/* Month Selector */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-500" />
                  <span>방문 예정 월</span>
                </label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-orange-500/30 outline-none"
                >
                  <option value="전체">상관없음 (전체)</option>
                  {MONTHS.filter(m => m.value !== 'ALL').map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>

              {/* Companion */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-emerald-500" />
                  <span>동행자</span>
                </label>
                <select
                  value={companion}
                  onChange={(e) => setCompanion(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-orange-500/30 outline-none"
                >
                  <option value="가족/어린이">가족 / 어린이 동반</option>
                  <option value="연인/데이트">연인 데이트</option>
                  <option value="친구/그룹">친구들과 활기차게</option>
                  <option value="혼자 여행">나홀로 유유자적</option>
                  <option value="부모님 동반">부모님 효도 여행</option>
                </select>
              </div>

              {/* Preference */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-amber-500" />
                  <span>선호하는 여행 테마</span>
                </label>
                <select
                  value={preference}
                  onChange={(e) => setPreference(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-orange-500/30 outline-none"
                >
                  <option value="해양/야경/불꽃">해양 바다 & 화려한 야경/불꽃</option>
                  <option value="수산물/맛집/식도락">수산물 & 전통시장 맛집 투어</option>
                  <option value="음악/공연/영화">음악 페스티벌 & 영화/문화예술</option>
                  <option value="꽃/자연/산책">꽃밭 & 생태공원 힐링 산책</option>
                  <option value="역사/전통체험">조선 역사 & 골목길 마을 체험</option>
                </select>
              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Gemini AI가 부산 축제 코스를 만드는 중...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>맞춤 축제 코스 생성하기</span>
                </>
              )}
            </button>

          </form>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          {/* AI Recommendation Output */}
          {result && (
            <div className="p-5 bg-gradient-to-b from-amber-50/50 to-orange-50/30 rounded-2xl border border-amber-200/80 space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2 pb-2 border-b border-amber-200/60 text-amber-900 font-extrabold text-sm">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>AI가 추천하는 부산 축제 여정</span>
              </div>
              <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line space-y-2">
                {result}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
