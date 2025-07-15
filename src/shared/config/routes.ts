export const routes = {
  home: '/',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  notFound: '/notfound',
  adnChaCon: '/dich-vu-xet-nghiem-adn-huyet-thong-cha-con',
  adnKhaiSinh: '/dich-vu-xet-nghiem-adn-lam-giay-khai-sinh-cho-con',
  news: "/news",
  newsDetail: (id: string) => `/news/${id}`,
};
export const adminRoutes = {
  dashboard: '/admin/dashboard',
  userManagement: '/admin/users',
  kitManagement: '/admin/kits',
  sampleMethodManagement: '/admin/sample-methods',
  bookingModal: '/admin/booking-modal',
};
export const managerRoutes = {
  requestCompleted: '/manager/request-completed',
  exResult: '/manager/ex-result',
};
