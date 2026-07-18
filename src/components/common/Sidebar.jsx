import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BarChart3 } from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, shortcut: 'G+D' },
  { name: 'Leads', path: '/leads', icon: Users, shortcut: 'G+L' },
  { name: 'Analytics', path: '/analytics', icon: BarChart3, shortcut: 'G+A' }
];

/**
 * @typedef {Object} SidebarProps
 * @property {function} [onItemClick] - Callback function triggered when a navlink is selected (used to auto-close drawers).
 * @property {boolean} [forceFull] - Flag to force the full horizontal row structure (for mobile drawers).
 */

/**
 * Sidebar component renders list of core workspace pages navigation.
 * Uses dynamic variables/theme tokens (`bg-active-sidebar`, `text-primary`, `text-txt-sub`, etc.) for themes.
 *
 * @param {SidebarProps} props - Component properties.
 * @returns {React.JSX.Element} Rendered sidebar links.
 */
export default function Sidebar({ onItemClick, forceFull = false }) {
  return (
    <nav className="space-y-2 w-full">
      {menuItems.map((item) => {
        const Icon = item.icon;
        
        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            onClick={onItemClick}
            className={({ isActive }) => {
              // Replaced hardcoded slate/blue backgrounds with theme tokens: bg-active-sidebar and text-primary
              const activeBg = isActive 
                ? 'bg-active-sidebar text-primary border-l-2 border-primary' 
                : 'text-txt-sub hover:bg-bg-base hover:text-txt-main border-l-2 border-transparent';
              
              const layoutClasses = forceFull 
                ? 'flex flex-row items-center justify-between px-3 py-3 text-sm' 
                : 'flex flex-col lg:flex-row items-center justify-center lg:justify-between px-1 py-3 lg:px-3 lg:py-2.5 text-[10px] lg:text-sm';

              return `w-full rounded-lg font-semibold transition-all duration-150 group cursor-pointer ${activeBg} ${layoutClasses}`;
            }}
          >
            {({ isActive }) => (
              <>
                <div className={`flex items-center ${forceFull ? 'flex-row gap-3' : 'flex-col lg:flex-row gap-1.5 lg:gap-3'}`}>
                  <Icon className={`transition-transform group-hover:scale-105 ${
                    forceFull ? 'w-5 h-5' : 'w-5 h-5 lg:w-4 h-4'
                  } ${
                    isActive ? 'text-primary' : 'text-txt-sub'
                  }`} />
                  <span>{item.name}</span>
                </div>
                
                {item.shortcut && (
                  <span className={`font-mono font-medium text-txt-mute group-hover:text-txt-sub ${
                    forceFull ? 'inline-block text-[10px]' : 'hidden lg:inline-block text-[10px]'
                  }`}>
                    {item.shortcut}
                  </span>
                )}
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
