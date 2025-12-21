interface StatusBadgeProps {
    status: 'urgent' | 'deadline' | 'general' | 'archive'
    size?: 'sm' | 'md'
}

const statusConfig = {
    urgent: {
        label: 'MENDESAK',
        className: 'badge-danger',
    },
    deadline: {
        label: 'BATAS WAKTU',
        className: 'badge-warning',
    },
    general: {
        label: 'UMUM',
        className: 'badge-primary',
    },
    archive: {
        label: 'ARSIP',
        className: 'badge-neutral',
    }
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const config = statusConfig[status] || statusConfig.general

    return (
        <span className={`badge ${config.className}`}>
            {config.label}
        </span>
    )
}
