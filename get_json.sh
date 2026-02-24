json='{"dir":"'$(pwd)'", "items":[]}'

files=$(find . -maxdepth 1 -type f -printf '%s %p\n' | sed 's|./||g')
dirs=$(du -d1 | head -n -1 | sed 's|./||g')

readarray -t files_array <<< "$files"
for file in "${files_array[@]}"; do
    if [[ $file =~ ^([0-9]+)[[:space:]]+(.+)$ ]]; then
        size_bytes=${BASH_REMATCH[1]}
        name=${BASH_REMATCH[2]}
        item='{"name":"'$name'", "file":"'$name'", "size_bytes": '$size_bytes'}'
        json=$(echo "$json" | jq --argjson new_item "$item" '.items += [$new_item]')
    fi
done

readarray -t dirs_array <<< "$dirs"
for dir in "${dirs_array[@]}"; do
    if [[ $dir =~ ^([0-9]+)[[:space:]]+(.+)$ ]]; then
        size_bytes=${BASH_REMATCH[1]}
        name=${BASH_REMATCH[2]}
        # sometimes a torrent contains .txt or .nfo file with release group
        # don't use such file, use the largest one
        largest_file=$(find "$name" -type f -printf '%s %p\n' | sort -nr | head -n 1)
        largest_file=${largest_file##*/}
        item='{"name":"'$name'", "file":"'$largest_file'", "size_bytes": '$size_bytes'}'
        json=$(echo "$json" | jq --argjson new_item "$item" '.items += [$new_item]')
    fi
done

echo $json
