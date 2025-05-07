import Logo from "../../../assets/logo.png"


const FigsLogo = () => {
  return (
    <div className="flex items-center">
      {/* Logo image */}
      <img
        src={Logo}// Replace with the correct path to your logo image
        alt="Logo"
        className="h-20 mr-1"
      />

      {/* Optional original circular icon */}
      <div className=" flex items-center justify-center mr-1">
        <div className="w-2 h-2 bg-white rounded-full"></div>
      </div>

      <span className="font-bold text-3xl">STETH</span>
    </div>
  )
}

export default FigsLogo
