import { useEffect, useState } from "react";
import type { ReactNode } from "react"; 

interface Props {
  children: ReactNode;
}

function BackGround({ children }: Props) {
  // Varsayılan olarak Karanlık Mod
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Sayfa yüklendiğinde kullanıcının son tercihini hafızadan çek
  useEffect(() => {
    const savedTheme = localStorage.getItem("kanban-theme");
    if (savedTheme === "light") {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Tema Değiştirme
  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("kanban-theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("kanban-theme", "dark");
      setIsDarkMode(true);
    }
  };

  return (
    <div className="relative min-h-screen w-full font-sans transition-colors duration-500 overflow-hidden 
      bg-slate-50 text-slate-900 selection:bg-rose-500/30
      dark:bg-slate-950 dark:text-white"
    >
      
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full bg-rose-600/10 dark:bg-rose-600/20 blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-blue-600/10 dark:bg-blue-600/20 blur-[120px] pointer-events-none"></div>

      <div className="absolute inset-0 bg-[url('https://play.tailwindcss.com/img/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5 dark:opacity-10 pointer-events-none"></div>
      
      <div className="relative z-10 w-full h-full flex flex-col min-h-screen">
        
        {/* RESPONSIVE NAVBAR */}
        <header className="w-full h-16 sm:h-20 border-b border-slate-300/50 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-md flex items-center justify-between px-4 sm:px-8 sticky top-0 z-50">
          
          <div className="flex items-center gap-2 sm:gap-3 cursor-default">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-rose-500 to-orange-400 flex items-center justify-center font-bold text-lg sm:text-xl shadow-lg shadow-rose-500/30 text-white">
              T
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-wide text-slate-800 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:to-gray-400">
              ThunderFlow
            </h1>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:ring-2 ring-rose-500 transition-all"
              title="Temayı Değiştir"
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-amber-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-slate-700">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              )}
            </button>
            <div className="relative group cursor-pointer hidden sm:block">
              <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 to-orange-500 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative w-12 h-12 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-2xl shadow-xl">
                👨‍💻
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-hidden flex">
          {children}
        </main>

      </div>
    </div>
  );
}

export default BackGround;