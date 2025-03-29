import react, { usestate } from "react"
import { navlink, uselocation } from "react-router-dom"
import { chevrondown, chevronright, helpcircle } from "lucide-react"
import { usemenu } from "@/contexts/menucontext"
import { menuitem } from "@/contexts/menucontext"
import * as icons from "lucide-react"

type iconname = keyof typeof icons

const sidebar: react.fc = () => {
  const { menus, isloading, iserror, issidebaropen } = usemenu()
  const location = uselocation()
  const [expandedmenus, setexpandedmenus] = usestate<record<number, boolean>>({})

  const geticonbyname = (iconname: string) => {
    const iconcomponent = (icons[iconname as iconname] || icons.helpcircle) as react.componenttype<{ classname: string }>
    return <iconcomponent classname="h-5 w-5" />
  }

  const togglesubmenu = (menuid: number) => {
    setexpandedmenus(prev => ({
      ...prev,
      [menuid]: !prev[menuid],
    }))
  }

  const rendermenuitem = (menu: menuitem) => {
    const haschildren = menu.filhos && menu.filhos.length > 0
    const isexpanded = expandedmenus[menu.id]
    const isactive = location.pathname === menu.rota
    const ischildactive = haschildren && menu.filhos?.some(child =>
      location.pathname === child.rota ||
      (child.filhos && child.filhos.some(grandchild => location.pathname === grandchild.rota))
    )

    return (
      <div key={menu.id} classname="mb-1">
        {menu.rota ? (
          <navlink
            to={menu.rota}
            classname={({ isactive }) =>
              `sidebar-item ${isactive ? "active" : ""} ${!issidebaropen ? "justify-center" : ""}`
            }
          >
            {geticonbyname(menu.icone)}
            {issidebaropen && <span classname="ml-3">{menu.nome}</span>}
          </navlink>
        ) : (
          <div
            classname={`sidebar-item cursor-pointer ${ischildactive ? "text-sidebar-primary-foreground" : ""} ${!issidebaropen ? "justify-center" : ""}`}
            onclick={() => issidebaropen && togglesubmenu(menu.id)}
          >
            {geticonbyname(menu.icone)}
            {issidebaropen && (
              <>
                <span classname="ml-3 flex-1">{menu.nome}</span>
                {haschildren && (
                  isexpanded ? <chevrondown classname="h-4 w-4" /> : <chevronright classname="h-4 w-4" />
                )}
              </>
            )}
          </div>
        )}

        {haschildren && issidebaropen && isexpanded && (
          <div classname="ml-6 mt-1 space-y-1">
            {menu.filhos?.map(child => rendermenuitem(child))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div classname={`sidebar z-20 ${issidebaropen ? "" : "sidebar-collapsed"}`}>
      <div classname="p-4 flex items-center justify-center border-b border-sidebar-border h-16">
        {issidebaropen ? (
          <h1 classname="text-xl font-bold text-white">erp admin</h1>
        ) : (
          <h1 classname="text-xl font-bold text-white">ea</h1>
        )}
      </div>
      {isloading ? (
        <div classname="p-3 mt-2 text-white">carregando menus...</div>
      ) : iserror ? (
        <div classname="p-3 mt-2 text-red-400">erro ao carregar menus</div>
      ) : menus.length === 0 ? (
        <div classname="p-3 mt-2 text-white">nenhum menu disponível</div>
      ) : (
        <nav classname="p-3 mt-2">
          {menus.map(menu => rendermenuitem(menu))}
        </nav>
      )}
    </div>
  )
}

export default sidebar