export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#EFEBFF] rounded-full"></div>
          <div className="w-16 h-16 border-4 border-[#633CFF] border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <p className="text-[#737373] text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
}
