export default function PageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(255,255,255,0.8)" }}>
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div
          className="w-12 h-12 rounded-full border-4 animate-spin"
          style={{
            borderColor: "#D4E6F7",
            borderTopColor: "#003087",
          }}
        />
        <p className="text-sm font-medium" style={{ color: "#003087" }}>
          Memuat...
        </p>
      </div>
    </div>
  );
}