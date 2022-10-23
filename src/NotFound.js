import './NotFound.css';
import mole from "./DizzyMole.png"

function NotFound({ isNoBuildErr }) {
    return (
        <div className='error'>
            <div className='errorBox'>
                {!isNoBuildErr &&
                    <img src={mole} alt='dizzy mole'></img>
                }
                {!isNoBuildErr &&
                    <div className='error-text'>Something went wrong :(</div>
                }
            </div>
        </div>
    );
}

export default NotFound;