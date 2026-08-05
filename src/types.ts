export interface FestivalItem {
  UC_SEQ: number;
  TITLE: string;
  SUBTITLE?: string;
  MAIN_TITLE?: string;
  GUGUN_NM: string; // 구/군 이름 (예: 해운대구, 수영구, 남구, 부산진구, 기장군, 중구, 등)
  HOMEPAGE_URL?: string;
  MAIN_PLACE?: string;
  PLACE?: string;
  ADDR1?: string;
  ADDR2?: string;
  CNTCT_TEL?: string;
  USAGE_DAY?: string; // 날짜/기간 정보 (예: 2025.10.12 ~ 2025.10.14)
  USAGE_DAY_WEEK_AND_TIME?: string;
  USAGE_AMOUNT?: string; // 입장료 / 무료
  MAIN_IMG_NORMAL?: string;
  MAIN_IMG_THUMB?: string;
  ITEMCNTNTS?: string; // 상세 설명
  LAT?: number; // 위도
  LNG?: number; // 경도
  TRFC_INFO?: string; // 교통 정보
  MIDDLE_SIZE_RM1?: string; // 기타 참고
  
  // Normalized helper fields for frontend
  startDate?: string; // YYYY-MM-DD or YYYY-MM
  endDate?: string;
  month?: number; // 1 ~ 12
  status?: 'ONGOING' | 'UPCOMING' | 'ENDED' | 'ALL_YEAR';
  tags?: string[];
}

export interface FestivalApiResponse {
  resultCode: string;
  resultMsg: string;
  totalCount: number;
  pageNo: number;
  numOfRows: number;
  items: FestivalItem[];
  isFallback?: boolean;
}

export type SortOrder = 'date_asc' | 'date_desc' | 'name_asc' | 'popular';

export interface FilterState {
  gugun: string; // 'ALL' or specific district like '해운대구'
  month: string; // 'ALL' or '1'~'12'
  status: string; // 'ALL' | 'ONGOING' | 'UPCOMING' | 'ENDED'
  searchQuery: string;
  dateRange: {
    start: string;
    end: string;
  };
  sortOrder: SortOrder;
  onlyFree: boolean;
}
