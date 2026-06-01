import "./index.css";
import { Composition } from "remotion";
import { CVVideo } from "./CVVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CVVideo"
        component={CVVideo}
        durationInFrames={275}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};
