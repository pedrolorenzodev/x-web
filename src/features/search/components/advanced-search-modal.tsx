"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FloatingLabelInput,
  FloatingLabelSelect,
} from "@/components/ui/floating-label-field";
import { CalendarIcon } from "@/components/ui/icons";
import { IconButton } from "@/components/ui/icon-button";
import { Modal, ModalHeader } from "@/components/ui/modal";
import { Radio } from "@/components/ui/radio";
import {
  useRouteModalClose,
  type RouteModalDismiss,
} from "@/hooks/use-route-modal-close";
import { saveRecentQuery } from "@/features/search/api/recent-searches";
import {
  advancedSearchResultsHref,
  buildAdvancedQuery,
  createAdvancedSearchFields,
  searchLanguages,
  type AdvancedSearchFields,
  type SearchDate,
} from "@/features/search/utils/advanced-search";

const FIRST_YEAR = 2006;
const LAST_YEAR = 2026;

const months = [
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
].map((label, index) => ({ value: String(index + 1), label }));

const days = Array.from({ length: 31 }, (_, index) => {
  const value = String(index + 1);
  return { value, label: value };
});

const years = Array.from({ length: LAST_YEAR - FIRST_YEAR + 1 }, (_, index) => {
  const value = String(LAST_YEAR - index);
  return { value, label: value };
});

type TextField = Exclude<
  keyof AdvancedSearchFields,
  | "includeReplies"
  | "onlyReplies"
  | "includeLinks"
  | "onlyLinks"
  | "since"
  | "until"
>;

type FieldSpec = {
  name: TextField;
  label: string;
  hint: string;
  numeric?: boolean;
};

const wordFields: FieldSpec[] = [
  {
    name: "allWords",
    label: "All of these words",
    hint: "Example: what’s happening · contains both “what’s” and “happening”",
  },
  {
    name: "exactPhrase",
    label: "This exact phrase",
    hint: "Example: happy hour · contains the exact phrase “happy hour”",
  },
  {
    name: "anyWords",
    label: "Any of these words",
    hint: "Example: cats dogs · contains either “cats” or “dogs” (or both)",
  },
  {
    name: "noneWords",
    label: "None of these words",
    hint: "Example: cats dogs · does not contain “cats” and does not contain “dogs”",
  },
  {
    name: "hashtags",
    label: "These hashtags",
    hint: "Example: #ThrowbackThursday · contains the hashtag #ThrowbackThursday",
  },
];

const accountFields: FieldSpec[] = [
  {
    name: "fromAccounts",
    label: "From these accounts",
    hint: "Example: @X · sent from @X",
  },
  {
    name: "toAccounts",
    label: "To these accounts",
    hint: "Example: @X · sent in reply to @X",
  },
  {
    name: "mentionedAccounts",
    label: "Mentioning these accounts",
    hint: "Example: @SFBART @Caltrain · mentions @SFBART or mentions @Caltrain",
  },
];

const engagementFields: FieldSpec[] = [
  {
    name: "minReplies",
    label: "Minimum replies",
    hint: "Example: 280 · posts with at least 280 replies",
    numeric: true,
  },
  {
    name: "minLikes",
    label: "Minimum Likes",
    hint: "Example: 280 · posts with at least 280 Likes",
    numeric: true,
  },
  {
    name: "minReposts",
    label: "Minimum reposts",
    hint: "Example: 280 · posts with at least 280 reposts",
    numeric: true,
  },
];

function SectionTitle({ children }: { children: ReactNode }) {
  return <h3 className="px-4 py-3 text-xl font-extrabold">{children}</h3>;
}

type DateFieldProps = {
  label: string;
  value: SearchDate;
  onChange: (value: SearchDate) => void;
};

function DateField({ label, value, onChange }: DateFieldProps) {
  const pickerRef = useRef<HTMLInputElement>(null);
  const iso =
    value.year && value.month && value.day
      ? `${value.year}-${value.month.padStart(2, "0")}-${value.day.padStart(2, "0")}`
      : "";

  return (
    <div className="px-4 py-3">
      <p className="text-base text-muted">{label}</p>
      <div className="mt-1 flex items-center gap-3">
        <FloatingLabelSelect
          label="Month"
          value={value.month}
          options={months}
          onChange={(month) => onChange({ ...value, month })}
          className="flex-[2.25]"
        />
        <FloatingLabelSelect
          label="Day"
          value={value.day}
          options={days}
          onChange={(day) => onChange({ ...value, day })}
          className="flex-1"
        />
        <FloatingLabelSelect
          label="Year"
          value={value.year}
          options={years}
          onChange={(year) => onChange({ ...value, year })}
          className="flex-[1.2]"
        />
        <div className="relative">
          <IconButton
            label="Calendar"
            tone="plain"
            onClick={() => pickerRef.current?.showPicker()}
            className="size-[52px] text-foreground"
          >
            <CalendarIcon className="size-[22px]" />
          </IconButton>
          <input
            ref={pickerRef}
            type="date"
            tabIndex={-1}
            aria-hidden
            value={iso}
            onChange={(event) => {
              const [year, month, day] = event.target.value.split("-");
              if (!year || !month || !day) return;
              onChange({
                year,
                month: String(Number(month)),
                day: String(Number(day)),
              });
            }}
            className="pointer-events-none absolute inset-0 opacity-0 [color-scheme:dark]"
          />
        </div>
      </div>
    </div>
  );
}

type ContentFilterProps = {
  title: string;
  include: boolean;
  only: boolean;
  includeLabel: string;
  onlyLabel: string;
  onIncludeChange: (include: boolean) => void;
  onOnlyChange: (only: boolean) => void;
};

function ContentFilter({
  title,
  include,
  only,
  includeLabel,
  onlyLabel,
  onIncludeChange,
  onOnlyChange,
}: ContentFilterProps) {
  return (
    <div>
      <label className="flex h-14 cursor-pointer items-center justify-between px-4">
        <span className="text-base font-bold">{title}</span>
        <Checkbox
          checked={include}
          onChange={(event) => onIncludeChange(event.target.checked)}
          className="-mr-2"
        />
      </label>
      {include ? (
        <div className="px-4 pb-2">
          <Radio
            variant="compact"
            name={title}
            label={includeLabel}
            checked={!only}
            onChange={() => onOnlyChange(false)}
            className="py-2"
          />
          <Radio
            variant="compact"
            name={title}
            label={onlyLabel}
            checked={only}
            onChange={() => onOnlyChange(true)}
            className="py-2"
          />
        </div>
      ) : null}
    </div>
  );
}

type AdvancedSearchModalProps = {
  query: string;
  dismiss: RouteModalDismiss;
};

export function AdvancedSearchModal({ query, dismiss }: AdvancedSearchModalProps) {
  const router = useRouter();
  const close = useRouteModalClose(dismiss);
  const [fields, setFields] = useState(() => createAdvancedSearchFields(query));
  const builtQuery = buildAdvancedQuery(fields);

  function update(change: Partial<AdvancedSearchFields>) {
    setFields((current) => ({ ...current, ...change }));
  }

  function search() {
    if (!builtQuery) return;
    saveRecentQuery(builtQuery);
    router.push(advancedSearchResultsHref(builtQuery));
  }

  function renderField({ name, label, hint, numeric }: FieldSpec) {
    return (
      <div key={name} className="px-4 py-3">
        <FloatingLabelInput
          label={label}
          name={name}
          value={fields[name]}
          inputMode={numeric ? "numeric" : undefined}
          onChange={(value) =>
            update({ [name]: numeric ? value.replace(/\D/g, "") : value })
          }
        />
        <p className="px-2 pt-1 text-xs text-muted">{hint}</p>
      </div>
    );
  }

  return (
    <Modal
      label="Advanced search"
      size="fixed"
      onClose={close}
      className="bg-elevated"
    >
      <ModalHeader
        onClose={close}
        title="Advanced search"
        className="bg-elevated/85"
        action={
          <Button size="sm" disabled={!builtQuery} onClick={search}>
            Search
          </Button>
        }
      />
      <form
        onSubmit={(event) => {
          event.preventDefault();
          search();
        }}
        className="min-h-0 flex-1 overflow-y-auto pb-6"
      >
        <SectionTitle>Words</SectionTitle>
        {wordFields.map(renderField)}
        <div className="px-4 py-3">
          <FloatingLabelSelect
            label="Language"
            value={fields.language}
            options={searchLanguages}
            onChange={(language) => update({ language })}
          />
        </div>

        <SectionTitle>Accounts</SectionTitle>
        {accountFields.map(renderField)}

        <SectionTitle>Filters</SectionTitle>
        <ContentFilter
          title="Replies"
          include={fields.includeReplies}
          only={fields.onlyReplies}
          includeLabel="Include replies and original posts"
          onlyLabel="Only show replies"
          onIncludeChange={(includeReplies) => update({ includeReplies })}
          onOnlyChange={(onlyReplies) => update({ onlyReplies })}
        />
        <ContentFilter
          title="Links"
          include={fields.includeLinks}
          only={fields.onlyLinks}
          includeLabel="Include posts with links"
          onlyLabel="Only show posts with links"
          onIncludeChange={(includeLinks) => update({ includeLinks })}
          onOnlyChange={(onlyLinks) => update({ onlyLinks })}
        />

        <SectionTitle>Engagement</SectionTitle>
        {engagementFields.map(renderField)}

        <SectionTitle>Dates</SectionTitle>
        <DateField
          label="From"
          value={fields.since}
          onChange={(since) => update({ since })}
        />
        <DateField
          label="To"
          value={fields.until}
          onChange={(until) => update({ until })}
        />
        <button type="submit" hidden />
      </form>
    </Modal>
  );
}
