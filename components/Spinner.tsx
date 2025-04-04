"use client"
const  Spinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-gray-500 border-opacity-50"></div>
    </div>
  );
}

export default Spinner;