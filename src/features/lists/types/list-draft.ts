export type ListDraft = {
  name: string;
  description: string;
  private: boolean;
  bannerUrl: string | null;
};

export const LIST_NAME_MAX = 25;
export const LIST_DESCRIPTION_MAX = 100;
