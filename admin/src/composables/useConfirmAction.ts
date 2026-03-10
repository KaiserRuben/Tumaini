import { useConfirm } from 'primevue/useconfirm'

export function useConfirmAction() {
    const confirm = useConfirm()

    return {
        confirmDelete(message: string, onAccept: () => void) {
            confirm.require({
                message,
                header: 'Confirm Delete',
                icon: 'pi pi-trash',
                rejectLabel: 'Cancel',
                acceptLabel: 'Delete',
                acceptClass: 'p-button-danger',
                accept: onAccept
            })
        },
        confirmAction(message: string, header: string, onAccept: () => void) {
            confirm.require({
                message,
                header,
                icon: 'pi pi-exclamation-triangle',
                rejectLabel: 'Cancel',
                acceptLabel: 'Confirm',
                accept: onAccept
            })
        }
    }
}
