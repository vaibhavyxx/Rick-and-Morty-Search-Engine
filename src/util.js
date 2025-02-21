//capitalizes first letter
function capitalizeFirstLetter(word){
    return word.replace(/^./, char => char.toUpperCase());
};

const urlStatus = (json) => {
    apiStatus.innerHTML = `Found ${json.info.count} searches`;
}

export {capitalizeFirstLetter, urlStatus};