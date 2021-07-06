export const imageOnClickHandler = async (url: string) => {
  let image = document.createElement("img");
  image.src = url;
  let w: Window | null = window.open("", "_blank");
  if (w) {
    w.document.title = "AlivaKakaoClient";
    w.document.title = "AlivaKakaoClient";
    w.document.body.appendChild(image);
    w.location.href = url;
  }
};
