interface ProfileFieldProps {
  label: string;
  value: string;
  editing?: boolean;
  onChange?: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'tel' | 'select';
  required?: boolean;
  disabled?: boolean;
  options?: readonly string[] | string[];
}

export function ProfileField({ label, value, editing, onChange, placeholder, type = 'text', required, disabled, options }: ProfileFieldProps) {
  const labelColor = editing ? '#1D1D1F' : '#2563EB';

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: labelColor, fontFamily: "'Raleway', system-ui, sans-serif" }}>
        {label}{required && <span style={{ color: '#DC2626' }}> *</span>}
      </p>
      {editing ? (
        type === 'select' && options ? (
          <select
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={disabled}
            className="light-form w-full text-sm px-3 py-2.5 rounded-xl"
            style={{ backgroundColor: disabled ? '#F8FAFC' : undefined }}
          >
            <option value="" disabled>{placeholder || `Seleccione ${label.toLowerCase()}`}</option>
            {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className="light-form w-full text-sm px-3 py-2.5 rounded-xl"
            style={{ backgroundColor: disabled ? '#F8FAFC' : undefined }}
          />
        )
      ) : (
        <div className="rounded-xl px-3 py-2.5" style={{ border: '1px solid #E4EBFA', backgroundColor: '#FFFFFF' }}>
          <p className="text-sm" style={{ color: value ? '#1D1D1F' : '#9CA3AF', fontFamily: "'Raleway', system-ui, sans-serif" }}>
            {value || '—'}
          </p>
        </div>
      )}
    </div>
  );
}
