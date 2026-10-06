"use client";

import { useId, useState } from "react";
import { Modal, ModalHeader } from "@/components/ui/modal";
import { Radio } from "@/components/ui/radio";
import { Button } from "@/components/ui/button";

const categories = [
  "Spam",
  "Hate, Abuse, or Harassment",
  "Child Safety",
  "Violent Speech",
  "Graphic or Violent Media",
  "Illegal and Regulated Behaviors",
  "Impersonation",
  "Adult Sexual Content",
  "Private or Non-Consensual Content",
  "Suicide or Self-Harm",
  "Terrorism or Violent Extremism",
  "Civic Integrity",
];

export function ReportModal({ onClose }: { onClose: () => void }) {
  const titleId = useId();
  const [choice, setChoice] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  return (
    <Modal labelledBy={titleId} size="fixed" onClose={onClose}>
      <ModalHeader onClose={onClose} />
      {sent ? (
        <div className="flex flex-col px-8 pt-4">
          <h1 id={titleId} className="text-[23px] leading-7 font-bold">
            Thanks for letting us know
          </h1>
          <p className="mt-2 text-base text-muted">
            Your report helps keep X safe. This clone doesn’t send reports
            anywhere.
          </p>
          <Button size="lg" onClick={onClose} className="mt-8 h-13">
            Done
          </Button>
        </div>
      ) : (
        <>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="px-8 pt-2 pb-4">
              <h1 id={titleId} className="text-[23px] leading-7 font-bold">
                What are you reporting?
              </h1>
              <p className="mt-2 text-base text-muted">
                Please choose the category that best describes your issue.
              </p>
            </div>
            <div role="radiogroup" aria-labelledby={titleId}>
              {categories.map((category) => (
                <Radio
                  key={category}
                  name="report-category"
                  label={category}
                  checked={choice === category}
                  onChange={() => setChoice(category)}
                />
              ))}
            </div>
            <p className="px-8 py-4 text-sm text-muted">
              You can learn more about our policies and additional reporting
              options in our{" "}
              <a
                href="https://help.x.com/en/rules-and-policies/x-report-violation"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                Help Center
              </a>
              .
            </p>
          </div>
          <div className="border-t border-border px-8 py-6">
            <Button
              size="lg"
              disabled={!choice}
              onClick={() => setSent(true)}
              className="h-13 w-full"
            >
              Next
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}
