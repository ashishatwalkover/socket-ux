"use client";

import { useState } from "react";
import LoopIcon from "@mui/icons-material/Loop";
import CloseIcon from "@mui/icons-material/Close";
import {
  Popover,
  Typography,
  Box,
  Button,
  Drawer,
  IconButton,
  Divider,
} from "@mui/material";

export default function LoopIconWithPopover() {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const open = Boolean(anchorEl);

  return (
    <>
      <button
        type="button"
        className="hover:text-gray-900"
        title="Refresh"
        onMouseEnter={(e) => setAnchorEl(e.currentTarget)}
        onMouseLeave={() => setAnchorEl(null)}
      >
        <LoopIcon sx={{ fontSize: 16 }} />
      </button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        onMouseEnter={() => setAnchorEl(anchorEl)}
        onMouseLeave={() => setAnchorEl(null)}
      >
        <Box sx={{ p: 2, width: 320 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, textAlign: "center" }}>
            How a Loop Works
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 1.5 }}>
            <svg width="300" height="210" viewBox="0 0 320 210" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <marker id="arrowGreen" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                </marker>
                <marker id="arrowBlue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#6366f1" />
                </marker>
                <path id="loopMotion" d="M 195 28 L 195 172" fill="none" />
              </defs>

              <rect x="140" y="10" width="110" height="36" rx="8" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.5" />
              <text x="195" y="33" textAnchor="middle" fontSize="13" fontWeight="600" fill="#065f46">Trigger</text>

              <rect x="140" y="82" width="110" height="36" rx="8" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
              <text x="195" y="105" textAnchor="middle" fontSize="13" fontWeight="600" fill="#1e3a8a">Step</text>

              <rect x="140" y="154" width="110" height="36" rx="8" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="195" y="177" textAnchor="middle" fontSize="13" fontWeight="600" fill="#78350f">Complete</text>

              <line x1="195" y1="46" x2="195" y2="78" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowGreen)" />
              <line x1="195" y1="118" x2="195" y2="150" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowGreen)" />

              <text x="50" y="14" textAnchor="middle" fontSize="11" fontWeight="600" fill="#6b7280">Data</text>
              <rect x="15" y="20" width="70" height="172" rx="8" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeDasharray="3 3" />

              <path d="M 85 28 Q 110 28 140 28" fill="none" stroke="#9ca3af" strokeWidth="1.5" markerEnd="url(#arrowGreen)" />

              {(() => {
                const items = [
                  { letter: "A", color: "#ef4444" },
                  { letter: "B", color: "#f59e0b" },
                  { letter: "C", color: "#10b981" },
                  { letter: "D", color: "#6366f1" },
                ];
                const total = 12;
                return items.map(({ letter, color }, i) => {
                  const start = i * 3;
                  const end = start + 3;
                  const k0 = (start / total).toFixed(4);
                  const k1 = (end / total).toFixed(4);
                  const fillKeyTimes =
                    i === 0 ? `0;${k1};${k1};1` : i === 3 ? `0;${k0};${k0};1` : `0;${k0};${k1};1`;
                  const fillVals =
                    i === 0
                      ? `${color};${color};#f9fafb;#f9fafb`
                      : i === 3
                      ? `#f9fafb;#f9fafb;${color};${color}`
                      : `#f9fafb;${color};#f9fafb;#f9fafb`;
                  const textVals =
                    i === 0
                      ? "#ffffff;#ffffff;#374151;#374151"
                      : i === 3
                      ? "#374151;#374151;#ffffff;#ffffff"
                      : "#374151;#ffffff;#374151;#374151";
                  const y = 28 + i * 40;
                  return (
                    <g key={`arr-${letter}`}>
                      <rect x="25" y={y} width="50" height="32" rx="6" fill="#f9fafb" stroke={color} strokeWidth="1.5">
                        <animate
                          attributeName="fill"
                          dur={`${total}s`}
                          repeatCount="indefinite"
                          calcMode="discrete"
                          keyTimes={fillKeyTimes}
                          values={fillVals}
                        />
                      </rect>
                      <text x="50" y={y + 21} textAnchor="middle" fontSize="14" fontWeight="700" fill="#374151">
                        {letter}
                        <animate
                          attributeName="fill"
                          dur={`${total}s`}
                          repeatCount="indefinite"
                          calcMode="discrete"
                          keyTimes={fillKeyTimes}
                          values={textVals}
                        />
                      </text>
                    </g>
                  );
                });
              })()}

              {[
                { letter: "A", color: "#ef4444" },
                { letter: "B", color: "#f59e0b" },
                { letter: "C", color: "#10b981" },
                { letter: "D", color: "#6366f1" },
              ].map(({ letter, color }, i) => {
                const total = 12;
                const start = i * 3;
                const end = start + 3;
                const k0 = (start / total).toFixed(4);
                const k1 = (end / total).toFixed(4);
                const keyTimes = `0;${k0};${k1};1`;
                const keyPoints = "0;0;1;1";
                const opacityValues =
                  i === 0
                    ? "1;1;0;0"
                    : i === 3
                    ? "0;0;1;1"
                    : "0;1;0;0";
                const opacityKeyTimes =
                  i === 0
                    ? `0;${k1};${k1};1`
                    : i === 3
                    ? `0;${k0};${k0};1`
                    : `0;${k0};${k1};1`;
                return (
                  <g key={letter}>
                    <circle r="11" fill={color} stroke="#fff" strokeWidth="2" opacity="0">
                      <animateMotion
                        dur={`${total}s`}
                        repeatCount="indefinite"
                        keyTimes={keyTimes}
                        keyPoints={keyPoints}
                      >
                        <mpath href="#loopMotion" />
                      </animateMotion>
                      <animate
                        attributeName="opacity"
                        dur={`${total}s`}
                        repeatCount="indefinite"
                        calcMode="discrete"
                        keyTimes={opacityKeyTimes}
                        values={opacityValues}
                      />
                    </circle>
                    <text textAnchor="middle" dy="4" fontSize="11" fontWeight="700" fill="#fff" opacity="0">
                      {letter}
                      <animateMotion
                        dur={`${total}s`}
                        repeatCount="indefinite"
                        keyTimes={keyTimes}
                        keyPoints={keyPoints}
                      >
                        <mpath href="#loopMotion" />
                      </animateMotion>
                      <animate
                        attributeName="opacity"
                        dur={`${total}s`}
                        repeatCount="indefinite"
                        calcMode="discrete"
                        keyTimes={opacityKeyTimes}
                        values={opacityValues}
                      />
                    </text>
                  </g>
                );
              })}
            </svg>
          </Box>
          <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.5, textAlign: "center" }}>
            Repeats the flow for every item in your data, then stops.
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => {
                setDrawerOpen(true);
                setAnchorEl(null);
              }}
            >
              Enable
            </Button>
          </Box>
        </Box>
      </Popover>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{ paper: { sx: { width: 400 } } }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Enable Loop
          </Typography>
          <IconButton size="small" onClick={() => setDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <Box sx={{ p: 3 }}>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
            Configure how this trigger iterates over your data. The flow will run once for each item in the source array.
          </Typography>

          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Data Source
          </Typography>
          <Box
            component="pre"
            sx={{
              bgcolor: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: 1,
              p: 1.5,
              fontSize: 12,
              fontFamily: "monospace",
              mb: 3,
            }}
          >
{`[
  { "id": "A" },
  { "id": "B" },
  { "id": "C" },
  { "id": "D" }
]`}
          </Box>

          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Settings
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 3 }}>
            <Typography variant="body2">- Run mode: <strong>Sequential</strong></Typography>
            <Typography variant="body2">- Stop on error: <strong>Yes</strong></Typography>
            <Typography variant="body2">- Max iterations: <strong>1000</strong></Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1, mt: 4 }}>
            <Button variant="outlined" fullWidth onClick={() => setDrawerOpen(false)}>
              Cancel
            </Button>
            <Button variant="contained" fullWidth onClick={() => setDrawerOpen(false)}>
              Save & Enable
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
