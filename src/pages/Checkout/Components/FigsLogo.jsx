import Logo from "../../../assets/logo.png"
import { Link } from "react-router-dom"


const FigsLogo = () => {
  return (
    <div className="flex items-center">
      {/* Logo image */}
      <Link to="/">
        <img
          src={Logo} // Replace with the correct path to your logo image
          alt="Logo"
          className="h-20 mr-1"
          style={{ cursor: 'pointer' }}
        />
      </Link>

      {/* Optional original circular icon */}
      <div className=" flex items-center justify-center mr-1">
        <div className="w-2 h-2 bg-white rounded-full"></div>
      </div>

      <span className="font-bold text-3xl">STETH</span>
    </div>
  )
}

export default FigsLogo
