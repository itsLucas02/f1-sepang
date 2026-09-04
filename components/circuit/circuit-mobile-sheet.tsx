"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { CircuitInfoPanel } from "@/components/circuit/circuit-info-panel";
import type { SepangHotspot } from "@/content/sepang";
import type { TourMode } from "@/lib/sepang";

type CircuitMobileSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hotspot: SepangHotspot;
  tourMode: TourMode;
  sepangReady: boolean;
  hasNextHotspot: boolean;
  onNextHotspot: () => void;
};

export function CircuitMobileSheet({
  open,
  onOpenChange,
  hotspot,
  tourMode,
  sepangReady,
  hasNextHotspot,
  onNextHotspot,
}: CircuitMobileSheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/72 backdrop-blur-sm lg:hidden" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 z-[90] max-h-[86dvh] overflow-y-auto border-t border-white/18 bg-[#0a0a0c] shadow-[0_-24px_70px_rgba(0,0,0,0.65)] focus:outline-none lg:hidden">
          <Dialog.Title className="sr-only">
            {hotspot.title} circuit details
          </Dialog.Title>

          <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-[#0a0a0c]/96 px-5 py-3 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="h-1 w-10 rounded-full bg-white/18" aria-hidden="true" />
              <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-white/38">
                Interactive circuit explorer
              </span>
            </div>
            <Dialog.Close
              aria-label="Close circuit details"
              className="inline-flex size-10 items-center justify-center border border-white/14 text-white transition-colors hover:border-white/35 hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X aria-hidden="true" className="size-4" />
            </Dialog.Close>
          </div>

          <CircuitInfoPanel
            hotspot={hotspot}
            tourMode={tourMode}
            sepangReady={sepangReady}
            hasNextHotspot={hasNextHotspot}
            onNextHotspot={onNextHotspot}
            variant="mobile"
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
