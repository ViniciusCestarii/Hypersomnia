import React from 'react'
import { ResponsiveModal } from './responsive-dialog'
import { Button } from './button'

interface ConfirmModalProps
  extends Omit<React.ComponentProps<typeof ResponsiveModal>, 'children'> {
  onConfirm: () => void
}

const ConfirmModal = ({ onConfirm, ...props }: ConfirmModalProps) => {
  return (
    <ResponsiveModal {...props}>
      <div className="mt-auto flex flex-col sm:flex-row sm:justify-end gap-2 p-4 pt-2">
        <Button variant="destructive" onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </ResponsiveModal>
  )
}

export default ConfirmModal
