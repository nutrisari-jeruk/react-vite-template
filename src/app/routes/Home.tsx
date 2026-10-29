function HomePage() {
  return (
    <div className="flex min-h-[calc(100dvh-12rem)] items-center justify-center px-4">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Welcome to Your App
        </h1>
        <p className="mx-auto max-w-md text-lg text-gray-600">
          Get started by adding components and features with{" "}
          <code className="rounded bg-gray-100 px-2 py-0.5 font-mono text-sm text-indigo-600">
            frontier-fe add
          </code>
        </p>
      </div>
    </div>
  );
}

export default HomePage;
