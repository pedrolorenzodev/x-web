import {
  useId,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { cn } from "@/lib/utils";
import { PHONE_COUNTRIES, type PhoneCountry } from "@/config/phone-countries";
import { SearchIcon, SelectChevronIcon } from "@/components/ui/icons";
import { useEscapeToClose } from "@/features/auth/hooks/use-escape-to-close";
import { countryFlag } from "@/features/auth/utils/country-flag";

type CountryPickerProps = {
  country: PhoneCountry;
  onSelect: (country: PhoneCountry) => void;
};

function matchesQuery(country: PhoneCountry, query: string) {
  const value = query.trim().toLowerCase();
  if (!value) return true;
  return (
    country.name.toLowerCase().includes(value) ||
    country.dialCode.includes(value.replace(/^\+?/, "+"))
  );
}

export function CountryPicker({ country, onSelect }: CountryPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const countries = PHONE_COUNTRIES.filter((item) => matchesQuery(item, query));

  function close() {
    setOpen(false);
    setQuery("");
  }

  useEscapeToClose(
    open,
    () => {
      close();
      buttonRef.current?.focus();
    },
    { capture: true },
  );

  function toggle() {
    if (open) close();
    else setOpen(true);
  }

  function select(next: PhoneCountry) {
    close();
    onSelect(next);
  }

  function options() {
    return Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>("[role=option]") ?? [],
    );
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const items = options();
    const index = items.indexOf(document.activeElement as HTMLButtonElement);
    const step = event.key === "ArrowDown" ? 1 : -1;
    items[Math.min(items.length - 1, Math.max(0, index + step))]?.focus();
  }

  function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    event.preventDefault();
    if (countries[0]) select(countries[0]);
  }

  function preventLabelActivation(event: MouseEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  function closeFromOverlay(event: MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    close();
  }

  function keepFocusInSearch(event: MouseEvent<HTMLDivElement>) {
    if (event.target !== searchRef.current) event.preventDefault();
  }

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    const next = event.relatedTarget;
    if (open && next && !event.currentTarget.contains(next)) close();
  }

  return (
    <div onBlur={handleBlur} className="relative">
      {open ? (
        <div
          aria-hidden
          onClick={closeFromOverlay}
          className="fixed inset-0"
        />
      ) : null}
      <button
        ref={buttonRef}
        type="button"
        aria-label={`Select country, currently ${country.name} ${country.dialCode}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={toggle}
        className="relative flex items-center gap-1 whitespace-nowrap text-auth-country outline-none focus-visible:z-[1] focus-visible:outline-offset-4 focus-visible:[outline:auto_var(--color-accent)]"
      >
        <span className="w-[1em]">{countryFlag(country.code)}</span>
        <span className="ms-[6.4px] text-[14px]">{country.dialCode}</span>
        <SelectChevronIcon className="size-3" />
      </button>
      {open ? (
        <div
          onKeyDown={handleKeyDown}
          onClick={preventLabelActivation}
          onMouseDown={keepFocusInSearch}
          className="absolute start-0 top-[calc(100%+4px)] flex max-narrow:z-10 max-h-[400px] min-w-[320px] cursor-default flex-col overflow-hidden rounded-lg border border-auth-menu-border bg-auth-menu shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)]"
        >
          <div className="flex items-center gap-2 border-b border-auth-menu-border bg-auth-menu p-3">
            <SearchIcon className="size-5 shrink-0 text-auth-eye" />
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(event) => setQuery(event.currentTarget.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search"
              aria-label="Search countries"
              aria-controls={listId}
              autoFocus
              className="min-w-0 flex-1 bg-transparent p-0 text-[14px] leading-5 text-white outline-none placeholder:text-white"
            />
          </div>
          <div
            ref={listRef}
            id={listId}
            role="listbox"
            aria-label="Countries"
            className="max-h-[340px] overflow-y-auto bg-auth-menu"
          >
            {countries.length === 0 ? (
              <p className="p-6 text-center text-[14px] text-auth-subtle">
                No results found
              </p>
            ) : (
              countries.map((item) => {
                const selected = item.code === country.code;
                return (
                  <button
                    key={item.code}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => select(item)}
                    className={cn(
                      "flex w-full items-center gap-3 p-3 text-start text-white transition-[background-color] duration-150 ease-[ease] hover:bg-transparent",
                      selected ? "bg-transparent" : "bg-auth-menu",
                    )}
                  >
                    <span className="w-[1em] shrink-0">{countryFlag(item.code)}</span>
                    <span className="flex-1 text-start text-[14px]">{item.name}</span>
                    <span className="ms-[6.4px] flex-1 text-end text-[14px]">
                      {item.dialCode}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
