"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card } from "@/components/ui/card"
import { Plus, ChevronRight, Palette } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Edit, Files, Trash2, Flag } from "lucide-react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"

interface FormPage {
  id: string
  title: string
  icon?: string
  content: React.ReactNode
}

export default function FormBuilder() {
  const [activePageId, setActivePageId] = useState("cover")
  const [pages, setPages] = useState<FormPage[]>([
    {
      id: "cover",
      title: "Cover",
      content: (
        <div className="space-y-8">
          <div className="space-y-3">
            <Label htmlFor="name" className="text-white text-lg">
              {"What's your name?"} <span className="text-orange-400">*</span>
            </Label>
            <Input
              id="name"
              className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 h-12"
              placeholder=""
            />
          </div>

          <div className="space-y-4">
            <Label className="text-white text-lg">
              Are you able to attend? <span className="text-orange-400">*</span>
            </Label>
            <RadioGroup defaultValue="yes" className="space-y-3">
              <div className="flex items-center space-x-3">
                <RadioGroupItem
                  value="yes"
                  id="yes"
                  className="border-slate-600 text-green-400 data-[state=checked]:bg-green-400 data-[state=checked]:border-green-400"
                />
                <Label htmlFor="yes" className="text-white text-base flex items-center gap-2">
                  <span className="text-green-400">✓</span> Yes
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem
                  value="no"
                  id="no"
                  className="border-slate-600 text-red-400 data-[state=checked]:bg-red-400 data-[state=checked]:border-red-400"
                />
                <Label htmlFor="no" className="text-white text-base flex items-center gap-2">
                  <span className="text-red-400">✕</span> Nope
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg">
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
    },
    {
      id: "basic-info",
      title: "Basic",
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-white">
                Email Address
              </Label>
              <Input id="email" type="email" className="bg-slate-700/50 border-slate-600 text-white" />
            </div>
            <div>
              <Label htmlFor="phone" className="text-white">
                Phone Number
              </Label>
              <Input id="phone" type="tel" className="bg-slate-700/50 border-slate-600 text-white" />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "contact-info",
      title: "Contact",
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">Contact Information</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="address" className="text-white">
                Address
              </Label>
              <Input id="address" className="bg-slate-700/50 border-slate-600 text-white" />
            </div>
            <div>
              <Label htmlFor="city" className="text-white">
                City
              </Label>
              <Input id="city" className="bg-slate-700/50 border-slate-600 text-white" />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "guests",
      title: "Guests",
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">Guest Information</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="guest-count" className="text-white">
                Number of Guests
              </Label>
              <Input id="guest-count" type="number" className="bg-slate-700/50 border-slate-600 text-white" />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "ending",
      title: "Ending",
      content: (
        <div className="space-y-6 text-center">
          <h2 className="text-2xl font-semibold text-white">Thank You!</h2>
          <p className="text-slate-300">Your response has been recorded.</p>
          <Button className="bg-green-600 hover:bg-green-700 text-white">Submit Form</Button>
        </div>
      ),
    },
  ])

  const addPage = () => {
    // this built in prompt isnt needed but I added it so that we can give a name to our tab if we wanted.
    const name = prompt("Name")
    const newPage: FormPage = {
      id: `page-${Date.now()}`,
      title: name || `Page ${pages.length + 1}`,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">New Page</h2>
          <p className="text-slate-300">Add your content here...</p>
        </div>
      ),
    }
    setPages([...pages, newPage])
  }

  const deletePage = (pageId: string) => {
    if (pages.length <= 1) return // Don't delete if it's the last page

    const newPages = pages.filter((page) => page.id !== pageId)
    setPages(newPages)

    // If we deleted the active page, switch to the first page
    if (activePageId === pageId) {
      setActivePageId(newPages[0]?.id || "")
    }
  }

  const insertPageAt = (index: number) => {
    const name = prompt("Page name") || "New Page"
    const newPage: FormPage = {
      id: `page-${Date.now()}`,
      title: name,
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">{name}</h2>
          <p className="text-slate-300">Add your content here...</p>
        </div>
      ),
    }
    const newPages = [...pages]
    newPages.splice(index, 0, newPage)
    setPages(newPages)
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(pages)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setPages(items)
  }

  const setAsFirstPage = (pageId: string) => {
    const pageIndex = pages.findIndex((p) => p.id === pageId)
    if (pageIndex > 0) {
      const page = pages[pageIndex]
      const newPages = [page, ...pages.filter((p) => p.id !== pageId)]
      setPages(newPages)
    }
  }

  const renamePage = (pageId: string) => {
    const newName = prompt("Enter new page name:")
    if (newName && newName.trim()) {
      setPages(pages.map((page) => (page.id === pageId ? { ...page, title: newName.trim() } : page)))
    }
  }

  const copyPage = (pageId: string) => {
    const pageToCopy = pages.find((p) => p.id === pageId)
    if (pageToCopy) {
      const newPage: FormPage = {
        ...pageToCopy,
        id: `page-${Date.now()}`,
        title: `${pageToCopy.title} Copy`,
      }
      const pageIndex = pages.findIndex((p) => p.id === pageId)
      const newPages = [...pages]
      newPages.splice(pageIndex + 1, 0, newPage)
      setPages(newPages)
    }
  }

  const duplicatePage = (pageId: string) => {
    const pageToDuplicate = pages.find((p) => p.id === pageId)
    if (pageToDuplicate) {
      const newPage: FormPage = {
        ...pageToDuplicate,
        id: `page-${Date.now()}`,
        title: `${pageToDuplicate.title} (2)`,
      }
      setPages([...pages, newPage])
    }
  }

  const activePage = pages.find((page) => page.id === activePageId)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="p-6">
        <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
          <Palette className="mr-2 h-4 w-4" />
          Theme
        </Button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center px-6 pb-32">
        <Card className="w-full max-w-2xl bg-transparent border-none shadow-none">
          <div className="p-8">{activePage?.content}</div>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex items-center justify-center max-w-6xl mx-auto">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="pages" direction="horizontal">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="flex items-center">
                  {pages.map((page, index) => (
                    <Draggable key={page.id} draggableId={page.id} index={index}>
                      {(provided, snapshot) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} className="flex items-center">
                          {/* Insert button before each page (except first) */}
                          {index > 0 && (
                            <div className="group relative mx-2">
                              <div className="w-6 h-6 flex items-center justify-center">
                                <div className="w-2 h-0.5 bg-gray-300"></div>
                                <button
                                  onClick={() => insertPageAt(index)}
                                  className="absolute w-6 h-6 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:border-blue-500 hover:text-blue-500 transition-all duration-200 text-xs font-bold"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Page Tab */}
                          <div className={`group relative ${snapshot.isDragging ? "shadow-lg z-10" : ""}`}>
                            <div
                              {...provided.dragHandleProps}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-move ${
                                activePageId === page.id
                                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                              } ${snapshot.isDragging ? "bg-blue-100 shadow-lg" : ""}`}
                              onClick={() => setActivePageId(page.id)}
                            >
                              {/* Page Icons */}
                              {page.id === "cover" && (
                                <div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs">
                                  i
                                </div>
                              )}
                              {page.id === "basic-info" && (
                                <div className="w-4 h-4 bg-blue-500 rounded flex items-center justify-center text-white text-xs">
                                  📋
                                </div>
                              )}
                              {page.id === "contact-info" && (
                                <div className="w-4 h-4 bg-green-500 rounded flex items-center justify-center text-white text-xs">
                                  📞
                                </div>
                              )}
                              {page.id === "guests" && (
                                <div className="w-4 h-4 bg-purple-500 rounded flex items-center justify-center text-white text-xs">
                                  👥
                                </div>
                              )}
                              {page.id === "anything-else" && (
                                <div className="w-4 h-4 bg-gray-500 rounded flex items-center justify-center text-white text-xs">
                                  ?
                                </div>
                              )}
                              {page.id === "ending" && (
                                <div className="w-4 h-4 bg-red-500 rounded flex items-center justify-center text-white text-xs">
                                  ✓
                                </div>
                              )}
                              {!["cover", "basic-info", "contact-info", "guests", "anything-else", "ending"].includes(
                                page.id,
                              ) && (
                                <div className="w-4 h-4 bg-gray-400 rounded flex items-center justify-center text-white text-xs">
                                  •
                                </div>
                              )}

                              {page.title}
                            </div>

                            {/* Context Menu */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button
                                  className="absolute -top-1 -right-1 w-5 h-5 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-gray-200 transition-opacity text-xs"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  ⋯
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start" className="w-48">
                                {index > 0 && (
                                  <>
                                    <DropdownMenuItem onClick={() => setAsFirstPage(page.id)}>
                                      <Flag className="h-4 w-4 mr-2" />
                                      Set as first page
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                  </>
                                )}
                                <DropdownMenuItem onClick={() => renamePage(page.id)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Rename
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => copyPage(page.id)}>
                                  <Files className="h-4 w-4 mr-2" />
                                  Copy
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => duplicatePage(page.id)}>
                                  <Files className="h-4 w-4 mr-2" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => deletePage(page.id)}
                                  className="text-red-600 focus:text-red-600"
                                  disabled={pages.length <= 1}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          {/* Connector line after each page (except last) */}
                          {index < pages.length - 1 && <div className="mx-2 w-6 h-0.5 bg-gray-300"></div>}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}

                  {/* Final add button */}
                  <div className="group relative mx-2">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <div className="w-2 h-0.5 bg-gray-300"></div>
                      <button
                        onClick={addPage}
                        className="absolute w-6 h-6 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:border-blue-500 hover:text-blue-500 transition-all duration-200 text-xs font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Add page button */}
                  <Button
                    onClick={addPage}
                    variant="ghost"
                    size="sm"
                    className="ml-4 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add page
                  </Button>
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </div>
  )
}
