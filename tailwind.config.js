/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#007bff',  // 버튼과 이벤트 배경 색상
        secondary: '#f0f8ff',  // 오늘 날짜 배경 색상
        text: '#333',  // 기본 텍스트 색상
        eventBackground: '#0056b3',  // 이벤트 배경 색상
      },
      backgroundImage: {
        // 배경 이미지가 필요한 경우 추가 가능
      },
      spacing: {
        // 추가적인 padding, margin, width, height 등을 설정
      },
      fontSize: {
        // 폰트 사이즈 확장 가능
      },
      borderRadius: {
        'rounded-lg': '0.5rem',  // 버튼 및 이벤트의 둥근 모서리 크기
      },
    },
  },
  plugins: [],
};
