import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-titan">
      <div className="text-center">
        <h1 className="text-6xl font-bold gradient-text mb-4">404</h1>
        <h2 className="text-2xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-gray-300 mb-6">The page you're looking for doesn't exist.</p>
        <Link
          href="/"
          className="bg-gradient-neon text-black px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition inline-block"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
