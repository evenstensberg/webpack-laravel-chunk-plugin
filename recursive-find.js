const path = require('path')
const fs = require('fs')


function checkIfInExcludedList(file, excluded, newPath) {
    for(let exPath of excluded) {
        if(newPath && (file.includes(exPath) || file.includes(newPath)) && exPath !== '') {
            return false;
        }
    }
    return true;
}
module.exports = function recFindByExt(base, excluded=[],files,result) 
{
    files = files || fs.readdirSync(base);
    result = result || [] 
    files.filter(file => checkIfInExcludedList(file, excluded, path.join(base,file))).forEach( 
        function (file) {
            let newbase = path.join(base,file)
            if ( fs.statSync(newbase).isDirectory() )
            {
                result = recFindByExt(newbase, excluded, fs.readdirSync(newbase),result, excluded)
            }
            else
            {
                if (file.substr(-2*('php'.length+2)) == '.blade.php' )
                {
                    result.push(newbase)
                } 
            }
        }
    )
    return result
}