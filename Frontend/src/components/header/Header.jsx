import Logout from "../login/Logout"
import "./Header.scss"
import Menu from "./Menu"
const Header = () => {
    return (
        <div>
            <header className="header">
                <Menu></Menu>
                {/* <Logout></Logout> */}
            </header>
        </div>
    )
}

export default Header
