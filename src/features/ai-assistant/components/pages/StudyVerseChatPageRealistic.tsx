import { useOutletContext } from "react-router-dom";
import { StudyVerseChatInterfaceRealistic } from "../StudyVerseChatInterfaceRealistic";

interface OutletContext {
  activeFeature: string;
}

export const StudyVerseChatPageRealistic: React.FC = () => {
  const { activeFeature } = useOutletContext<OutletContext>();

  return (
    <div className="h-full flex flex-col">
      <StudyVerseChatInterfaceRealistic activeFeature={activeFeature} />
    </div>
  );
};
