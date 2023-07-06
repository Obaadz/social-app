enum categoriesEnum {
  photographer = "photographer",
  designer = "designer",
  video_creator = "video creator",
  illustrator = "illustrator",
  other = "other",
}

const CATEGORIES = [
  "photographer",
  "designer",
  "video creator",
  "illustrator",
  "other",
] as const;

export default CATEGORIES;

export type { categoriesEnum };
