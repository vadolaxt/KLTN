import type { StatItem, ServiceItem, NewsItem } from '@/features/homepage/bloc/homepage.state';
import { NEWS_CATEGORY_LABEL, NewsApiService } from './news.api';

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
    href: '/tra-cuu',
    variant: 'default',
  },
  {
    id: '2',
    iconKey: 'DOCUMENT',
    name: 'Quản Lý Hồ Sơ Thí Sinh',
    description: 'Nộp và theo dõi hồ sơ xét tuyển trực tuyến, cập nhật thông tin cá nhân.',
    linkLabel: 'Vào hồ sơ',
    href: '/ho-so',
    variant: 'default',
  },
  {
    id: '3',
    iconKey: 'GLOBE',
    name: 'Quy đổi Chứng Chỉ Tiếng Anh',
    description: 'Quy đổi chứng chỉ ngoại ngữ quốc tế thành điểm thi trung học phổ thông.',
    linkLabel: 'Quy đổi ngay',
    href: 'quy-doi-chung-chi',
    variant: 'default',
  },
  {
    id: '4',
    iconKey: 'CHART',
    name: 'Dự Đoán Trúng Tuyển',
    description: 'Công cụ dự đoán khả năng trúng tuyển dựa trên điểm số và phương thức xét tuyển.',
    linkLabel: 'Dự đoán ngay',
    href: '/du-doan',
    variant: 'default',
  },
  {
    id: '5',
    iconKey: 'BOOK',
    name: 'Cẩm Nang Tuyển Sinh',
    description: 'Tổng hợp thông tin tuyển sinh, hướng nghiệp chuyên sâu và điểm tin chính thức.',
    linkLabel: 'Xem cẩm nang',
    href: '/cam-nang',
    variant: 'default',
  },
  // {
  //   id: '6',
  //   iconKey: 'CHAT',
  //   name: 'Chatbot Tư Vấn Trực Tuyến',
  //   description: '',
  //   linkLabel: '',
  //   href: '/chat',
  //   variant: 'chatbot',
  // },
];

const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    tag: 'Tuyển sinh 2026',
    title: 'Thông tin tuyển sinh đại học chính quy năm 2026',
    description: 'Cập nhật thông tin tuyển sinh chính quy và các mốc hồ sơ quan trọng.',
    date: '2026-07-01',
    emoji: '📌',
    gradientVariant: 'green',
    href: '/cam-nang',
  },
  {
    id: '2',
    tag: 'Hướng nghiệp',
    title: 'Thông tin tuyển sinh và hướng nghiệp 2026',
    description: 'Tài liệu định hướng ngành học dành cho phụ huynh và thí sinh.',
    date: '2026-03-20',
    emoji: '🎓',
    gradientVariant: 'blue',
    href: '/cam-nang',
  },
  {
    id: '3',
    tag: 'Điểm tin',
    title: 'Mùa thi, ăn uống thế nào để học mau, nhớ lâu?',
    description: 'Góc nhìn hỗ trợ sức khỏe và học tập cho thí sinh trong mùa thi.',
    date: '2026-01-15',
    emoji: '📰',
    gradientVariant: 'purple',
    href: '/cam-nang',
  },
];

export async function getStats(): Promise<StatItem[]> {
  return MOCK_STATS;
}

export async function getServices(): Promise<ServiceItem[]> {
  return MOCK_SERVICES;
}

export async function getNews(): Promise<NewsItem[]> {
  try {
    const res = await NewsApiService.getPublished({ limit: 6 });
    return res.data.map((item, index) => ({
      id: item.id,
      tag: NEWS_CATEGORY_LABEL[item.category],
      title: item.title,
      description: item.summary,
      date: item.publishedAt,
      emoji: item.category === 'ADMISSION_INFO' ? '📌' : item.category === 'CAREER_GUIDANCE' ? '🎓' : '📰',
      gradientVariant: index % 3 === 0 ? 'green' : index % 3 === 1 ? 'blue' : 'purple',
      href: `/cam-nang/${item.id}`,
      imageUrl: item.imageUrl,
      sourceUrl: item.sourceUrl,
    }));
  } catch {
    return MOCK_NEWS;
  }
}
