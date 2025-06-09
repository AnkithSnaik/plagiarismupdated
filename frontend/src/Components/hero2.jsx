import React from 'react';
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import TaskIcon from '@mui/icons-material/Task';
import DescriptionIcon from '@mui/icons-material/Description';
import BoltIcon from '@mui/icons-material/Bolt';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAuth } from '../Context/Authprovider'; // Import useAuth for logout

// Navigation links for the Hero2's specific Navbar
// Note: 'current' helps TailwindCSS apply active styles, adjust as needed based on actual route
const navigation = [
  { name: 'Home', href: '/', current: false }, // Added Home link
  { name: 'Dashboard', href: '/dashboard', current: true }, // Changed # to /dashboard (assuming this page is the Dashboard)
  { name: 'Result', href: '/results', current: false }, // Changed # to /results
  { name: 'Submit', href: '/upload', current: false }, // Changed # to /upload
];

// Utility function to conditionally apply classes
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Cards data with title, description, and icon for each card
const cardsData = [
  {
    title: 'Submit Project',
    description: 'Upload your project for an instant plagiarism check',
    icon: 'task',
    buttonLink: '/upload',
  },
  {
    title: 'View Result',
    description: 'Get detailed insights on your submissions.',
    icon: 'description',
    buttonLink: '/results',
  },
  {
    title: 'Dashboard',
    description: 'Track all your project submissions.',
    icon: 'bolt',
    buttonLink: '/dashboard',
  },
];

// Icon component mapping
const iconMap = {
  task: <TaskIcon style={{ fontSize: '48px' }} />,
  description: <DescriptionIcon style={{ fontSize: '48px' }} />,
  bolt: <BoltIcon style={{ fontSize: '48px' }} />,
};

// Card component
const Card = ({ title, description, icon, buttonLink }) => {
  return (
    <div className="relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg w-96 transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
      <div className="p-4 text-center">
        <h5 className="mb-2 text-slate-800 text-xl font-semibold">{title}</h5>

        {/* Render the icon between title and description */}
        <div className="mb-4 flex justify-center">
          {iconMap[icon]}
        </div>

        <p className="text-slate-600 leading-normal font-light">{description}</p>

        {/* Render the button with unique link for each card */}
        <Link to={buttonLink}>
          <button className="rounded-md bg-slate-800 py-2 px-4 mt-6 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button">
            Go to {title}
          </button>
        </Link>
      </div>
    </div>
  );
};

// CardList component that maps over the cardsData array
const CardList = () => {
  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {cardsData.map((card, index) => (
        <Card
          key={index}
          title={card.title}
          description={card.description}
          icon={card.icon}
          buttonLink={card.buttonLink}
        />
      ))}
    </div>
  );
};

// Main component for the Hero section
const Hero2 = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const { logout } = useAuth(); // Get the logout function from AuthContext

  const handleSignOut = () => {
    logout(); // Call the logout function
    navigate('/'); // Redirect to home page after logout
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Navbar */}
      <Disclosure as="nav" className="bg-gray-800 sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              {/* Mobile menu button */}
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon aria-hidden="true" className="block size-6 group-data-[open]:hidden" />
                <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-[open]:block" />
              </DisclosureButton>
            </div>
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex shrink-0 items-center">
                {/* <img
                  alt="Your Company"
                  src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"
                  className="h-8 w-auto"
                /> */}
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  {navigation.map((item) => (
                    // Use Link component for client-side routing
                    <Link
                      key={item.name}
                      to={item.href} // Use 'to' prop for Link
                      aria-current={item.current ? 'page' : undefined}
                      className={classNames(
                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'rounded-md px-3 py-2 text-sm font-medium',
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <button
                type="button"
                className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                <span className="absolute -inset-1.5" />
                <span className="sr-only">View notifications</span>
                <BellIcon aria-hidden="true" className="size-6" />
              </button>

              {/* Profile dropdown */}
              <Menu as="div" className="relative ml-3">
                <div>
                  <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    {/* Corrected imgw to img and used a generic placeholder image */}
                    <img
                      alt=""
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      className="size-8 rounded-full"
                    />
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <MenuItem>
                    <a
                      href="#" // Placeholder, consider dedicated profile page route
                      className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                    >
                      Your Profile
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      href="#" // Placeholder, consider dedicated settings page route
                      className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                    >
                      Settings
                    </a>
                  </MenuItem>
                  <MenuItem>
                    {/* Logout functionality */}
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                    >
                      Sign out
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          </div>
        </div>

        <DisclosurePanel className="sm:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navigation.map((item) => (
              // Use DisclosureButton as a Link for mobile navigation
              <DisclosureButton
                key={item.name}
                as={Link} // Use 'as={Link}' to make DisclosureButton act as a React Router Link
                to={item.href}
                aria-current={item.current ? 'page' : undefined}
                className={classNames(
                  item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'block rounded-md px-3 py-2 text-base font-medium',
                )}
              >
                {item.name}
              </DisclosureButton>
            ))}
          </div>
        </DisclosurePanel>
      </Disclosure>

      {/* Main content below the navbar */}
      <div className="pt-24"> {/* Added padding to prevent content from hiding behind the navbar */}
         {/* Title for the Hero2 content */}
        <h1 className="text-4xl font-bold text-center mb-10 text-gray-800 dark:text-gray-200">
            Your Dashboard
        </h1>
        <CardList />
      </div>
    </div>
  );
};

export default Hero2;