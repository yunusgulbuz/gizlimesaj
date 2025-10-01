"use client";

export default function TemplateDetailLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="inline-block w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600">Şablon hazırlanıyor...</p>
      </div>
    </div>
  );
}
