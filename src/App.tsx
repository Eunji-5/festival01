import React, { useState, useEffect, useMemo } from 'react';
import { FestivalItem, FilterState, SortOrder } from './types';
import { FALLBACK_FESTIVALS } from './data/fallbackFestivals';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { FestivalCard } from './components/FestivalCard';
import { FestivalDetailModal } from './components/FestivalDetailModal';
import { FestivalCalendarView } from './components/FestivalCalendarView';
import { FestivalMapView } from './components/FestivalMapView';
import { SavedFestivalsDrawer } from './components/SavedFestivalsDrawer';
import { AiPlannerModal } from './components/AiPlannerModal';
import { Loader2, Waves, AlertCircle, RefreshCw, Sparkles, MapPin, Calendar, Heart, ShieldCheck } from 'lucide-react';

export default function App() {
  const [festivals, setFestivals] = useState<FestivalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Active view mode
  const [activeView, setActiveView] = useState<'grid' | 'calendar' | 'map'>('grid');

  // Filter state
  const [filterState, setFilterState] = useState<FilterState>({
    gugun: 'ALL',
    month: 'ALL',
    status: 'ALL',
    searchQuery: '',
    dateRange: { start: '', end: '' },
    sortOrder: 'date_asc',
    onlyFree: false,
  });

  // Saved / Bookmarked festivals state
  const [savedFestivals, setSavedFestivals] = useState<FestivalItem[]>(() => {
    try {
      const stored = localStorage.getItem('busan_saved_festivals');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Modals & Drawers state
  const [selectedFestival, setSelectedFestival] = useState<FestivalItem | null>(null);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isAiPlannerOpen, setIsAiPlannerOpen] = useState(false);

  // Persist saved festivals in localStorage
  useEffect(() => {
    try {
      localStorage.setItem('busan_saved_festivals', JSON.stringify(savedFestivals));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [savedFestivals]);

  // Fetch Busan festival data from backend API proxy
  const fetchFestivals = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch('/api/festivals?pageNo=1&numOfRows=100');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data && Array.isArray(data.items) && data.items.length > 0) {
        setFestivals(data.items);
        setIsFallback(Boolean(data.isFallback));
      } else {
        setFestivals(FALLBACK_FESTIVALS);
        setIsFallback(true);
      }
    } catch (err: any) {
      console.warn('API error, using curated fallback dataset:', err);
      setFestivals(FALLBACK_FESTIVALS);
      setIsFallback(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFestivals();
  }, []);

  // Filter and Sort Festivals
  const filteredFestivals = useMemo(() => {
    return festivals.filter((festival) => {
      // Gugun filter
      if (filterState.gugun !== 'ALL' && !festival.GUGUN_NM.includes(filterState.gugun)) {
        return false;
      }

      // Month filter
      if (filterState.month !== 'ALL' && festival.month !== parseInt(filterState.month, 10)) {
        return false;
      }

      // Status filter
      if (filterState.status !== 'ALL' && festival.status !== filterState.status) {
        return false;
      }

      // Only Free filter
      if (filterState.onlyFree) {
        const isFree = festival.USAGE_AMOUNT && (festival.USAGE_AMOUNT.includes('무료') || festival.USAGE_AMOUNT.includes('0원'));
        if (!isFree) return false;
      }

      // Search Query
      if (filterState.searchQuery.trim() !== '') {
        const query = filterState.searchQuery.toLowerCase().trim();
        const matchTitle = festival.TITLE?.toLowerCase().includes(query);
        const matchSubtitle = festival.SUBTITLE?.toLowerCase().includes(query);
        const matchGugun = festival.GUGUN_NM?.toLowerCase().includes(query);
        const matchPlace = festival.MAIN_PLACE?.toLowerCase().includes(query) || festival.ADDR1?.toLowerCase().includes(query);
        const matchContent = festival.ITEMCNTNTS?.toLowerCase().includes(query);

        if (!matchTitle && !matchSubtitle && !matchGugun && !matchPlace && !matchContent) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (filterState.sortOrder === 'name_asc') {
        return a.TITLE.localeCompare(b.TITLE, 'ko-KR');
      }
      if (filterState.sortOrder === 'date_desc') {
        return (b.month || 0) - (a.month || 0);
      }
      if (filterState.sortOrder === 'popular') {
        return (b.UC_SEQ || 0) - (a.UC_SEQ || 0);
      }
      // default: date_asc
      return (a.month || 0) - (b.month || 0);
    });
  }, [festivals, filterState]);

  // Bookmark Toggle
  const handleToggleSave = (festival: FestivalItem) => {
    setSavedFestivals((prev) => {
      const exists = prev.some((item) => item.UC_SEQ === festival.UC_SEQ);
      if (exists) {
        return prev.filter((item) => item.UC_SEQ !== festival.UC_SEQ);
      } else {
        return [...prev, festival];
      }
    });
  };

  const handleResetFilters = () => {
    setFilterState({
      gugun: 'ALL',
      month: 'ALL',
      status: 'ALL',
      searchQuery: '',
      dateRange: { start: '', end: '' },
      sortOrder: 'date_asc',
      onlyFree: false,
    });
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      
      {/* Header Bar */}
      <Header
        searchQuery={filterState.searchQuery}
        setSearchQuery={(query) => setFilterState((prev) => ({ ...prev, searchQuery: query }))}
        savedCount={savedFestivals.length}
        onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
        onOpenAiPlanner={() => setIsAiPlannerOpen(true)}
        activeView={activeView}
        setActiveView={setActiveView}
        totalCount={festivals.length}
      />

      {/* Filter Toolbar */}
      <FilterBar
        filterState={filterState}
        setFilterState={setFilterState}
        onResetFilters={handleResetFilters}
        filteredCount={filteredFestivals.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Loading Indicator */}
        {loading ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center mx-auto">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">부산 축제 정보 불러오는 중...</h3>
              <p className="text-xs text-slate-500 mt-1">공공데이터포털(data.go.kr) 부산축제 서비스 수신 중</p>
            </div>
          </div>
        ) : (
          <>
            {/* View Switching Render */}
            {activeView === 'grid' && (
              <div className="space-y-6">
                
                {filteredFestivals.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-3 max-w-lg mx-auto my-8">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-800">
                      조건에 일치하는 부산 축제가 없습니다.
                    </h3>
                    <p className="text-xs text-slate-500">
                      선택하신 지역(구·군)이나 월, 키워드를 변경하시거나 필터를 초기화해보세요.
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition"
                    >
                      전체 축제 보기 (필터 초기화)
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredFestivals.map((festival) => {
                      const isSaved = savedFestivals.some((item) => item.UC_SEQ === festival.UC_SEQ);
                      return (
                        <FestivalCard
                          key={festival.UC_SEQ}
                          festival={festival}
                          isSaved={isSaved}
                          onToggleSave={handleToggleSave}
                          onSelectFestival={(item) => setSelectedFestival(item)}
                        />
                      );
                    })}
                  </div>
                )}

              </div>
            )}

            {activeView === 'calendar' && (
              <FestivalCalendarView
                festivals={filteredFestivals}
                selectedMonth={filterState.month}
                setSelectedMonth={(month) => setFilterState((prev) => ({ ...prev, month }))}
                onSelectFestival={(item) => setSelectedFestival(item)}
              />
            )}

            {activeView === 'map' && (
              <FestivalMapView
                festivals={filteredFestivals}
                selectedGugun={filterState.gugun}
                setSelectedGugun={(gugun) => setFilterState((prev) => ({ ...prev, gugun }))}
                onSelectFestival={(item) => setSelectedFestival(item)}
              />
            )}
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="font-bold text-slate-800 flex items-center justify-center sm:justify-start gap-1.5">
              <Waves className="w-4 h-4 text-blue-600" />
              <span>부산 축제 나비게이터 (Busan Festival Service)</span>
            </p>
            <p className="text-slate-500">
              공공데이터포털(apis.data.go.kr) 부산광역시 축제정보 API 연동 및 AI 추천 맞춤 가이드
            </p>
          </div>
          <div className="flex items-center gap-4 text-slate-600">
            <button
              onClick={() => setIsAiPlannerOpen(true)}
              className="hover:text-blue-600 font-medium flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> AI 맞춤 추천
            </button>
            <button
              onClick={() => setIsSavedDrawerOpen(true)}
              className="hover:text-rose-600 font-medium flex items-center gap-1"
            >
              <Heart className="w-3.5 h-3.5 text-rose-500" /> 관심 목록
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <FestivalDetailModal
        festival={selectedFestival}
        onClose={() => setSelectedFestival(null)}
        isSaved={selectedFestival ? savedFestivals.some((item) => item.UC_SEQ === selectedFestival.UC_SEQ) : false}
        onToggleSave={handleToggleSave}
      />

      <SavedFestivalsDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedFestivals={savedFestivals}
        onRemoveSave={handleToggleSave}
        onSelectFestival={(item) => setSelectedFestival(item)}
      />

      <AiPlannerModal
        isOpen={isAiPlannerOpen}
        onClose={() => setIsAiPlannerOpen(false)}
        initialFestival={selectedFestival}
      />

    </div>
  );
}
