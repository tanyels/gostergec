export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-slate-600 text-sm">
            <p className="font-semibold text-slate-700">Göstergeç - Gerçek Getiri Hesaplayıcı</p>
            <p className="mt-1 text-slate-500">
              Veriler bilgilendirme amaçlıdır, yatırım tavsiyesi değildir.
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-slate-500 text-sm">
            <p>Data sources: TCMB, TEFAS, Yahoo Finance</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
