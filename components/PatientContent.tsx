"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronLeft, ChevronRight, FileSpreadsheet, FileIcon as FilePdf, Search } from "lucide-react"
import { PatientTable } from "@/components/PatientTable"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import * as XLSX from "xlsx"
import saveAs from "file-saver"
import { useRouter } from "next/navigation"
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

export default function PatientContent() {
  const [patients, setPatients] = useState<any[]>([])
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [patientToDelete, setPatientToDelete] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  const router = useRouter()

  // ✅ Fetch patients from API
  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true)
      try {
        const response = await fetch("http://localhost:8080/api/patients")
        const data = await response.json()
        setPatients(data)
        console.log(data);
      } catch (error) {
        console.error("❌ Error fetching patients:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchPatients()
  }, [])

  // ✅ Filter data for search functionality
  const filteredData = useMemo(() => {
    return patients.filter((item) =>
      Object.entries(item).some(
        ([key, value]) =>
          key !== "id" &&
          value !== null &&
          value !== undefined &&
          String(value).toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    )
  }, [searchTerm, patients])

  // ✅ Pagination
  const paginatedData = useMemo(() => {
    return filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  }, [filteredData, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const handleViewDetails = (item: any) => {
    setSelectedPatient(item)
    setIsDialogOpen(true)
  }

  const handleEdit = (item: any) => {
    router.push(`/dashboard/patient/edit/${item.id}`)
  }

  // ✅ Handle Delete
  const handleDelete = (item: any) => {
    setPatientToDelete(item)
    setDeleteDialogOpen(true)
  }

  // ✅ Confirm delete action (API DELETE request)
  const confirmDelete = async () => {
    if (patientToDelete) {
      try {
        const response = await fetch(`http://localhost:8080/api/patients/delete/${patientToDelete.id}`, {
          method: "DELETE",
        })

        if (!response.ok) throw new Error("❌ Failed to delete patient")

        console.log("✅ Patient deleted successfully")
        setPatients(patients.filter((p) => p.id !== patientToDelete.id))
      } catch (error) {
        console.error("❌ Error deleting patient:", error)
      } finally {
        setDeleteDialogOpen(false)
        setPatientToDelete(null)
      }
    }
  }

  // ✅ Export patients to PDF
  const exportToPDF = () => {
    const doc = new jsPDF()
    autoTable(doc, {
      head: [["Nom", "Prénom", "Situation médicale", "Section"]],
      body: filteredData.map((item) => [item.nom, item.prenom, item.situationMedicale, item.section.nom]),
    })
    doc.save("patients.pdf")
  }

  // ✅ Export patients to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredData.map((item) => ({
        Nom: item.nom,
        Prénom: item.prenom,
        "Situation médicale": item.situationMedicale,
        Section: item.section.nom,
      })),
    )
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Patients")
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" })
    const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
    saveAs(data, "patients.xlsx")
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Patients</h1>
      <p className="text-gray-500 mt-1">Gérer les dossiers des patients</p>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button
            className="bg-green-500 hover:bg-green-600 text-white"
            onClick={() => router.push("/dashboard/patient/add")}
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

      {loading ? (
        <p>Chargement des patients...</p>
      ) : (
        <PatientTable
          data={paginatedData}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center text-sm text-gray-500">
        <div>Total {filteredData.length}</div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails du patient</DialogTitle>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Nom</h4>
                <p>{selectedPatient.nom}</p>
              </div>
              <div>
                <h4 className="font-medium">Prénom</h4>
                <p>{selectedPatient.prenom}</p>
              </div>
              <div>
                <h4 className="font-medium">Situation médicale</h4>
                <p>{selectedPatient.situationMedicale}</p>
              </div>
              <div>
                <h4 className="font-medium">Section</h4>
                <p>{selectedPatient.section.nom}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        message="Voulez-vous supprimer ce patient ?"
      />
    </div>
  )
}