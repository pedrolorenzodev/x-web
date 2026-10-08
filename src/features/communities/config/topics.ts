import type { CommunityTopic } from "@/types/community";

export const communityTopics: CommunityTopic[] = [
  "Sports",
  "Technology",
  "Art",
  "Entertainment",
  "Gaming",
  "Politics",
  "Business",
  "Culture",
  "Science",
  "Food",
  "Animals",
  "Education",
  "Fashion & Beauty",
  "Health & Fitness",
  "News",
  "Cryptocurrency",
  "Travel",
  "X Official",
];

export const topicSubcategories: Partial<Record<CommunityTopic, string[]>> = {
  Sports: ["Soccer", "Basketball", "Running"],
  Technology: ["Artificial Intelligence", "Software", "Hardware"],
  Art: ["Design", "Photography", "Illustration"],
  Gaming: ["PC Gaming", "Esports"],
  Animals: ["Dogs", "Cats"],
  Travel: ["Hiking", "Road Trips"],
};
