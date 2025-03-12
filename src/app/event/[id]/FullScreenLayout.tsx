import React, { useState, useRef } from 'react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw, Pin, Expand } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import HallLayout from '@/components/hall-layout';
import { Guest, Event } from '@/app/types/events';

interface MapComponentProps {
  event: Event | null;
  selectedGuest: Guest | null;
  showAllTables: boolean;
}

const FullScreenLayout: React.FC<MapComponentProps> = ({ event, selectedGuest, showAllTables }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const zoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.1, 3));
  const zoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.1, 1));
  const resetZoom = () => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    // Implement your drag logic here
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const deltaX = e.movementX;
      const deltaY = e.movementY;
      setPanPosition((prev) => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }));
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    // Implement your touch drag logic here
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      const touch = e.touches[0];
      const deltaX = touch.clientX - panPosition.x;
      const deltaY = touch.clientY - panPosition.y;
      setPanPosition({ x: touch.clientX, y: touch.clientY });
    }
  };

  const handleTouchEnd = () => setIsDragging(false);

  const isLargeScreen = window.innerWidth > 1024;

  if (!event) {
    return <div>Loading...</div>; // Handle case where event data is not available
  }

  return (
    <div>
      {/* Map Container */}
      <div
        ref={mapContainerRef}
        className={`relative w-full ${
          isLargeScreen ? "aspect-[2/1]" : "aspect-[16/9]"
        } mb-4 border-2 border-pink-200 rounded-lg overflow-hidden bg-white shadow-md`}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="absolute inset-0 transition-transform duration-100 ease-out"
          style={{
            transform: `scale(${zoomLevel}) translate(${panPosition.x}px, ${panPosition.y}px)`,
            transformOrigin: "center center",
          }}
        >
          {/* Use the hall layout image */}
          <HallLayout className="w-full h-full" />


          {/* Show either just the selected table or all tables */}
          {event.tables.map((table) => {
            if (
              showAllTables ||
              table.table_no === selectedGuest?.table_no
            ) {
              return (
                <div
                  key={table.table_no}
                  className={`absolute ${
                    table.table_no === selectedGuest?.table_no
                      ? "animate-bounce"
                      : ""
                  }`}
                  style={{
                    left: `${table.position_x * 100}%`,
                    top: `${table.position_y * 100}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex flex-col items-center ${
                        table.table_no === selectedGuest?.table_no
                          ? "scale-50"
                          : "scale-100"
                      }`}
                    >
                      <Pin
                        className={`h-10 w-10 drop-shadow-md ${
                          table.table_no === selectedGuest?.table_no
                            ? "text-pink-500 filter drop-shadow-lg"
                            : "text-purple-300"
                        }`}
                      />
                      <div
                        className={`
                          absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full
                          px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap shadow-md
                          ${
                            table.table_no === selectedGuest?.table_no
                              ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                              : "bg-white text-purple-600 border border-purple-200"
                          }
                        `}
                      >
                        Table #{table.table_no}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>

        {/* Zoom controls */}
        <div className="absolute bottom-2 right-2 flex flex-col gap-1 bg-white/80 p-1 rounded-lg shadow-md">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full bg-white border-pink-200 text-pink-600 hover:bg-pink-50"
                onClick={zoomIn}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Zoom in</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full bg-white border-pink-200 text-pink-600 hover:bg-pink-50"
                onClick={zoomOut}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Zoom out</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full bg-white border-pink-200 text-pink-600 hover:bg-pink-50"
                onClick={resetZoom}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Reset view</p>
            </TooltipContent>
          </Tooltip>

          {/* Expand Icon */}
          <Dialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-white border-pink-200 text-pink-600 hover:bg-pink-50"
                  >
                    <Expand className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Expand</p>
              </TooltipContent>
            </Tooltip>
            <DialogContent className="max-w-4xl">
              <div
                className="relative w-full aspect-[2/1] overflow-hidden"
                style={{ cursor: isDragging ? "grabbing" : "grab" }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div
                  className="absolute inset-0 transition-transform duration-100 ease-out"
                  style={{
                    transform: `scale(${zoomLevel}) translate(${panPosition.x}px, ${panPosition.y}px)`,
                    transformOrigin: "center center",
                  }}
                >
                  {/* Reuse the same image and pins logic */}
                  <HallLayout className="w-full h-full" />

                  {event.tables.map((table) => {
                    if (
                      showAllTables ||
                      table.table_no === selectedGuest?.table_no
                    ) {
                      return (
                        <div
                          key={table.table_no}
                          className={`absolute ${
                            table.table_no === selectedGuest?.table_no
                              ? "animate-bounce"
                              : ""
                          }`}
                          style={{
                            left: `${table.position_x * 100}%`,
                            top: `${table.position_y * 100}%`,
                            transform: "translate(-50%, -50%)",
                          }}
                        >
                          <div className="flex flex-col items-center">
                            <div
                              className={`flex flex-col items-center ${
                                table.table_no === selectedGuest?.table_no
                                  ? "scale-50"
                                  : "scale-100"
                              }`}
                            >
                              <Pin
                                className={`h-10 w-10 drop-shadow-md ${
                                  table.table_no === selectedGuest?.table_no
                                    ? "text-pink-500 filter drop-shadow-lg"
                                    : "text-purple-300"
                                }`}
                              />
                              <div
                                className={`
                                  absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full
                                  px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap shadow-md
                                  ${
                                    table.table_no === selectedGuest?.table_no
                                      ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                                      : "bg-white text-purple-600 border border-purple-200"
                                  }
                                `}
                              >
                                Table #{table.table_no}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>

              {/* Zoom controls inside the modal */}
              <div className="absolute bottom-2 right-2 flex flex-col gap-1 bg-white/80 p-1 rounded-lg shadow-md">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-white border-pink-200 text-pink-600 hover:bg-pink-50"
                      onClick={zoomIn}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>Zoom in</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-white border-pink-200 text-pink-600 hover:bg-pink-50"
                      onClick={zoomOut}
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>Zoom out</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-white border-pink-200 text-pink-600 hover:bg-pink-50"
                      onClick={resetZoom}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>Reset view</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Zoom level indicator */}
        <div className="absolute top-2 right-2 bg-white/80 px-2 py-1 rounded-md text-xs font-medium text-gray-700">
          {Math.round(zoomLevel * 100)}%
        </div>

        {/* Pan instructions */}
        {zoomLevel > 1 && (
          <div className="absolute top-2 left-2 bg-white/80 px-2 py-1 rounded-md text-xs text-gray-700">
            Drag to pan
          </div>
        )}
      </div>
    </div>
  );
};

export default FullScreenLayout;
