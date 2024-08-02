import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button, ButtonProps } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import ClipboardButton from '@/components/ui/panel/clipboard-button'
import TypographyH3 from '@/components/ui/Typography-h3'
import { cn, getRequestWithQueryParams } from '@/lib/utils'
import useHypersomniaStore from '@/zustand/hypersomnia-store'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { AlertTriangle, GripVertical, Plus, Trash } from 'lucide-react'
import { useState } from 'react'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

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
        <AlertDescription className="text-xss break-words pr-8 max-h-28 min-w-24 relative">
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
  const handleSaveReorder = (newOrder: string[]) => {
    const reorderedParams = newOrder
      .map((id) => request.queryParameters.find((param) => param.id === id))
      .filter((param) => param !== undefined)

    updateRequestField('queryParameters', reorderedParams)
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (!over) return

    if (active.id !== over.id) {
      const items = request.queryParameters.map((p) => p.id)
      const oldIndex = items.indexOf(active.id.toString())
      const newIndex = items.indexOf(over.id.toString())

      handleSaveReorder(arrayMove(items, oldIndex, newIndex))
    }
  }

  const localQueryParamsId = request.queryParameters.map((p) => p.id)

  return (
    <>
      <TypographyH3 className="pt-4 px-2">Query Parameters</TypographyH3>
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
          disabled={request.queryParameters.length === 0}
          onConfirm={deleteAllParams}
          text="Delete all"
          aria-label="delete all query parameters"
          title="delete all query parameters"
          className="rounded-none h-9 flex items-center"
          iconSize={12}
        />
      </div>
      <ScrollArea type="auto">
        <ul className="min-w-60 max-h-[60vh]">
          <DndContext
            modifiers={[restrictToVerticalAxis]}
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={localQueryParamsId}
              strategy={verticalListSortingStrategy}
            >
              {localQueryParamsId.map((id, index) => (
                <QueryParamInput key={id} id={id} index={index} />
              ))}
            </SortableContext>
          </DndContext>
        </ul>
        <ScrollBar orientation="horizontal" />
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </>
  )
}

interface QueryParamInputProps {
  id: string
  index: number
}

const QueryParamInput = ({ id, index }: QueryParamInputProps) => {
  const deleteQueryParam = useHypersomniaStore(
    (state) => state.deleteQueryParam,
  )
  const request = useHypersomniaStore((state) => state.selectedRequest!)
  const updateQueryParamField = useHypersomniaStore(
    (state) => state.updateQueryParamField,
  )
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

  const keyInputId = `param-key-${id}`
  const valueInputId = `param-value-${id}`
  const checkboxId = `param-enabled-${id}`

  const param = request.queryParameters[index]

  if (!param) return null
  return (
    <li
      key={id}
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center select-none transition-colors',
        !param.enabled && 'opacity-[0.5_!important]',
        isDragging && 'bg-muted/85',
      )}
    >
      <GripVertical
        ref={setActivatorNodeRef as unknown as React.RefObject<SVGSVGElement>}
        {...attributes}
        {...listeners}
        className={cn(
          'cursor-grab min-w-6 p-[6px] h-9',
          isDragging && 'cursor-grabbing',
        )}
      />

      <Label className="sr-only" htmlFor={keyInputId}>
        Key
      </Label>
      <Input
        id={keyInputId}
        type="text"
        value={param.key ?? ''}
        className="h-9 rounded-none border-none placeholder:text-muted-foreground/50 placeholder:text-xs placeholder:uppercase"
        placeholder="key"
        onChange={(e) => updateQueryParamField(index, 'key', e.target.value)}
      />
      <Label className="sr-only" htmlFor={valueInputId}>
        Value
      </Label>
      <Input
        id={valueInputId}
        type="text"
        value={param.value ?? ''}
        className="h-9 rounded-none border-none placeholder:text-muted-foreground/50 placeholder:text-xs placeholder:uppercase"
        placeholder="value"
        onChange={(e) => updateQueryParamField(index, 'value', e.target.value)}
      />
      <DeleteConfirmationButton
        onConfirm={() => deleteQueryParam(index)}
        aria-label="delete query parameter"
        title="delete query parameter"
        className="rounded-none h-9 flex items-center"
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
          title={param.enabled ? 'disable query param' : 'enable query param'}
          checked={param.enabled}
          onCheckedChange={(checked) =>
            updateQueryParamField(index, 'enabled', checked)
          }
        />
      </div>
    </li>
  )
}

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
