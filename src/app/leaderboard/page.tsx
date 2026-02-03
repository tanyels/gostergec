import { FundLeaderboard } from '@/components/ui/FundLeaderboard'

export default function LeaderboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Sıralama</h1>
      <p className="text-gray-600 mb-8">
        USD bazlı gerçek getiriye göre sıralanmış fonlar / Funds ranked by real USD-adjusted returns
      </p>

      <FundLeaderboard />
    </div>
  )
}
