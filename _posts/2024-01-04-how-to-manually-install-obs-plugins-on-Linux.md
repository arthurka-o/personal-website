---
layout: post
title: How to manually install OBS plugins on Linux
lead:
---

> This article was previosly available at https://vrsal.xyz/issues/linux
>
> But due to website's unavailability, I decided to post this helpful information here

**TLDR:**

- Do one of the following:

  - Build the plugin from source
  - Get the binaries as a zip archive
  - Get the plugin as a .deb file and extract it

- Create the following directory structure:

  - ~/.config/obs-studio/plugins/[plugin name]/bin/64bit
  - ~/.config/obs-studio/plugins/[plugin name]/data

- Copy the .so file to the bin/64bit folder and the data (locale etc.) to the data/ folder

Sometimes you have to install plugins on Linux manually. Maybe because you do not have root access, because you built the plugin from source or you only have a .deb installer, but you're not using a Debian based distro.

## **Building from source**

This can vary depending on the plugin, so here's just the basics:

- Install obs-studio (duh), git, cmake, gcc and g++
- Clone the plugin with `git clone [plugin git repo]`, you might have to add `--recursive`
- Change the directory into the plugin repo
- Build the plugin `mkdir build && cd build && cmake .. && make`. Add `-j[threads]` for parallel building

The .so of the plugin should now be in the build folder. The data for the plugin should be in the root of the plugin repository.

## **Extracting a .deb installer**

When I switched my plugins to the CI of the plugin-template the CI stopped creating zip archives with the binaries, so for now there's only Debian installers. The installer is just an archive that contains the binaries, so you just have to extract:![](https://web.archive.org/web/20230605164433im_/https://vrsal.xyz/assets/img/archive.png)Inside `data.tar.gz` is a structure that looks like this:

- usr/lib/x86_64-linux-gnu/obs-plugins/[plugin name].so
- usr/share/obs/obs-plugins/[plugin name]/

Ultimately you only need the .so file and the contents of the `.../obs-plugins/[plugin name]/` folder.

## **Installing the files**

After extracting the .deb installer or building the plugin from source you'll have both the .so file and the plugin data. Then it's just a matter of creating the correct folders in your local obs-studio directory and then moving the files there.

Create the folling directory structure:

- `~/.config/obs-studio/plugins/[plugin name]/bin/64bit`
- `~/.config/obs-studio/plugins/[plugin name]/data`

Copy the .so file to the `bin/64bit` folder and the plugin data (locale etc.) to the `data/` folder.
