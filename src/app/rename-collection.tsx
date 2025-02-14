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
import { Collection } from '@/types'
import { toast } from 'sonner'

interface RenameCollectionProps {
  collection: Collection
  open: boolean
  onOpenChange: (open: boolean) => void
}

const RenameCollection = ({
  collection,
  open,
  onOpenChange,
}: RenameCollectionProps) => {
  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title="Rename Collection"
      description={`Rename collection ${collection?.title}.`}
    >
      <RenameCollectionForm
        open={open}
        collection={collection}
        onSubmitEnd={() => onOpenChange(false)}
      />
    </ResponsiveModal>
  )
}

interface RenameCollectionFormProps {
  collection: Collection
  onSubmitEnd: () => void
  open: boolean
}

const RenameCollectionForm = ({
  onSubmitEnd,
  collection,
  open,
}: RenameCollectionFormProps) => {
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
            title !== collection.title &&
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
      )
      .refine(
        (title) => {
          if (createSlug(title) === 'home') return false
          return true
        },
        {
          message: `Title cannot be 'home'.`,
        },
      ),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: collection.title,
    },
  })

  const updateCollectionById = useHypersomniaStore(
    (state) => state.updateCollectionById,
  )

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!collection) {
      toast.error('Collection not found.')
      return
    }

    updateCollectionById(collection.id, {
      ...collection,
      title: values.title,
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
                <Input
                  placeholder="Title"
                  autoFocus
                  {...field}
                  ref={(el) => {
                    field.ref(el)
                    if (el && open) {
                      setTimeout(() => el.focus(), 0) // Ensures focus after render
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button>Rename</Button>
        </div>
      </form>
    </Form>
  )
}

export default RenameCollection
