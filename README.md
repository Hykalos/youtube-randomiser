# Youtube randomiser
This is a quickly implemented Firefox addon to properly randomise playlists. Due to it's implemented quickly, there are some quirks.

## Build
Run the following commands in your favourite terminal in the base folder of the project:

```
npm install
npm run build
```

## Install
This addon hasn't been uploaded to [addons.mozilla.org](https://addons.mozilla.org), so the installation is a bit more manual:

1. Download manifest.json and the dist folder. Remember to keep the dist folder in the same folder as manifest.json
1. Open about:debugging in Firefox and load the addon as a temporary addon
1. Go to [Youtube](https://www.youtube.com) and allow it to autoplay by clicking the icon next to the address bar

![Autoplay in Youtube](images/allow-autoplay.png)

## Play randomised playlist
Note that you need to load the addon as a temporary addon every time you open Firefox.

1. Go to a playlist of your choosing
1. Scroll to the bottom so all videos are loaded into the list
1. Click the shuffle button next to the title of the playlist
    - You may need to reload the extension once in the playlist to get the button to show

## Stop playing the randomised playlist
The randomiser will continue playing the next video in the randomised order until reaching the end even if you're watching another video.

You can stop the randomiser from going to the next video by opening the developer panel by:

1. Press `ctrl+shift+i`
1. Go to the Storage tab
1. Go to Local Storage
1. Either remove the entry `customrandomiseractive` or set the value of it to `false`

To activate the randomiser again, set the `customrandomiseractive` value to `true` again and it will pick up from where it left off

## Fullscreen
To get the video to automatically go back into fullscreen after it's changed the video, do the following:

1. Go into about:config and set the setting `full-screen-api.allow-trusted-requests-only` to `false`