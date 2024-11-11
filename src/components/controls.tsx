export function Controls() {
  return (
    <div className="absolute left-1 top-2 min-w-[250px] rounded-lg bg-white p-2 shadow-lg">
      <div className="flex flex-col items-center gap-2 overflow-x-auto">
        <div className="flex items-center gap-2 self-start">
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500"></div>
          <p className="text-primary-foreground">Selected node</p>
        </div>
        <div className="flex items-center gap-2 self-start">
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-orange-500"></div>
          <p className="text-primary-foreground">Node to Node path</p>
        </div>
        <div className="flex items-center gap-2 self-start">
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500"></div>
          <p className="text-primary-foreground">Leaf to Node path</p>
        </div>
        <div className="flex items-center gap-2 self-start">
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-purple-500"></div>
          <p className="text-primary-foreground">Both Leaf and Node path</p>
        </div>
      </div>
    </div>
  );
}
