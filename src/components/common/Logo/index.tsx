import useNavigation from "../../../hooks/useNavigation";
import logo from "../../../assets/logo.png";

import "./Logo.scss";

const Logo: React.FC = () => {
  const { navigate } = useNavigation();

  return (
    <div className="logo" data-testid="logo" onClick={() => navigate("/")}>
      <img src={logo} alt="OmniHealth Logo" />
    </div>
  );
};

export default Logo;
