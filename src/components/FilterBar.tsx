import React from 'react';
import { BUSAN_GUGUNS, MONTHS } from '../data/fallbackFestivals';
import { FilterState, SortOrder } from '../types';
import { MapPin, Calendar, SlidersHorizontal, RotateCcw, Check, Clock } from 'lucide-react';

interface FilterBarProps {
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  onResetFilters: () => void;
  filteredCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filterState,
  setFilterState,
  onResetFilters,
  filteredCount,
}) => {

  const handleGugunChange = (gugun: string) => {
    setFilterState(prev => ({
      ...prev,
      gugun: gugun === '전체' ? 'ALL' : gugun
    }));
  };

  const handleMonthChange = (month: string) => {
    setFilterState(prev => ({
      ...prev,
      month
    }));
  };

  const handleStatusChange = (status: string) => {
    setFilterState(prev => ({
      ...prev,
      status
    }));
  };

  const handleSortChange = (sortOrder: SortOrder) => {
    setFilterState(prev => ({
      ...prev,
      sortOrder
    }));
  };

  const activeGugunLabel = filterState.gugun === 'ALL' ? '전체 구/군' : filterState.gugun;
  const isFiltered = filterState.gugun !== 'ALL' || filterState.month !== 'ALL' || filterState.status !== 'ALL' || filterState.onlyFree || filterState.searchQuery !== '';

  return (
    <div className="bg-white border-b border-slate-200/90 py-4 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3.5">
        
        {/* Section 1: District Filter Pills (지역별) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>지역별 선택 (부산 구·군)</span>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              선택된 지역: <strong className="text-blue-600">{activeGugunLabel}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {BUSAN_GUGUNS.map((gugun) => {
              const isSelected = (gugun === '전체' && filterState.gugun === 'ALL') || filterState.gugun === gugun;
              return (
                <button
                  key={gugun}
                  onClick={() => handleGugunChange(gugun)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition border ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs font-semibold'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {gugun}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Month / Date Filter & Status Filter (날짜별) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          
          {/* Month Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
            <div className="flex items-center gap-1 text-xs font-bold text-slate-700 shrink-0">
              <Calendar className="w-3.5 h-3.5 text-sky-600" />
              <span>월별:</span>
            </div>
            <div className="flex items-center gap-1">
              {MONTHS.map((m) => {
                const isSelected = filterState.month === m.value;
                return (
                  <button
                    key={m.value}
                    onClick={() => handleMonthChange(m.value)}
                    className={`px-2.5 py-1 rounded-md whitespace-nowrap font-medium transition ${
                      isSelected
                        ? 'bg-sky-600 text-white font-semibold'
                        : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {m.value === 'ALL' ? '전체월' : `${m.value}월`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status Tabs & Extra Checkboxes */}
          <div className="flex items-center justify-between lg:justify-end gap-3 text-xs flex-wrap">
            
            {/* Status Filter Buttons */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/60">
              <span className="text-[11px] font-semibold text-slate-500 px-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> 상태:
              </span>
              {[
                { id: 'ALL', label: '전체' },
                { id: 'ONGOING', label: '진행중' },
                { id: 'UPCOMING', label: '예정' },
                { id: 'ALL_YEAR', label: '상설' },
                { id: 'ENDED', label: '종료' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleStatusChange(s.id)}
                  className={`px-2 py-0.5 rounded font-medium transition ${
                    filterState.status === s.id
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Free Entrance Checkbox */}
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 select-none bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/80">
              <input
                type="checkbox"
                checked={filterState.onlyFree}
                onChange={(e) => setFilterState(prev => ({ ...prev, onlyFree: e.target.checked }))}
                className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 border-emerald-300"
              />
              <span className="font-semibold text-emerald-800 text-[11px]">무료 행사만</span>
            </label>

            {/* Sort Selector */}
            <div className="flex items-center gap-1 text-slate-600">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filterState.sortOrder}
                onChange={(e) => handleSortChange(e.target.value as SortOrder)}
                className="bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="date_asc">일정 빠르게 (날짜순)</option>
                <option value="date_desc">일정 나중에</option>
                <option value="name_asc">가나다순</option>
                <option value="popular">인기순</option>
              </select>
            </div>

            {/* Reset Filter Button */}
            {isFiltered && (
              <button
                onClick={onResetFilters}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>필터 초기화</span>
              </button>
            )}

          </div>

        </div>

        {/* Filter Summary Banner */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span>조회된 부산 축제: <strong className="text-slate-900 font-bold">{filteredCount}개</strong></span>
            {filterState.gugun !== 'ALL' && (
              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200 font-medium">
                📍 {filterState.gugun}
              </span>
            )}
            {filterState.month !== 'ALL' && (
              <span className="bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full border border-sky-200 font-medium">
                🗓️ {filterState.month}월
              </span>
            )}
            {filterState.status !== 'ALL' && (
              <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200 font-medium">
                ⏱️ {filterState.status === 'ONGOING' ? '진행중' : filterState.status === 'UPCOMING' ? '예정' : filterState.status === 'ALL_YEAR' ? '상설' : '종료'}
              </span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
