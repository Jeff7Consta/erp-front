import react, { createcontext, usecontext, usestate, useeffect, reactnode } from "react"
import { useauth } from "./authcontext"
import { getmenusbyuser } from "@/services/api"
import { toast } from "@/hooks/use-toast"

export interface menuitem {
  id: number
  nome: string
  rota: string
  icone: string
  paiid: number | null
  ordem: number
  filhos?: menuitem[]
}

interface menucontexttype {
  menus: menuitem[]
  isloading: boolean
  iserror: boolean
  issidebaropen: boolean
  togglesidebar: () => void
}

const menucontext = createcontext<menucontexttype | undefined>(undefined)

export const menuprovider: react.fc<{ children: reactnode }> = ({ children }) => {
  const [rawmenus, setrawmenus] = usestate<menuitem[]>([])
  const [menus, setmenus] = usestate<menuitem[]>([])
  const [isloading, setisloading] = usestate(true)
  const [iserror, setiserror] = usestate(false)
  const [issidebaropen, setissidebaropen] = usestate(true)
  const { isauthenticated, token } = useauth()

  useeffect(() => {
    // const fetchmenus = async () => {
    //   if (isauthenticated && token) {
    //     try {
    //       setisloading(true)
    //       setiserror(false)
    //       const menusdata = await getmenusbyuser()
    //       setrawmenus(menusdata)
    //     } catch (error) {
    //       console.error("error fetching menus:", error)
    //       setiserror(true)
    //       toast({
    //         title: "erro ao carregar menus",
    //         description: "não foi possível carregar os menus. tente novamente.",
    //         variant: "destructive",
    //       })
    //     } finally {
    //       setisloading(false)
    //     }
    //   } else {
    //     setisloading(false)
    //   }
    // }
    // fetchmenus()
  
    // menu fixo pra teste
    setrawmenus([
      { id: 1, nome: "dashboard", rota: "/dashboard", icone: "home", paiid: null, ordem: 1 },
      { id: 2, nome: "usuários", rota: "/usuarios", icone: "users", paiid: null, ordem: 2 },
    ])
    setisloading(false)
  }, [isauthenticated, token])

  useeffect(() => {
    const buildmenutree = (items: menuitem[], parentid: number | null = null): menuitem[] => {
      return items
        .filter(item => item.paiid === parentid)
        .sort((a, b) => a.ordem - b.ordem)
        .map(item => ({
          ...item,
          filhos: buildmenutree(items, item.id),
        }))
    }

    const organizedmenus = buildmenutree(rawmenus)
    setmenus(organizedmenus)
  }, [rawmenus])

  const togglesidebar = () => {
    setissidebaropen(!issidebaropen)
  }

  return (
    <menucontext.provider value={{ menus, isloading, iserror, issidebaropen, togglesidebar }}>
      {children}
    </menucontext.provider>
  )
}

export const usemenu = () => {
  const context = usecontext(menucontext)
  if (context === undefined) {
    throw new error("usemenu must be used within a menuprovider")
  }
  return context
}