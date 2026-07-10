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

export type AdminTab = 'dashboard' | 'users' | 'admissions' | 'news';

const DEFAULT_YEARS = [2026, 2025, 2024, 2023, 2022, 2021, 2020];
const ADMIN_DEMO_MODE = false;
const DEMO_ADMIN_PROFILE: AdminProfile = {
  firstName: 'Quáº£n trá»‹',
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
    majorName: 'CĂ´ng nghá»‡ thĂ´ng tin',
    majorCode: '7480201',
    admissionQuota: 240,
    cutoffScore: 24.5,
    combinations: ['A00', 'A01', 'D07'].map(makeCombination),
    programType: 'Äáº¡i trĂ ',
    note: 'Dá»¯ liá»‡u demo láº¥y theo cáº¥u trĂºc dataset.csv',
  },
  {
    id: 'adm-2026-7640101',
    schoolCode: 'NLU',
    year: 2026,
    departmentCode: 'CNTY',
    majorName: 'ThĂº y',
    majorCode: '7640101',
    admissionQuota: 180,
    cutoffScore: 24.75,
    combinations: ['A00', 'B00', 'D07', 'D08'].map(makeCombination),
    programType: 'Äáº¡i trĂ ',
    note: '',
  },
  {
    id: 'adm-2026-7540101',
    schoolCode: 'NLU',
    year: 2026,
    departmentCode: 'CNHHTP',
    majorName: 'CĂ´ng nghá»‡ thá»±c pháº©m',
    majorCode: '7540101',
    admissionQuota: 220,
    cutoffScore: 23,
    combinations: ['A00', 'A01', 'B00', 'D08'].map(makeCombination),
    programType: 'Äáº¡i trĂ ',
    note: '',
  },
  {
    id: 'adm-2026-7510201',
    schoolCode: 'NLU',
    year: 2026,
    departmentCode: 'CK',
    majorName: 'CĂ´ng nghá»‡ ká»¹ thuáº­t cÆ¡ khĂ­',
    majorCode: '7510201',
    admissionQuota: 120,
    cutoffScore: 21,
    combinations: ['A00', 'A01', 'D07'].map(makeCombination),
    programType: 'CLC',
    note: 'ChÆ°Æ¡ng trĂ¬nh cháº¥t lÆ°á»£ng cao',
  },
  {
    id: 'adm-2025-7480201',
    schoolCode: 'NLU',
    year: 2025,
    departmentCode: 'CNTT',
    majorName: 'CĂ´ng nghá»‡ thĂ´ng tin',
    majorCode: '7480201',
    admissionQuota: 210,
    cutoffScore: 23.75,
    combinations: ['A00', 'A01', 'D07'].map(makeCombination),
    programType: 'Äáº¡i trĂ ',
    note: '',
  },
];

const DEMO_USERS: AdminUser[] = [
  {
    id: 'user-demo-1',
    firstName: 'An',
    lastName: 'Nguyá»…n VÄƒn',
    email: 'an.nguyen@student.nlu.edu.vn',
    identity: '079204001234',
    role: 'USER',
    status: 'ACTIVE',
    createdAt: '2026-05-10',
  },
  {
    id: 'user-demo-2',
    firstName: 'Quáº£n trá»‹',
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
    title: 'ThĂ´ng bĂ¡o tuyá»ƒn sinh Ä‘áº¡i há»c chĂ­nh quy nÄƒm 2026',
    summary: 'Cáº­p nháº­t chá»‰ tiĂªu, tá»• há»£p mĂ´n vĂ  Ä‘iá»ƒm chuáº©n tham kháº£o cho cĂ¡c ngĂ nh Ä‘Ă o táº¡o.',
    content: 'Ná»™i dung demo phá»¥c vá»¥ kiá»ƒm thá»­ giao diá»‡n quáº£n trá»‹ tuyá»ƒn sinh.',
    category: 'ADMISSION_INFO',
    status: 'PUBLISHED',
    publishedAt: '2026-05-01',
    imageUrl: 'https://ts.nlu.edu.vn/imgs/hinh1.jpg',
    sourceUrl: 'https://ts.nlu.edu.vn/',
    sourceName: 'Trang tuyển sinh NLU',
    views: 1540,
    displayOrder: 1,
  },
];

const buildDemoStats = (): DashboardStats => ({
  totalMajors: new Set(DEMO_ADMISSIONS.filter((item) => item.year === 2026).map((item) => item.majorCode)).size,
  totalDepartments: new Set(DEMO_ADMISSIONS.filter((item) => item.year === 2026).map((item) => item.departmentCode)).size,
  totalQuota: DEMO_ADMISSIONS.filter((item) => item.year === 2026).reduce((sum, item) => sum + item.admissionQuota, 0),
  totalAdmissionRecords: DEMO_ADMISSIONS.filter((item) => item.year === 2026).length,
  averageCutoffScore: 23.31,
  highestCutoffScore: 24.75,
  lowestCutoffScore: 21,
  latestYear: 2026,
  quotaByDepartment: [
    { label: 'CNTT', count: 240 },
    { label: 'CNHHTP', count: 220 },
    { label: 'CNTY', count: 180 },
    { label: 'CK', count: 120 },
  ],
  majorsByDepartment: [
    { label: 'CNTT', count: 1 },
    { label: 'CNHHTP', count: 1 },
    { label: 'CNTY', count: 1 },
    { label: 'CK', count: 1 },
  ],
  majorsByProgramType: [
    { label: 'Đ?i trà', count: 3 },
    { label: 'CLC', count: 1 },
  ],
  quotaByYear: [
    { label: '2026', count: 760 },
    { label: '2025', count: 210 },
  ],
});
const upsertById = <T extends { id: string }>(items: T[], nextItem: T) => {
  const exists = items.some((item) => item.id === nextItem.id);
  if (!exists) return [...items, nextItem];
  return items.map((item) => (item.id === nextItem.id ? nextItem : item));
};

export function useAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(ADMIN_DEMO_MODE);
  const [isCheckingAuth, setIsCheckingAuth] = useState(!ADMIN_DEMO_MODE);
  const [isForbidden, setIsForbidden] = useState(false);
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
      setIsCheckingAuth(false);
      return;
    }

    const verifyAdminSession = async () => {
      try {
        const response = await AdminApiService.getCurrentProfile();
        const profile = response.data;
        const isAdmin = profile?.role === 'ADMIN' || profile?.role === 'ROLE_ADMIN';

        if (response.status === 'OK' && isAdmin) {
          localStorage.setItem('isAdminLogin', 'true');
          localStorage.setItem('adminProfile', JSON.stringify(profile));
          setIsAuthenticated(true);
          setIsForbidden(false);
          setCurrentUser(profile);
          setIsCheckingAuth(false);
          return;
        }

        if (response.status === 'OK' && profile) {
          setIsForbidden(true);
        }
      } catch {
        // The admin page will redirect to the shared login page after this check finishes.
        setIsForbidden(false);
      }

      localStorage.removeItem('isAdminLogin');
      localStorage.removeItem('adminProfile');
      setIsAuthenticated(false);
      setCurrentUser(null);
      setIsCheckingAuth(false);
    };

    verifyAdminSession();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    if (ADMIN_DEMO_MODE) {
      localStorage.setItem('isAdminLogin', 'true');
      localStorage.setItem('adminProfile', JSON.stringify(DEMO_ADMIN_PROFILE));
      setIsAuthenticated(true);
      setCurrentUser(DEMO_ADMIN_PROFILE);
      toast.success('Ä Ă£ vĂ o cháº¿ Ä‘á»™ demo Admin');
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
        toast.success('Ä Äƒng nháº­p quáº£n trá»‹ viĂªn thĂ nh cĂ´ng');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'KhĂ´ng thá»ƒ Ä‘Äƒng nháº­p há»‡ thá»‘ng quáº£n trá»‹';
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
      toast.success(`Demo: Ä‘Ă£ nháº­n yĂªu cáº§u táº¡o Admin cho ${data.email}`);
      setIsRegisterMode(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await AdminApiService.register(data);

      if (response.status === 'OK') {
        toast.success('Ä Ă£ gá»­i yĂªu cáº§u táº¡o tĂ i khoáº£n Admin');
        setIsRegisterMode(false);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'KhĂ´ng thá»ƒ táº¡o tĂ i khoáº£n Admin';
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
      toast.success('Ä ang báº­t cháº¿ Ä‘á»™ demo Admin');
      return;
    }

    try {
      await AdminApiService.logout();
    } catch {
      // Client state still needs to be cleared when the server session is already invalid.
    } finally {
      localStorage.removeItem('isAdminLogin');
      localStorage.removeItem('adminProfile');
      localStorage.removeItem('isLogin');
      localStorage.removeItem('userName');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('role');
      setIsAuthenticated(false);
      setIsForbidden(false);
      setCurrentUser(null);
      toast.success('Ä Ă£ Ä‘Äƒng xuáº¥t tĂ i khoáº£n quáº£n trá»‹');
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

  const fetchStats = useCallback(async (year: number = selectedYear) => {
    if (ADMIN_DEMO_MODE) {
      setStats(buildDemoStats());
      return;
    }

    const res = await AdminApiService.getStats(year);
    if (res.status === 'OK') setStats(res.data);
  }, [selectedYear]);

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
          case 'news':
            await fetchNews();
            break;
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'KhĂ´ng thá»ƒ Ä‘á»“ng bá»™ dá»¯ liá»‡u quáº£n trá»‹';
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
      toast.success(`Demo: Ä‘Ă£ thĂªm ngÆ°á»i dĂ¹ng ${newUser.email}`);
      return;
    }

    try {
      const res = await AdminApiService.createUser(user);
      if (res.status === 'OK') {
        setUsers((prev) => [...prev, res.data]);
        toast.success(`ÄĂ£ thĂªm ngÆ°á»i dĂ¹ng: ${res.data.lastName} ${res.data.firstName}`);
        fetchStats();
      }
    } catch {
      toast.error('KhĂ´ng thá»ƒ thĂªm ngÆ°á»i dĂ¹ng má»›i');
    }
  }, [fetchStats]);

  const updateUserRole = useCallback(async (id: string, role: AdminUser['role']) => {
    if (ADMIN_DEMO_MODE) {
      setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, role } : user)));
      toast.success(`Demo: Ä‘Ă£ Ä‘á»•i vai trĂ² sang ${role}`);
      return;
    }

    try {
      const res = await AdminApiService.updateUser(id, { role });
      if (res.status === 'OK') {
        setUsers((prev) => prev.map((user) => (user.id === id ? res.data : user)));
        toast.success(`ÄĂ£ Ä‘á»•i vai trĂ² sang ${role}`);
      }
    } catch {
      toast.error('KhĂ´ng thá»ƒ cáº­p nháº­t vai trĂ² ngÆ°á»i dĂ¹ng');
    }
  }, []);

  const toggleUserStatus = useCallback(async (id: string, currentStatus: AdminUser['status']) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';

    if (ADMIN_DEMO_MODE) {
      setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, status: nextStatus } : user)));
      toast.success(nextStatus === 'ACTIVE' ? 'Demo: Ä‘Ă£ má»Ÿ khĂ³a tĂ i khoáº£n' : 'Demo: Ä‘Ă£ khĂ³a tĂ i khoáº£n');
      return;
    }

    try {
      const res = await AdminApiService.updateUser(id, { status: nextStatus });
      if (res.status === 'OK') {
        setUsers((prev) => prev.map((user) => (user.id === id ? res.data : user)));
        toast.success(nextStatus === 'ACTIVE' ? 'ÄĂ£ má»Ÿ khĂ³a tĂ i khoáº£n' : 'ÄĂ£ khĂ³a tĂ i khoáº£n');
        fetchStats();
      }
    } catch {
      toast.error('KhĂ´ng thá»ƒ cáº­p nháº­t tráº¡ng thĂ¡i tĂ i khoáº£n');
    }
  }, [fetchStats]);

  const deleteUser = useCallback(async (id: string) => {
    if (ADMIN_DEMO_MODE) {
      setUsers((prev) => prev.filter((user) => user.id !== id));
      toast.success('Demo: Ä‘Ă£ xĂ³a tĂ i khoáº£n khá»i danh sĂ¡ch');
      return;
    }

    try {
      const res = await AdminApiService.deleteUser(id);
      if (res.status === 'OK') {
        setUsers((prev) => prev.filter((user) => user.id !== id));
        toast.success('ÄĂ£ xĂ³a tĂ i khoáº£n khá»i há»‡ thá»‘ng');
        fetchStats();
      }
    } catch {
      toast.error('KhĂ´ng thá»ƒ xĂ³a tĂ i khoáº£n');
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
      toast.success('Demo: Ä‘Ă£ cáº­p nháº­t thĂ´ng tin tuyá»ƒn sinh');
      return;
    }

    try {
      const res = await AdminApiService.updateAdmission(id, updatedFields);

      if (res.status === 'OK') {
        setAdmissions((prev) => upsertById(prev, res.data));
        toast.success(`ÄĂ£ cáº­p nháº­t ngĂ nh ${res.data.majorCode}`);
        fetchStats();
      }
    } catch {
      toast.error('KhĂ´ng thá»ƒ cáº­p nháº­t thĂ´ng tin tuyá»ƒn sinh');
    }
  }, [fetchStats]);

  const createAdmissionInfo = useCallback(async (data: AdmissionCreateRequest) => {
    try {
      const res = await AdminApiService.createAdmission(data);
      if (res.status === 'CREATED') {
        if (res.data.year === selectedYear) setAdmissions((prev) => upsertById(prev, res.data));
        setAvailableYears((prev) => [...new Set([...prev, res.data.year])].sort((a, b) => b - a));
        toast.success(`ÄĂ£ thĂªm thĂ´ng tin tuyá»ƒn sinh ngĂ nh ${res.data.majorCode}`);
        fetchStats();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'KhĂ´ng thá»ƒ thĂªm thĂ´ng tin tuyá»ƒn sinh');
      throw err;
    }
  }, [fetchStats, selectedYear]);

  const deleteAdmissionInfo = useCallback(async (id: string) => {
    try {
      const res = await AdminApiService.deleteAdmission(id);
      if (res.status === 'OK') {
        setAdmissions((prev) => prev.filter((item) => item.id !== id));
        toast.success('ÄĂ£ xĂ³a thĂ´ng tin tuyá»ƒn sinh');
        fetchStats();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'KhĂ´ng thá»ƒ xĂ³a thĂ´ng tin tuyá»ƒn sinh');
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

  const createNewsArticle = useCallback(async (article: Omit<AdminNews, 'id' | 'views' | 'createdAt' | 'updatedAt'>) => {
    if (ADMIN_DEMO_MODE) {
      const newArticle: AdminNews = {
        ...article,
        id: `news-demo-${Date.now()}`,
        views: 0,
        publishedAt: article.publishedAt || new Date().toISOString().split('T')[0],
        displayOrder: article.displayOrder ?? 100,
      };

      setNews((prev) => [...prev, newArticle]);
      toast.success('Demo: Ä‘Ă£ Ä‘Äƒng bĂ i viáº¿t tuyá»ƒn sinh');
      return;
    }

    try {
      const res = await AdminApiService.createNews(article);
      if (res.status === 'OK' || res.status === 'CREATED') {
        setNews((prev) => [...prev, res.data]);
        toast.success('ÄĂ£ Ä‘Äƒng bĂ i viáº¿t tuyá»ƒn sinh');
        fetchStats();
      }
    } catch {
      toast.error('KhĂ´ng thá»ƒ Ä‘Äƒng tin tá»©c');
    }
  }, [fetchStats]);

  const updateNewsArticle = useCallback(async (id: string, updatedFields: Partial<AdminNews>) => {
    if (ADMIN_DEMO_MODE) {
      setNews((prev) => prev.map((article) => (
        article.id === id ? { ...article, ...updatedFields } : article
      )));
      toast.success('Demo: Ä‘Ă£ cáº­p nháº­t tin tá»©c');
      return;
    }

    try {
      const res = await AdminApiService.updateNews(id, updatedFields);
      if (res.status === 'OK') {
        setNews((prev) => prev.map((article) => (article.id === id ? res.data : article)));
        toast.success('ÄĂ£ cáº­p nháº­t tin tá»©c');
      }
    } catch {
      toast.error('KhĂ´ng thá»ƒ cáº­p nháº­t tin tá»©c');
    }
  }, []);

  const deleteNewsArticle = useCallback(async (id: string) => {
    if (ADMIN_DEMO_MODE) {
      setNews((prev) => prev.filter((article) => article.id !== id));
      toast.success('Demo: Ä‘Ă£ xĂ³a bĂ i viáº¿t');
      return;
    }

    try {
      const res = await AdminApiService.deleteNews(id);
      if (res.status === 'OK') {
        setNews((prev) => prev.filter((article) => article.id !== id));
        toast.success('ÄĂ£ xĂ³a bĂ i viáº¿t tin tá»©c');
        fetchStats();
      }
    } catch {
      toast.error('KhĂ´ng thá»ƒ xĂ³a bĂ i viáº¿t');
    }
  }, [fetchStats]);

  const availableCombinationCodes = useMemo(() => {
    const codeSet = new Set<string>();
    admissions.forEach((item) => {
      item.combinations.forEach((combination) => codeSet.add(combination.code));
    });
    return Array.from(codeSet).sort();
  }, [admissions]);

  const refreshData = useCallback(async () => {
    if (activeTab === 'dashboard') await fetchStats();
    if (activeTab === 'users') await fetchUsers();
    if (activeTab === 'admissions') await fetchAdmissions(selectedYear);
    if (activeTab === 'news') await fetchNews();
  }, [activeTab, fetchAdmissions, fetchNews, fetchStats, fetchUsers, selectedYear]);

  return {
    isAuthenticated,
    isCheckingAuth,
    isForbidden,
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
