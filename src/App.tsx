interface Website {
  name: string
  url: string
  description?: string
}

const websites: Website[] = [
  {
    name: 'Example Website 1',
    url: 'https://example.com',
    description: 'A sample website description'
  },
  {
    name: 'Example Website 2',
    url: 'https://example.org',
    description: 'Another sample website description'
  },
  {
    name: 'Example Website 3',
    url: 'https://example.net',
    description: 'Yet another sample website description'
  }
]

function App() {
  return (
    <>
      <header className="sticky top-0 w-full bg-white dark:bg-gray-800 shadow-md z-[1000] px-8 py-4">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          RSUD R.T. Notopuro
        </h1>
      </header>
      <main className="min-h-screen bg-white dark:bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Website Links
          </h2>
          <div className="flex flex-row gap-4 overflow-x-auto pb-4">
            {websites.map((website, index) => (
              <div
                key={index}
                className="max-w-sm min-w-[300px] p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 flex flex-col"
              >
                <a 
                  href={website.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {website.name}
                  </h5>
                </a>
                {website.description && (
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    {website.description}
                  </p>
                )}
                <a
                  href={website.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-auto"
                >
                  Read more
                  <svg
                    className="w-3.5 h-3.5 ml-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 5h12m0 0L9 1m4 4L9 9"
                    />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}

export default App

