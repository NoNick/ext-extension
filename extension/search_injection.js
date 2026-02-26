function runSearch() {
    browser.runtime.sendMessage({action: "getSizeBytes"})
    .then(response => {
        l = selectMostSuitableLink(response.sizeBytes);
        if (l) {
            window.location.href=l;
        } else {
            console.error("Failed to find torrent link");
        }
    })
    .catch(error => console.error(error));
}

function sizeStrToBytes(str) {
  // Regex to match: number + optional decimal + space + unit (GB, MB, KB)
  const match = str.trim().match(/^(\d+\.?\d*)\s*(GB|MB|KB)$/i);
  
  if (!match) {
    console.log("Failed to parse size string: ", str);
    return 0;
  }
  
  const [, value, unit] = match;
  const numValue = parseFloat(value);
  
  const multipliers = {
    GB: 1024 * 1024 * 1024,  // 1,073,741,824 bytes
    MB: 1024 * 1024,         // 1,048,576 bytes  
    KB: 1024                  // 1,024 bytes
  };
  
  return Math.round(numValue * multipliers[unit.toUpperCase()]);
}

function selectMostSuitableLink(targetSizeBytes) {
    const regex = /<span>(.*?)<\/span>/g;
    const parser = new DOMParser();
    torrents=document.querySelectorAll('.file-list-item');
    currentDifferenceBytes = 1e20;
    chosenLink = '';
    for (i = 0; i < torrents.length; i++) {
        torrentDesc = parser.parseFromString(torrents[i].innerHTML, 'text/html');
        mobileInfos = torrentDesc.querySelectorAll('.mobile-info');
        sizeStr = ''
        for (j = 0; j < mobileInfos.length; j++) {
            if (mobileInfos[j].innerHTML.includes("storage")) {
                storageInfo = parser.parseFromString(mobileInfos[j].innerHTML, 'text/html');
                firstSpan = storageInfo.querySelector('span');
                sizeStr = firstSpan.outerText;
		break;
            }
        }
        link = torrentDesc.querySelectorAll('.torrent-name-link');
        linkSizeBytes = sizeStrToBytes(sizeStr);
        diffBytes = Math.abs(linkSizeBytes - targetSizeBytes);
        if (diffBytes < currentDifferenceBytes) {
            currentDifferenceBytes = diffBytes;
            chosenLink = link[0].href;
        }
    }
    return chosenLink;
}

magnet  = document.querySelector('.btn.btn-primary.detail-download-link.copy-magnet-btn');
magnet2 = document.querySelector('.btn.btn-primary.detail-magnet-link.copy-magnet-btn');
if (magnet != null) {
    // magnet page
    window.wrappedJSObject.handleCopyMagnetLink(magnet);
} else if (magnet2 != null) {
    // magnet page, but different button
    window.wrappedJSObject.handleCopyMagnetLink(magnet2);
} else {
    // search page
    runSearch();
}
