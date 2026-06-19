const STATUS_COLORS = {
  'Not Started': '#6b7280',
  'In Progress': '#f59e0b',
  'Completed':   '#10b981',
  'Pending':     '#6b7280',
  'High':        '#ef4444',
  'Medium':      '#f59e0b',
  'Low':         '#10b981',
};

export default function StatusBadge({ value }) {
  const color = STATUS_COLORS[value] || '#6b7280';
  return (
    <span style={{
      display: 'inline-block', padding: '2px 10px', borderRadius: 12,
      fontSize: 12, fontWeight: 600, color: '#fff', background: color,
    }}>
      {value}
    </span>
  );
}
