interface StatusBadgeProps {
    status: 'urgent' | 'deadline' | 'general' | 'archive'
    size?: 'sm' | 'md'
}

const statusConfig = {
    urgent: {
        label: 'Mendesak',
        className: 'badge-danger',
    },
    deadline: {
        label: 'Batas Waktu',
        className: 'badge-warning',
    },
    general: {
        label: 'Umum',
        className: 'badge-primary',
    },
    archive: {
        label: 'Arsip',
        className: 'badge-neutral',
    }
}

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
    const config = statusConfig[status] || statusConfig.general

    return (
        <span className={`badge ${config.className}`}>
            {config.label}
        </span>
    )
}
