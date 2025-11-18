import { useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png";

import "./Logo.scss";

const Logo: React.FC = () => {
  const navigate = useNavigate();

  function handleLogoClick() {
    navigate("/");
  }

  return (
    <div className="logo" data-testid="logo" onClick={handleLogoClick}>
      <img src={logo} alt="OmniHealth Logo" />
    </div>
  );
};

export default Logo;
