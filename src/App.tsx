import { useState } from 'react';
import './App.css'

type Website = {
  name: string;
  url: string;
  image_url: string;
};

const websites: Website[] = [
  { name: "RSUD R.T. NOTOPURO SIDOARJO", url: "https://www.rsudnotopuro.co.id", image_url: "/logo.webp" },
  { name: "Hospital Management System", url: "https://example.com/hms", image_url: "/logo.webp" },
  { name: "Patient Portal", url: "https://example.com/patient", image_url: "/logo.webp" },
  { name: "Laboratory System", url: "https://example.com/lab", image_url: "/logo.webp" },
  { name: "Radiology Portal", url: "https://example.com/radiology", image_url: "/logo.webp" },
  { name: "Pharmacy System", url: "https://example.com/pharmacy", image_url: "/logo.webp" },
  { name: "HR Management", url: "https://example.com/hr", image_url: "/logo.webp" },
  { name: "Finance System", url: "https://example.com/finance", image_url: "/logo.webp" },
  { name: "Inventory Management", url: "https://example.com/inventory", image_url: "/logo.webp" },
  { name: "Appointment Booking", url: "https://example.com/appointment", image_url: "/logo.webp" },
  { name: "Medical Records", url: "https://example.com/records", image_url: "/logo.webp" },
  { name: "Billing System", url: "https://example.com/billing", image_url: "/logo.webp" },
  { name: "Emergency Services", url: "https://example.com/emergency", image_url: "/logo.webp" },
  { name: "ICU Monitoring", url: "https://example.com/icu", image_url: "/logo.webp" },
  { name: "Surgery Scheduling", url: "https://example.com/surgery", image_url: "/logo.webp" },
  { name: "Outpatient Clinic", url: "https://example.com/outpatient", image_url: "/logo.webp" },
  { name: "Inpatient Management", url: "https://example.com/inpatient", image_url: "/logo.webp" },
  { name: "Blood Bank System", url: "https://example.com/bloodbank", image_url: "/logo.webp" },
  { name: "Donor Management", url: "https://example.com/donor", image_url: "/logo.webp" },
  { name: "Vaccination Portal", url: "https://example.com/vaccination", image_url: "/logo.webp" },
  { name: "Health Check System", url: "https://example.com/healthcheck", image_url: "/logo.webp" },
  { name: "Doctor Portal", url: "https://example.com/doctor", image_url: "/logo.webp" },
  { name: "Nurse Dashboard", url: "https://example.com/nurse", image_url: "/logo.webp" },
  { name: "Admin Panel", url: "https://example.com/admin", image_url: "/logo.webp" },
  { name: "Report Generator", url: "https://example.com/reports", image_url: "/logo.webp" },
  { name: "Analytics Dashboard", url: "https://example.com/analytics", image_url: "/logo.webp" },
  { name: "Mobile App API", url: "https://example.com/api", image_url: "/logo.webp" },
  { name: "Email Service", url: "https://example.com/email", image_url: "/logo.webp" },
  { name: "Notification System", url: "https://example.com/notifications", image_url: "/logo.webp" },
  { name: "Document Management", url: "https://example.com/documents", image_url: "/logo.webp" },
];

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWebsites = websites.filter(website =>
    website.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="sticky top-0 backdrop-blur-lg bg-white/80 border-b border-gray-200/50 shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <img 
              src="/logo.svg" 
              alt="RSUD R.T. NOTOPURO SIDOARJO Logo" 
              className="h-14 w-auto drop-shadow-sm" 
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                RSUD R.T. NOTOPURO SIDOARJO
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">Application Portal</p>
            </div>
            <div className="relative w-64 md:w-80">
              <input
                type="text"
                placeholder="Search by app name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400 transition-all duration-200"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {filteredWebsites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No apps found matching "{searchQuery}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredWebsites.map((website, index) => (
              <a
                href={website.url}
                key={website.name}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-white/80 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-xl border border-gray-200/50 p-6 flex flex-col items-center justify-center min-h-[160px] transition-all duration-300 hover:-translate-y-1 hover:border-blue-300/50"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10 flex flex-col items-center gap-3 w-full">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-300">
                    <img
                      src={website.image_url}
                      alt={website.name}
                      className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800 text-center line-clamp-2 group-hover:text-blue-700 transition-colors duration-300">
                    {website.name}
                  </h3>
                </div>
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg
                    className="w-4 h-4 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
