import Link from 'next/link';

export default function CompanyCard({ company }: { company: any }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center">
        {company.logo_url ? (
          <img 
            src={company.logo_url} 
            alt="Company logo" 
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
        )}
        <div className="ml-4">
          <Link href={`/companies/${company.id}`}>
            <h3 className="text-lg font-bold text-blue-600 hover:text-blue-800">
              {company.name}
            </h3>
          </Link>
          {company.industry && (
            <p className="text-sm text-gray-600">{company.industry}</p>
          )}
        </div>
      </div>
      
      {company.description && (
        <p className="mt-4 text-gray-600 line-clamp-2">{company.description}</p>
      )}
    </div>
  );
}