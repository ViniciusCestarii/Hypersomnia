import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button, ButtonProps } from '@/components/ui/button'
import DeleteConfirmationButton from '@/components/ui/panel/delete-confirmation-button'
import OrdenableInput from '@/components/ui/panel/ordenable-input'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import TypographyH3 from '@/components/ui/Typography-h3'
import {
  cn,
  generateUUID,
  getDefinedHeaders,
  isHeaderForbidden,
} from '@/lib/utils'
import { RequestHeaders } from '@/types'
import useHypersomniaStore from '@/zustand/hypersomnia-store'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Plus, Terminal } from 'lucide-react'
import { forwardRef, useState } from 'react'

const RequestHeadersTab = () => {
  const request = useHypersomniaStore((state) => state.selectedRequest!)
  const updateRequestField = useHypersomniaStore(
    (state) => state.updateRequestField,
  )
  const addHeader = () => {
    const newHeader: RequestHeaders = {
      id: generateUUID(),
      key: '',
      value: '',
      enabled: true,
    }
    updateRequestField('headers', [...(request?.headers ?? []), newHeader])
  }

  const deleteAllHeaders = () => updateRequestField('headers', undefined)

  const headers = request.headers ?? []

  const handleSaveReorder = (newOrder: string[]) => {
    const reorderedHeaders = newOrder
      .map((id) => headers.find((header) => header.id === id))
      .filter((header) => header !== undefined)

    updateRequestField('headers', reorderedHeaders)
  }

  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  function handleDragStart(event: DragStartEvent) {
    const { active } = event

    if (!active) return

    setActiveId(active.id.toString())
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(active.id.toString())

    if (!over) return

    if (active.id !== over.id) {
      const items = headers.map((p) => p.id)
      const oldIndex = items.indexOf(active.id.toString())
      const newIndex = items.indexOf(over.id.toString())

      handleSaveReorder(arrayMove(items, oldIndex, newIndex))

      setActiveId(null)
    }
  }

  const localHeaderssId = headers.map((p) => p.id)

  return (
    <>
      <TypographyH3 className="pt-2 px-2 text-nowrap">Headers</TypographyH3>
      <div className="flex">
        <Button
          onClick={addHeader}
          size="sm"
          variant="ghost"
          aria-label="add header"
          title="add header"
          className="rounded-none h-9 flex items-center"
        >
          <Plus size={12} className="mr-1" />
          Add
        </Button>
        <DeleteConfirmationButton
          disabled={headers.length === 0}
          onConfirm={deleteAllHeaders}
          text="Delete all"
          aria-label="delete all headers"
          title="delete all headers"
          className="rounded-none h-9 flex items-center"
          iconSize={12}
        />
      </div>
      <ScrollArea type="auto" className="h-[55vh]">
        <ul className="py-[1px] text-sm">
          {Object.entries(getDefinedHeaders()).map(([key, value]) => (
            <li key={key} className="grid grid-cols-[0.95fr_1.05fr] px-4">
              <span>{key}:</span>
              <span>{value}</span>
            </li>
          ))}
          <DndContext
            modifiers={[restrictToVerticalAxis]}
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={localHeaderssId}
              strategy={verticalListSortingStrategy}
            >
              {localHeaderssId.map((id, index) => (
                <SortableHeadersInput key={id} id={id} index={index} />
              ))}
            </SortableContext>
            <DragOverlay>
              {activeId ? <HeadersInput id={activeId} isOver /> : null}
            </DragOverlay>
          </DndContext>
        </ul>
        <Alert className="mt-2">
          <Terminal className="size-4" />
          <AlertTitle>Some headers may be overriden by browser</AlertTitle>
          <AlertDescription className="text-xs">
            When making requests from the browser, certain headers like{' '}
            <code>User-Agent</code> and <code>Referer</code> may be overridden
            for security reasons. Please check the Network tab in your
            browser&apos;s developer tools.{' '}
            <a
              href="https://developer.mozilla.org/docs/Glossary/Forbidden_header_name"
              className="underline"
              target="_blank"
              rel="noreferrer"
            >
              Know more
            </a>
          </AlertDescription>
        </Alert>
        <ScrollBar orientation="horizontal" />
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </>
  )
}

interface HeadersInputProps extends React.HTMLProps<HTMLLIElement> {
  id: string
  isOver?: boolean
  gripProps?: ButtonProps
}

const SortableHeadersInput = ({ id, index }: { id: string; index: number }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const request = useHypersomniaStore((state) => state.selectedRequest!)
  const headers = request.headers ?? []

  const thisHeader = headers.find((header) => header.id === id)!
  const duplicateIndex = headers.findLastIndex(
    (header) => header.key?.toLowerCase() === thisHeader.key?.toLowerCase(),
  )

  const willBeOverriden = duplicateIndex > index

  const isForbiddenHeader = isHeaderForbidden(thisHeader.key)

  return (
    <HeadersInput
      id={id}
      ref={setNodeRef}
      style={style}
      className={cn(
        isDragging && 'opacity-50',
        isForbiddenHeader && 'bg-destructive/20',
        willBeOverriden && 'bg-warning/20',
      )}
      title={
        isForbiddenHeader
          ? 'This header is forbidden by the browser'
          : willBeOverriden
            ? 'This header will be overriden by another header with the same name'
            : undefined
      }
      gripProps={{
        ref: setActivatorNodeRef,
        className: isDragging ? 'cursor-grabbing' : '',
        ...listeners,
        ...attributes,
      }}
    />
  )
}

const HeadersInput = forwardRef<HTMLLIElement, HeadersInputProps>(
  (props, ref) => {
    const request = useHypersomniaStore((state) => state.selectedRequest!)
    const headers = request.headers ?? []

    const { id } = props

    const header = headers.find((p) => p.id === id)

    if (!header) return null

    return (
      <OrdenableInput
        {...props}
        ref={ref}
        allOrdenable={headers}
        ordenable={header}
        pathField="headers"
        inputName="header"
        keyTitle="name"
      />
    )
  },
)

HeadersInput.displayName = 'HeadersInput'

export default RequestHeadersTab
