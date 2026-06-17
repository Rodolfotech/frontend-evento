interface ProfileFieldProps {
  label: string;
  value: string;
  editing?: boolean;
  onChange?: (value: string) => void;
  placeholder?: string;
  type?: string;
}

export function ProfileField({ label, value, editing, onChange, placeholder, type = 'text' }: ProfileFieldProps) {
  return (
    <div className="rounded-xl px-4 py-3" style={{ border: '1px solid #E4EBFA', backgroundColor: '#FFFFFF' }}>
      <p className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#2563EB', fontFamily: "'Raleway', system-ui, sans-serif" }}>
        {label}
      </p>
      {editing ? (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder || label}
          className="w-full text-sm font-medium outline-none bg-transparent"
          style={{ color: '#1D1D1F', fontFamily: "'Raleway', system-ui, sans-serif" }}
        />
      ) : (
        <p className="text-sm font-medium" style={{ color: '#1D1D1F', fontFamily: "'Raleway', system-ui, sans-serif" }}>
          {value || '—'}
        </p>
      )}
    </div>
  );
}
