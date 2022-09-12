import tommy from "./TommyIsSus.png"
import React, { useEffect, useRef } from "react";

function CustomError() {
    const holdRef = useRef(null)
    useEffect(() => {
        const executeScroll = () => {
            holdRef.current.scrollIntoView({ block: 'start', inline: 'start', behavior: 'smooth' });
        }

        executeScroll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='errorBox' ref={holdRef}>
            <img src={tommy} alt=''></img>
            <div className='error-text'>No good builds found for this request</div>
        </div>
    )
}

export default CustomError;