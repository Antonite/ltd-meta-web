import './hold.css';
import React, { useState, useEffect, useRef } from "react";


function Hold({ hold, scroll }) {
    const holdRef = useRef(null)
    const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
    const cols = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    const [posMap, setPosMap] = useState([])
    const executeScroll = () => {
        holdRef.current.scrollIntoView({ block: 'start', inline: 'start', behavior: 'smooth' });
    }
    useEffect(() => {
        if (scroll) {
            executeScroll();
        }
        console.log(hold);
        // let pMap = [];
        // hold.Units.forEach(u => {
        //     let x = 
        // })
    }, []);

    return (
        <div ref={holdRef} className='hold' key={"hold_" + hold.ID}>
            <table>
                <tbody>
                    {
                        rows.map(r => (
                            <tr key={"row_" + r}>
                                {
                                    cols.map(c => (
                                        <td key={"row_" + r + "_col_" + c} className="box"></td>
                                    ))
                                }
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            <div className='imageBox'>
                {
                    hold.Units.map(u => (
                        <img className='unitImage' style={{ top: ((14 - u.pos.y - 14.5) * 26) + 'px', left: ((u.pos.x - 0.5) * 26) + 'px' }} src={'https://cdn.legiontd2.com/' + u.icon}></img>
                    ))
                }
            </div>
            <div className='sendBox'>

            </div>
        </div>
    );
}


export default Hold;