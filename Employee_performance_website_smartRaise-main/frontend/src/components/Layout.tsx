import { Link, Outlet, useLocation } from 'react-router-dom'
import { Disclosure } from '@headlessui/react'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Layout() {
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Employees', href: '/employees' },
    { name: 'Performance', href: '/performance' },
    { name: 'Reports', href: '/reports' },
    { name: 'Data Import', href: '/data-import' },
  ]

  return (
    <div className="flex flex-col h-full w-full">
      <Disclosure as="nav" className="bg-gradient-to-r from-indigo-600 to-indigo-700 shadow-lg">
        {({ open }) => (
          <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center justify-between w-full">
                  <div className="flex-shrink-0">
                    <Link to="/dashboard" className="flex items-center">
                      <span className="text-white text-xl font-bold tracking-tight hover:text-indigo-100 transition-colors">
                        RaiseSmart
                      </span>
                    </Link>
                  </div>
                  <div className="hidden md:block">
                    <div className="flex items-baseline space-x-4">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={classNames(
                            location.pathname === item.href
                              ? 'bg-indigo-700 text-white shadow-inner'
                              : 'text-indigo-100 hover:bg-indigo-500 hover:text-white',
                            'px-4 py-2 rounded-md text-sm font-medium transition-all duration-200'
                          )}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </Disclosure>

      <main className="flex-1 min-h-0 w-full">
        <div className="h-full max-w-7xl mx-auto content-scroll">
          <Outlet />
        </div>
      </main>
    </div>
  )
} 