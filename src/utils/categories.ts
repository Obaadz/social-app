enum categoriesEnum {
  photographer = "photographer",
  design = "design",
  video = "video",
  illustrator = "illustrator",
}

const CATEGORIES = ["photographer", "design", "video", "illustrator"] as const;

export default CATEGORIES;

export type { categoriesEnum };
