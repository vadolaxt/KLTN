'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  X, 
  Calendar, 
  Check,
  AlertCircle,
  FileText,
  FileCheck
} from 'lucide-react';
import { AdminNews } from '@/service/admin.api';

interface NewsManagementProps {
  news: AdminNews[];
  createNewsArticle: (news: Omit<AdminNews, 'id' | 'views' | 'publishedAt'>) => Promise<void>;
  updateNewsArticle: (id: string, updatedFields: Partial<AdminNews>) => Promise<void>;
  deleteNewsArticle: (id: string) => Promise<void>;
  isLoading: boolean;
}

export default function NewsManagement({
  news,
  createNewsArticle,
  updateNewsArticle,
  deleteNewsArticle,
  isLoading
}: NewsManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Create / Edit Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<AdminNews | null>(null);
  const [articleTitle, setArticleTitle] = useState('');
  const [articleSummary, setArticleSummary] = useState('');
  const [articleContent, setArticleContent] = useState('');
  const [articleCategory, setArticleCategory] = useState<AdminNews['category']>('ANNOUNCEMENT');
  const [articleStatus, setArticleStatus] = useState<AdminNews['status']>('DRAFT');
  const [articleEmoji, setArticleEmoji] = useState('📢');
  const [formError, setFormError] = useState('');

  // Delete Confirm State
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filter news list
  const filteredNews = news.filter((n) => {
    const searchMatch = 
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      n.summary.toLowerCase().includes(searchTerm.toLowerCase());
    
    const catMatch = categoryFilter === 'ALL' || n.category === categoryFilter;
    const statMatch = statusFilter === 'ALL' || n.status === statusFilter;

    return searchMatch && catMatch && statMatch;
  });

  const handleOpenCreateModal = () => {
    setSelectedArticle(null);
    setArticleTitle('');
    setArticleSummary('');
    setArticleContent('');
    setArticleCategory('ANNOUNCEMENT');
    setArticleStatus('DRAFT');
    setArticleEmoji('📢');
    setFormError('');
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (article: AdminNews) => {
    setSelectedArticle(article);
    setArticleTitle(article.title);
    setArticleSummary(article.summary);
    setArticleContent(article.content);
    setArticleCategory(article.category);
    setArticleStatus(article.status);
    setArticleEmoji(article.emoji);
    setFormError('');
    setIsFormModalOpen(true);
  };

  const handleTogglePublish = async (article: AdminNews) => {
    const nextStatus = article.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    await updateNewsArticle(article.id, { status: nextStatus });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!articleTitle.trim() || !articleSummary.trim() || !articleContent.trim()) {
      setFormError('Vui lòng điền đầy đủ các trường thông tin');
      return;
    }

    const payload = {
      title: articleTitle.trim(),
      summary: articleSummary.trim(),
      content: articleContent.trim(),
      category: articleCategory,
      status: articleStatus,
      emoji: articleEmoji
    };

    if (selectedArticle) {
      await updateNewsArticle(selectedArticle.id, payload);
    } else {
      await createNewsArticle(payload);
    }

    setIsFormModalOpen(false);
  };

  const getCategoryLabel = (cat: AdminNews['category']) => {
    switch (cat) {
      case 'ANNOUNCEMENT': return 'Thông báo';
      case 'GUIDE': return 'Hướng dẫn';
      case 'EVENT': return 'Sự kiện';
    }
  };

  return (
    <div className="bg-white border border-gray-mid rounded-2xl p-6 shadow-sm">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Tìm tin tức theo tiêu đề, tóm tắt..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-light text-xs text-text-dark px-3.5 py-2.5 pl-9 rounded-xl border border-gray-mid focus:outline-none focus:border-green-main focus:ring-1 focus:ring-green-main font-medium"
          />
          <Search size={15} className="absolute left-3 top-3 text-text-light" />
        </div>

        {/* Filters and Add button */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 bg-gray-light border border-gray-mid px-3 py-1.5 rounded-xl">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-text-mid outline-none border-none cursor-pointer"
            >
              <option value="ALL">Tất cả nhãn</option>
              <option value="ANNOUNCEMENT">Thông báo</option>
              <option value="GUIDE">Hướng dẫn</option>
              <option value="EVENT">Sự kiện</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-gray-light border border-gray-mid px-3 py-1.5 rounded-xl">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-text-mid outline-none border-none cursor-pointer"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="PUBLISHED">Đã xuất bản</option>
              <option value="DRAFT">Bản nháp</option>
            </select>
          </div>

          {/* Add News Button */}
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-main hover:bg-green-dark text-white font-extrabold text-xs rounded-xl shadow-sm transition-all duration-200"
          >
            <Plus size={15} />
            Đăng tin tuyển sinh
          </button>
        </div>
      </div>

      {/* News Table */}
      <div className="overflow-x-auto border border-gray-mid rounded-xl">
        <table className="min-w-full divide-y divide-gray-mid text-left">
          <thead className="bg-gray-light text-[10px] font-black uppercase tracking-[1.5px] text-text-light">
            <tr>
              <th className="px-6 py-4 w-12 text-center">Bìa</th>
              <th className="px-6 py-4">Bài viết tin tức</th>
              <th className="px-6 py-4">Nhãn</th>
              <th className="px-6 py-4">Ngày đăng</th>
              <th className="px-6 py-4">Lượt xem</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-mid bg-white text-xs">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-text-light font-medium">
                  Đang tải danh sách tin tức tuyển sinh...
                </td>
              </tr>
            ) : filteredNews.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-text-light font-medium">
                  🔍 Không tìm thấy bài viết tin tức nào phù hợp.
                </td>
              </tr>
            ) : (
              filteredNews.map((article) => (
                <tr key={article.id} className="hover:bg-green-pale/10 transition-colors">
                  {/* Emoji Cover */}
                  <td className="px-6 py-4 whitespace-nowrap text-center text-lg">
                    {article.emoji}
                  </td>
                  {/* Title & Summary */}
                  <td className="px-6 py-4 max-w-sm">
                    <h4 className="font-extrabold text-text-dark truncate">{article.title}</h4>
                    <p className="text-[11px] text-text-light truncate mt-0.5">{article.summary}</p>
                  </td>
                  {/* Category */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {article.category === 'ANNOUNCEMENT' && (
                      <span className="bg-green-pale text-green-dark text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-green-main/10">
                        Thông báo
                      </span>
                    )}
                    {article.category === 'GUIDE' && (
                      <span className="bg-gray-light text-text-dark text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-gray-mid">
                        Hướng dẫn
                      </span>
                    )}
                    {article.category === 'EVENT' && (
                      <span className="bg-green-pale text-green-main text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                        Sự kiện
                      </span>
                    )}
                  </td>
                  {/* Date */}
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-text-mid flex items-center gap-1.5 mt-2">
                    <Calendar size={12} className="text-green-main" />
                    {article.publishedAt}
                  </td>
                  {/* Views */}
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-text-mid">
                    <span className="inline-flex items-center gap-1">
                      <Eye size={12} />
                      {article.views.toLocaleString()}
                    </span>
                  </td>
                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {article.status === 'PUBLISHED' ? (
                      <span className="inline-flex items-center gap-1 bg-green-pale text-green-dark px-2.5 py-0.5 rounded-full font-extrabold text-[10px]">
                        Đã đăng
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-gray-light text-text-light px-2.5 py-0.5 rounded-full font-extrabold text-[10px] border border-gray-mid">
                        Bản nháp
                      </span>
                    )}
                  </td>
                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-center flex items-center justify-center gap-2">
                    {/* Toggle publish status */}
                    <button
                      onClick={() => handleTogglePublish(article)}
                      title={article.status === 'PUBLISHED' ? 'Hạ xuống bản nháp' : 'Xuất bản tin tức'}
                      className={`p-1.5 rounded-lg border transition-all ${
                        article.status === 'PUBLISHED'
                          ? 'border-gray-mid text-text-mid hover:bg-gray-light'
                          : 'border-green-main/20 text-green-main bg-green-pale hover:bg-green-main hover:text-white'
                      }`}
                    >
                      {article.status === 'PUBLISHED' ? <FileText size={13} /> : <FileCheck size={13} />}
                    </button>

                    {/* Edit button */}
                    <button
                      onClick={() => handleOpenEditModal(article)}
                      title="Chỉnh sửa tin tức"
                      className="p-1.5 rounded-lg border border-gray-mid text-text-mid hover:bg-green-pale hover:text-green-dark hover:border-green-main/30 transition-all"
                    >
                      <Edit3 size={13} />
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => setDeleteConfirmId(article.id)}
                      title="Xóa tin tức"
                      className="p-1.5 rounded-lg border border-gray-mid text-text-mid hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ─────────────────────────────────────────────
      // MODAL: CREATE OR EDIT NEWS ARTICLE
      // ───────────────────────────────────────────── */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-gray-mid rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-light mb-5">
              <h3 className="text-sm font-black text-text-dark uppercase tracking-[0.5px]">
                {selectedArticle ? 'Cập nhật tin tuyển sinh' : 'Đăng tin tuyển sinh mới'}
              </h3>
              <button onClick={() => setIsFormModalOpen(false)} className="text-text-light hover:text-text-dark">
                <X size={18} />
              </button>
            </div>

            {/* Form Error */}
            {formError && (
              <div className="mb-4 bg-red-50 text-red-600 border border-red-200 p-3 rounded-lg text-xs font-semibold">
                ⚠️ {formError}
              </div>
            )}

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {/* Cover Emoji */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase text-text-mid">Emoji bìa</label>
                  <select
                    value={articleEmoji}
                    onChange={(e) => setArticleEmoji(e.target.value)}
                    className="h-10 w-full rounded-xl border border-gray-mid px-3 text-sm text-text-dark outline-none bg-gray-light/20 focus:border-green-main focus:bg-white text-center font-bold"
                  >
                    <option value="📢">📢 Thông báo</option>
                    <option value="📝">📝 Hướng dẫn</option>
                    <option value="🎪">🎪 Sự kiện</option>
                    <option value="📅">📅 Lịch tuyển</option>
                    <option value="🏆">🏆 Kết quả</option>
                    <option value="🎓">🎓 Nhập học</option>
                  </select>
                </div>

                {/* Category */}
                <div className="flex flex-col gap-1 col-span-2">
                  <label className="text-[10px] font-black uppercase text-text-mid">Nhãn bài viết</label>
                  <select
                    value={articleCategory}
                    onChange={(e) => setArticleCategory(e.target.value as AdminNews['category'])}
                    className="h-10 w-full rounded-xl border border-gray-mid px-3 text-xs text-text-dark outline-none bg-gray-light/20 focus:border-green-main focus:bg-white font-bold"
                  >
                    <option value="ANNOUNCEMENT">Thông báo chính thức</option>
                    <option value="GUIDE">Hướng dẫn tuyển sinh</option>
                    <option value="EVENT">Sự kiện & Ngày hội</option>
                  </select>
                </div>
              </div>

              {/* Title */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-text-mid">Tiêu đề tin tức *</label>
                <input
                  type="text"
                  placeholder="Nhập tiêu đề tin tức tuyển sinh..."
                  value={articleTitle}
                  onChange={(e) => setArticleTitle(e.target.value)}
                  className="h-10 w-full rounded-xl border border-gray-mid px-4 text-xs font-bold text-text-dark outline-none bg-gray-light/20 focus:border-green-main focus:bg-white"
                  required
                />
              </div>

              {/* Summary */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-text-mid">Tóm tắt ngắn *</label>
                <input
                  type="text"
                  placeholder="Mô tả tóm tắt nội dung bài viết (hiển thị trên trang chủ)..."
                  value={articleSummary}
                  onChange={(e) => setArticleSummary(e.target.value)}
                  className="h-10 w-full rounded-xl border border-gray-mid px-4 text-xs text-text-dark outline-none bg-gray-light/20 focus:border-green-main focus:bg-white"
                  required
                />
              </div>

              {/* Content */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-text-mid">Nội dung chi tiết *</label>
                <textarea
                  placeholder="Viết nội dung bài viết tin tức đầy đủ tại đây..."
                  value={articleContent}
                  onChange={(e) => setArticleContent(e.target.value)}
                  rows={6}
                  className="w-full rounded-xl border border-gray-mid p-4 text-xs text-text-dark outline-none bg-gray-light/20 focus:border-green-main focus:bg-white resize-y font-medium"
                  required
                />
              </div>

              {/* Status */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-text-mid">Trạng thái đăng bài</label>
                <select
                  value={articleStatus}
                  onChange={(e) => setArticleStatus(e.target.value as AdminNews['status'])}
                  className="h-10 w-full rounded-xl border border-gray-mid px-3 text-xs text-text-dark outline-none bg-gray-light/20 focus:border-green-main focus:bg-white font-bold"
                >
                  <option value="DRAFT">Lưu bản nháp (Draft)</option>
                  <option value="PUBLISHED">Xuất bản ngay (Published)</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-light mt-5">
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

      {/* ─────────────────────────────────────────────
      // MODAL: DELETE CONFIRMATION
      // ───────────────────────────────────────────── */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-gray-mid rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-500 mb-4">
              <div className="h-10 w-10 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center">
                <Trash2 size={20} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-[0.5px]">Xóa bài viết</h3>
            </div>
            <p className="text-xs text-text-mid leading-relaxed mb-6">
              Bạn có chắc chắn muốn xóa bài viết tin tức tuyển sinh này? Hành động này sẽ gỡ bài viết vĩnh viễn khỏi trang tin tức và không thể phục hồi.
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
