"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-titan">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Something went wrong!</h2>
        <p className="text-gray-300 mb-6">{error.message || "An error occurred"}</p>
        <button
          onClick={() => reset()}
          className="bg-gradient-neon text-black px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
