'use client';

import { useState, useRef, useEffect } from 'react';
import { Pencil } from 'lucide-react';

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  className?: string;
  maxLength?: number;
  disabled?: boolean;
}

export function EditableText({
  value,
  onChange,
  placeholder = 'Buraya tıklayarak düzenleyin...',
  multiline = false,
  className = '',
  maxLength,
  disabled = false,
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const [showIcon, setShowIcon] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleClick = () => {
    if (!disabled) {
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (localValue !== value) {
      onChange(localValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleBlur();
    } else if (e.key === 'Escape') {
      setLocalValue(value);
      setIsEditing(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (!maxLength || newValue.length <= maxLength) {
      setLocalValue(newValue);
    }
  };

  if (isEditing) {
    if (multiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`w-full bg-white/90 border-2 border-pink-500 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-pink-500 ${className}`}
          rows={4}
        />
      );
    }

    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full bg-white/90 border-2 border-pink-500 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-pink-500 ${className}`}
      />
    );
  }

  return (
    <div
      className={`relative cursor-pointer group ${className}`}
      onClick={handleClick}
      onMouseEnter={() => setShowIcon(true)}
      onMouseLeave={() => setShowIcon(false)}
    >
      <div className={`${!disabled ? 'hover:bg-white/10 rounded-lg p-1 transition-colors' : ''}`}>
        {value || <span className="text-gray-400 italic">{placeholder}</span>}
      </div>
      {!disabled && showIcon && (
        <div className="absolute -right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Pencil className="w-4 h-4 text-pink-500" />
        </div>
      )}
    </div>
  );
}
