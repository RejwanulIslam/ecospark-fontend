export default function IdeaCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700/60 overflow-hidden flex flex-col">
      <div className="h-48 skeleton" />
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full skeleton" />
          <div className="h-3 w-24 skeleton rounded" />
        </div>
        <div className="h-5 w-3/4 skeleton rounded" />
        <div className="h-3 w-full skeleton rounded" />
        <div className="h-3 w-2/3 skeleton rounded" />
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700/50">
          <div className="flex gap-3">
            <div className="h-3 w-8 skeleton rounded" />
            <div className="h-3 w-8 skeleton rounded" />
            <div className="h-3 w-8 skeleton rounded" />
          </div>
          <div className="h-7 w-16 skeleton rounded-xl" />
        </div>
      </div>
    </div>
  );
}
