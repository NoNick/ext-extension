This extension finds torrent magnets on ext.to for given torrent contents, i.e. already downloaded files.

Usage:
- To install popup go to about:debugging#/runtime/this-firefox and choose Load Temporary Add-on
- Run ./get_json.sh in a directory with the torrent files
- Enter ./get_json.sh output string into the extension popup
- Wait painfully
- (TODO) Execute output from the popup in a terminal where qbittorrent is installed

TODO:
- doesn't work when popup window is closed
- integrate with qbt
