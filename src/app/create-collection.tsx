import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { ResponsiveModal } from '@/components/ui/responsive-dialog'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import useHypersomniaStore from '@/zustand/hypersomnia-store'
import { Input } from '@/components/ui/input'
import { createSlug } from '@/lib/utils'

const CreateCollection = () => {
  const [open, setOpen] = React.useState(false)
  return (
    <ResponsiveModal
      open={open}
      onOpenChange={setOpen}
      title="Create New Collection"
      description="Create a new collection to group your requests."
      trigger={<Button>Create Collection</Button>}
    >
      <CreateCollectionForm onSubmitEnd={() => setOpen(false)} />
    </ResponsiveModal>
  )
}

interface CreateCollectionFormProps {
  onSubmitEnd: () => void
}

const CreateCollectionForm = ({ onSubmitEnd }: CreateCollectionFormProps) => {
  const collections = useHypersomniaStore((state) => state.collections)

  const formSchema = z.object({
    title: z
      .string()
      .min(2, {
        message: 'Title must be at least 2 characters.',
      })
      .max(75, {
        message: 'Title must be at most 50 characters.',
      })
      .refine(
        (title) => {
          if (
            collections.some(
              (collection) => collection.id === createSlug(title),
            )
          ) {
            return false
          }
          return true
        },
        {
          message: 'Collection with this title already exists.',
        },
      ),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  })

  const createCollection = useHypersomniaStore(
    (state) => state.createCollection,
  )

  function onSubmit(values: z.infer<typeof formSchema>) {
    createCollection({
      title: values.title,
      description: '',
      fileSystem: [],
      id: createSlug(values.title),
    })
    onSubmitEnd()
  }

  return (
    <Form {...form} formState={form.formState}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Title" autoFocus {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button>Create</Button>
        </div>
      </form>
    </Form>
  )
}

export default CreateCollection
