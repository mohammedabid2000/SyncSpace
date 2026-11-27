export const MIN_ROOM_NAME = 3;
export const MAX_ROOM_NAME = 40;
export const roomNameLength = `${MIN_ROOM_NAME} to ${MAX_ROOM_NAME} characters`;

export function validRoomName(name) {
  return name.length >= MIN_ROOM_NAME && name.length <= MAX_ROOM_NAME;
}
