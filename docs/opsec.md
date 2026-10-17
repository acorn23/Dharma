# My OPSEC

>My OPSEC model is rather extreme and difficult to replicate and live off therefore I highly recommend following this guide to achieve an acceptable level of privacy.
>[The Android Defensive Security System](https://github.com/The-DresOS-Foundation/DresOS-The-Android-Defensive-Security-System)

In the [“You are a commodity”](panopticon.md) section, we saw how much power tech companies have over us and how many aspects of our lives they can affect, directly or indirectly. So, how do we escape it?

> The only winning move is not to play.

That really is it. It’s impossible to fight powerful tech companies with trillions of dollars at their disposal. But we can always opt out.

It’s important to understand that true privacy is impossible to achieve. Everything we do can only reduce our digital footprint.

Here, I briefly outline my OPSEC model. It works for me because I understand my threat model, know how to use these tools, and have adapted my behavior and lifestyle to be more privacy-conscious.

## Phone

<p align="center">
  <img src="/Dharma/img/phone.png" width="40%" >
</p>

My phone is my daily driver, and I’ve spent the most effort hardening it.
As a matter of fact, installing custom roms and open source software have become more significant than ever given how Google is on the verge of [killing](https://keepandroidopen.org/) sideloading.
### Hardware and software

I have a Xiaomi Mi 10T Pro (2020), which I bought around five years ago. It still runs as well as new.

It currently runs LineageOS 24.0-xxx-Nightly (Android 17), with the latest security patch as of October 11, 2026.

[LineageOS](https://lineageos.org/) provides a recent, debloated Android build for many devices, but it still relies on some Google components and requires manual hardening.

> [GrapheneOS](https://grapheneos.org/) is the best privacy-focused custom ROM for Android phones, in my opinion. However, it is available only for Google Pixel devices, which I don’t own. GrapheneOS offers unmatched security, while LineageOS can provide a similar level of privacy.
>
> I wouldn’t recommend LineageOS to someone facing a dangerous adversary; in that case, GrapheneOS would be the better choice for its security.

### Hardening tweaks

#### Root

I use [Magisk](https://github.com/topjohnwu/Magisk/) to gain root access, which lets me modify system files and apply hardening measures. One disadvantage compared with KernelSU is that Magisk must be manually installed via [ADB](https://developer.android.com/tools/adb) after each system update. This takes about two minutes, but Magisk has a large community and supports prebuilt modules.

#### Debloating

For some reason, LineageOS still includes a few Google apps, such as Google Assistant. These can be removed with the De-bloater module.

#### Captive portal

Android’s captive-portal check contacts Google when connecting to public Wi-Fi. It can be replaced with a privacy-respecting alternative, such as Kuketz, or disabled altogether. Disabling it may make some public Wi-Fi networks harder to connect to.

To set Kuketz as the captive portal, run these commands over ADB:

```sh
adb shell 'settings put global captive_portal_http_url "http://captiveportal.kuketz.de"'
adb shell 'settings put global captive_portal_https_url "https://captiveportal.kuketz.de"'
adb shell 'settings put global captive_portal_fallback_url "http://captiveportal.kuketz.de"'
adb shell 'settings put global captive_portal_other_fall_back_urls "http://captiveportal.kuketz.de"'
```

To confirm the change, run:

```sh
adb shell 'settings get global captive_portal_https_url'
```

#### WebView

The default WebView included with LineageOS is Chromium-based. It is open source, but includes some proprietary components maintained by Google. I replace it by installing the [Open WebView](https://github.com/Magisk-Modules-Alt-Repo/open_webview) module.

#### Google Fused Location Provider

SUPL is used as part of the A-GPS (Assisted GPS) system to get a faster Time to First Fix. The problem is that Android's implementation automatically sends the IMSI (ID of the SIM card) to the SUPL provider for no apparent reason. And because Google is the default provider it's a big breach of privacy.

[SUPL replacer](https://github.com/Magisk-Modules-Alt-Repo/supl-replacer) module replaces the SUPL provider with a proxy server provided by GrapheneOS. The non-profit open source project is known for its security and privacy involvement.
#### Connectivity checks

When connecting to Wi-Fi or a cellular network, the phone may contact Google to check connectivity. I block these domains by adding them to my hosts file:

```text
connectivitycheck.gstatic.com
connectivitycheck.android.com
```

With those changes in place, the phone no longer relies on Google services for these functions. Next is the software side.

### OPSEC

[InviZible Pro](https://github.com/Gedsh/InviZible) is the backbone of my OPSEC setup. It combines [DNSCrypt](https://www.dnscrypt.org/), [Tor](https://www.torproject.org/), and [I2P](https://i2p.net/en/) in one app.

The app runs in root mode, using a kernel-level [AF+ firewall](https://github.com/ukanth/afwall). It provides these services system-wide and includes a kill switch that blocks apps from connecting if the services go down. DNSCrypt queries are encrypted, with enforcement handled at the kernel level through iptables.

I also enabled per-network MAC-address randomization in the phone’s settings.

#### Browser

[WebLibre](https://github.com/FaFre/WebLibre) is my default browser. It is built on the Gecko engine and allows each website to run in its own isolated process. Profiles let me switch between Tor, I2P, and a direct connection.

#### Extensions

I use several extensions to improve privacy without compromising fingerprinting protection:

- **[Dark Reader](https://github.com/darkreader/darkreader):** Applies a dark theme to websites. I can’t do without it.
- **[LibRedirect](https://github.com/libredirect/browser_extension):** Redirects links to popular services such as YouTube, Reddit, IMDb, and Pinterest to privacy-respecting front ends and back ends. This lets me browse some services without visiting their original sites or signing in.
- **[uBlock Origin](https://github.com/gorhill/uBlock):** My preferred ad blocker.
- **[Privacy Badger](https://privacybadger.org/):** Detects tracking domains and blocks them.
- **[NoScript](https://noscript.net/):** Disables JavaScript by default and lets me allow it for individual websites. It also helps reduce exposure to cross-site scripting attacks.
- **[LocalCDN](https://codeberg.org/nobody/LocalCDN):** Blocks requests to external CDNs and serves some resources locally to reduce external requests.
My custom rules:

```text
! Block punycode/IDN domains in documents, popups, and frames
xn--*$doc,popup,frame

! Ads and analytics
||doubleclick.net^$important
||google-analytics.com^$important

! Social tracking and third-party embeds
||facebook.com^$important,third-party
||facebook.net^$important,third-party
||linkedin.com^$important,third-party
||instagram.com^$important,third-party
||tiktok.com^$important,third-party
||twitter.com^$third-party
||x.com^$third-party
||gravatar.com^$important,third-party

! Cloudflare challenges
||challenges.cloudflare.com^$third-party
@@||challenges.cloudflare.com/cdn-cgi/challenge-platform/$third-party,script,frame

! Google reCAPTCHA
||www.google.com^$third-party,subdocument
@@||www.google.com/recaptcha/$third-party,subdocument
||www.gstatic.com^$third-party,script
@@||www.gstatic.com/recaptcha/$third-party,script

! Google
||google.com^$third-party
||gstatic.com^$third-party
||googleapis.com^$third-party
||googletagmanager.com^$third-party
```
#### University

My university requires me to use WhatsApp and sign in to its portal with a Google account assigned to students.

I keep the Google account in an isolated Tor container. This lets me access the portal without using that account in my regular browsing environment.

In India, WhatsApp is difficult to avoid, so I use it only for university matters.

I run the WhatsApp app in an isolated Waydroid container on my Linux machine. On my phone, I use WhatsApp Web in the browser, routed through Tor. Custom extension rules help limit requests, and I use an extension to spoof a desktop user agent so the site works. WhatsApp can still collect metadata; messages are reportedly end-to-end encrypted. I use the service strictly for university.

My uBlock Origin rules for WhatsApp Web:

```text
! WhatsApp Web
||dit.whatsapp.net/deidentified_telemetry$xhr,third-party
||crashlogs.whatsapp.net^
||flows.whatsapp.net^
||pps.whatsapp.net^
||webtp.whatsapp.net^
||graph.whatsapp.net^
||mmg.whatsapp.net^
||dit.whatsapp.net^
||static.whatsapp.net/rsrc.php/yS/r/T_xj3a3ApC9.webp^
```

I originally tried to improve the privacy of the WhatsApp app by using XPL-EX to spoof system properties and a DNS blocker to block requests the app makes frequently. That approach wasn’t effective enough, so I concluded that the app should be used only in an isolated environment. It collects too much information for my comfort.

The web app is easier for me to control through browser settings and extensions.

You might wonder why I route WhatsApp through Tor when Meta already knows my identity. I do this because I use networks outside my home, such as university Wi-Fi, and I don’t want Meta to associate those connections with my actual location.

### Apps

## Apps

- **[Obtainium](https://github.com/ImranR98/Obtainium):** Installs and manages apps directly from their sources.
- **[CoMaps](https://www.comaps.app/):** A map app based on OpenStreetMap.
- **[WebLibre](https://github.com/FaFre/WebLibre):** My primary hardened browser.
- **[IronFox](https://ironfoxoss.org/):** My secondary hardened browser.
- **[Tor Browser](https://www.torproject.org/download/#android):** The official Tor browser.
- **[KeePassDX](https://github.com/Kunzisoft/KeePassDX):** An encrypted password manager and database.
- **[LibreTorrent](https://github.com/proninyaroslav/libretorrent):** A torrent client.
- **[Metrolist](https://github.com/MetrolistGroup/Metrolist):** An open-source YouTube Music app, routed through Tor.
- **[Obsidian](https://obsidian.md/):** A proprietary note-taking app. I haven’t found a free, open-source alternative that works as well for me. I block it with my firewall.
- **[Orion Viewer](https://f-droid.org/packages/universe.constellation.orion.viewer/):** A PDF and file viewer.
- **[LibreOffice Viewer](https://f-droid.org/packages/org.documentfoundation.libreoffice/):** A document viewer.
- **[OSS Document Scanner](https://github.com/ossappscollective/OSS-DocumentScanner):** Scans documents and creates PDFs. I prefer it to Adobe Scan.
- **[Poweramp](https://powerampapp.com/):** A music player.
- **[ServerBox](https://github.com/lollipopkit/flutter_server_box):** Connects to my server over SSH and helps me manage it.
- **[Tailscale](https://github.com/tailscale/tailscale):** Lets me connect to my server remotely.
- **[Molly](https://github.com/mollyim/mollyim-android):** A hardened Signal fork that’s easy to recommend because of its simplicity and privacy features.
- **[SimpleX](https://simplex.chat/downloads/):** My preferred instant-messaging app.
- **[Usagi](https://github.com/UsagiApp/Usagi):** A manga reader. I route it through Tor because it retrieves comics from various sources.
- **[Windscribe](https://windscribe.com/download):** A VPN with a free plan that includes 15 GB of data per month.
- **[ZArchiver](https://zdevs.ru/en/):** A proprietary file manager that I find easy to use. It doesn’t connect to the internet, but I block it with my firewall anyway.
- **[KDE Connect](https://invent.kde.org/network/kdeconnect-android):** Connects my phone with my other Linux machines.

### Web apps and self-hosting

I access other online services, such as email providers, through their websites. Their web versions offer an experience similar to their apps, and installing more apps adds complexity. Open source doesn’t automatically mean an app is free of trackers.

I access other services I rely on, such as PDF tools and cloud storage, through my server.

### Cellular

![Connectivity](img/pstn.png)

The Public Switched Telephone Network (PSTN), the dominant form of communication, is proprietary. So is the broadband chip in my phone. No one outside the manufacturers knows exactly what code it runs or what it can do.

Cellular providers collect extensive information about how their networks are used. They can see whom you call and for how long; calls and SMS are not encrypted by the cellular network. Providers can also record timestamps and connections made over the network. Your location can be estimated through cell-tower triangulation.

This information can be used to profile you, sold to data brokers, or shared with government agencies. Data brokers may also sell personal information to others.

A YouTube video from 14 years ago, [“Your phone company is watching” by Malte Spitz](https://www.youtube.com/embed/Gv7Y0W0xmYQ?start=6), illustrates the scale of the issue. Surveillance infrastructure has advanced considerably since then.

My phone stays in airplane mode about 99% of the time. I don’t recharge my mobile number unless I need to, and I avoid giving it out. There are no affordable VoIP-number providers in India outside the commercial sector, as far as I know.

I mostly rely on home Wi-Fi and connect to my university’s public Wi-Fi when I’m there. If I go elsewhere, I ask to use the available Wi-Fi. Between those networks, I’m disconnected. In an emergency, I can ask someone nearby to share a hotspot.

I use Signal for calls, which lets me use my phone more like a landline.

Without internet access or Google’s Fused Location Provider, my phone can take up to a minute to get a satellite fix. After that, the map app works smoothly.

I also don’t use [microG](https://github.com/microg/). I don’t use proprietary apps that depend on Google Play services, and microG’s notification services may contact Google’s servers.
