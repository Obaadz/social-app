enum categoriesEnum {
  photographer = "photographer",
  design = "design",
  video = "video",
  illustrator = "illustrator",
  other = "other",
}

const CATEGORIES = ["photographer", "design", "video", "illustrator", "other"] as const;

export default CATEGORIES;

export type { categoriesEnum };
