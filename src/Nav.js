import './Nav.css';
import { Outlet, Link } from 'react-router-dom';


function Nav() {
    return (
        <div>
            <div className='navbar'>
                <div className='links'>
                    <Link className='link' reloadDocument to="/guides">Guides</Link>
                    <Link className='link' reloadDocument to="/builds">Builds</Link>
                </div>
                <div className='code'>Creator code: paint</div>
            </div>

            <Outlet />

        </div>
    );
}

export default Nav;