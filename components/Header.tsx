import React from 'react';
import { Palette } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="text-center mb-8 pt-12">
      <div className="inline-flex items-center justify-center p-4 bg-white rounded-full shadow-xl mb-6 animate-bounce border-4 border-pastelYellow/50">
        <Palette className="w-10 h-10 text-pastelPink mr-2" />
        <span className="text-3xl">✨</span>
      </div>
      <h1 className="text-4xl md:text-6xl font-extrabold text-pastelPink tracking-tight mb-4 drop-shadow-sm text-stroke-white">
        나만의 AI 색칠공부
      </h1>
      <div className="bg-white/60 backdrop-blur-sm py-4 px-6 rounded-3xl inline-block shadow-sm border border-white/50">
        <p className="text-gray-500 text-lg md:text-2xl font-medium leading-relaxed">
          사진을 찰칵! 📸<br />
          <span className="text-gray-600 mt-1 block">세상에 하나뿐인 도안을 만들어보세요 🧸🎈</span>
        </p>
      </div>
    </header>
  );
};

export default Header;