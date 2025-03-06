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
import { Textarea } from '@/components/ui/textarea'
import {
  curlToHypersomniaRequest,
  generateNewRequestTemplate,
} from '@/lib/utils'
import useHypersomniaStore from '@/zustand/hypersomnia-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface ImportRequestFromCurlModal {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ImportRequestFromCurlModal = ({
  onOpenChange,
  open,
}: ImportRequestFromCurlModal) => {
  const formSchema = z.object({
    curl: z
      .string()
      .min(1)
      .refine(
        (value) => {
          const trimmed = value.trim()
          if (trimmed.startsWith('curl')) return true
          return false
        },
        { message: 'Invalid curl command' },
      ),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      curl: '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newRequest = generateNewRequestTemplate()
    const request = curlToHypersomniaRequest(values.curl)
    newRequest.request = request
    const path: string[] = []
    useHypersomniaStore.getState().createFileSystemNode(newRequest, path)
    useHypersomniaStore
      .getState()
      .selectRequest([...(path ?? []), newRequest.id])
    onOpenChange(false)
    form.reset()
  }

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={() => {
        onOpenChange(false)
        form.reset()
      }}
      title="Import Request"
      description="Import a request from a Curl command."
    >
      <Form {...form} formState={form.formState}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="curl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Curl</FormLabel>
                <FormControl>
                  <Textarea {...field} autoFocus />
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

export default ImportRequestFromCurlModal
