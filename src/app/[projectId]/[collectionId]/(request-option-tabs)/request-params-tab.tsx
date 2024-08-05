import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button, ButtonProps } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import ClipboardButton from '@/components/ui/panel/clipboard-button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import TypographyH3 from '@/components/ui/Typography-h3'
import { cn, getRequestWithQueryParams } from '@/lib/utils'
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
import { AlertTriangle, GripVertical, Plus, Trash } from 'lucide-react'
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
  ({ id, className, gripProps, isOver, ...props }, ref) => {
    const deleteQueryParam = useHypersomniaStore(
      (state) => state.deleteQueryParam,
    )
    const request = useHypersomniaStore((state) => state.selectedRequest!)
    const updateQueryParamField = useHypersomniaStore(
      (state) => state.updateQueryParamField,
    )

    const queryParameters = request.queryParameters ?? []

    const keyInputId = `param-key-${id}-${isOver}`
    const valueInputId = `param-value-${id}-${isOver}`
    const checkboxId = `param-enabled-${id}-${isOver}`

    const param = queryParameters.find((p) => p.id === id)

    if (!param) return null
    return (
      <li
        {...props}
        ref={ref}
        className={cn(
          'flex items-center select-none transition-colors min-w-60',
          isOver && 'bg-muted/50',
          !param.enabled && 'opacity-[0.5_!important]',
          className,
        )}
      >
        <Button
          variant="ghost"
          {...gripProps}
          className={cn(
            'cursor-grab min-w-7 p-[6px] px-2 h-9 flex justify-center items-center rounded-none',
            isOver && 'cursor-grabbing',
            gripProps?.className,
          )}
        >
          <GripVertical />
        </Button>
        <Label className="sr-only" htmlFor={keyInputId}>
          Key
        </Label>
        <Input
          id={keyInputId}
          type="text"
          value={param.key ?? ''}
          className={cn(
            'h-9 rounded-none border-none placeholder:text-muted-foreground/50 placeholder:text-xs placeholder:uppercase',
            isOver && 'cursor-grabbing',
          )}
          placeholder="key"
          onChange={(e) => updateQueryParamField(id, 'key', e.target.value)}
        />
        <Label className="sr-only" htmlFor={valueInputId}>
          Value
        </Label>
        <Input
          id={valueInputId}
          type="text"
          value={param.value ?? ''}
          className={cn(
            'h-9 rounded-none border-none placeholder:text-muted-foreground/50 placeholder:text-xs placeholder:uppercase',
            isOver && 'cursor-grabbing',
          )}
          placeholder="value"
          onChange={(e) => updateQueryParamField(id, 'value', e.target.value)}
        />
        <DeleteConfirmationButton
          onConfirm={() => deleteQueryParam(id)}
          aria-label="delete query parameter"
          title="delete query parameter"
          className={cn(
            'rounded-none h-9 flex items-center',
            isOver && 'cursor-grabbing',
          )}
          iconSize={12}
        />
        <div className="rounded-none h-9 flex items-center hover:bg-accent px-3">
          <Label className="sr-only" htmlFor={checkboxId}>
            Enabled
          </Label>
          <Checkbox
            id={checkboxId}
            aria-label={
              param.enabled ? 'disable query param' : 'enable query param'
            }
            className={cn(isOver && 'cursor-grabbing')}
            title={param.enabled ? 'disable query param' : 'enable query param'}
            checked={param.enabled}
            onCheckedChange={(checked) =>
              updateQueryParamField(id, 'enabled', checked)
            }
          />
        </div>
      </li>
    )
  },
)

QueryParamInput.displayName = 'QueryParamInput'

const DeleteConfirmationButton = ({
  onConfirm,
  title,
  'aria-label': ariaLabel,
  iconSize = 12,
  className,
  text,
  ...props
}: ButtonProps & {
  onConfirm: () => void
  text?: string
  iconSize?: number
  className?: string
}) => {
  const [isConfirming, setIsConfirming] = useState(false)

  const handleClick = () => {
    if (isConfirming) {
      onConfirm()
      setIsConfirming(false)
    } else {
      setIsConfirming(true)
      setTimeout(() => setIsConfirming(false), 2000)
    }
  }

  return (
    <Button
      {...props}
      size="sm"
      variant="ghost"
      aria-label={isConfirming ? 'confirm delete' : ariaLabel}
      title={isConfirming ? 'confirm delete' : title}
      className={cn(
        className,
        isConfirming && 'text-warning hover:text-warning',
      )}
      onClick={handleClick}
    >
      {isConfirming ? (
        <AlertTriangle size={iconSize} className={text ? 'mr-1' : undefined} />
      ) : (
        <Trash size={iconSize} className={text ? 'mr-1' : undefined} />
      )}
      {isConfirming && text ? 'Confirm delete' : (text ?? '')}
    </Button>
  )
}

export default RequestParamsTab
