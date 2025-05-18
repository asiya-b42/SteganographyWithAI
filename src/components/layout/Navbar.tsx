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
    <nav className="bg-slate-800 shadow-md">
      <div className="container mx-auto">
        <ul className="flex overflow-x-auto justify-center">
          {items.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-6 py-3 transition-all duration-200 ${
                    isActive
                      ? 'text-indigo-400 border-b-2 border-indigo-500 font-medium'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700'
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