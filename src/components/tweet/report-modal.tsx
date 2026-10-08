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
  const progress = sent ? 100 : 33;

  return (
    <Modal labelledBy={titleId} size="fixed" onClose={onClose}>
      <ModalHeader
        onClose={onClose}
        title={sent ? "Thanks for letting us know" : "What are you reporting?"}
        titleId={titleId}
      />
      <div
        role="progressbar"
        aria-label={`${progress}% complete`}
        aria-valuenow={progress}
        className="h-[3px] shrink-0"
      >
        <div className="h-full bg-accent" style={{ width: `${progress}%` }} />
      </div>
      {sent ? (
        <div className="flex flex-col px-20 pt-7 max-[702px]:px-8">
          <p className="text-base text-muted">
            Your report helps keep X safe. This clone doesn’t send reports
            anywhere.
          </p>
          <Button size="lg" onClick={onClose} className="mt-8 h-13">
            Done
          </Button>
        </div>
      ) : (
        <>
          <div className="min-h-0 flex-1 overflow-y-auto px-20 max-[702px]:px-8">
            <p className="pt-7 pb-5 text-base text-muted">
              Please choose the category that best describes your issue.
            </p>
            <div role="radiogroup" aria-labelledby={titleId}>
              {categories.map((category) => (
                <Radio
                  key={category}
                  name="report-category"
                  label={category}
                  checked={choice === category}
                  onChange={() => setChoice(category)}
                  className="h-12 px-0 py-0 pr-2 pb-1 hover:bg-transparent"
                />
              ))}
            </div>
            <p className="pt-4 text-base">
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
          <div className="shrink-0 border-t border-border px-20 py-6 max-[702px]:px-8">
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
