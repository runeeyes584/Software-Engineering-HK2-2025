import { useState } from "react";
import { useLanguage } from "@/components/language-provider-fixed"

export default function SaveButton({ isSaved, onToggle }: { isSaved: boolean, onToggle: () => void }) {
  const { t } = useLanguage();
  return (
    <button
      onClick={onToggle}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: "#fff",
        border: "1.5px solid #d1d5db",
        borderRadius: 12,
        padding: "8px 20px",
        cursor: "pointer",
        transition: "border 0.2s, box-shadow 0.2s",
        boxShadow: isSaved ? "0 2px 8px #e0e0e0" : "none",
        outline: "none",
      }}
      onMouseOver={e => {
        e.currentTarget.style.border = "1.5px solid #60a5fa";
      }}
      onMouseOut={e => {
        e.currentTarget.style.border = "1.5px solid #d1d5db";
      }}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill={isSaved ? "#e53935" : "none"}
        stroke={isSaved ? "#e53935" : "#222"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          transition: "fill 0.2s, stroke 0.2s",
          marginRight: 4,
        }}
      >
        <path
          d="M16.5 3.5c-1.74 0-3.41 1.01-4.5 2.09C10.91 4.51 9.24 3.5 7.5 3.5 4.42 3.5 2 5.92 2 9c0 3.78 3.4 6.86 8.55 11.54a2 2 0 0 0 2.9 0C18.6 15.86 22 12.78 22 9c0-3.08-2.42-5.5-5.5-5.5z"
          fill={isSaved ? "#e53935" : "none"}
          stroke={isSaved ? "#e53935" : "#222"}
        />
      </svg>
      <span
        style={{
          fontWeight: 600,
          fontSize: 17,
          color: "#222",
          letterSpacing: 0.2,
        }}
      >
        {isSaved ? t('tour.savedButton') : t('tour.saveButton')}
      </span>
    </button>
  );
} 