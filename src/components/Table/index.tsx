
import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ArrowUp,
  ArrowDown,
  Trash,
  Edit,
  Plus,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (value: any, item: T, index: number) => React.ReactNode;
  sortable?: boolean;
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  onRowClick?: (item: T) => void;
  actions?: {
    view?: {
      onClick: (item: T) => void;
      visible?: (item: T) => boolean;
    };
    edit?: {
      onClick: (item: T) => void;
      visible?: (item: T) => boolean;
    };
    delete?: {
      onClick: (item: T) => void;
      visible?: (item: T) => boolean;
    };
  };
  onAdd?: () => void;
  exportable?: boolean;
  pagination?: {
    itemsPerPage?: number;
    onPageChange?: (page: number) => void;
    totalItems?: number;
    currentPage?: number;
  };
}

function Table<T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
  actions,
  onAdd,
  exportable = true,
  pagination = {
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0,
  },
}: TableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | string;
    direction: "asc" | "desc";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(pagination.currentPage || 1);
  const itemsPerPage = pagination.itemsPerPage || 10;
  const totalItems = pagination.totalItems || data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const sortedData = React.useMemo(() => {
    let sortableData = [...data];
    if (sortConfig) {
      sortableData.sort((a, b) => {
        const keyAsString = String(sortConfig.key);
        const aValue = typeof sortConfig.key === "string" && !a.hasOwnProperty(keyAsString) 
          ? null 
          : a[keyAsString as keyof T];
        const bValue = typeof sortConfig.key === "string" && !b.hasOwnProperty(keyAsString) 
          ? null 
          : b[keyAsString as keyof T];
        
        if (aValue === null) return sortConfig.direction === "asc" ? -1 : 1;
        if (bValue === null) return sortConfig.direction === "asc" ? 1 : -1;
        
        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        return sortConfig.direction === "asc"
          ? (aValue > bValue ? 1 : -1)
          : (bValue > aValue ? 1 : -1);
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  // Get current page data
  const currentData = React.useMemo(() => {
    if (pagination.onPageChange) {
      // If external pagination, use the data as is
      return sortedData;
    }
    // Otherwise, handle pagination internally
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage, pagination.onPageChange]);

  const handleSort = (key: keyof T | string) => {
    const column = columns.find(col => col.key === key);
    if (!column?.sortable) return;

    setSortConfig({
      key,
      direction:
        sortConfig?.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const handlePageChange = (newPage: number) => {
    if (pagination.onPageChange) {
      pagination.onPageChange(newPage);
    }
    setCurrentPage(newPage);
  };

  const exportToCSV = () => {
    // Generate CSV content
    const headers = columns.map(col => col.header).join(",");
    const rows = data.map(item => 
      columns.map(col => {
        const keyAsString = String(col.key);
        let value: string | null = "";
        
        if (typeof col.key === "string" && !item.hasOwnProperty(keyAsString)) {
          value = "";
        } else {
          value = String(item[keyAsString as keyof T] ?? "");
        }
        
        // Handle quotes in strings to avoid CSV issues
        return typeof value === "string" 
          ? `"${value.replace(/"/g, '""')}"` 
          : value;
      }).join(",")
    ).join("\n");
    
    const csvContent = `${headers}\n${rows}`;
    
    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "export.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Exportação concluída",
      description: "Os dados foram exportados com sucesso.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        {onAdd && (
          <Button onClick={onAdd} size="sm" className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        )}
        {exportable && (
          <Button
            variant="outline"
            size="sm"
            onClick={exportToCSV}
            className="flex items-center ml-auto"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        )}
      </div>

      <div className="table-container">
        <table className="w-full border-collapse">
          <thead>
            <tr className="table-header">
              {columns.map((column) => (
                <th
                  key={column.key.toString()}
                  className={`table-cell text-left ${
                    column.sortable ? "cursor-pointer" : ""
                  }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center">
                    {column.header}
                    {column.sortable && sortConfig?.key === column.key && (
                      <span className="ml-1">
                        {sortConfig.direction === "asc" ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actions && <th className="table-cell text-right">Ações</th>}
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, index) => (
              <tr
                key={index}
                className={`table-row ${onRowClick ? "cursor-pointer" : ""}`}
                onClick={() => onRowClick && onRowClick(item)}
              >
                {columns.map((column) => (
                  <td key={column.key.toString()} className="table-cell">
                    {column.render
                      ? column.render(
                          typeof column.key === "string" && !item.hasOwnProperty(column.key)
                            ? ""
                            : item[column.key as keyof T],
                          item,
                          index
                        )
                      : typeof column.key === "string" && !item.hasOwnProperty(column.key)
                        ? ""
                        : String(item[column.key as keyof T] ?? "")}
                  </td>
                ))}
                {actions && (
                  <td className="table-cell text-right">
                    <div className="flex justify-end space-x-2">
                      {actions.view && 
                        (!actions.view.visible || actions.view.visible(item)) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            actions.view?.onClick(item);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      {actions.edit && 
                        (!actions.edit.visible || actions.edit.visible(item)) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            actions.edit?.onClick(item);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {actions.delete && 
                        (!actions.delete.visible || actions.delete.visible(item)) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            actions.delete?.onClick(item);
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {currentData.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="table-cell text-center py-8 text-muted-foreground"
                >
                  Nenhum dado encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-muted-foreground">
            Mostrando {currentData.length} de {totalItems} registros
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Table;
