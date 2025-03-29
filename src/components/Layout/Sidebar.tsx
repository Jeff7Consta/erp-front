
import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight, HelpCircle } from "lucide-react";
import { useMenu } from "@/contexts/MenuContext";
import { MenuItem } from "@/contexts/MenuContext";
import * as Icons from "lucide-react";

type IconName = keyof typeof Icons;

const Sidebar: React.FC = () => {
  const { menus, isSidebarOpen } = useMenu();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<Record<number, boolean>>({});

  // Dynamically get icon component by name
  const getIconByName = (iconName: string) => {
    // Default to a question mark if icon doesn't exist
    const IconComponent = (Icons[iconName as IconName] || Icons.HelpCircle) as React.ComponentType<{ className: string }>;
    return <IconComponent className="h-5 w-5" />;
  };

  const toggleSubmenu = (menuId: number) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  // Recursively render menu items and their children
  const renderMenuItem = (menu: MenuItem) => {
    const hasChildren = menu.filhos && menu.filhos.length > 0;
    const isExpanded = expandedMenus[menu.id];
    const isActive = location.pathname === menu.rota;
    const isChildActive = hasChildren && menu.filhos?.some(child => 
      location.pathname === child.rota || 
      (child.filhos && child.filhos.some(grandchild => location.pathname === grandchild.rota))
    );

    return (
      <div key={menu.id} className="mb-1">
        {menu.rota ? (
          <NavLink
            to={menu.rota}
            className={({ isActive }) => 
              `sidebar-item ${isActive ? "active" : ""} ${!isSidebarOpen ? "justify-center" : ""}`
            }
          >
            {getIconByName(menu.icone)}
            {isSidebarOpen && <span className="ml-3">{menu.nome}</span>}
          </NavLink>
        ) : (
          // Parent menu with children
          <div
            className={`sidebar-item cursor-pointer ${isChildActive ? "text-sidebar-primary-foreground" : ""} ${!isSidebarOpen ? "justify-center" : ""}`}
            onClick={() => isSidebarOpen && toggleSubmenu(menu.id)}
          >
            {getIconByName(menu.icone)}
            {isSidebarOpen && (
              <>
                <span className="ml-3 flex-1">{menu.nome}</span>
                {hasChildren && (
                  isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
                )}
              </>
            )}
          </div>
        )}

        {/* Render children if expanded */}
        {hasChildren && isSidebarOpen && isExpanded && (
          <div className="ml-6 mt-1 space-y-1">
            {menu.filhos?.map(child => renderMenuItem(child))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`sidebar z-20 ${isSidebarOpen ? "" : "sidebar-collapsed"}`}>
      <div className="p-4 flex items-center justify-center border-b border-sidebar-border h-16">
        {isSidebarOpen ? (
          <h1 className="text-xl font-bold text-white">ERP Admin</h1>
        ) : (
          <h1 className="text-xl font-bold text-white">EA</h1>
        )}
      </div>
      <nav className="p-3 mt-2">
        {menus.map(menu => renderMenuItem(menu))}
      </nav>
    </div>
  );
};

export default Sidebar;
