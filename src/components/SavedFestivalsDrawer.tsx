import React from 'react';
import { FestivalItem } from '../types';
import { Heart, X, Trash2, Calendar, MapPin, ChevronRight, ExternalLink } from 'lucide-react';

interface SavedFestivalsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedFestivals: FestivalItem[];
  onRemoveSave: (festival: FestivalItem) => void;
  onSelectFestival: (festival: FestivalItem) => void;
}

export const SavedFestivalsDrawer: React.FC<SavedFestivalsDrawerProps> = ({
  isOpen,
  onClose,
  savedFestivals,
  onRemoveSave,
  onSelectFestival,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h2 className="text-base font-extrabold tracking-tight">
              내가 담은 관심 부산 축제 ({savedFestivals.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {savedFestivals.length === 0 ? (
            <div className="py-20 text-center space-y-3 text-slate-500">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-400 mx-auto flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold">아직 담아둔 축제가 없습니다.</p>
              <p className="text-xs text-slate-400">
                축제 카드의 하트 버튼을 눌러 관심 축제로 저장해보세요!
              </p>
            </div>
          ) : (
            savedFestivals.map((festival) => (
              <div
                key={festival.UC_SEQ}
                className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3 relative group hover:border-blue-300 transition"
              >
                <img
                  src={festival.MAIN_IMG_THUMB || festival.MAIN_IMG_NORMAL}
                  alt={festival.TITLE}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 bg-slate-200"
                />

                <div 
                  className="flex-1 min-w-0 cursor-pointer space-y-0.5"
                  onClick={() => {
                    onSelectFestival(festival);
                    onClose();
                  }}
                >
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded">
                    📍 {festival.GUGUN_NM}
                  </span>
                  <h4 className="font-bold text-xs text-slate-900 truncate group-hover:text-blue-600 transition">
                    {festival.TITLE}
                  </h4>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-blue-500 shrink-0" />
                    <span className="truncate">{festival.USAGE_DAY}</span>
                  </p>
                </div>

                <button
                  onClick={() => onRemoveSave(festival)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition shrink-0"
                  title="삭제"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {savedFestivals.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-500 font-medium">
              저장된 축제 정보는 브라우저에 안전하게 보관됩니다.
            </p>
          </div>
        )}

      </div>

    </div>
  );
};
