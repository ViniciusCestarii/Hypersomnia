import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button, ButtonProps } from '@/components/ui/button'
import ClipboardButton from '@/components/ui/panel/clipboard-button'
import DeleteConfirmationButton from '@/components/ui/panel/delete-confirmation-button'
import OrdenableInput from '@/components/ui/panel/ordenable-input'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import TypographyH3 from '@/components/ui/Typography-h3'
import { getRequestWithQueryParams } from '@/lib/utils'
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
import { Plus } from 'lucide-react'
import { forwardRef, useState } from 'react'

const RequestParamsTab = () => {
  const request = useHypersomniaStore((state) => state.selectedRequest!)

  const requestUrlWithQuery = getRequestWithQueryParams(request)
  const isRequestUrlWithQueryEmpty = requestUrlWithQuery === ''

  return (
    <>
      <Alert className="bg-foreground/5">
        <AlertTitle className="uppercase text-xs text-foreground/75 ">
          URL preview
        </AlertTitle>
        <AlertDescription className="text-xss break-words pr-8 max-h-20 min-w-24 relative">
          {isRequestUrlWithQueryEmpty ? '...' : requestUrlWithQuery}
          <ClipboardButton
            label="copy URL"
            disabled={isRequestUrlWithQueryEmpty}
            text={requestUrlWithQuery}
            variant={'ghost'}
            className="absolute right-0 bottom-0"
          />
        </AlertDescription>
      </Alert>
      <QueryParametersSection />
    </>
  )
}

const QueryParametersSection = () => {
  const request = useHypersomniaStore((state) => state.selectedRequest!)
  const addQueryParam = useHypersomniaStore((state) => state.addQueryParam)
  const updateRequestField = useHypersomniaStore(
    (state) => state.updateRequestField,
  )
  const deleteAllParams = useHypersomniaStore((state) => state.deleteAllParams)

  const queryParameters = request.queryParameters ?? []

  const handleSaveReorder = (newOrder: string[]) => {
    const reorderedParams = newOrder
      .map((id) => queryParameters.find((param) => param.id === id))
      .filter((param) => param !== undefined)

    updateRequestField('queryParameters', reorderedParams)
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
      const items = queryParameters.map((p) => p.id)
      const oldIndex = items.indexOf(active.id.toString())
      const newIndex = items.indexOf(over.id.toString())

      handleSaveReorder(arrayMove(items, oldIndex, newIndex))

      setActiveId(null)
    }
  }

  const localQueryParamsId = queryParameters.map((p) => p.id)

  return (
    <>
      <TypographyH3 className="pt-4 px-2 text-nowrap">
        Query Parameters
      </TypographyH3>
      <div className="flex">
        <Button
          onClick={addQueryParam}
          size="sm"
          variant="ghost"
          aria-label="add query parameter"
          title="add query parameter"
          className="rounded-none h-9 flex items-center"
        >
          <Plus size={12} className="mr-1" />
          Add
        </Button>
        <DeleteConfirmationButton
          disabled={queryParameters.length === 0}
          onConfirm={deleteAllParams}
          text="Delete all"
          aria-label="delete all query parameters"
          title="delete all query parameters"
          className="rounded-none h-9 flex items-center"
          iconSize={12}
        />
      </div>
      <ScrollArea type="auto" className="h-[55vh]">
        <ul className="py-[1px]">
          <DndContext
            modifiers={[restrictToVerticalAxis]}
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={localQueryParamsId}
              strategy={verticalListSortingStrategy}
            >
              {localQueryParamsId.map((id) => (
                <SortableQueryParamInput key={id} id={id} />
              ))}
            </SortableContext>
            <DragOverlay>
              {activeId ? <QueryParamInput id={activeId} isOver /> : null}
            </DragOverlay>
          </DndContext>
        </ul>
        <ScrollBar orientation="horizontal" />
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </>
  )
}

interface QueryParamInputProps extends React.HTMLProps<HTMLLIElement> {
  id: string
  isOver?: boolean
  gripProps?: ButtonProps
}

const SortableQueryParamInput = ({ id }: { id: string }) => {
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

  return (
    <QueryParamInput
      id={id}
      ref={setNodeRef}
      style={style}
      className={isDragging ? 'opacity-50' : ''}
      gripProps={{
        ref: setActivatorNodeRef,
        className: isDragging ? 'cursor-grabbing' : '',
        ...listeners,
        ...attributes,
      }}
    />
  )
}

const QueryParamInput = forwardRef<HTMLLIElement, QueryParamInputProps>(
  (props, ref) => {
    const request = useHypersomniaStore((state) => state.selectedRequest!)
    const queryParameters = request.queryParameters ?? []

    const { id } = props

    const param = queryParameters.find((p) => p.id === id)

    if (!param) return null
    return (
      <OrdenableInput
        {...props}
        ref={ref}
        allOrdenable={queryParameters}
        ordenable={param}
        pathField="queryParameters"
        inputName="query param"
      />
    )
  },
)

QueryParamInput.displayName = 'QueryParamInput'

export default RequestParamsTab
