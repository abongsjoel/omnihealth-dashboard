import useNavigation from "../../../hooks/useNavigation";
import "./Logo.scss";

const Logo: React.FC = () => {
  const { navigate } = useNavigation();

  return (
    <h1 className="logo" onClick={() => navigate("/")}>
      OmniHealth
    </h1>
  );
};

export default Logo;
