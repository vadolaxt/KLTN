'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  AdminApiService,
  AdminNews,
  AdminProfile,
  AdminUser,
  AdmissionInfo,
  AdmissionCreateRequest,
  AdmissionUpdateRequest,
  DashboardStats,
} from '@/service/admin.api';

export type AdminTab = 'dashboard' | 'users' | 'admissions' | 'scores' | 'news';

const DEFAULT_YEARS = [2026, 2025, 2024, 2023, 2022, 2021, 2020];
const ADMIN_DEMO_MODE = false;
const DEMO_ADMIN_PROFILE: AdminProfile = {
  firstName: 'Quản trị',
  lastName: 'Demo',
  email: 'admin@nlu.edu.vn',
  role: 'ADMIN',
};

const makeCombination = (code: string) => ({
  code,
  name: code,
});

const DEMO_ADMISSIONS: AdmissionInfo[] = [
  {
    id: 'adm-2026-7480201',
    schoolCode: 'NLU',
    year: 2026,
    departmentCode: 'CNTT',
    majorName: 'Công nghệ thông tin',
    majorCode: '7480201',
    admissionQuota: 240,
    cutoffScore: 24.5,
    combinations: ['A00', 'A01', 'D07'].map(makeCombination),
    programType: 'Đại trà',
    note: 'Dữ liệu demo lấy theo cấu trúc dataset.csv',
  },
  {
    id: 'adm-2026-7640101',
    schoolCode: 'NLU',
    year: 2026,
    departmentCode: 'CNTY',
    majorName: 'Thú y',
    majorCode: '7640101',
    admissionQuota: 180,
    cutoffScore: 24.75,
    combinations: ['A00', 'B00', 'D07', 'D08'].map(makeCombination),
    programType: 'Đại trà',
    note: '',
  },
  {
    id: 'adm-2026-7540101',
    schoolCode: 'NLU',
    year: 2026,
    departmentCode: 'CNHHTP',
    majorName: 'Công nghệ thực phẩm',
    majorCode: '7540101',
    admissionQuota: 220,
    cutoffScore: 23,
    combinations: ['A00', 'A01', 'B00', 'D08'].map(makeCombination),
    programType: 'Đại trà',
    note: '',
  },
  {
    id: 'adm-2026-7510201',
    schoolCode: 'NLU',
    year: 2026,
    departmentCode: 'CK',
    majorName: 'Công nghệ kỹ thuật cơ khí',
    majorCode: '7510201',
    admissionQuota: 120,
    cutoffScore: 21,
    combinations: ['A00', 'A01', 'D07'].map(makeCombination),
    programType: 'CLC',
    note: 'Chương trình chất lượng cao',
  },
  {
    id: 'adm-2025-7480201',
    schoolCode: 'NLU',
    year: 2025,
    departmentCode: 'CNTT',
    majorName: 'Công nghệ thông tin',
    majorCode: '7480201',
    admissionQuota: 210,
    cutoffScore: 23.75,
    combinations: ['A00', 'A01', 'D07'].map(makeCombination),
    programType: 'Đại trà',
    note: '',
  },
];

const DEMO_USERS: AdminUser[] = [
  {
    id: 'user-demo-1',
    firstName: 'An',
    lastName: 'Nguyễn Văn',
    email: 'an.nguyen@student.nlu.edu.vn',
    identity: '079204001234',
    role: 'USER',
    status: 'ACTIVE',
    createdAt: '2026-05-10',
  },
  {
    id: 'user-demo-2',
    firstName: 'Quản trị',
    lastName: 'Demo',
    email: 'admin@nlu.edu.vn',
    identity: '079204009999',
    role: 'ADMIN',
    status: 'ACTIVE',
    createdAt: '2026-01-01',
  },
];

const DEMO_NEWS: AdminNews[] = [
  {
    id: 'news-demo-1',
    title: 'Thông báo tuyển sinh đại học chính quy năm 2026',
    summary: 'Cập nhật chỉ tiêu, tổ hợp môn và điểm chuẩn tham khảo cho các ngành đào tạo.',
    content: 'Nội dung demo phục vụ kiểm thử giao diện quản trị tuyển sinh.',
    category: 'ANNOUNCEMENT',
    status: 'PUBLISHED',
    publishedAt: '2026-05-01',
    emoji: '📢',
    views: 1540,
  },
];

const buildDemoStats = (): DashboardStats => ({
  totalUsers: DEMO_USERS.length,
  totalAdmissions: DEMO_ADMISSIONS
    .filter((item) => item.year === 2026)
    .reduce((sum, item) => sum + item.admissionQuota, 0),
  totalNews: DEMO_NEWS.length,
  activeUsers: DEMO_USERS.filter((user) => user.status === 'ACTIVE').length,
  approvedApplicationsRate: 78.4,
  applicationsByMethod: [
    { method: 'Xét học bạ THPT', count: 1840 },
    { method: 'Xét điểm thi THPT', count: 2450 },
    { method: 'Xét điểm ĐGNL', count: 680 },
    { method: 'Xét tuyển thẳng', count: 120 },
  ],
  registrationsByMonth: [
    { month: 'T1', count: 110 },
    { month: 'T2', count: 140 },
    { month: 'T3', count: 290 },
    { month: 'T4', count: 650 },
    { month: 'T5', count: 1200 },
    { month: 'T6', count: 1540 },
  ],
});

const upsertById = <T extends { id: string }>(items: T[], nextItem: T) => {
  const exists = items.some((item) => item.id === nextItem.id);
  if (!exists) return [...items, nextItem];
  return items.map((item) => (item.id === nextItem.id ? nextItem : item));
};

export function useAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(ADMIN_DEMO_MODE);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<AdminProfile | null>(
    ADMIN_DEMO_MODE ? DEMO_ADMIN_PROFILE : null
  );

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [selectedYear, setSelectedYear] = useState(2026);
  const [availableYears, setAvailableYears] = useState<number[]>(DEFAULT_YEARS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [users, setUsers] = useState<AdminUser[]>(ADMIN_DEMO_MODE ? DEMO_USERS : []);
  const [admissions, setAdmissions] = useState<AdmissionInfo[]>(
    ADMIN_DEMO_MODE ? DEMO_ADMISSIONS.filter((item) => item.year === selectedYear) : []
  );
  const [news, setNews] = useState<AdminNews[]>(ADMIN_DEMO_MODE ? DEMO_NEWS : []);
  const [stats, setStats] = useState<DashboardStats | null>(ADMIN_DEMO_MODE ? buildDemoStats() : null);

  useEffect(() => {
    if (ADMIN_DEMO_MODE) {
      localStorage.setItem('isAdminLogin', 'true');
      localStorage.setItem('adminProfile', JSON.stringify(DEMO_ADMIN_PROFILE));
      setIsAuthenticated(true);
      setCurrentUser(DEMO_ADMIN_PROFILE);
      return;
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    if (ADMIN_DEMO_MODE) {
      localStorage.setItem('isAdminLogin', 'true');
      localStorage.setItem('adminProfile', JSON.stringify(DEMO_ADMIN_PROFILE));
      setIsAuthenticated(true);
      setCurrentUser(DEMO_ADMIN_PROFILE);
      toast.success('Đã vào chế độ demo Admin');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await AdminApiService.login(email, password);

      if (response.status === 'OK' && response.data) {
        localStorage.setItem('isAdminLogin', 'true');
        localStorage.setItem('adminProfile', JSON.stringify(response.data.profile));
        setIsAuthenticated(true);
        setCurrentUser(response.data.profile);
        toast.success('Đăng nhập quản trị viên thành công');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Không thể đăng nhập hệ thống quản trị';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: {
    firstName: string;
    lastName: string;
    email: string;
    identity: string;
  }) => {
    if (ADMIN_DEMO_MODE) {
      toast.success(`Demo: đã nhận yêu cầu tạo Admin cho ${data.email}`);
      setIsRegisterMode(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await AdminApiService.register(data);

      if (response.status === 'OK') {
        toast.success('Đã gửi yêu cầu tạo tài khoản Admin');
        setIsRegisterMode(false);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Không thể tạo tài khoản Admin';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    if (ADMIN_DEMO_MODE) {
      localStorage.setItem('isAdminLogin', 'true');
      localStorage.setItem('adminProfile', JSON.stringify(DEMO_ADMIN_PROFILE));
      setIsAuthenticated(true);
      setCurrentUser(DEMO_ADMIN_PROFILE);
      toast.success('Đang bật chế độ demo Admin');
      return;
    }

    try {
      await AdminApiService.logout();
    } catch {
      // Client state still needs to be cleared when the server session is already invalid.
    } finally {
      localStorage.removeItem('isAdminLogin');
      localStorage.removeItem('adminProfile');
      setIsAuthenticated(false);
      setCurrentUser(null);
      toast.success('Đã đăng xuất tài khoản quản trị');
    }
  }, []);

  const fetchYears = useCallback(async () => {
    if (ADMIN_DEMO_MODE) {
      setAvailableYears(DEFAULT_YEARS);
      return;
    }

    try {
      const res = await AdminApiService.getAdmissionYears();
      if (res.status === 'OK' && res.data.length > 0) {
        setAvailableYears([...res.data].sort((a, b) => b - a));
      }
    } catch {
      setAvailableYears(DEFAULT_YEARS);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    if (ADMIN_DEMO_MODE) {
      setStats(buildDemoStats());
      return;
    }

    const res = await AdminApiService.getStats();
    if (res.status === 'OK') setStats(res.data);
  }, []);

  const fetchUsers = useCallback(async () => {
    if (ADMIN_DEMO_MODE) {
      setUsers(DEMO_USERS);
      return;
    }

    const res = await AdminApiService.getUsers();
    if (res.status === 'OK') setUsers(res.data);
  }, []);

  const fetchAdmissions = useCallback(async (year: number) => {
    if (ADMIN_DEMO_MODE) {
      setAdmissions((prev) => {
        const currentItems = prev.filter((item) => item.year === year);
        return currentItems.length > 0
          ? currentItems
          : DEMO_ADMISSIONS.filter((item) => item.year === year);
      });
      return;
    }

    const res = await AdminApiService.getAdmissions({ year });
    if (res.status === 'OK') setAdmissions(res.data);
  }, []);

  const fetchNews = useCallback(async () => {
    if (ADMIN_DEMO_MODE) {
      setNews(DEMO_NEWS);
      return;
    }

    const res = await AdminApiService.getNews();
    if (res.status === 'OK') setNews(res.data);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchYears();
  }, [fetchYears, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        switch (activeTab) {
          case 'dashboard':
            await fetchStats();
            break;
          case 'users':
            await fetchUsers();
            break;
          case 'admissions':
            await fetchAdmissions(selectedYear);
            break;
          case 'scores':
            await fetchAdmissions(selectedYear);
            break;
          case 'news':
            await fetchNews();
            break;
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Không thể đồng bộ dữ liệu quản trị';
        setError(msg);
        toast.error(msg);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [
    activeTab,
    fetchAdmissions,
    fetchNews,
    fetchStats,
    fetchUsers,
    isAuthenticated,
    selectedYear,
  ]);

  const createUser = useCallback(async (user: Omit<AdminUser, 'id' | 'createdAt'>) => {
    if (ADMIN_DEMO_MODE) {
      const newUser: AdminUser = {
        ...user,
        id: `user-demo-${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
      };

      setUsers((prev) => [...prev, newUser]);
      toast.success(`Demo: đã thêm người dùng ${newUser.email}`);
      return;
    }

    try {
      const res = await AdminApiService.createUser(user);
      if (res.status === 'OK') {
        setUsers((prev) => [...prev, res.data]);
        toast.success(`Đã thêm người dùng: ${res.data.lastName} ${res.data.firstName}`);
        fetchStats();
      }
    } catch {
      toast.error('Không thể thêm người dùng mới');
    }
  }, [fetchStats]);

  const updateUserRole = useCallback(async (id: string, role: AdminUser['role']) => {
    if (ADMIN_DEMO_MODE) {
      setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, role } : user)));
      toast.success(`Demo: đã đổi vai trò sang ${role}`);
      return;
    }

    try {
      const res = await AdminApiService.updateUser(id, { role });
      if (res.status === 'OK') {
        setUsers((prev) => prev.map((user) => (user.id === id ? res.data : user)));
        toast.success(`Đã đổi vai trò sang ${role}`);
      }
    } catch {
      toast.error('Không thể cập nhật vai trò người dùng');
    }
  }, []);

  const toggleUserStatus = useCallback(async (id: string, currentStatus: AdminUser['status']) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';

    if (ADMIN_DEMO_MODE) {
      setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, status: nextStatus } : user)));
      toast.success(nextStatus === 'ACTIVE' ? 'Demo: đã mở khóa tài khoản' : 'Demo: đã khóa tài khoản');
      return;
    }

    try {
      const res = await AdminApiService.updateUser(id, { status: nextStatus });
      if (res.status === 'OK') {
        setUsers((prev) => prev.map((user) => (user.id === id ? res.data : user)));
        toast.success(nextStatus === 'ACTIVE' ? 'Đã mở khóa tài khoản' : 'Đã khóa tài khoản');
        fetchStats();
      }
    } catch {
      toast.error('Không thể cập nhật trạng thái tài khoản');
    }
  }, [fetchStats]);

  const deleteUser = useCallback(async (id: string) => {
    if (ADMIN_DEMO_MODE) {
      setUsers((prev) => prev.filter((user) => user.id !== id));
      toast.success('Demo: đã xóa tài khoản khỏi danh sách');
      return;
    }

    try {
      const res = await AdminApiService.deleteUser(id);
      if (res.status === 'OK') {
        setUsers((prev) => prev.filter((user) => user.id !== id));
        toast.success('Đã xóa tài khoản khỏi hệ thống');
        fetchStats();
      }
    } catch {
      toast.error('Không thể xóa tài khoản');
    }
  }, [fetchStats]);

  const updateAdmissionInfo = useCallback(async (id: string, updatedFields: AdmissionUpdateRequest) => {
    if (ADMIN_DEMO_MODE) {
      const applyUpdate = (item: AdmissionInfo): AdmissionInfo => {
        if (item.id !== id) return item;

        const { combinationCodes, ...rest } = updatedFields;
        return {
          ...item,
          ...rest,
          combinations: combinationCodes ? combinationCodes.map(makeCombination) : item.combinations,
        };
      };

      setAdmissions((prev) => prev.map(applyUpdate));
      toast.success('Demo: đã cập nhật thông tin tuyển sinh');
      return;
    }

    try {
      const res = await AdminApiService.updateAdmission(id, updatedFields);

      if (res.status === 'OK') {
        setAdmissions((prev) => upsertById(prev, res.data));
        toast.success(`Đã cập nhật ngành ${res.data.majorCode}`);
        fetchStats();
      }
    } catch {
      toast.error('Không thể cập nhật thông tin tuyển sinh');
    }
  }, [fetchStats]);

  const createAdmissionInfo = useCallback(async (data: AdmissionCreateRequest) => {
    try {
      const res = await AdminApiService.createAdmission(data);
      if (res.status === 'CREATED') {
        if (res.data.year === selectedYear) setAdmissions((prev) => upsertById(prev, res.data));
        setAvailableYears((prev) => [...new Set([...prev, res.data.year])].sort((a, b) => b - a));
        toast.success(`Đã thêm thông tin tuyển sinh ngành ${res.data.majorCode}`);
        fetchStats();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không thể thêm thông tin tuyển sinh');
      throw err;
    }
  }, [fetchStats, selectedYear]);

  const deleteAdmissionInfo = useCallback(async (id: string) => {
    try {
      const res = await AdminApiService.deleteAdmission(id);
      if (res.status === 'OK') {
        setAdmissions((prev) => prev.filter((item) => item.id !== id));
        toast.success('Đã xóa thông tin tuyển sinh');
        fetchStats();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không thể xóa thông tin tuyển sinh');
      throw err;
    }
  }, [fetchStats]);

  const updateAdmissionQuota = useCallback(async (id: string, quota: number, methods: string[]) => {
    await updateAdmissionInfo(id, {
      admissionQuota: quota,
      combinationCodes: methods,
    });
  }, [updateAdmissionInfo]);

  const updateCutoffScore = useCallback(async (id: string, cutoffScore: number, combinationCodes?: string[]) => {
    await updateAdmissionInfo(id, {
      cutoffScore,
      ...(combinationCodes ? { combinationCodes } : {}),
    });
  }, [updateAdmissionInfo]);

  const createNewsArticle = useCallback(async (article: Omit<AdminNews, 'id' | 'views' | 'publishedAt'>) => {
    if (ADMIN_DEMO_MODE) {
      const newArticle: AdminNews = {
        ...article,
        id: `news-demo-${Date.now()}`,
        views: 0,
        publishedAt: new Date().toISOString().split('T')[0],
      };

      setNews((prev) => [...prev, newArticle]);
      toast.success('Demo: đã đăng bài viết tuyển sinh');
      return;
    }

    try {
      const res = await AdminApiService.createNews(article);
      if (res.status === 'OK') {
        setNews((prev) => [...prev, res.data]);
        toast.success('Đã đăng bài viết tuyển sinh');
        fetchStats();
      }
    } catch {
      toast.error('Không thể đăng tin tức');
    }
  }, [fetchStats]);

  const updateNewsArticle = useCallback(async (id: string, updatedFields: Partial<AdminNews>) => {
    if (ADMIN_DEMO_MODE) {
      setNews((prev) => prev.map((article) => (
        article.id === id ? { ...article, ...updatedFields } : article
      )));
      toast.success('Demo: đã cập nhật tin tức');
      return;
    }

    try {
      const res = await AdminApiService.updateNews(id, updatedFields);
      if (res.status === 'OK') {
        setNews((prev) => prev.map((article) => (article.id === id ? res.data : article)));
        toast.success('Đã cập nhật tin tức');
      }
    } catch {
      toast.error('Không thể cập nhật tin tức');
    }
  }, []);

  const deleteNewsArticle = useCallback(async (id: string) => {
    if (ADMIN_DEMO_MODE) {
      setNews((prev) => prev.filter((article) => article.id !== id));
      toast.success('Demo: đã xóa bài viết');
      return;
    }

    try {
      const res = await AdminApiService.deleteNews(id);
      if (res.status === 'OK') {
        setNews((prev) => prev.filter((article) => article.id !== id));
        toast.success('Đã xóa bài viết tin tức');
        fetchStats();
      }
    } catch {
      toast.error('Không thể xóa bài viết');
    }
  }, [fetchStats]);

  const availableCombinationCodes = useMemo(() => {
    const codeSet = new Set<string>();
    admissions.forEach((item) => {
      item.combinations.forEach((combination) => codeSet.add(combination.code));
    });
    return Array.from(codeSet).sort();
  }, [admissions]);

  const scores = admissions;

  const refreshData = useCallback(async () => {
    if (activeTab === 'dashboard') await fetchStats();
    if (activeTab === 'users') await fetchUsers();
    if (activeTab === 'admissions') await fetchAdmissions(selectedYear);
    if (activeTab === 'scores') await fetchAdmissions(selectedYear);
    if (activeTab === 'news') await fetchNews();
  }, [activeTab, fetchAdmissions, fetchNews, fetchStats, fetchUsers, selectedYear]);

  return {
    isAuthenticated,
    isRegisterMode,
    setIsRegisterMode,
    currentUser,
    login,
    register,
    logout,

    activeTab,
    setActiveTab,
    selectedYear,
    setSelectedYear,
    availableYears,
    availableCombinationCodes,
    isLoading,
    error,

    users,
    admissions,
    scores,
    news,
    stats,

    createUser,
    updateUserRole,
    toggleUserStatus,
    deleteUser,
    updateAdmissionInfo,
    createAdmissionInfo,
    deleteAdmissionInfo,
    updateAdmissionQuota,
    updateCutoffScore,
    createNewsArticle,
    updateNewsArticle,
    deleteNewsArticle,
    refreshData,
  };
}
