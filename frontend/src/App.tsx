import { useState, useEffect } from "react"
import axios from "axios"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Trash, PencilLine } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const API_URL = "http://localhost:5000/api/tasks"

const taskSchema = z.object({
  nomTask: z.string().min(1, "Le nom de la tâche est requis"),
  nomEmploye: z.string().min(1, "Le nom de l'employé est requis"),
  dateDebut: z.string().min(1, "La date de début est requise"),
  dateFin: z.string().min(1, "La date de fin est requise"),
})

type TaskForm = z.infer<typeof taskSchema>
type Task = TaskForm & { id: number; complete: boolean }

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const form = useForm<TaskForm>({
    resolver: zodResolver(taskSchema),
    defaultValues: { nomTask: "", nomEmploye: "", dateDebut: "", dateFin: "" },
  })

  // 🔹 Charger toutes les tâches au démarrage
  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get(API_URL)
      setTasks(data)
    } catch (error) {
      console.error("Erreur fetch tasks:", error)
    }
  }

  const openDialog = (task: Task | null = null) => {
    setSelectedTask(task)
    form.reset(task || { nomTask: "", nomEmploye: "", dateDebut: "", dateFin: "" })
    setDialogOpen(true)
  }

  const formatDate = (dateStr: string) => {
  if (!dateStr) return ""
  return new Date(dateStr).toLocaleDateString("fr-FR")
}


  const onSubmit = async (data: TaskForm) => {
    try {
      if (selectedTask) {
        // 🔹 Modifier
        const { data: updatedTask } = await axios.put(`${API_URL}/${selectedTask.id}`, data)
        setTasks((prev) =>
          prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
        )
      } else {
        // 🔹 Ajouter
        const { data: newTask } = await axios.post(API_URL, data)
        setTasks((prev) => [...prev, newTask])
      }
      setDialogOpen(false)
      setSelectedTask(null)
    } catch (error) {
      console.error("Erreur add/update task:", error)
    }
  }

  const deleteTask = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/${id}`)
      setTasks((prev) => prev.filter((t) => t.id !== id))
    } catch (error) {
      console.error("Erreur delete task:", error)
    }
  }

  const toggleComplete = async (task: Task) => {
    try {
      const { data: updated } = await axios.patch(`${API_URL}/${task.id}/complete`)
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? updated.task : t))
      )
    } catch (error) {
      console.error("Erreur toggle complete:", error)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-100 w-full px-6">
      {/* Tableau */}
      <div className="border border-black rounded-2xl shadow-lg p-6 bg-white w-full max-w-4xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Task Name</TableHead>
              <TableHead className="w-[150px]">Employee Name</TableHead>
              <TableHead className="w-[150px]">Start Date</TableHead>
              <TableHead className="w-[150px]">End Date</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[50px] text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.nomTask}</TableCell>
                <TableCell>{task.nomEmploye}</TableCell>
                <TableCell>{formatDate(task.dateDebut)}</TableCell>
                <TableCell>{formatDate(task.dateFin)}</TableCell>
                <TableCell>
                  <Badge
                    className={task.complete ? "bg-green-500 text-white" : "bg-red-500 text-white"}
                    onClick={() => toggleComplete(task)}
                  >
                    {task.complete ? "Complete" : "Incomplete"}
                  </Badge>
                </TableCell>
                <TableCell className="flex justify-center">
                  <Button
                    className="text-blue-500 bg-transparent hover:text-white hover:bg-blue-500"
                    onClick={() => openDialog(task)}
                  >
                    <PencilLine />
                  </Button>
                  <Button
                    className="text-red-500 ml-2 bg-transparent hover:text-white hover:bg-red-500"
                    onClick={() => deleteTask(task.id)}
                  >
                    <Trash />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Bouton Ajouter */}
      <div className="w-full max-w-4xl flex justify-end mt-4">
        <Button
          className="bg-blue-500 text-white hover:bg-blue-600 shadow-lg"
          onClick={() => openDialog(null)}
        >
          Add Task
        </Button>
      </div>

      {/* Dialog Add/Edit */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedTask ? "Modifier la tâche" : "Ajouter une tâche"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <FormField
                control={form.control}
                name="nomTask"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de la tâche</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nom de la tâche" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nomEmploye"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de l'employé</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nom de l'employé" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateDebut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de début</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateFin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de fin</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end mt-4">
                <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-600">
                  {selectedTask ? "Enregistrer" : "Ajouter"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
