import CATEGORIES from "./categories.js";
import MOBILE_CATEGORIES from "./mobileCategories.js";

export default (
  category: (typeof MOBILE_CATEGORIES)[number]
): (typeof CATEGORIES)[number] => {
  const index = MOBILE_CATEGORIES.findIndex((c) => c === category.toUpperCase());

  return CATEGORIES[index >= 0 ? index : CATEGORIES.length - 1]; // Use the last category if no match
};
