"use client"

import React, { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronLeft, ChevronRight, FileSpreadsheet, FileIcon as FilePdf, Search } from "lucide-react"
import { BatimentTable } from "@/components/BatimentTable"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import * as XLSX from "xlsx"
import saveAs from "file-saver"
import { useRouter } from "next/navigation"
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

// Define the type for Batiment
interface Batiment {
  id: number;
  nom: string;
  emplacement: string;
  taille: string;
  fonctionnalite: string;
  description: string;
}

const mockData = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  batiment: `Bâtiment ${i + 1}`,
  taille: `${Math.floor(Math.random() * 10000) + 1000} m²`,
  emplacement: `Zone ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
  fonctionnalite: ["Hospitalisation", "Consultation", "Administration", "Recherche", "Enseignement"][
    Math.floor(Math.random() * 5)
  ],
  description: `Description du bâtiment ${i + 1}`,
}))

export default function BatimentContent() {
  const [selectedBatiment, setSelectedBatiment] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [batimentToDelete, setBatimentToDelete] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [batiment, setBatiment] = useState<Batiment[]>([])

  const router = useRouter()

  useEffect(() => {
    fetch("http://localhost:8080/api/batiments")
        .then(response => response.json())
        .then(data => {
          console.log("✅ Fetched Data:", data);
          setBatiment(data);
          /*if (JSON.stringify(data) !== JSON.stringify(batiment)) {
              setBatiment(data);
          }*/
        })
        .catch(error => console.error("Erreur de chargement :", error));
  }, []);

  const filteredData = useMemo(() => {
    if (!searchTerm) return batiment; // ✅ Avoid unnecessary filtering if no search
    return batiment.filter((item) =>
      Object.entries(item).some(
        ([key, value]) =>
          key !== "id" &&
          value !== null &&
          value !== undefined &&
          String(value).toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    )
  }, [searchTerm, batiment])

  const paginatedData = useMemo(() => {
    return filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  }, [filteredData, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const handleViewDetails = (item: any) => {
    setSelectedBatiment(item)
    setIsDialogOpen(true)
  }

  const handleEdit = (item: any) => {
    router.push(`/dashboard/batiment/edit/${item.id}`)
  }

  const handleDelete = (item: any) => {
    setBatimentToDelete(item)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    const id = batimentToDelete.id;
    if (batimentToDelete) {
        const response = await fetch(`http://localhost:8080/api/batiments/${id}`, {
          method: "DELETE",
        });

      if (response.ok) {
          console.log("Bâtiment supprimé avec succès !");
          // ✅ Remove deleted batiment from state
          setBatiment(batiment.filter(btm => btm.id !== id));
      } else {
          console.log("Erreur : Bâtiment non trouvé !");
      }
    }
  }

  const exportToPDF = () => {
    const doc = new jsPDF()
    autoTable(doc, {
      head: [["Bâtiment", "Taille", "Emplacement", "Fonctionnalité", "Description"]],
      body: filteredData.map((item) => [
        item.nom,
        item.taille,
        item.emplacement,
        item.fonctionnalite,
        item.description,
      ]),
    })
    doc.save("batiments.pdf")
  }

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredData.map((item) => ({
        Bâtiment: item.nom,
        Taille: item.taille,
        Emplacement: item.emplacement,
        Fonctionnalité: item.fonctionnalite,
        Description: item.description,
      })),
    )
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Bâtiments")
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" })
    const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
    saveAs(data, "batiments.xlsx")
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Bâtiments</h1>
      <p className="text-gray-500 mt-1">Gérer les bâtiments de l'hôpital</p>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button
            className="bg-green-500 hover:bg-green-600 text-white"
            onClick={() => router.push("/dashboard/batiment/add")}
          >
            Ajouter nouveau
          </Button>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-[300px]"
            />
          </div>
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

      <BatimentTable
        data={paginatedData}
        onViewDetails={handleViewDetails}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Pagination */}
      <div className="flex justify-between items-center text-sm text-gray-500">
        <div className="flex items-center gap-8">
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
          <div>Total {filteredData.length}</div>
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
            .filter((page) => page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1))
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails du bâtiment</DialogTitle>
          </DialogHeader>
          {selectedBatiment && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Bâtiment</h4>
                <p>{selectedBatiment.batiment}</p>
              </div>
              <div>
                <h4 className="font-medium">Taille</h4>
                <p>{selectedBatiment.taille}</p>
              </div>
              <div>
                <h4 className="font-medium">Emplacement</h4>
                <p>{selectedBatiment.emplacement}</p>
              </div>
              <div>
                <h4 className="font-medium">Fonctionnalité</h4>
                <p>{selectedBatiment.fonctionnalite}</p>
              </div>
              <div>
                <h4 className="font-medium">Description</h4>
                <p>{selectedBatiment.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        message="Voulez-vous supprimer ce bâtiment ?"
      />
    </div>
  )
}

