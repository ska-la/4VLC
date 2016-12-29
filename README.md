# Features
1. It's not yet another player based on VLC at all.
2. It's only yet another Remote Control for VLM (not Telnet interface).
3. It's set of additional files which are placed side-by-side with common VLC http files (into ../lua/http folder).
4. For setup of multicast streams of MP4 files and operate them (play, pause, resume, stop). Likewise of Video-on-Demand (VoD).
5. It use built-in VideoLan Manager (VLM) of VLC player over any favorite Web Browser.
6. Interface was adapted for mobile devices with small screen (sirca 3.5 inch).
7. Can be used by people with poor vision or big fingers.
8. Suitable for headless ARM servers (under Unix/Linux) like Cubieboards, Raspberry Pi and many others.. Windows' option is also supported.
9. (Not yet implemented , need help) Get audio stream of MP4 on the RC device (into a current web page).

# Install and Use
1. Download ZIP archive and unpack it. Under Unix/Linux somewhere into: /usr/share/vlc/ folder, under Windows - C:\Program Files\VideoLAN\VLC\ .
2. Start VLC with http interface:
 * Windows: vlc.exe
  ```
  Tools -> Preferences -> All -> Interface -> Main interfaces -> Web
  ```
 * Unix/Linux: 
  ```
  cvlc -I http --http-password <your password>
  ```
 for details look at [there] (https://wiki.videolan.org/Documentation:Modules/http_intf/).
3. Connect to VLC's web interface. Open your favorite web browser and input http://localhost:8080/ or http://\<your desired ip address\>:8080/ into address bar. Also you can add path ..:8080/mobile.html . Play with it. May be that's all of you need.
4. Now input http://\<your ip addr\>:8080/4vlc.html and compare with our solution. You can receive the created streams with any player which support a playback of a multicast stream. You can start another instance of VLC and use View -> Playlist -> Network streams(SAP). Choose desired stream and Play it.

Use a lot of big screen devices (TVs, Monitors, Projectors and so on) to view your streams and control them with your old fashion phone with small screen. Don't harm your eyes. Have a nice day.
