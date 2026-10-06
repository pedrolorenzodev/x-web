"use client";

import { useRouter } from "next/navigation";
import { useId, useState, useTransition } from "react";
import type { User } from "@/types/user";
import { routes } from "@/config/routes";
import { Button } from "@/components/ui/button";
import { Modal, ModalHeader } from "@/components/ui/modal";
import {
  useRouteModalClose,
  type RouteModalDismiss,
} from "@/hooks/use-route-modal-close";
import type { ListDraft } from "@/features/lists/types/list-draft";
import { createList } from "@/features/lists/api/list-mutations";
import { ListForm } from "@/features/lists/components/list-form";
import { MemberPicker } from "@/features/lists/components/member-picker";

type CreateListModalProps = {
  suggestions: User[];
  dismiss: RouteModalDismiss;
};

const emptyDraft: ListDraft = {
  name: "",
  description: "",
  private: false,
  bannerUrl: null,
};

export function CreateListModal({ suggestions, dismiss }: CreateListModalProps) {
  const router = useRouter();
  const close = useRouteModalClose(dismiss);
  const titleId = useId();
  const [step, setStep] = useState<"details" | "members">("details");
  const [draft, setDraft] = useState(emptyDraft);
  const [members, setMembers] = useState<User[]>([]);
  const [pending, startTransition] = useTransition();
  const canContinue = draft.name.trim() !== "";

  function finish() {
    startTransition(async () => {
      const id = await createList(
        draft,
        members.map((member) => member.id),
      );
      if (id) router.replace(routes.list(id));
    });
  }

  return (
    <Modal
      onClose={() => {
        if (!pending) close();
      }}
      labelledBy={titleId}
      size="fixed"
      className="overflow-y-auto"
    >
      {step === "details" ? (
        <>
          <ModalHeader
            onClose={close}
            title="Create a new List"
            titleId={titleId}
            action={
              <Button
                size="sm"
                disabled={!canContinue}
                onClick={() => setStep("members")}
              >
                Next
              </Button>
            }
          />
          <ListForm draft={draft} onChange={setDraft} />
        </>
      ) : (
        <>
          <ModalHeader
            onClose={close}
            title="Add to your List"
            titleId={titleId}
            action={
              <Button size="sm" disabled={pending} onClick={finish}>
                Done
              </Button>
            }
          />
          <MemberPicker
            suggestions={suggestions}
            members={members}
            onChange={setMembers}
          />
        </>
      )}
    </Modal>
  );
}
