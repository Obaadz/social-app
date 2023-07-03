import randomatic from "randomatic";

export default (size: number) => {
  const randomNumber = randomatic("0", size);

  return randomNumber;
};
