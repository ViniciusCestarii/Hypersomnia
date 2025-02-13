import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ResponsiveModal } from '@/components/ui/responsive-dialog'
import useHypersomniaStore from '@/zustand/hypersomnia-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { Download } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const ImportCollectionModal = () => {
  const collections = useHypersomniaStore((state) => state.collections)
  const createCollection = useHypersomniaStore(
    (state) => state.createCollection,
  )

  const [open, setOpen] = useState(false)

  const formSchema = z.object({
    file: z
      .unknown()
      .transform((value) => value as FileList)
      .refine(
        (files) => {
          if (files.length === 0) return false
          const file = files[0]
          return file.type === 'application/json'
        },
        { message: 'File must be a JSON file' },
      )
      .refine(
        (files) => {
          if (files.length === 0) return false
          const file = files[0]
          return file.size < 4.5 * 1024 * 1024 // 4.5MB
        },
        { message: 'JSON file is too large' },
      ),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const file = values.file[0]
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const text = event.target?.result as string
        const json = JSON.parse(text)

        // todo: validate json schema not just id
        if (!json.id) {
          form.setError('file', { message: 'Invalid JSON file' })
          return
        }

        while (collections.some((c) => c.id === json.id)) {
          json.id += '-copy'
          json.title += ' Copy'
        }

        createCollection(json)
        setOpen(false)
      } catch (error) {
        console.error('Invalid JSON file', error)
        form.setError('file', { message: 'Invalid JSON file' })
      }
    }

    reader.readAsText(file)
  }

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button>
          <Download className="size-4" />
          Import Collection
        </Button>
      }
      title="Import Collection"
      description="Import a collection from a JSON file."
    >
      <Form {...form} formState={form.formState}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="file"
            render={({ field: { onChange, value: _value, ...field } }) => (
              <FormItem>
                <FormLabel>File</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    autoFocus
                    type="file"
                    onChange={(e) => onChange(e.target.files)}
                    accept=".json"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button>Import</Button>
          </div>
        </form>
      </Form>
    </ResponsiveModal>
  )
}

export default ImportCollectionModal
