import { currentUser, findUser } from "../people/previewPeople";

export const participants = [
  { ...currentUser, host: true, online: true },
  { ...findUser("Lina"), host: false, online: true },
  { ...findUser("Adam"), host: false, online: true },
];
