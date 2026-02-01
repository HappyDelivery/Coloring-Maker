import React, { useState } from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import ProcessingEditor from './components/ProcessingEditor';

const App: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  return (
    <div className="min-h-screen bg-pattern font-sans selection:bg-pastelPink selection:text-white pb-20 overflow-x-hidden">
      <Header />
      
      <main className="container mx-auto px-4">
        {!selectedImage ? (
          <div className="max-w-3xl mx-auto space-y-12 animate-fade-in-up">
            <FileUpload onImageSelected={setSelectedImage} />
            
            {/* Demo / Explanation Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-90">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-white/50 text-center transform hover:-translate-y-2 transition-transform duration-300">
                <div className="text-5xl mb-4 drop-shadow-sm">📸</div>
                <h3 className="font-bold text-xl text-gray-700 mb-2">1. 사진 고르기</h3>
                <p className="text-gray-500 font-medium">잘 나온 사진을<br/>선택해주세요</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-white/50 text-center transform hover:-translate-y-2 transition-transform duration-300 delay-100">
                <div className="text-5xl mb-4 drop-shadow-sm">✨</div>
                <h3 className="font-bold text-xl text-gray-700 mb-2">2. 도안 변환</h3>
                <p className="text-gray-500 font-medium">AI가 슥삭슥삭<br/>그림을 그려요</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-white/50 text-center transform hover:-translate-y-2 transition-transform duration-300 delay-200">
                <div className="text-5xl mb-4 drop-shadow-sm">🖍️</div>
                <h3 className="font-bold text-xl text-gray-700 mb-2">3. 색칠놀이</h3>
                <p className="text-gray-500 font-medium">인쇄해서 예쁘게<br/>색칠해보세요</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            <ProcessingEditor 
              imageFile={selectedImage} 
              onReset={() => setSelectedImage(null)} 
            />
          </div>
        )}
      </main>
      
      <footer className="fixed bottom-0 w-full p-6 text-center text-gray-500 text-sm font-bold bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-50">
        <p>Made by 행복배달부 🍀</p>
      </footer>
    </div>
  );
};

export default App;