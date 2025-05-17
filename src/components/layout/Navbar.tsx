import React from 'react';
import { NavLink } from 'react-router-dom';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

interface NavbarProps {
  items: NavItem[];
}

const Navbar: React.FC<NavbarProps> = ({ items }) => {
  return (
    <nav className="bg-gray-800/60 backdrop-blur-sm border-b border-gray-700">
      <div className="container mx-auto">
        <ul className="flex overflow-x-auto md:justify-center">
          {items.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-3 border-b-2 whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'border-cyan-500 text-cyan-400 font-medium'
                      : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;