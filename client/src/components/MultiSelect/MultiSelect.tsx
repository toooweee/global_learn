import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './MultiSelect.module.scss';

type Option = { label: string; value: string };

type Props = {
  options: Option[];
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
};

const MultiSelect = ({ options, value, onChange, placeholder = 'Select…', disabled }: Props) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, []);

  const selectedOptions = useMemo(() => {
    const set = new Set(value);
    return options.filter((o) => set.has(o.value));
  }, [options, value]);

  const toggle = (val: string) => {
    if (disabled) return;
    const set = new Set(value);
    if (set.has(val)) set.delete(val);
    else set.add(val);
    onChange(Array.from(set));
  };

  const remove = (val: string) => {
    if (disabled) return;
    onChange(value.filter((v) => v !== val));
  };

  return (
    <div className={styles.root} ref={containerRef}>
      <button
        type="button"
        className={styles.control}
        onClick={() => !disabled && setOpen((p) => !p)}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
      >
        {selectedOptions.length === 0 ? (
          <span className={styles.placeholder}>{placeholder}</span>
        ) : (
          <span className={styles.tags}>
            {selectedOptions.map((o) => (
              <span key={o.value} className={styles.tag}>
                {o.label}
                <button
                  type="button"
                  className={styles.tagRemove}
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(o.value);
                  }}
                  aria-label={`Remove ${o.label}`}
                >
                  ×
                </button>
              </span>
            ))}
          </span>
        )}
      </button>
      {open && (
        <div className={styles.menu} role="listbox" aria-multiselectable>
          {options.map((o) => {
            const checked = value.includes(o.value);
            return (
              <div
                key={o.value}
                className={styles.option}
                role="option"
                aria-selected={checked}
                onClick={() => toggle(o.value)}
              >
                <input type="checkbox" readOnly checked={checked} />
                <span>{o.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
