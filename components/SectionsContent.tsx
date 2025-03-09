"use client"

import React, { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronLeft, ChevronRight, FileSpreadsheet, FileIcon as FilePdf, Search } from "lucide-react"
import { SectionsTable } from "@/components/SectionsTable"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import * as XLSX from "xlsx"
import saveAs from "file-saver"
import { useRouter } from "next/navigation"
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface Section {
  id: number
  nom: string
  description: string
  personnels: { id: number; nom: string; prenom: string }[]
}

export default function SectionsContent() {
  const router = useRouter()
  const [sections, setSections] = useState<Section[]>([]) // ✅ Fetch real data
  const [selectedSection, setSelectedSection] = useState<Section | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [sectionToDelete, setSectionToDelete] = useState<Section | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSections = async () => {
      setLoading(true)
      try {
        const response = await fetch("http://localhost:8080/api/sections")
  
        // ✅ Check if response is OK
        if (!response.ok) {
          throw new Error(`❌ Server Error: ${response.status}`)
        }
  
        // ✅ Read as text first to debug JSON structure
        const text = await response.text()
        console.log("🔍 Raw API Response:", text)
  
        // ✅ Parse JSON safely
        let data
        try {
          data = JSON.parse(text)
        } catch (jsonError) {
          console.error("❌ Invalid JSON:", text)
          return
        }
  
        // ✅ Ensure `personnels` is always an array
        const formattedData = data.map((section: any) => ({
          ...section,
          affecteA: Array.isArray(section.personnels)
            ? section.personnels.map((p: any) => `${p.nom} ${p.prenom}`)
            : [], // ✅ Always an array
        }))
  
        console.log("✅ Formatted Data:", formattedData)
        setSections(formattedData)
      } catch (error) {
        console.error("❌ Fetch Error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchSections()
  }, [])
  
  

  const filteredData = useMemo(() => {
    return sections.filter((item) =>
      Object.entries(item).some(
        ([key, value]) =>
          key !== "id" &&
          value !== null &&
          value !== undefined &&
          (typeof value === "string"
            ? value.toLowerCase().includes(searchTerm.toLowerCase())
            : Array.isArray(value) && value.some((v) => v.toLowerCase().includes(searchTerm.toLowerCase()))),
      ),
    )
  }, [searchTerm, sections])

  const paginatedData = useMemo(() => {
    return filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  }, [filteredData, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const handleViewDetails = (section: Section) => {
    setSelectedSection(section)
    setIsDialogOpen(true)
  }

  const handleEdit = (section: Section) => {
    router.push(`/dashboard/sections/edit/${section.id}`)
  }

  const handleDelete = (section: Section) => {
    setSectionToDelete(section)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (sectionToDelete) {
      try {
        const response = await fetch(`http://localhost:8080/api/sections/${sectionToDelete.id}`, {
          method: "DELETE",
        })
        if (!response.ok) throw new Error("Failed to delete section")
        console.log("✅ Section deleted:", sectionToDelete.nom)
        setSections(sections.filter((sec) => sec.id !== sectionToDelete.id)) // ✅ Remove from UI
      } catch (error) {
        console.error("❌ Error deleting section:", error)
      }
      setDeleteDialogOpen(false)
      setSectionToDelete(null)
    }
  }

  const exportToPDF = () => {
    const doc = new jsPDF()
    autoTable(doc, {
      head: [["Section", "Description", "Affecté à"]],
      body: filteredData.map((item) => [item.nom, item.description, item.personnels.map((p) => `${p.nom} ${p.prenom}`).join(", ")]),
    })
    doc.save("sections.pdf")
  }

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredData.map((item) => ({
        Section: item.nom,
        Description: item.description,
        "Affecté à": item.personnels.map((p) => `${p.nom} ${p.prenom}`).join(", "),
      })),
    )
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Sections")
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" })
    const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
    saveAs(data, "sections.xlsx")
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Sections</h1>
      <p className="text-gray-500 mt-1">Gérer les sections de l'hôpital</p>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button className="bg-green-500 hover:bg-green-600 text-white" onClick={() => router.push("/dashboard/sections/add")}>
            Ajouter nouvelle
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

      {loading ? (
        <p className="text-gray-500">Chargement des sections...</p>
      ) : (
        <SectionsTable data={paginatedData} onViewDetails={handleViewDetails} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        message="Voulez-vous supprimer cette section ?"
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails de la section</DialogTitle>
          </DialogHeader>
          {selectedSection && (
            <div className="space-y-4">
              <div><h4 className="font-medium">Nom</h4><p>{selectedSection.nom}</p></div>
              <div><h4 className="font-medium">Description</h4><p>{selectedSection.description}</p></div>
              <div><h4 className="font-medium">Affecté à</h4><p>{selectedSection.personnels.map(p => `${p.nom} ${p.prenom}`).join(", ")}</p></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}