import type { ScoreMethod } from '../score-support/types';

export const METHODS: Array<{ value: ScoreMethod; label: string; shortLabel: string; description: string }> = [
  {
    value: 'thpt',
    label: 'THPT',
    shortLabel: 'THPT',
    description: 'Tổng điểm 3 môn theo từng tổ hợp xét tuyển.',
  },
  {
    value: 'hb',
    label: 'Học bạ',
    shortLabel: 'Học bạ',
    description: 'Tổng điểm 3 môn học bạ theo từng tổ hợp xét tuyển.',
  },
  {
    value: 'dgnl',
    label: 'ĐGNL',
    shortLabel: 'ĐGNL',
    description: 'Điểm đánh giá năng lực lấy theo đợt thi cao nhất.',
  },
  {
    value: 'kh',
    label: 'Kết hợp THPT và Học bạ',
    shortLabel: 'Kết hợp',
    description: '02 môn thi tốt nghiệp THPT năm 2026 và 01 môn còn lại bằng điểm học bạ.',
  },
];
