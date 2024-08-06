import { forwardRef } from 'react'
import { Button, ButtonProps } from '../button'
import { cn } from '@/lib/utils'
import { GripVertical } from 'lucide-react'
import { Label } from '../label'
import { Input } from '../input'
import DeleteConfirmationButton from './delete-confirmation-button'
import { Checkbox } from '../checkbox'
import useHypersomniaStore from '@/zustand/hypersomnia-store'

interface OrdernableType {
  id: string
  key?: string
  value?: string
  enabled: boolean
}

interface OrdenableInputProps extends React.HTMLProps<HTMLLIElement> {
  ordenable: OrdernableType
  isOver?: boolean
  gripProps?: ButtonProps
  pathField: string
  allOrdenable: OrdernableType[]
  inputName: string
  keyTitle?: string
}

const OrdenableInput = forwardRef<HTMLLIElement, OrdenableInputProps>(
  (
    {
      className,
      gripProps,
      isOver,
      ordenable,
      pathField,
      allOrdenable,
      inputName,
      keyTitle,
      ...props
    },
    ref,
  ) => {
    const updateRequestField = useHypersomniaStore(
      (state) => state.updateRequestField,
    )

    const { id } = ordenable
    const keyInputId = `${inputName.replace(' ', '-')}-${keyTitle}-${id}-${isOver}`
    const valueInputId = `${inputName}-value-${id}-${isOver}`
    const checkboxId = `${inputName}-enabled-${id}-${isOver}`

    const deleteField = () => {
      const index = allOrdenable.findIndex((o) => o.id === id)
      if (index !== -1) {
        allOrdenable.splice(index, 1)
        updateRequestField(pathField, allOrdenable)
      }
    }

    const updateOrdenable = (newOrdenable: OrdernableType) => {
      const index = allOrdenable.findIndex((o) => o.id === id)
      if (index !== -1) {
        allOrdenable[index] = newOrdenable
        updateRequestField(pathField, allOrdenable)
      }
    }

    return (
      <li
        {...props}
        ref={ref}
        className={cn(
          'flex items-center select-none transition-colors min-w-60',
          isOver && 'bg-muted/50',
          !ordenable.enabled && 'opacity-[0.5_!important]',
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
          {keyTitle}
        </Label>
        <Input
          id={keyInputId}
          type="text"
          value={ordenable.key ?? ''}
          className={cn(
            'h-9 rounded-none border-none placeholder:text-muted-foreground/50 placeholder:text-xs placeholder:uppercase',
            isOver && 'cursor-grabbing',
          )}
          placeholder={keyTitle}
          onChange={(e) =>
            updateOrdenable({ ...ordenable, key: e.target.value })
          }
        />
        <Label className="sr-only" htmlFor={valueInputId}>
          Value
        </Label>
        <Input
          id={valueInputId}
          type="text"
          value={ordenable.value ?? ''}
          className={cn(
            'h-9 rounded-none border-none placeholder:text-muted-foreground/50 placeholder:text-xs placeholder:uppercase',
            isOver && 'cursor-grabbing',
          )}
          placeholder="value"
          onChange={(e) =>
            updateOrdenable({ ...ordenable, value: e.target.value })
          }
        />
        <DeleteConfirmationButton
          onConfirm={deleteField}
          aria-label={`delete ${inputName}`}
          title={`delete ${inputName}`}
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
              ordenable.enabled ? `disable ${inputName}` : `enable ${inputName}`
            }
            className={cn(isOver && 'cursor-grabbing')}
            // if no key is provided, the checkbox is disabled
            title={
              !ordenable.key
                ? `${keyTitle} is required`
                : ordenable.enabled
                  ? `disable ${inputName}`
                  : `enable ${inputName}`
            }
            disabled={!ordenable.key}
            checked={!!ordenable.key && ordenable.enabled}
            onCheckedChange={(checked) =>
              updateOrdenable({ ...ordenable, enabled: checked as boolean })
            }
          />
        </div>
      </li>
    )
  },
)

OrdenableInput.displayName = 'OrdenableInput'

export default OrdenableInput
