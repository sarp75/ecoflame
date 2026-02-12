"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export const BackgroundRippleEffect = ({
  cellSize = 56,
  className,
  fixed = true,
}: {
  cellSize?: number;
  className?: string;
  fixed?: boolean;
}) => {
  const [clickedCell, setClickedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const [rippleKey, setRippleKey] = useState(0);
  const [dimensions, setDimensions] = useState({ rows: 0, cols: 0 });
  const [isDark, setIsDark] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  // Detect dark mode properly
  useEffect(() => {
    const updateDark = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    updateDark();

    const observer = new MutationObserver(updateDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateDimensions = () => {
      const rows = Math.ceil(window.innerHeight / cellSize) + 2;
      const cols = Math.ceil(window.innerWidth / cellSize) + 2;
      setDimensions({ rows, cols });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [cellSize]);

  if (dimensions.rows === 0 || dimensions.cols === 0) {
    return null;
  }

  // Real colors, no CSS vars
  const borderColor = isDark ? "#3f3f46" : "#d4d4d8"; // neutral-700 / 300
  const fillColor = isDark ? "#0a0a0a" : "#f5f5f5"; // neutral-950 / 100
  const shadowColor = isDark ? "#262626" : "#737373"; // darker neutral / 500

  return (
    <div
      ref={ref}
      className={cn(
        "pointer-events-none inset-0 z-0 h-full w-full overflow-hidden cursor-default",
        fixed ? "fixed" : "absolute",
        className,
      )}
    >
      <div className="relative h-full w-full">
        <DivGrid
          key={`base-${rippleKey}`}
          className="mask-radial-from-20% mask-radial-at-top opacity-60"
          rows={dimensions.rows}
          cols={dimensions.cols}
          cellSize={cellSize}
          borderColor={borderColor}
          fillColor={fillColor}
          shadowColor={shadowColor}
          clickedCell={clickedCell}
          onCellClick={(row, col) => {
            setClickedCell({ row, col });
            setRippleKey((k) => k + 1);
          }}
          interactive
        />
      </div>
    </div>
  );
};

type DivGridProps = {
  className?: string;
  rows: number;
  cols: number;
  cellSize: number;
  borderColor: string;
  fillColor: string;
  shadowColor: string;
  clickedCell: { row: number; col: number } | null;
  onCellClick?: (row: number, col: number) => void;
  interactive?: boolean;
};

const DivGrid = ({
  className,
  rows,
  cols,
  cellSize,
  borderColor,
  fillColor,
  shadowColor,
  clickedCell,
  onCellClick = () => {},
  interactive = true,
}: DivGridProps) => {
  const cells = useMemo(
    () => Array.from({ length: rows * cols }, (_, idx) => idx),
    [rows, cols],
  );

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
    gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
    width: cols * cellSize,
    height: rows * cellSize,
  };

  return (
    <div className={cn("absolute inset-0", className)} style={gridStyle}>
      {cells.map((idx) => {
        const rowIdx = Math.floor(idx / cols);
        const colIdx = idx % cols;

        const distance = clickedCell
          ? Math.hypot(clickedCell.row - rowIdx, clickedCell.col - colIdx)
          : 0;

        const delay = clickedCell ? Math.max(0, distance * 55) : 0;
        const duration = 200 + distance * 80;

        const animationStyle: React.CSSProperties = clickedCell
          ? {
              animationDelay: `${delay}ms`,
              animationDuration: `${duration}ms`,
            }
          : {};

        return (
          <div
            key={idx}
            className={cn(
              "cell relative border-[0.5px] opacity-40 transition-opacity duration-150 will-change-transform hover:opacity-80",
              clickedCell && "animate-cell-ripple",
              interactive ? "pointer-events-auto" : "pointer-events-none",
            )}
            style={{
              backgroundColor: fillColor,
              borderColor: borderColor,
              boxShadow: `0 0 40px 1px ${shadowColor} inset`,
              ...animationStyle,
            }}
            onClick={
              interactive ? () => onCellClick(rowIdx, colIdx) : undefined
            }
          />
        );
      })}
    </div>
  );
};
