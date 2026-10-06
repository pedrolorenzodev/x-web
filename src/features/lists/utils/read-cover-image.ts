const COVER_WIDTH = 1200;
const COVER_HEIGHT = 400;
const COVER_QUALITY = 0.82;

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Unreadable image"));
    };
    image.src = url;
  });
}

export async function readCoverImage(file: File): Promise<string> {
  const image = await loadImage(file);
  const scale = Math.max(
    COVER_WIDTH / image.naturalWidth,
    COVER_HEIGHT / image.naturalHeight,
  );
  const width = image.naturalWidth * scale;
  const height = image.naturalHeight * scale;

  const canvas = document.createElement("canvas");
  canvas.width = COVER_WIDTH;
  canvas.height = COVER_HEIGHT;
  canvas
    .getContext("2d")
    ?.drawImage(
      image,
      (COVER_WIDTH - width) / 2,
      (COVER_HEIGHT - height) / 2,
      width,
      height,
    );
  return canvas.toDataURL("image/jpeg", COVER_QUALITY);
}
