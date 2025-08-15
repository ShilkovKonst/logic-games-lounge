import { DefineDropzoneType } from "./types";

export const defineDropzone: DefineDropzoneType = (e) => {
  let dropzone;
  if (e instanceof MouseEvent) {
    dropzone = document
      .elementFromPoint(e.clientX, e.clientY)
      ?.closest(".dropzone");
  }
  if (e instanceof TouchEvent) {
    dropzone = document
      .elementFromPoint(
        e.changedTouches[0].clientX,
        e.changedTouches[0].clientY
      )
      ?.closest(".dropzone");
  }
  return dropzone as HTMLElement | null;
};
