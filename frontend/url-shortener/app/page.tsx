import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900 tracking-tight">URL Shortener</span>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors px-4 py-2 rounded-lg"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
            Shorten your links,
            <br />
            <span className="text-indigo-600">amplify your reach.</span>
          </h1>
          <p className="mt-6 text-lg text-gray-500 leading-relaxed max-w-lg mx-auto">
            Create short, memorable links in seconds. Track clicks, manage your
            URLs, and share with confidence.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center h-12 px-8 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors"
            >
              Get Started &mdash; It&rsquo;s Free
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center h-12 px-8 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} URL Shortener. All rights reserved.
      </footer>
    </div>
  );
}
