const {readFileSync} = require('fs');

function findInvoc(phpArr) {
    return [].concat(...phpArr.map( elem => {
        const contents = readFileSync(elem, 'utf8');
        if(!contents.length) {
            return null;
        }
        let res = [];
        const hasMixDef = contents.indexOf('{{mix(');
        if(hasMixDef >= 0) {
            let walk = hasMixDef;
            while(walk > -1) {
                const elemEndIdx = contents.indexOf(')}}', walk);
                res.push({
                    file: elem,
                    start: walk,
                    end: elemEndIdx,
                    type: 'script'
                })
                walk = contents.indexOf("{{mix(", walk+1);
            }
        }

        const hasAssetDef = contents.indexOf('{{asset(');
        if(hasMixDef >= 0) {
            let walk = hasAssetDef;
            while(walk > -1) {
                const elemEndIdx = contents.indexOf(')}}', walk);
                res.push({
                    file: elem,
                    start: walk,
                    end: elemEndIdx,
                    type: 'asset'
                })
                walk = contents.indexOf("{{asset(", walk+1);
            }
        }
        return res.length > 0 ? res : false;
    }).filter(e => e));
}

module.exports = findInvoc;