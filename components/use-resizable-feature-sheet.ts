"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent, type CSSProperties } from "react";

type DragState = { pointerId: number; startY: number; startHeight: number };

function bounds(viewportHeight: number) {
  const maxHeight = Math.min(viewportHeight, viewportHeight * 0.7);
  const minHeight = Math.min(maxHeight, Math.max(160, viewportHeight * 0.2));
  return { minHeight, maxHeight, defaultHeight: Math.min(viewportHeight * 0.45, 380) };
}

/**
 * The Photo Editor's accessible mobile feature-sheet resize interaction,
 * shared by the Audio and Video workbenches. Desktop layout remains owned
 * by the consuming editor.
 */
export function useResizableFeatureSheet() {
  const panelElementRef = useRef<HTMLElement | null>(null);
  const panelRef = useCallback((node: HTMLElement | null) => { panelElementRef.current = node; }, []);
  const dragRef = useRef<DragState | null>(null);
  const [sheetHeight, setSheetHeight] = useState<number | null>(null);
  const [viewportHeight, setViewportHeight] = useState(800);

  const resizeTo = useCallback((height: number) => {
    const { minHeight, maxHeight } = bounds(window.innerHeight);
    setSheetHeight(Math.min(maxHeight, Math.max(minHeight, height)));
  }, []);

  useEffect(() => {
    const updateViewport = () => {
      const height = window.innerHeight;
      setViewportHeight(height);
      setSheetHeight((current) => {
        if (current === null) return null;
        const { minHeight, maxHeight } = bounds(height);
        return Math.min(maxHeight, Math.max(minHeight, current));
      });
    };
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const onPointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || !panelElementRef.current) return;
    const { defaultHeight } = bounds(window.innerHeight);
    dragRef.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
      startHeight: sheetHeight ?? panelElementRef.current.getBoundingClientRect().height ?? defaultHeight,
    };
    setSheetHeight(dragRef.current.startHeight);
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  }, [sheetHeight]);

  const onPointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    resizeTo(drag.startHeight + drag.startY - event.clientY);
    event.preventDefault();
  }, [resizeTo]);

  const onPointerUp = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }, []);

  const onKeyDown = useCallback((event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const { minHeight, maxHeight, defaultHeight } = bounds(window.innerHeight);
    const current = sheetHeight ?? panelElementRef.current?.getBoundingClientRect().height ?? defaultHeight;
    if (event.key === "Home") resizeTo(minHeight);
    else if (event.key === "End") resizeTo(maxHeight);
    else resizeTo(current + (event.key === "ArrowUp" ? 32 : -32));
  }, [resizeTo, sheetHeight]);

  const { minHeight, maxHeight, defaultHeight } = bounds(viewportHeight);
  const panelStyle = { "--feature-panel-height": sheetHeight === null ? "min(45dvh, 380px)" : `${sheetHeight}px` } as CSSProperties;

  return {
    panelRef,
    panelStyle,
    sheetHeight,
    resizeHandleProps: {
      role: "slider" as const,
      "aria-label": "Resize editing panel",
      "aria-orientation": "vertical" as const,
      "aria-valuemin": Math.round(minHeight),
      "aria-valuemax": Math.round(maxHeight),
      "aria-valuenow": Math.round(sheetHeight ?? defaultHeight),
      tabIndex: 0,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
      onKeyDown,
    },
  };
}
