export default function Dashboard() {
  return (

    <div className="space-y-6">

      <h1 className="text-2xl font-semibold text-stone-900">
        Welcome back 👋
      </h1>

      <div className="grid grid-cols-4 gap-6">

        <div className="bg-white p-6 rounded-xl border border-stone-200">
          <p className="text-sm text-stone-500">Page Views</p>
          <h2 className="text-2xl font-bold mt-2">0</h2>
        </div>

        <div className="bg-white p-6 rounded-xl border border-stone-200">
          <p className="text-sm text-stone-500">Link Clicks</p>
          <h2 className="text-2xl font-bold mt-2">0</h2>
        </div>

        <div className="bg-white p-6 rounded-xl border border-stone-200">
          <p className="text-sm text-stone-500">Blocks</p>
          <h2 className="text-2xl font-bold mt-2">0</h2>
        </div>

        <div className="bg-white p-6 rounded-xl border border-stone-200">
          <p className="text-sm text-stone-500">Earnings</p>
          <h2 className="text-2xl font-bold mt-2">$0</h2>
        </div>

      </div>

    </div>

  );
}