'use client';

import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  Calendar,
  ExternalLink,
  Eye,
  FileCheck,
  FileText,
  Image as ImageIcon,
  Plus,
  Search,
  Trash2,
  X,
  Edit3,
} from 'lucide-react';
import { AdminNews } from '@/service/admin.api';
import { NEWS_CATEGORY_LABEL, NewsCategory } from '@/service/news.api';

type NewsPayload = Omit<AdminNews, 'id' | 'views' | 'createdAt' | 'updatedAt'>;

interface NewsManagementProps {
  news: AdminNews[];
  createNewsArticle: (news: NewsPayload) => Promise<void>;
  updateNewsArticle: (id: string, updatedFields: Partial<AdminNews>) => Promise<void>;
  deleteNewsArticle: (id: string) => Promise<void>;
  isLoading: boolean;
}

const CATEGORY_OPTIONS: Array<{ value: NewsCategory; label: string }> = [
  { value: 'ADMISSION_INFO', label: NEWS_CATEGORY_LABEL.ADMISSION_INFO },
  { value: 'CAREER_GUIDANCE', label: NEWS_CATEGORY_LABEL.CAREER_GUIDANCE },
  { value: 'PRESS_NEWS', label: NEWS_CATEGORY_LABEL.PRESS_NEWS },
];

const emptyForm = {
  title: '',
  summary: '',
  content: '',
  category: 'ADMISSION_INFO' as NewsCategory,
  status: 'DRAFT' as AdminNews['status'],
  imageUrl: '',
  sourceUrl: '',
  sourceName: 'Trang tuyển sinh NLU',
  publishedAt: new Date().toISOString().split('T')[0],
  displayOrder: 100,
};

export default function NewsManagement({
  news,
  createNewsArticle,
  updateNewsArticle,
  deleteNewsArticle,
  isLoading,
}: NewsManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<NewsCategory | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<AdminNews['status'] | 'ALL'>('ALL');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<AdminNews | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [previewArticle, setPreviewArticle] = useState<AdminNews | null>(null);

  const filteredNews = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    return news.filter((item) => {
      const searchMatch =
        !keyword ||
        item.title.toLowerCase().includes(keyword) ||
        item.summary.toLowerCase().includes(keyword) ||
        item.sourceUrl?.toLowerCase().includes(keyword);
      const categoryMatch = categoryFilter === 'ALL' || item.category === categoryFilter;
      const statusMatch = statusFilter === 'ALL' || item.status === statusFilter;
      return searchMatch && categoryMatch && statusMatch;
    });
  }, [categoryFilter, news, searchTerm, statusFilter]);

  const updateForm = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const openCreateModal = () => {
    setSelectedArticle(null);
    setForm(emptyForm);
    setFormError('');
    setIsFormModalOpen(true);
  };

  const openEditModal = (article: AdminNews) => {
    setSelectedArticle(article);
    setForm({
      title: article.title,
      summary: article.summary,
      content: article.content,
      category: article.category,
      status: article.status,
      imageUrl: article.imageUrl || '',
      sourceUrl: article.sourceUrl || '',
      sourceName: article.sourceName || 'Trang tuyển sinh NLU',
      publishedAt: article.publishedAt || new Date().toISOString().split('T')[0],
      displayOrder: article.displayOrder ?? 100,
    });
    setFormError('');
    setIsFormModalOpen(true);
  };

  const submitForm = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError('');

    if (!form.title.trim() || !form.summary.trim() || !form.content.trim()) {
      setFormError('Vui lòng nhập tiêu đề, tóm tắt và nội dung bài viết.');
      return;
    }

    const payload: NewsPayload = {
      title: form.title.trim(),
      summary: form.summary.trim(),
      content: form.content.trim(),
      category: form.category,
      status: form.status,
      imageUrl: form.imageUrl.trim() || null,
      sourceUrl: form.sourceUrl.trim() || null,
      sourceName: form.sourceName.trim() || 'Trang tuyển sinh NLU',
      publishedAt: form.publishedAt,
      displayOrder: Number(form.displayOrder) || 100,
    };

    if (selectedArticle) {
      await updateNewsArticle(selectedArticle.id, payload);
    } else {
      await createNewsArticle(payload);
    }

    setIsFormModalOpen(false);
  };

  const togglePublish = async (article: AdminNews) => {
    await updateNewsArticle(article.id, {
      status: article.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED',
    });
  };

  return (
    <div className="bg-white border border-gray-mid rounded-2xl p-4 shadow-sm xl:p-5">
      <div className="flex flex-col gap-3 justify-between items-stretch lg:flex-row lg:items-center mb-5">
        <div className="relative flex-1 max-w-[420px]">
          <input
            type="text"
            placeholder="Tìm theo tiêu đề, tóm tắt, nguồn..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full bg-gray-light text-xs text-text-dark px-3.5 py-2.5 pl-9 rounded-xl border border-gray-mid focus:outline-none focus:border-green-main focus:ring-1 focus:ring-green-main font-medium"
          />
          <Search size={15} className="absolute left-3 top-3 text-text-light" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value as NewsCategory | 'ALL')}
            className="bg-gray-light border border-gray-mid px-3 py-2 rounded-xl text-xs font-bold text-text-mid outline-none max-w-[185px]"
          >
            <option value="ALL">Tất cả nhóm</option>
            {CATEGORY_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as AdminNews['status'] | 'ALL')}
            className="bg-gray-light border border-gray-mid px-3 py-2 rounded-xl text-xs font-bold text-text-mid outline-none max-w-[165px]"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="PUBLISHED">Đã xuất bản</option>
            <option value="DRAFT">Bản nháp</option>
          </select>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-green-main hover:bg-green-dark text-white font-extrabold text-xs rounded-xl shadow-sm transition-all duration-200"
          >
            <Plus size={15} />
            Đăng bài cẩm nang
          </button>
        </div>
      </div>

      <div className="overflow-hidden border border-gray-mid rounded-xl">
        <table className="w-full table-fixed divide-y divide-gray-mid text-left">
          <thead className="bg-gray-light text-[10px] font-black uppercase tracking-[1.5px] text-text-light">
            <tr>
              <th className="w-[34%] px-3 py-3">Bài viết</th>
              <th className="w-[15%] px-3 py-3">Nhóm</th>
              <th className="w-[11%] px-3 py-3">Ngày đăng</th>
              <th className="w-[14%] px-3 py-3">Nguồn</th>
              <th className="w-[7%] px-3 py-3">Lượt xem</th>
              <th className="w-[9%] px-3 py-3">Trạng thái</th>
              <th className="w-[10%] px-3 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-mid bg-white text-xs">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-text-light font-medium">
                  Đang tải danh sách tin tức...
                </td>
              </tr>
            ) : filteredNews.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-text-light font-medium">
                  Không tìm thấy bài viết phù hợp.
                </td>
              </tr>
            ) : (
              filteredNews.map((article) => (
                <tr key={article.id} className="hover:bg-green-pale/10 transition-colors">
                  <td className="px-3 py-3">
                    <div className="flex min-w-0 items-start gap-2.5">
                      <div className="flex h-11 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md border border-gray-mid bg-gray-light">
                        {article.imageUrl ? (
                          <img src={article.imageUrl} alt={article.title} className="h-full w-full object-cover" />
                        ) : (
                          <ImageIcon size={17} className="text-text-light" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-extrabold text-text-dark truncate">{article.title}</h4>
                        <p className="text-[11px] text-text-light truncate mt-0.5">{article.summary}</p>
                        <p className="text-[10px] text-text-light mt-1">Thứ tự: {article.displayOrder ?? 100}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 font-bold text-text-mid">
                    <span className="block truncate">{NEWS_CATEGORY_LABEL[article.category]}</span>
                  </td>
                  <td className="px-3 py-3 font-medium text-text-mid">
                    <span className="inline-flex items-center gap-1 truncate">
                      <Calendar size={12} className="text-green-main" />
                      {article.publishedAt}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    {article.sourceUrl ? (
                      <a
                        href={article.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex max-w-full items-center gap-1 truncate font-bold text-green-main no-underline"
                      >
                        {article.sourceName || 'Nguồn chính thức'}
                        <ExternalLink size={12} className="shrink-0" />
                      </a>
                    ) : (
                      <span className="text-text-light">Chưa có</span>
                    )}
                  </td>
                  <td className="px-3 py-3 font-bold text-text-mid">
                    <span className="inline-flex items-center gap-1">
                      <Eye size={12} />
                      {article.views.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    {article.status === 'PUBLISHED' ? (
                      <span className="inline-flex bg-green-pale text-green-dark px-2 py-0.5 rounded-full font-extrabold text-[10px]">
                        Đã đăng
                      </span>
                    ) : (
                      <span className="inline-flex bg-gray-light text-text-light px-2 py-0.5 rounded-full font-extrabold text-[10px] border border-gray-mid">
                        Bản nháp
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => togglePublish(article)}
                        title={article.status === 'PUBLISHED' ? 'Hạ xuống bản nháp' : 'Xuất bản'}
                        className="p-1 rounded-md border border-gray-mid text-text-mid hover:bg-green-pale hover:text-green-dark transition-all"
                      >
                        {article.status === 'PUBLISHED' ? <FileText size={12} /> : <FileCheck size={12} />}
                      </button>
                      <button
                        onClick={() => setPreviewArticle(article)}
                        title="Xem nhanh"
                        className="p-1 rounded-md border border-gray-mid text-text-mid hover:bg-green-pale hover:text-green-dark transition-all"
                      >
                        <Eye size={12} />
                      </button>
                      <button
                        onClick={() => openEditModal(article)}
                        title="Chỉnh sửa"
                        className="p-1 rounded-md border border-gray-mid text-text-mid hover:bg-green-pale hover:text-green-dark transition-all"
                      >
                        <Edit3 size={12} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(article.id)}
                        title="Xóa"
                        className="p-1 rounded-md border border-gray-mid text-text-mid hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-gray-mid rounded-2xl w-full max-w-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center pb-4 border-b border-gray-light mb-5">
              <h3 className="text-sm font-black text-text-dark uppercase tracking-[0.5px]">
                {selectedArticle ? 'Cập nhật bài cẩm nang' : 'Đăng bài cẩm nang mới'}
              </h3>
              <button onClick={() => setIsFormModalOpen(false)} className="text-text-light hover:text-text-dark">
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div className="mb-4 flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 p-3 rounded-lg text-xs font-semibold">
                <AlertCircle size={15} />
                {formError}
              </div>
            )}

            <form onSubmit={submitForm} className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <label className="flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase text-text-mid">Nhóm bài</span>
                  <select
                    value={form.category}
                    onChange={(event) => updateForm('category', event.target.value as NewsCategory)}
                    className="h-10 rounded-xl border border-gray-mid px-3 text-xs font-bold outline-none focus:border-green-main"
                  >
                    {CATEGORY_OPTIONS.map((item) => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase text-text-mid">Trạng thái</span>
                  <select
                    value={form.status}
                    onChange={(event) => updateForm('status', event.target.value as AdminNews['status'])}
                    className="h-10 rounded-xl border border-gray-mid px-3 text-xs font-bold outline-none focus:border-green-main"
                  >
                    <option value="DRAFT">Bản nháp</option>
                    <option value="PUBLISHED">Xuất bản</option>
                  </select>
                </label>
              </div>

              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase text-text-mid">Tiêu đề *</span>
                <input
                  value={form.title}
                  onChange={(event) => updateForm('title', event.target.value)}
                  className="h-10 rounded-xl border border-gray-mid px-4 text-xs font-bold outline-none focus:border-green-main"
                  required
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase text-text-mid">Tóm tắt *</span>
                <input
                  value={form.summary}
                  onChange={(event) => updateForm('summary', event.target.value)}
                  className="h-10 rounded-xl border border-gray-mid px-4 text-xs outline-none focus:border-green-main"
                  required
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase text-text-mid">Nội dung *</span>
                <textarea
                  value={form.content}
                  onChange={(event) => updateForm('content', event.target.value)}
                  rows={7}
                  className="rounded-xl border border-gray-mid p-4 text-xs leading-6 outline-none focus:border-green-main resize-y"
                  required
                />
              </label>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase text-text-mid">Ảnh bìa URL</span>
                  <input
                    value={form.imageUrl}
                    onChange={(event) => updateForm('imageUrl', event.target.value)}
                    className="h-10 rounded-xl border border-gray-mid px-4 text-xs outline-none focus:border-green-main"
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase text-text-mid">Ngày đăng</span>
                  <input
                    type="date"
                    value={form.publishedAt}
                    onChange={(event) => updateForm('publishedAt', event.target.value)}
                    className="h-10 rounded-xl border border-gray-mid px-4 text-xs outline-none focus:border-green-main"
                  />
                </label>
              </div>

              <div className="grid gap-3 md:grid-cols-[1fr_130px]">
                <label className="flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase text-text-mid">Link nguồn chính thức</span>
                  <input
                    value={form.sourceUrl}
                    onChange={(event) => updateForm('sourceUrl', event.target.value)}
                    className="h-10 rounded-xl border border-gray-mid px-4 text-xs outline-none focus:border-green-main"
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase text-text-mid">Thứ tự</span>
                  <input
                    type="number"
                    min={0}
                    value={form.displayOrder}
                    onChange={(event) => updateForm('displayOrder', Number(event.target.value))}
                    className="h-10 rounded-xl border border-gray-mid px-4 text-xs outline-none focus:border-green-main"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase text-text-mid">Tên nguồn</span>
                <input
                  value={form.sourceName}
                  onChange={(event) => updateForm('sourceName', event.target.value)}
                  className="h-10 rounded-xl border border-gray-mid px-4 text-xs outline-none focus:border-green-main"
                />
              </label>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-light">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 border border-gray-mid text-text-mid hover:bg-gray-light font-bold text-xs rounded-xl"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-main hover:bg-green-dark text-white font-bold text-xs rounded-xl shadow-sm"
                >
                  {selectedArticle ? 'Lưu cập nhật' : 'Đăng bài viết'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {previewArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-gray-mid bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-black uppercase text-text-dark">Xem nhanh bài viết</h3>
              <button onClick={() => setPreviewArticle(null)} className="text-text-light hover:text-text-dark">
                <X size={18} />
              </button>
            </div>
            <h4 className="text-xl font-black text-green-dark">{previewArticle.title}</h4>
            <p className="mt-2 text-sm font-semibold leading-6 text-text-mid">{previewArticle.summary}</p>
            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-text-dark">{previewArticle.content}</p>
            {previewArticle.sourceUrl && (
              <a href={previewArticle.sourceUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-green-main no-underline">
                Mở nguồn chính thức <ExternalLink size={15} />
              </a>
            )}
          </div>
        </div>
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white border border-gray-mid rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-500 mb-4">
              <div className="h-10 w-10 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center">
                <Trash2 size={20} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-[0.5px]">Xóa bài viết</h3>
            </div>
            <p className="text-xs text-text-mid leading-relaxed mb-6">
              Bài viết sẽ bị xóa khỏi danh sách cẩm nang và không thể khôi phục.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 border border-gray-mid text-text-mid hover:bg-gray-light font-bold text-xs rounded-xl"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  deleteNewsArticle(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 bg-[#e53935] hover:bg-[#c62828] text-white font-bold text-xs rounded-xl shadow-sm"
              >
                Đồng ý xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
