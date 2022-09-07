import './hold.css';
import React, { useState, useEffect, useRef } from "react";
import mythIcon from './MythiumForDays.png';
import doneIcon from './done.svg';
import valueIcon from './value.png';


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
    }, []);

    return (
        <div ref={holdRef} className='hold' key={"hold_" + hold.ID}>
            <div>
                <div className='valueBox'>
                    <img src={valueIcon}></img>
                    <div className='valueText'>{hold.TotalValue}</div>
                </div>
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
                            <img key={u.pos.y + "_" + u.pos.x} className='unitImage' style={{ top: ((14 - u.pos.y - 14.5) * 26) + 'px', left: ((u.pos.x - 0.5) * 26) + 'px' }} src={'https://cdn.legiontd2.com/' + u.icon}></img>
                        ))
                    }
                </div>
            </div>
            <div className='sendBox'>
                <div className='sendHeaders'>
                    <img className='mythBoxHeader' src={mythIcon}></img>
                    <img className='statsBoxHeader' src={doneIcon}></img>
                </div>
                {
                    hold.Sends.map(s => (
                        <div key={"send_" + s.ID} className='sendRow'>
                            <div className='mythCell'>{s.TotalMythium}</div>
                            <div className='leakCell'>{Math.ceil(s.Held / (s.Held + s.Leaked)) * 100 + "%"}</div>
                            <div className='iconsCell'>
                                {
                                    s.Sends.map(i => (
                                        <img className='sendIcon' key={i.key} src={'https://cdn.legiontd2.com/' + i.icon}></img>
                                    ))
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}


export default Hold;