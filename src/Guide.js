import './Guide.css';


function Guide({ n, guide, mercs, umap, dfunc, hfunc }) {
    function displayGuide() {
        let parsedHolds = [];
        guide.Waves.forEach((gHold, waveVal) => {
            let us = gHold.Position.split(",");
            let parsedUnits = [];
            us.forEach(u => {
                let s = u.split(":");
                if (s.length < 3) {
                    return;
                }
                let pos = s[1].split("|");
                let foundU = umap[s[0]]
                if (foundU === undefined) {
                    return;
                }
                let pu = { unit: s[0], pos: { x: pos[0], y: pos[1] }, stacks: s[2], icon: foundU.IconPath };
                parsedUnits.push(pu);
            })
            let parsedSends = [];
            let i = 0;
            gHold.Sends.forEach(gSend => {
                let icons = [];
                let ss = gSend.Sends.split(",");
                let k = 0;
                ss.forEach(sname => {
                    let m = mercs[sname];
                    if (m === undefined) {
                        return;
                    }
                    icons.push({ icon: m.IconPath, key: m.IconPath + k });
                    k = k + 1;
                })
                gSend.Icons = icons;
                gSend.ID = i;
                parsedSends.push(gSend);
                i = i + 1;
            })
            let h = { Score: gHold.Score, Sends: parsedSends, TotalValue: gHold.Value, Units: parsedUnits, Wave: waveVal };
            parsedHolds.push(h);
        })
        hfunc(parsedHolds);
        dfunc(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return (
        <div className='card' onClick={() => displayGuide()}>
            <div className='title'>
                <div>{umap[guide.MainUnitID].Name}</div>
                <div className='suppl'>{"with " + umap[guide.SecondaryUnitID].Name}</div>
            </div>
            <div className='imgbox'>
                <img className='pImage blur' src={'https://cdn.legiontd2.com/' + umap[guide.MainUnitID].IconPath} alt={umap[guide.MainUnitID].Name + " guide"}>
                </img>
                <img className='sImage blur' src={'https://cdn.legiontd2.com/' + umap[guide.SecondaryUnitID].IconPath} alt={umap[guide.SecondaryUnitID].Name + " guide"}>
                </img>
            </div>
            <div className='title'>
                <div>{guide.Mastermind}</div>
            </div>
        </div>
    );
}

export default Guide;