// SidebarToggle.jsx
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function SidebarToggle() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        className="sidebar-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      <div 
        className={`admin-sidebar-overlay ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(false)}
      />
    </>
  );
}