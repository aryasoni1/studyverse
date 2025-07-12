import { useOutletContext } from "react-router-dom";
import { StudyVerseChatInterface } from "../StudyVerseChatInterface";

interface OutletContext {
  activeFeature: string;
}

export const StudyVerseChatPage: React.FC = () => {
  const { activeFeature } = useOutletContext<OutletContext>();

  return (
    <div className="h-full flex flex-col">
      <StudyVerseChatInterface activeFeature={activeFeature} />
    </div>
  );
};
