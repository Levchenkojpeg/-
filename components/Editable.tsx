import React, { useRef } from 'react';

interface EditableProps {
  isEditing: boolean;
  onSave: (value: string) => void;
  children?: React.ReactNode;
  // FIX: Replaced `keyof JSX.IntrinsicElements` with a union of specific tags to avoid JSX namespace issues.
  as?: 'div' | 'p' | 'h2' | 'h3';
  className?: string;
  dangerouslySetInnerHTML?: { __html: string };
}

export const Editable: React.FC<EditableProps> = ({ isEditing, onSave, children, as: Component = 'div', dangerouslySetInnerHTML, ...props }) => {
  // FIX: Changed useRef type to 'any' to resolve type conflicts with different HTML elements passed via the 'as' prop.
  const elementRef = useRef<any>(null);

  const handleBlur = () => {
    if (elementRef.current) {
        // For dangerouslySetInnerHTML, we save the innerHTML, otherwise innerText
        const value = dangerouslySetInnerHTML ? elementRef.current.innerHTML : elementRef.current.innerText;
        onSave(value);
    }
  };
  
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const editingStyles: React.CSSProperties = isEditing ? {
    outline: '2px dashed #3E5944',
    padding: '4px',
    borderRadius: '4px',
    cursor: 'text',
  } : {};

  if (dangerouslySetInnerHTML) {
    return (
        <Component
          {...props}
          ref={elementRef}
          contentEditable={isEditing}
          suppressContentEditableWarning={true}
          onBlur={handleBlur}
          onPaste={isEditing ? handlePaste : undefined}
          style={editingStyles}
          dangerouslySetInnerHTML={dangerouslySetInnerHTML}
        />
    )
  }

  return (
    <Component
      {...props}
      ref={elementRef}
      contentEditable={isEditing}
      suppressContentEditableWarning={true}
      onBlur={handleBlur}
      onPaste={isEditing ? handlePaste : undefined}
      style={editingStyles}
    >
      {children}
    </Component>
  );
};
