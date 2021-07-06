import { imageOnClickHandler } from "../../../helpers/media";

export const ImgMessageHandler = (props: { source: string; url: string }) => {
  return (
    <img
      loading="lazy"
      alt="userImages"
      src={props.source}
      onClick={() => imageOnClickHandler(props.url)}
      className="hoverPointer p-1"
      width="90"
      height="90"
    />
  );
};
