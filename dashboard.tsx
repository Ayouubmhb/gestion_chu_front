"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, ChevronLeft, ChevronRight, FileSpreadsheet, FileIcon as FilePdf } from "lucide-react"
import { Header } from "@/components/Header"
import { Sidenav } from "@/components/Sidenav"
import { MedicationTable } from "@/components/Table"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import * as XLSX from "xlsx"
import saveAs from "file-saver"

const months = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
]

const years = Array.from({ length: 5 }, (_, i) => 2025 + i)

const mockData = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  medicament: `Médicament ${i + 1}`,
  categorie: ["Analgésiques", "Antibiotiques", "Antihistaminiques", "Antidépresseurs", "Antihypertenseurs"][
    Math.floor(Math.random() * 5)
  ],
  prix: +(Math.random() * 100).toFixed(2),
  quantite: Math.floor(Math.random() * 1000),
  description: `Description du médicament ${i + 1}`,
  dateExpiration: new Date(Date.now() + Math.random() * 10000000000).toISOString().split("T")[0],
  fournisseur: `Fournisseur ${Math.floor(Math.random() * 10) + 1}`,
}))

export default function Dashboard() {
  const [selectedMedicament, setSelectedMedicament] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMonth, setSelectedMonth] = useState("")
  const [selectedYear, setSelectedYear] = useState("")

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false)
      }
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  const filteredData = useMemo(() => {
    return mockData
      .filter((item) =>
        Object.entries(item).some(
          ([key, value]) =>
            key !== "id" &&
            key !== "description" &&
            key !== "dateExpiration" &&
            String(value).toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      )
      .filter((item) => {
        const itemDate = new Date(item.dateExpiration)
        const selectedDate = new Date(`${selectedYear}-${selectedMonth}-01`)

        if (!selectedYear || !selectedMonth) return true

        return itemDate.getFullYear() === selectedDate.getFullYear() && itemDate.getMonth() === selectedDate.getMonth()
      })
  }, [searchTerm, selectedMonth, selectedYear])

  const paginatedData = useMemo(() => {
    return filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  }, [filteredData, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  useEffect(() => {
    setCurrentPage(1)
  }, [itemsPerPage])

  const handleViewDetails = (item: any) => {
    setSelectedMedicament(item)
    setIsDialogOpen(true)
  }

  const exportToPDF = () => {
    const doc = new jsPDF()
    autoTable(doc, {
      head: [["Médicament", "Catégorie", "Prix", "Quantité"]],
      body: filteredData.map((item) => [item.medicament, item.categorie, `${item.prix.toFixed(2)} €`, item.quantite]),
    })
    doc.save("medicaments.pdf")
  }

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredData.map((item) => ({
        Médicament: item.medicament,
        Catégorie: item.categorie,
        Prix: `${item.prix.toFixed(2)} €`,
        Quantité: item.quantite,
      })),
    )
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Medicaments")
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" })
    const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
    saveAs(data, "medicaments.xlsx")
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidenav isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} isMobile={isMobile} />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? "lg:pl-64" : "lg:pl-16"}`}
      >
        <Header toggleSidebar={toggleSidebar} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <main className="flex-1 p-6 overflow-auto">
          <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-semibold">Accueil</h1>
            <p className="text-gray-500 mt-1">
              Faites la prédiction et l'optimisation du stocks des médicaments pour les années à venir
            </p>

            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Select onValueChange={(value) => setSelectedMonth(value)}>
                  <SelectTrigger className="w-[180px] border-purple-500 focus:ring-purple-500">
                    <Calendar className="mr-2 h-4 w-4 text-purple-500" />
                    <SelectValue placeholder="Sélectionner le mois" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month, index) => (
                      <SelectItem key={month} value={`${index + 1}`.padStart(2, "0")}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select onValueChange={(value) => setSelectedYear(value)}>
                  <SelectTrigger className="w-[180px] border-purple-500 focus:ring-purple-500">
                    <Calendar className="mr-2 h-4 w-4 text-purple-500" />
                    <SelectValue placeholder="Sélectionner l'année" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-purple-500 hover:bg-purple-600 text-white">Exporter</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={exportToExcel}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={exportToPDF}>
                    <FilePdf className="mr-2 h-4 w-4" />
                    PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <MedicationTable data={paginatedData} onViewDetails={handleViewDetails} />

            {/* Pagination */}
            <div className="flex justify-between items-center text-sm">
              <div>Total {filteredData.length}</div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  Lignes par page
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => {
                      setItemsPerPage(Number(value))
                      setCurrentPage(1)
                    }}
                  >
                    <SelectTrigger className="w-[70px] h-8 border-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="15">15</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (page) =>
                        page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1),
                    )
                    .map((page, i, array) => (
                      <React.Fragment key={page}>
                        {i > 0 && array[i - 1] !== page - 1 && <span className="px-2">...</span>}
                        <Button
                          variant={currentPage === page ? "default" : "ghost"}
                          size="icon"
                          className={`h-8 w-8 ${currentPage === page ? "bg-blue-500 text-white hover:bg-blue-600" : ""}`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      </React.Fragment>
                    ))}

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails du médicament</DialogTitle>
          </DialogHeader>
          {selectedMedicament && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Nom</h4>
                <p>{selectedMedicament.medicament}</p>
              </div>
              <div>
                <h4 className="font-medium">Catégorie</h4>
                <p>{selectedMedicament.categorie}</p>
              </div>
              <div>
                <h4 className="font-medium">Prix</h4>
                <p className="text-purple-600">{selectedMedicament.prix.toFixed(2)} €</p>
              </div>
              <div>
                <h4 className="font-medium">Quantité</h4>
                <p className="text-red-600">{selectedMedicament.quantite}</p>
              </div>
              <div>
                <h4 className="font-medium">Description</h4>
                <p>{selectedMedicament.description}</p>
              </div>
              <div>
                <h4 className="font-medium">Date d'expiration</h4>
                <p>{new Date(selectedMedicament.dateExpiration).toLocaleDateString("fr-FR")}</p>
              </div>
              <div>
                <h4 className="font-medium">Fournisseur</h4>
                <p>{selectedMedicament.fournisseur}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

