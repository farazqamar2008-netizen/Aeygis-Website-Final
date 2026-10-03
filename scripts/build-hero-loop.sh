#!/usr/bin/env bash
# Builds public/media/hero-loop.mp4 (+ .webm, poster) from the raw clips in ./videos.
# Each shot: ~4s trim -> 1920x1080 crop -> dark grade with crushed blacks and per-clip saturation
# -> per-clip black overlay (up to 35%) -> crossfaded chain that loops seamlessly.
set -euo pipefail
cd "$(dirname "$0")/.."

SRC=videos
OUT=public/media
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
mkdir -p "$OUT"

FPS=30
LEN=4        # default seconds per shot
XF=0.8       # crossfade duration

# file | start (s) | speed factor (<1 = slow-mo) | overlay alpha (brighter clips get more) | length (s) | extra brightness | saturation
SHOTS=(
  "City Timelapse Night 4K.mp4|9|1|0.20|4|0|0.95"
  "Canada Parliament Video 4k.mp4|1.8|1|0.35|5|0|0.95"
  "Blue Colored Cables 4K Video.mp4|8|1|0.12|4|0.08|0.28"
  "Welding Video 1920x1080 (1).mp4|8|1|0.30|4|0|0.95"
  "Dirt Video 2560x1440.mp4|1|1|0.35|4|0|0.95"
  "Canada Parliament 4k Video.mp4|0|0.62|0.35|4|0|0.95"
  "Aerial View of Vehicles Night.mp4|12|1|0.15|4|0|0.95"
  "Toronto HD Video 1920x1080.mp4|6|1|0.30|4|0|0.95"
)

GRADE="eq=saturation=\$SAT:contrast=1.15:brightness=-0.01:gamma=1.0,\
curves=all='0/0 0.12/0 0.45/0.35 0.8/0.76 1/0.92',\
colorbalance=bs=0.04:bm=0.02:rh=-0.02"

i=0
LENS=()
for s in "${SHOTS[@]}"; do
  IFS='|' read -r file start speed alpha len lift sat <<<"$s"
  len=${len:-$LEN}; lift=${lift:-0}; sat=${sat:-0.28}
  grade=${GRADE//\$SAT/$sat}
  LENS+=("$len")
  srclen=$(echo "$len * $speed" | bc -l)
  ffmpeg -v error -y -ss "$start" -t "$srclen" -i "$SRC/$file" -an \
    -vf "setpts=PTS/$speed,fps=$FPS,scale=1920:1080:force_original_aspect_ratio=increase:flags=lanczos,crop=1920:1080,$grade,eq=brightness=$lift,drawbox=color=black@$alpha:t=fill,trim=duration=$len,setpts=PTS-STARTPTS,format=yuv420p" \
    -c:v libx264 -preset fast -crf 14 "$TMP/s$i.mp4"
  echo "shot $i: $file"
  i=$((i + 1))
done
N=$i

# Seamless loop: the chain is s0[XF..] -> s1 -> ... -> s(N-1) -> s0[0..XF].
# The final crossfade lands exactly on the frame the video opens on.
ffmpeg -v error -y -i "$TMP/s0.mp4" -vf "trim=start=$XF,setpts=PTS-STARTPTS" -c:v libx264 -preset fast -crf 14 "$TMP/head.mp4"
ffmpeg -v error -y -i "$TMP/s0.mp4" -vf "trim=duration=$XF,setpts=PTS-STARTPTS" -c:v libx264 -preset fast -crf 14 "$TMP/tail.mp4"

inputs=(-i "$TMP/head.mp4")
for ((k = 1; k < N; k++)); do inputs+=(-i "$TMP/s$k.mp4"); done
inputs+=(-i "$TMP/tail.mp4")

filter=""
prev="[0:v]"
offset=$(echo "${LENS[0]} - $XF - $XF" | bc -l)   # head is LENS[0]-XF long
for ((k = 1; k <= N; k++)); do
  filter+="${prev}[$k:v]xfade=transition=fade:duration=$XF:offset=$offset[v$k];"
  prev="[v$k]"
  ((k < N)) && offset=$(echo "$offset + ${LENS[$k]} - $XF" | bc -l)
done
filter=${filter%;}

ffmpeg -v error -y "${inputs[@]}" -filter_complex "$filter" -map "$prev" -an \
  -c:v libx264 -preset slow -crf 24 -profile:v high -pix_fmt yuv420p -movflags +faststart \
  "$OUT/hero-loop.mp4"
ffmpeg -v error -y -i "$OUT/hero-loop.mp4" -an -c:v libvpx-vp9 -b:v 0 -crf 38 -row-mt 1 -deadline good "$OUT/hero-loop.webm"
ffmpeg -v error -y -ss 1 -i "$OUT/hero-loop.mp4" -frames:v 1 -q:v 3 "$OUT/hero-poster.jpg"

ffprobe -v error -show_entries format=duration,size -of default=nw=1 "$OUT/hero-loop.mp4"
