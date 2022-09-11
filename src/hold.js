import './hold.css';
import React, { useState, useEffect, useRef } from "react";
import mythIcon from './MythiumForDays.png';
import doneIcon from './done.svg';
import valueIcon from './value.png';


function Hold({ hold, scroll }) {
    const holdRef = useRef(null)
    const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
    const cols = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    const [isCopy, setIsCopy] = useState(false)
    useEffect(() => {
        const executeScroll = () => {
            holdRef.current.scrollIntoView({ block: 'start', inline: 'start', behavior: 'smooth' });
        }
        if (scroll) {
            executeScroll();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function copy() {
        setIsCopy(true);
        setTimeout(() => { setIsCopy(false) }, 2000);
    }

    return (
        <div ref={holdRef} className='hold' key={"hold_" + hold.ID}>
            {
                isCopy &&
                <div>
                    <div className='valueBox'>
                        <img src={valueIcon} alt=''></img>
                        <div className='valueText'>{hold.TotalValue}</div>
                    </div>
                    <div className='copyBox'>
                        <img className='copyIcon' src={doneIcon} alt=''></img>
                        <div>Board copied!</div>
                    </div>
                </div>
            }
            {
                !isCopy &&
                <div>
                    <div className='valueBox'>
                        <img src={valueIcon} alt=''></img>
                        <div className='valueText'>{hold.TotalValue}</div>
                    </div>
                    <table onClick={() => copy()}>
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
                                <div key={u.pos.y + "_div_" + u.pos.x}>
                                    <img className='unitImage' style={{ top: ((14 - u.pos.y - 14.5) * 26) + 'px', left: ((u.pos.x - 0.5) * 26) + 'px' }} key={u.pos.y + "_img_" + u.pos.x} src={'https://cdn.legiontd2.com/' + u.icon} alt=''>
                                    </img>
                                    {
                                        u.stacks !== "0" &&
                                        <div className='unitImageStacks' style={{ top: ((14 - u.pos.y - 14.5) * 26) + 'px', left: ((u.pos.x - 0.5) * 26) + 19 + 'px' }} key={u.pos.y + "_stacks_" + u.pos.x}>{u.stacks}</div>
                                    }
                                </div>

                            ))
                        }
                    </div>
                </div>
            }

            <div className='sendBox'>
                <div className='sendHeaders'>
                    <img className='mythBoxHeader' src={mythIcon} alt='Total Mythium sent' title='Total Mythium sent'></img>
                    <img className='statsBoxHeader' src={doneIcon} alt='Chance of holding this send' title='Chance of holding this send'></img>
                </div>
                {
                    hold.Sends.map(s => (
                        <div key={"send_" + s.ID} className='sendRow'>
                            <div className='mythCell'>{s.TotalMythium}</div>
                            <div className={'leakCell ' + ((s.Held / (s.Held + s.Leaked)) > 0.67 ? "green" : "red")}>{Math.ceil((s.Held / (s.Held + s.Leaked)) * 100) + "%"}</div>
                            <div className='iconsCell'>
                                {
                                    s.Sends.map(i => (
                                        <img className='sendIcon' key={i.key} src={'https://cdn.legiontd2.com/' + i.icon} alt=''></img>
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