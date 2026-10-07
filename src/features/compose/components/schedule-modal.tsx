"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { routes } from "@/config/routes";
import { Button } from "@/components/ui/button";
import {
  FloatingLabelSelect,
  type FloatingLabelOption,
} from "@/components/ui/floating-label-field";
import { CalendarIcon, ClockIcon, ScheduleIcon } from "@/components/ui/icons";
import { IconButton } from "@/components/ui/icon-button";
import { Modal, ModalHeader } from "@/components/ui/modal";
import {
  formatScheduleDate,
  formatTimeZoneName,
} from "@/features/compose/utils/format-schedule";
import { cn } from "@/lib/utils";

const DEFAULT_LEAD_MS = 60 * 60 * 1000;
const YEARS_AHEAD = 2;

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

type Parts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  pm: boolean;
};

function toParts(date: Date): Parts {
  const hours = date.getHours();
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
    hour: hours % 12 === 0 ? 12 : hours % 12,
    minute: date.getMinutes(),
    pm: hours >= 12,
  };
}

function toDate({ year, month, day, hour, minute, pm }: Parts) {
  const hours = (hour % 12) + (pm ? 12 : 0);
  return new Date(year, month, day, hours, minute);
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function numberOptions(from: number, to: number, pad = false) {
  return Array.from({ length: to - from + 1 }, (_, index) => {
    const value = from + index;
    return {
      value: String(value),
      label: pad ? String(value).padStart(2, "0") : String(value),
    };
  });
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

type ScheduleModalProps = {
  value: string | null;
  onConfirm: (scheduledAt: string) => void;
  onClear: () => void;
  onClose: () => void;
};

export function ScheduleModal({
  value,
  onConfirm,
  onClear,
  onClose,
}: ScheduleModalProps) {
  const [now] = useState(() => new Date());
  const [parts, setParts] = useState(() =>
    toParts(value ? new Date(value) : new Date(now.getTime() + DEFAULT_LEAD_MS)),
  );
  const dateInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);

  const date = toDate(parts);
  const inPast = date.getTime() <= now.getTime();

  function update(change: Partial<Parts>) {
    setParts((current) => {
      const next = { ...current, ...change };
      return { ...next, day: Math.min(next.day, daysInMonth(next.year, next.month)) };
    });
  }

  const monthOptions: FloatingLabelOption[] = monthNames.map((name, index) => ({
    value: String(index),
    label: name,
  }));

  return (
    <Modal
      label="Schedule"
      placement="top"
      onClose={onClose}
      restoreFocusOnUnmount
      className="bg-elevated"
    >
      <ModalHeader
        onClose={onClose}
        title="Schedule"
        className="bg-elevated/85"
        action={
          <Button
            size="sm"
            disabled={inPast}
            onClick={() => onConfirm(date.toISOString())}
          >
            {value ? "Update" : "Confirm"}
          </Button>
        }
      />

      <div className="overflow-y-auto px-4 pb-4">
        <p
          className={cn(
            "flex items-center gap-3 py-3 text-xs",
            inPast ? "text-danger" : "text-muted",
          )}
        >
          <ScheduleIcon className="size-[18px] shrink-0" />
          {inPast
            ? "You can’t schedule a post to send in the past."
            : `Will send on ${formatScheduleDate(date)}`}
        </p>

        <h3 className="mt-1 text-base text-muted">Date</h3>
        <div className="mt-1 flex items-center gap-3">
          <FloatingLabelSelect
            label="Month"
            value={String(parts.month)}
            options={monthOptions}
            onChange={(month) => update({ month: Number(month) })}
            className="flex-[2.25]"
          />
          <FloatingLabelSelect
            label="Day"
            value={String(parts.day)}
            options={numberOptions(1, daysInMonth(parts.year, parts.month))}
            onChange={(day) => update({ day: Number(day) })}
            className="flex-1"
          />
          <FloatingLabelSelect
            label="Year"
            value={String(parts.year)}
            options={numberOptions(now.getFullYear(), now.getFullYear() + YEARS_AHEAD)}
            onChange={(year) => update({ year: Number(year) })}
            className="flex-[1.2]"
          />
          <div className="relative">
            <IconButton
              label="Calendar"
              tone="plain"
              onClick={() => dateInputRef.current?.showPicker()}
              className="size-[52px] text-foreground"
            >
              <CalendarIcon className="size-[22px]" />
            </IconButton>
            <input
              ref={dateInputRef}
              type="date"
              tabIndex={-1}
              aria-hidden
              value={`${parts.year}-${pad(parts.month + 1)}-${pad(parts.day)}`}
              onChange={(event) => {
                const [year, month, day] = event.target.value
                  .split("-")
                  .map(Number);
                if (year && month && day) update({ year, month: month - 1, day });
              }}
              className="pointer-events-none absolute inset-0 opacity-0 [color-scheme:dark]"
            />
          </div>
        </div>

        <h3 className="mt-4 text-base text-muted">Time</h3>
        <div className="mt-1 flex items-center gap-3">
          <FloatingLabelSelect
            label="Hour"
            value={String(parts.hour)}
            options={numberOptions(1, 12)}
            onChange={(hour) => update({ hour: Number(hour) })}
            className="flex-1"
          />
          <FloatingLabelSelect
            label="Minute"
            value={String(parts.minute)}
            options={numberOptions(0, 59, true)}
            onChange={(minute) => update({ minute: Number(minute) })}
            className="flex-1"
          />
          <FloatingLabelSelect
            label="AM/PM"
            value={parts.pm ? "PM" : "AM"}
            options={[
              { value: "AM", label: "AM" },
              { value: "PM", label: "PM" },
            ]}
            onChange={(period) => update({ pm: period === "PM" })}
            className="flex-1"
          />
          <div className="relative">
            <IconButton
              label="Time picker"
              tone="plain"
              onClick={() => timeInputRef.current?.showPicker()}
              className="size-[52px] text-foreground"
            >
              <ClockIcon className="size-[22px]" />
            </IconButton>
            <input
              ref={timeInputRef}
              type="time"
              tabIndex={-1}
              aria-hidden
              value={`${pad((parts.hour % 12) + (parts.pm ? 12 : 0))}:${pad(parts.minute)}`}
              onChange={(event) => {
                const [hours, minute] = event.target.value.split(":").map(Number);
                if (Number.isNaN(hours) || Number.isNaN(minute)) return;
                update({
                  hour: hours % 12 === 0 ? 12 : hours % 12,
                  minute,
                  pm: hours >= 12,
                });
              }}
              className="pointer-events-none absolute inset-0 opacity-0 [color-scheme:dark]"
            />
          </div>
        </div>

        <h3 className="mt-4 text-base text-muted">Time zone</h3>
        <p className="mt-1 text-lg">{formatTimeZoneName(date)}</p>
      </div>

      <div className="flex h-[49px] shrink-0 items-center justify-between border-t border-border px-4">
        <Link
          href={routes.composeScheduled}
          onClick={onClose}
          className="flex h-8 items-center rounded-full px-3 text-sm font-bold text-accent transition-colors duration-200 ease-[ease] hover:bg-accent/10"
        >
          Scheduled posts
        </Link>
        {value ? (
          <button
            type="button"
            onClick={onClear}
            className="flex h-8 items-center rounded-full px-3 text-sm font-bold text-accent transition-colors duration-200 ease-[ease] hover:bg-accent/10"
          >
            Clear
          </button>
        ) : null}
      </div>
    </Modal>
  );
}
