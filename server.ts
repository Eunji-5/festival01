import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { FALLBACK_FESTIVALS } from './src/data/fallbackFestivals';
import { FestivalItem } from './src/types';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper to sanitize and normalize item from data.go.kr
function normalizeItem(raw: any, index: number): FestivalItem {
  const title = raw.TITLE || raw.MAIN_TITLE || raw.TITLE_KR || '부산 축제';
  const gugun = raw.GUGUN_NM || raw.GUGUN || '부산 전체';
  const usageDay = raw.USAGE_DAY || raw.USAGE_DAY_WEEK_AND_TIME || raw.DATE_INFO || '';
  
  // Extract approximate start and end dates or month
  let month = 0;
  let startDate = '';
  let endDate = '';
  
  const dateMatches = usageDay.match(/\d{4}[.\-/]\d{1,2}[.\-/]\d{1,2}/g);
  if (dateMatches && dateMatches.length >= 1) {
    startDate = dateMatches[0].replace(/[.]/g, '-');
    endDate = dateMatches[1] ? dateMatches[1].replace(/[.]/g, '-') : startDate;
    const parts = startDate.split('-');
    if (parts.length >= 2) {
      month = parseInt(parts[1], 10);
    }
  } else {
    // Try to find month in text like "10월"
    const mMatch = usageDay.match(/(\d{1,2})월/);
    if (mMatch) {
      month = parseInt(mMatch[1], 10);
    }
  }

  if (!month) {
    month = ((index % 12) + 1); // default spread
  }

  let status: 'ONGOING' | 'UPCOMING' | 'ENDED' | 'ALL_YEAR' = 'UPCOMING';
  const currentMonth = new Date().getMonth() + 1;
  if (usageDay.includes('상설') || usageDay.includes('연중')) {
    status = 'ALL_YEAR';
  } else if (month === currentMonth) {
    status = 'ONGOING';
  } else if (month < currentMonth) {
    status = 'ENDED';
  } else {
    status = 'UPCOMING';
  }

  // Lat/Lng parsing
  let lat = parseFloat(raw.LAT || raw.LATITUDE || '0');
  let lng = parseFloat(raw.LNG || raw.LONGITUDE || '0');
  if (isNaN(lat) || lat === 0) lat = 35.17955;
  if (isNaN(lng) || lng === 0) lng = 129.07564;

  return {
    UC_SEQ: raw.UC_SEQ || (index + 100),
    TITLE: title,
    MAIN_TITLE: raw.MAIN_TITLE || title,
    SUBTITLE: raw.SUBTITLE || raw.TITLE_SUB || '',
    GUGUN_NM: gugun,
    HOMEPAGE_URL: raw.HOMEPAGE_URL || '',
    MAIN_PLACE: raw.MAIN_PLACE || raw.PLACE || '부산광역시 ' + gugun,
    PLACE: raw.PLACE || raw.MAIN_PLACE || '',
    ADDR1: raw.ADDR1 || '부산광역시 ' + gugun,
    ADDR2: raw.ADDR2 || '',
    CNTCT_TEL: raw.CNTCT_TEL || raw.TEL || '',
    USAGE_DAY: usageDay || '2026년 진행',
    USAGE_DAY_WEEK_AND_TIME: raw.USAGE_DAY_WEEK_AND_TIME || '',
    USAGE_AMOUNT: raw.USAGE_AMOUNT || '무료',
    MAIN_IMG_NORMAL: raw.MAIN_IMG_NORMAL || raw.MAIN_IMG_THUMB || 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?auto=format&fit=crop&w=1200&q=80',
    MAIN_IMG_THUMB: raw.MAIN_IMG_THUMB || raw.MAIN_IMG_NORMAL || 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?auto=format&fit=crop&w=600&q=80',
    ITEMCNTNTS: raw.ITEMCNTNTS || raw.CNTNTS || raw.ABSTRACT || '부산에서 열리는 생생하고 다채로운 축제 행사입니다.',
    LAT: lat,
    LNG: lng,
    TRFC_INFO: raw.TRFC_INFO || raw.TRAFFIC || '',
    MIDDLE_SIZE_RM1: raw.MIDDLE_SIZE_RM1 || '',
    startDate: startDate || `2026-${String(month).padStart(2, '0')}-01`,
    endDate: endDate || `2026-${String(month).padStart(2, '0')}-28`,
    month: month,
    status: status,
    tags: [gugun, `${month}월 축제`, raw.USAGE_AMOUNT && raw.USAGE_AMOUNT.includes('무료') ? '무료입장' : '문화축제']
  };
}

// API Route: Busan Festivals
app.get('/api/festivals', async (req, res) => {
  try {
    const defaultKey = "nh1EiA7TtQRTAQQEjtswM7FLMA46%2FZ5IPLfEj4scp1BzlK60OOy6deZiEu%2BuIhYuF71v3VRdIJwAuGO4tmIRug%3D%3D";
    const rawKey = process.env.FESTIVAL_SERVICE_KEY || defaultKey;
    
    // Clean key: ensure serviceKey parameter is handled correctly
    const serviceKeyParam = rawKey.includes('%') ? rawKey : encodeURIComponent(rawKey);
    const pageNo = req.query.pageNo || '1';
    const numOfRows = req.query.numOfRows || '100';

    const apiUrl = `https://apis.data.go.kr/6260000/FestivalService/getFestivalKr?serviceKey=${serviceKeyParam}&pageNo=${pageNo}&numOfRows=${numOfRows}&resultType=json`;

    console.log(`[API Proxy] Fetching Busan Festivals...`);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(apiUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const text = await response.text();
      let data: any = null;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.warn(`[API Proxy] Response is not valid JSON, returning fallback dataset.`);
      }

      if (data && data.getFestivalKr && Array.isArray(data.getFestivalKr.item) && data.getFestivalKr.item.length > 0) {
        const rawItems = data.getFestivalKr.item;
        const normalizedItems = rawItems.map((item: any, idx: number) => normalizeItem(item, idx));
        
        return res.json({
          resultCode: '00',
          resultMsg: 'NORMAL_SERVICE',
          totalCount: data.getFestivalKr.totalCount || normalizedItems.length,
          pageNo: parseInt(pageNo as string, 10),
          numOfRows: parseInt(numOfRows as string, 10),
          items: normalizedItems,
          isFallback: false
        });
      }
    }

    console.warn(`[API Proxy] External API returned non-200 or empty items. Serving fallback data.`);
    return res.json({
      resultCode: '00',
      resultMsg: 'FALLBACK_SERVICE',
      totalCount: FALLBACK_FESTIVALS.length,
      pageNo: 1,
      numOfRows: FALLBACK_FESTIVALS.length,
      items: FALLBACK_FESTIVALS,
      isFallback: true
    });
  } catch (error: any) {
    console.error(`[API Proxy Error]`, error?.message || error);
    return res.json({
      resultCode: '00',
      resultMsg: 'FALLBACK_SERVICE_ON_ERROR',
      totalCount: FALLBACK_FESTIVALS.length,
      pageNo: 1,
      numOfRows: FALLBACK_FESTIVALS.length,
      items: FALLBACK_FESTIVALS,
      isFallback: true
    });
  }
});

// AI Recommended Festival Itinerary / AI Guide
app.post('/api/festivals/ai-recommend', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({ error: 'GEMINI_API_KEY가 설정되지 않았습니다.' });
    }

    const { gugun, month, companion, preference, keyword } = req.body;

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
당신은 부산 관광 및 축제 전문 AI 가이드입니다.
사용자 요구사항:
- 희망 구/군 지역: ${gugun || '전체'}
- 희망 월: ${month ? month + '월' : '전체'}
- 동행자: ${companion || '누구나'}
- 선호 스타일: ${preference || '다채로운 문화 체험 및 먹거리'}
- 기타 키워드: ${keyword || '없음'}

위 정보를 바탕으로 부산에서 즐기기 좋은 축제 추천 코스 및 여행 팁을 친절하고 세련된 한국어로 작성해주세요.
응답 형식:
1. 🎯 맞춤 축제 추천 2~3곳 (축제명, 구/군, 관람 포인트)
2. 🗓️ 당일/1박2일 추천 연계 일정 코스
3. 💡 방문 팁 및 교통/주차 안내
markdown 형식으로 깔끔하게 답변해주세요.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return res.json({ recommendation: response.text });
  } catch (err: any) {
    console.error('AI Recommend Error:', err);
    return res.status(500).json({ error: 'AI 추천을 생성하는 중 오류가 발생했습니다.' });
  }
});

// Vite or Static file serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Festival App running on http://localhost:${PORT}`);
  });
}

startServer();
