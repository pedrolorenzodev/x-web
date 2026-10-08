"use client";

import { useState } from "react";
import { FloatingLabelSelect } from "@/components/ui/floating-label-field";
import {
  InfoIcon,
  LockIcon,
  ScheduleIcon,
  SpacesIcon,
} from "@/components/ui/icons";
import { Modal, ModalHeader } from "@/components/ui/modal";
import { Switch } from "@/components/ui/switch";
import {
  useRouteModalClose,
  type RouteModalDismiss,
} from "@/hooks/use-route-modal-close";
import {
  speakerOptions,
  spacesHelpUrl,
  spacesUnavailableMessage,
} from "@/features/spaces/config/spaces";

export function CreateSpaceModal({ dismiss }: { dismiss: RouteModalDismiss }) {
  const close = useRouteModalClose(dismiss);
  const [speakers, setSpeakers] = useState(speakerOptions[0].value);
  const [topic, setTopic] = useState("");
  const [record, setRecord] = useState(false);

  return (
    <Modal
      label="Create your Space"
      onClose={close}
      className="h-auto min-h-0 max-[702px]:h-full"
    >
      <ModalHeader onClose={close} />
      <div className="flex justify-center">
        <SpacesIcon className="size-12 text-[rgb(120_86_255)]" />
      </div>
      <div className="flex flex-col p-8 max-[702px]:px-5">
        <h2 className="text-[26px] leading-8 font-bold">Create your Space</h2>
        <FloatingLabelSelect
          label="Who can speak?"
          value={speakers}
          options={speakerOptions}
          onChange={setSpeakers}
          className="mt-4"
        />
        <input
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
          placeholder="What do you want to talk about?"
          aria-label="What do you want to talk about?"
          className="mt-4 h-11 w-full rounded-full border border-border-strong bg-transparent px-4 text-base outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted focus:border-accent focus:shadow-[0_0_0_1px_var(--color-accent)]"
        />
        <div className="mt-4 flex items-center justify-between">
          <span className="flex items-center gap-1 text-base">
            Record Space
            <span className="flex size-6 items-center justify-center text-accent">
              <InfoIcon className="size-4" />
            </span>
          </span>
          <Switch
            size="sm"
            label="Record Space"
            checked={record}
            onChange={setRecord}
          />
        </div>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            disabled
            className="flex h-11 flex-1 items-center justify-center rounded-full bg-accent text-base font-bold text-white disabled:opacity-50"
          >
            Start now
          </button>
          <button
            type="button"
            aria-label="Schedule Space"
            disabled
            className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border-strong text-accent disabled:opacity-50"
          >
            <ScheduleIcon className="size-[22px]" />
          </button>
        </div>
        <p className="mt-3 flex items-center justify-center gap-1 text-xs text-muted">
          <LockIcon className="size-4 shrink-0" />
          {spacesUnavailableMessage}
        </p>
        <a
          href={spacesHelpUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex h-9 items-center justify-center rounded-full text-base font-bold text-accent transition-colors duration-200 ease-[ease] hover:bg-accent/10"
        >
          Get to know Spaces
        </a>
      </div>
    </Modal>
  );
}
