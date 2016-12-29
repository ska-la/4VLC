# Features
1. It's not yet another player based on VLC at all.
2. It's only yet another Remote Control for VLM (not Telnet interface).
3. It's a set of additional files which are placed side-by-side with common VLC http files (into ../lua/http folder).
4. Default: it's to setup a multicast streams of MP4 files and operate them (play, pause, resume, stop). Likewise Video-on-Demand (VoD).
5. It use a functionality of a built-in VideoLan Manager (VLM) of VLC player over any favorite web browser.
6. Default: it allows to use SAP information (for players which support this).
7. Interface was adapted for mobile devices with a small screen (sirca 3.5 inch).
8. Can be used by people with a poor vision or big fingers.
9. Suitable for headless ARM servers (under Unix/Linux) like Cubieboards, Raspberry Pi and many others.. Windows' option is also supported.
10. (Not yet implemented , need help) Get audio stream of MP4 on the RC device (into a current web page).

# Install and Use
1. Download ZIP archive and unpack it. Under Unix/Linux COPY (DON'T REPLACE) a CONTENT of "http" folder (NOT FOLDER ITSELF) into: /usr/share/vlc/lua/http folder, under Windows - C:\Program Files\VideoLAN\VLC\lua\http\ .
2. Start VLC up with http interface:
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

# How setup a Stream
After you clicked on blue button "Select File" you can wander through your file system. Choose **ONLY MP4** file. Provide unique name for a stream when you ask. It's needed to distinguish each stream from others.

---
Use a lot of big screen devices (TVs, Monitors, Projectors and so on) to view your streams and control them with your old fashion phone with small screen. Don't harm your eyes. Have a nice day.
