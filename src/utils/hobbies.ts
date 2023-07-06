enum hobbiesEnum {
  photographer = "photographer",
  designer = "designer",
  video_creator = "video creator",
  illustrator = "illustrator",
}

const HOBBIES = ["photographer", "designer", "video creator", "illustrator"] as const;

export default HOBBIES;

export type { hobbiesEnum };
