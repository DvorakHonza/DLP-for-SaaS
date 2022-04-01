export function logUrl(requestDetails) {
    let initiator = requestDetails.initiator?.replace(/https?:\/\//i, '');
    if (requestDetails.method === "POST" && requestDetails.url.includes(initiator)) {
        console.dir(requestDetails);
    }
}

function isUpload(request) {
    const uschovna = request.requestBody?.formData?.map( item => 'filenames' in item && item['filenames'].length > 0);
    const containsFile = request.requestBody?.raw?.map( item => 'file' in item).some( value => value === true );
    return containsFile && request.method === "POST";
}