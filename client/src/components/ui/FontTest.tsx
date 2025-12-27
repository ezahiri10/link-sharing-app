export function FontTest() {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-4xl font-normal">Instrument Sans Regular (400)</h1>
      <h2 className="text-3xl font-semibold">Instrument Sans SemiBold (600)</h2>
      <h3 className="text-2xl font-bold">Instrument Sans Bold (700)</h3>
      <p className="text-base font-normal">
        The quick brown fox jumps over the lazy dog. 0123456789
      </p>
      <p className="text-base font-semibold">
        The quick brown fox jumps over the lazy dog. 0123456789
      </p>
      <p className="text-base font-bold">
        The quick brown fox jumps over the lazy dog. 0123456789
      </p>
    </div>
  );
}
