export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-600 text-sm">
            <p>Göstergeç - Gerçek Getiri Hesaplayıcı</p>
            <p className="mt-1">
              Veriler bilgilendirme amaçlıdır, yatırım tavsiyesi değildir.
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-gray-500 text-sm">
            <p>Data sources: TCMB, TEFAS, Yahoo Finance</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
