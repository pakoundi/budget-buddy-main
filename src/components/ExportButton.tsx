import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Download, FileText, FileSpreadsheet } from "lucide-react";
import { useExpenses } from "@/hooks/useExpenses";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";
import { unparse } from "papaparse";
import type { CategoryType } from "@/types/expense";

interface ExportButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function ExportButton({ variant = "outline", size = "default", className = "" }: ExportButtonProps) {
  const { expenses } = useExpenses();
  const [isExporting, setIsExporting] = React.useState(false);
  const [showMenu, setShowMenu] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Fermer le menu quand on clique en dehors
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const exportToPDF = async () => {
    const doc = new jsPDF();
    const title = "Mes Dépenses";
    const date = new Date().toLocaleDateString();
    
    // En-tête du document
    doc.setFontSize(20);
    doc.text(title, 14, 22);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Exporté le: ${date}`, 14, 30);

    // Préparation des données pour le tableau
    const tableData = expenses.map(expense => ({
      date: new Date(expense.date).toLocaleDateString(),
      catégorie: expense.category,
      montant: `${expense.amount.toFixed(2)} €`,
      description: expense.comment || ""
    }));

    // Création du tableau
    autoTable(doc, {
      head: [['Date', 'Catégorie', 'Montant', 'Description']],
      body: tableData.map(item => [item.date, item.catégorie, item.montant, item.description]),
      startY: 40,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [59, 130, 246] },
      margin: { top: 40 }
    });

    // Calcul du total
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Ajout du total
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total: ${total.toFixed(2)} €`, 14, (doc as any).lastAutoTable.finalY + 10);

    // Sauvegarde du PDF
    doc.save(`depenses-${date.replace(/\//g, '-')}.pdf`);
  };

  const exportToCSV = async () => {
    // Préparation des données pour le CSV
    const csvData = expenses.map(expense => ({
      Date: new Date(expense.date).toISOString().split('T')[0],
      Catégorie: expense.category,
      Montant: expense.amount,
      Description: expense.comment || "",
      "Date d'ajout": new Date(expense.createdAt).toISOString()
    }));

    // Calcul du total
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Création d'un objet de total compatible avec le type
    const totalRow = {
      Date: "",
      Catégorie: "TOTAL" as unknown as CategoryType, // Cast nécessaire pour le type
      Montant: total,
      Description: "",
      "Date d'ajout": ""
    };

    // Conversion en CSV avec les en-têtes
    const csv = unparse([...csvData, totalRow], {
      header: true,
      delimiter: ";"
    });
    
    // Création et téléchargement du fichier
    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    const date = new Date().toISOString().split('T')[0];
    saveAs(blob, `depenses-${date}.csv`);
  };

  return (
    <div className={`relative flex items-center ${className}`} ref={menuRef}>
      <Button
        variant={variant}
        size={size}
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu(!showMenu);
        }}
        className={`relative flex items-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-95 ${
          showMenu ? 'bg-accent/50' : ''
        }`}
        disabled={isExporting}
      >
        {isExporting ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        ) : (
          <Download className={`h-4 w-4 transition-transform ${showMenu ? 'rotate-[-45deg]' : ''}`} />
        )}
        {size !== 'icon' && <span>{isExporting ? 'Export...' : 'Exporter'}</span>}
      </Button>
      
      <div 
        className={`absolute right-0 bottom-full mb-2 w-56 rounded-xl bg-card border border-border/50 shadow-xl backdrop-blur-sm transition-all duration-200 overflow-hidden ${
          showMenu 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
        style={{
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div className="py-1.5">
          <button
            onClick={async (e) => {
              e.stopPropagation();
              setIsExporting(true);
              try {
                await exportToPDF();
              } finally {
                setIsExporting(false);
                setShowMenu(false);
              }
            }}
            className="w-full text-left px-5 py-2.5 text-sm font-medium text-foreground/90 hover:bg-accent/50 hover:text-foreground transition-colors flex items-center group"
            disabled={isExporting}
          >
            <div className="p-1.5 mr-3 rounded-lg bg-blue-50 dark:bg-blue-900/30 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
              <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <div className="font-medium">Exporter en PDF</div>
              <div className="text-xs text-muted-foreground">Pour impression et partage</div>
            </div>
          </button>
          
          <button
            onClick={async (e) => {
              e.stopPropagation();
              setIsExporting(true);
              try {
                await exportToCSV();
              } finally {
                setIsExporting(false);
                setShowMenu(false);
              }
            }}
            className="w-full text-left px-5 py-2.5 text-sm font-medium text-foreground/90 hover:bg-accent/50 hover:text-foreground transition-colors flex items-center group"
            disabled={isExporting}
          >
            <div className="p-1.5 mr-3 rounded-lg bg-green-50 dark:bg-green-900/30 group-hover:bg-green-100 dark:group-hover:bg-green-900/50 transition-colors">
              <FileSpreadsheet className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <div className="font-medium">Exporter en CSV</div>
              <div className="text-xs text-muted-foreground">Pour Excel et tableurs</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
