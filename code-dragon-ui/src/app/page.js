export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center text-center py-20 px-6 bg-brandGray-900">
      <h1 className="text-5xl font-display mb-6 text-brandWhite drop-shadow-glow-black">
        Welcome to Code Dragon
      </h1>
      <p className="max-w-3xl text-brandGray-300 mb-10 leading-relaxed">
        Your all-in-one platform to master Python, solve coding challenges, and
        chat with our AI Assistant—all in one sleek, black-and-white experience.
      </p>

      <div className="flex flex-wrap gap-4">
        <a
          href="/signup"
          className="px-6 py-3 rounded bg-brandWhite text-brandBlack font-bold hover:opacity-80 transition-opacity"
        >
          Get Started
        </a>
        <a
          href="/signin"
          className="px-6 py-3 rounded border border-brandGray-500 text-brandGray-200 hover:bg-brandGray-800 transition-colors"
        >
          Sign In
        </a>
      </div>
      <img
        src="https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI0LTAyL3dvcmxkZmFjZXNsYWJfYV9ibGFja19zaWxob3VldHRlX2RyYWdvbl9sb2dvX2ljb25fb25fYV93aGl0ZV9iYV81YzMzOTc1ZS1hYTliLTRjOWEtODJiMy1hMzQ2ODA1NzIzYzYucG5n.png"
        alt="Dragon Decorative"
        className="mt-8 w-32 opacity-50 rounded-xl"
      />
    </section>
  );
}
