This extension finds torrent magnets on ext.to for given torrent contents, i.e. already downloaded files.

Usage:
- Install jq, qbittorrent and qbittorrent-cli (fixed version) https://github.com/NoNick/qbittorrent-cli
- To install popup go to about:debugging#/runtime/this-firefox and choose Load Temporary Add-on
- Run ./get_json.sh in a directory with the torrent files
- Enter ./get_json.sh output string into the extension popup
- Wait painfully
- Execute output from the popup in a terminal where qbittorrent is installed

The extension uses timeouts. If your internet connections s too slow, increase them in extension/background.js 
