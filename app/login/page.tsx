"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Toaster, toast } from "react-hot-toast"
import { Activity } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (email && password) {
      toast.success("Connexion réussie!")
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    } else {
      toast.error("Veuillez remplir tous les champs")
    }
  }

  return (
    <div className="flex min-h-screen bg-[#1D262D] items-center justify-center">
      <Toaster position="top-right" />
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-center mb-6">
            <Activity className="h-8 w-8 text-[#1D262D] mr-2" />
            <h2 className="text-2xl font-bold text-center text-gray-700">Gestion CHU</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
                placeholder="vous@exemple.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Mot de passe
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
                placeholder="••••••••"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-[#1D262D] hover:bg-[#2A3642]">
              Se connecter
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

