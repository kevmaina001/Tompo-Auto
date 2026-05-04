import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Sign In",
  robots: { index: false, follow: false },
};

async function signIn(formData: FormData) {
  "use server";
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedPass = process.env.ADMIN_PASSWORD;
  const sessionToken = process.env.ADMIN_SESSION_TOKEN;

  if (!expectedUser || !expectedPass || !sessionToken) {
    redirect("/admin-login?error=server");
  }

  if (username !== expectedUser || password !== expectedPass) {
    redirect("/admin-login?error=1");
  }

  cookies().set("admin_session", sessionToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/admin");
}

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const errorMsg =
    searchParams.error === "server"
      ? "Server is not configured. Set ADMIN_USERNAME, ADMIN_PASSWORD, and ADMIN_SESSION_TOKEN env vars."
      : searchParams.error
        ? "Invalid username or password"
        : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        action={signIn}
        className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-sm space-y-4"
      >
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Admin Sign In
        </h1>

        {errorMsg && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
            {errorMsg}
          </p>
        )}

        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition-colors"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
