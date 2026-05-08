// ─────────────────────────────────────────────
// HOMEPAGE API SERVICE
// ─────────────────────────────────────────────

import { API_ENDPOINTS } from '@/lib/constants/api-client';
import type { StatItem, ServiceItem, NewsItem } from '@/features/homepage/bloc/homepage.state';

// ── Mock data (dùng khi chưa có backend) ──────
const MOCK_STATS: StatItem[] = [
  { id: '1', value: '36', label: 'Ngành đào tạo' },
  { id: '2', value: '12', label: 'Khoa' },
  { id: '3', value: '20,000+', label: 'Sinh viên' },
  { id: '4', value: '1955', label: 'Năm thành lập' },
];

const MOCK_SERVICES: ServiceItem[] = [
  {
    id: '1',
    iconKey: 'SEARCH',
    name: 'Tra Cứu Tuyển Sinh',
    description: 'Tra cứu thông tin tuyển sinh, điểm chuẩn các năm và ngành đào tạo nhanh chóng.',
    linkLabel: 'Tra cứu ngay',
    href: '#',
    variant: 'default',
  },
  {
    id: '2',
    iconKey: 'DOCUMENT',
    name: 'Quản Lý Hồ Sơ Thí Sinh',
    description: 'Nộp và theo dõi hồ sơ xét tuyển trực tuyến, cập nhật thông tin cá nhân.',
    linkLabel: 'Vào hồ sơ',
    href: '#',
    variant: 'default',
  },
  {
    id: '3',
    iconKey: 'GLOBE',
    name: 'Chứng Chỉ Tiếng Anh',
    description: 'Tra cứu yêu cầu và quy đổi chứng chỉ ngoại ngữ quốc tế theo từng ngành.',
    linkLabel: 'Tra cứu ngay',
    href: '#',
    variant: 'default',
  },
  {
    id: '4',
    iconKey: 'CHART',
    name: 'Dự Đoán Trúng Tuyển',
    description: 'Công cụ dự đoán khả năng trúng tuyển dựa trên điểm số và phương thức xét tuyển.',
    linkLabel: 'Dự đoán ngay',
    href: '#',
    variant: 'default',
  },
  {
    id: '5',
    iconKey: 'BOOK',
    name: 'Cẩm Nang Tuyển Sinh',
    description: 'Hướng dẫn đầy đủ quy trình xét tuyển, hạn nộp hồ sơ và các lưu ý quan trọng.',
    linkLabel: 'Xem cẩm nang',
    href: '#',
    variant: 'default',
  },
  {
    id: '6',
    iconKey: 'CHAT',
    name: 'Chatbot Tư Vấn Trực Tuyến',
    description: '',
    linkLabel: '',
    href: '#',
    variant: 'chatbot',
  },
];

const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    tag: 'Tuyển sinh 2025',
    title: 'Công bố Đề án Tuyển sinh 2025',
    description: 'Nhà trường chính thức công bố đề án tuyển sinh năm 2025 với nhiều phương thức xét tuyển mới.',
    date: '2025-02-26',
    emoji: '📋',
    gradientVariant: 'green',
  },
  {
    id: '2',
    tag: 'Lịch nộp hồ sơ',
    title: 'Lịch nộp hồ sơ xét tuyển',
    description: 'Cập nhật lịch nộp hồ sơ xét tuyển, thời hạn đăng ký và các mốc thời gian quan trọng.',
    date: '2025-03-01',
    emoji: '📅',
    gradientVariant: 'blue',
  },
  {
    id: '3',
    tag: 'Tư vấn',
    title: 'Tư vấn chọn ngành nghề',
    description: 'Chương trình tư vấn chọn ngành nghề phù hợp với năng lực và định hướng tương lai.',
    date: '2025-03-05',
    emoji: '🎓',
    gradientVariant: 'purple',
  },
];

// ── API calls ──────────────────────────────────

export async function getStats(): Promise<StatItem[]> {
  try {
    const res = await fetch("");
    if (!res.ok) throw new Error('Fetch failed');
    const res = await fetch(API_ENDPOINTS.HOMEPAGE.STATS);
    if (!res.ok) throw new Error('Fetch failed');
    return await res.json();
  } catch {
    // Fallback mock data khi chưa có API
    return MOCK_STATS;
  }
}

export async function getServices(): Promise<ServiceItem[]> {
  try {
    const res = await fetch("");
    if (!res.ok) throw new Error('Fetch failed');
    return await res.json();
  } catch {
    return MOCK_SERVICES;
  }
}

export async function getNews(): Promise<NewsItem[]> {
  try {
    const res = await fetch("");
    if (!res.ok) throw new Error('Fetch failed');
    return await res.json();
  } catch {
    return MOCK_NEWS;
  }
}