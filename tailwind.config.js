/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'], // Font mặc định 
        poppins: ['Poppins', 'sans-serif'], // Font cho tiêu đề
      },
      colors: {
        primary: '#1B4965', // Xanh dương đậm (nút, tiêu đề)
        secondary: '#E5E7EB', // Xám nhạt (nền phụ, viền)
        accent: '#34D399', // Xanh lá nhạt (điểm nhấn, DNA)
        background: '#F9FAFB', // Nền trắng nhẹ
        foreground: '#1F2937', // Chữ chính
        border: '#D1D5DB', // Viền xám
        error: '#EF4444', // Đỏ cho lỗi
      },
      animation: {
        slideIn: 'slideIn 0.5s ease-out',
        fadeIn: 'fadeIn 0.5s ease-in',
      },
      keyframes: {
        slideIn: {
          from: { transform: 'translateX(100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      borderRadius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '0.75rem',
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        button: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};