import yasserPhoto from "../assets/avatars/yasser.svg";
import linaPhoto from "../assets/avatars/lina.svg";
import adamPhoto from "../assets/avatars/adam.svg";
import saraPhoto from "../assets/avatars/sara.svg";
import omarPhoto from "../assets/avatars/omar.svg";
import nadiaPhoto from "../assets/avatars/nadia.svg";
import karimPhoto from "../assets/avatars/karim.svg";
import youssefPhoto from "../assets/avatars/youssef.svg";
import inesPhoto from "../assets/avatars/ines.svg";

// TODO: replace ALL of this preview data with real data from the backend
// (photos/online status = preview only, so the UI looks complete before the backend exists)
export const currentUser = { name: "Yasser", email: "yasser@example.com", photo: yasserPhoto };
export const users = [
  { name: "Lina", photo: linaPhoto, online: true },
  { name: "Adam", photo: adamPhoto, online: false },
  { name: "Sara", photo: saraPhoto, online: true },
  { name: "Omar", photo: omarPhoto, online: false },
  { name: "Nadia", photo: nadiaPhoto, online: true },
  { name: "Karim", photo: karimPhoto, online: false },
  { name: "Youssef", photo: youssefPhoto, online: true },
  { name: "Ines", photo: inesPhoto, online: false },
];
export const findUser = (name) => users.find((u) => u.name === name);
