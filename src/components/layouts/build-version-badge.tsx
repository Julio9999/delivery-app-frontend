export function BuildVersionBadge() {
  return (
    <div
      className="mt-3 text-center font-mono text-[10px] text-white/50 select-all"
      title={__APP_FULL_VERSION__}
    >
      {__APP_VERSION__}
    </div>
  );
}
