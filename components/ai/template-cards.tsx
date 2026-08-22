"use client";

import { ReactNode, useState } from "react";
import { IconButton } from "@mui/material";

type Template = {
  id: string;
  title: string;
  icons: ReactNode[];
  moreCount?: number;
  chips: string[];
  installs: number;
  images?: string[];
  imageStyle?: "slider" | "gallery";
  onClick?: () => void;
};

type TemplateCardsProps = {
  templates: Template[];
};

export function TemplateCards({ templates }: TemplateCardsProps) {
  const [sliderIndices, setSliderIndices] = useState<Record<string, number>>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleSliderPrev = (id: string, imagesLength: number) => {
    setSliderIndices((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) === 0 ? imagesLength - 1 : (prev[id] || 0) - 1,
    }));
  };

  const handleSliderNext = (id: string, imagesLength: number) => {
    setSliderIndices((prev) => ({
      ...prev,
      [id]: ((prev[id] || 0) + 1) % imagesLength,
    }));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {templates.map((template) => (
        <div
          key={template.id}
          role="button"
          tabIndex={0}
          onClick={template.onClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              template.onClick?.();
            }
          }}
          className="rounded-2xl border border-gray-200 bg-white overflow-hidden text-left transition-all hover:border-gray-300 hover:shadow-lg cursor-pointer"
        >
          {/* Image Slider (Template 1) */}
          {template.imageStyle === "slider" && template.images && template.images.length > 0 && (
            <div className="relative w-full h-48 bg-gray-100 group">
              <img
                src={template.images[sliderIndices[template.id] || 0]}
                alt="Template preview"
                className="w-full h-full object-cover"
              />
              <IconButton
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSliderPrev(template.id, template.images!.length);
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                sx={{ bgcolor: "rgba(255,255,255,0.8)", "&:hover": { bgcolor: "#fff" } }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 19l-7-7 7-7"/>
                </svg>
              </IconButton>
              <IconButton
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSliderNext(template.id, template.images!.length);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                sx={{ bgcolor: "rgba(255,255,255,0.8)", "&:hover": { bgcolor: "#fff" } }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 5l7 7-7 7"/>
                </svg>
              </IconButton>
            </div>
          )}

          <div className="p-8">
            {/* Icons row */}
            <div className="flex items-center gap-3 mb-8">
              {template.icons.map((icon, idx) => (
                <div
                  key={idx}
                  className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700"
                >
                  {icon}
                </div>
              ))}
              {template.moreCount && (
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-300 bg-white text-sm font-semibold text-gray-700">
                  +{template.moreCount}
                </div>
              )}
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
              {template.title}
            </h3>

            {/* Image Gallery (Template 2) */}
            {template.imageStyle === "gallery" && template.images && template.images.length > 0 && (
              <div className="mb-6 flex gap-2">
                {template.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(img);
                    }}
                    className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 hover:border-gray-400 transition-colors"
                  >
                    <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Footer: Chips and Installs */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                {template.chips.map((chip, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-3 py-1 rounded-full border border-gray-300 bg-white text-xs font-medium text-gray-700"
                  >
                    {chip}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600 whitespace-nowrap">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20M12 20l-7-7M12 20l7-7"/>
                </svg>
                <span className="font-medium">{template.installs}</span>
                <span>installs</span>
              </div>
            </div>
          </div>

          {/* Image Dialog */}
          {selectedImage && (
            <div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={() => setSelectedImage(null)}
            >
              <div className="relative bg-white rounded-lg max-w-2xl max-h-[80vh]">
                <IconButton
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4"
                  sx={{ bgcolor: "#fff", "&:hover": { bgcolor: "#f3f4f6" } }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6l-12 12M6 6l12 12"/>
                  </svg>
                </IconButton>
                <img src={selectedImage} alt="Full view" className="w-full h-auto rounded-lg" />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
