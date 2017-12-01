---
published: true
---
Suspend never worked with Linux on my Lenovo Z510. Recently I came across [this issue](https://github.com/Bumblebee-Project/bbswitch/issues/142) while looking for a fix (I use NVIDIA Prime, not Bumbleebee). Suspend now works on my laptop by doing:

`sudo vim /etc/default/grub`

Replace `GRUB_CMDLINE_LINUX_DEFAULT="quiet splash"` with `GRUB_CMDLINE_LINUX_DEFAULT="quiet splash acpi_osi=\"!Windows 2013\" acpi_osi=Linux"`

`sudo update-grub`

Reboot.
