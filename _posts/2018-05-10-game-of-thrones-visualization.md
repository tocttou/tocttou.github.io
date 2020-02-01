---
title: Game Of Thrones Visualizations With Neo4j graph DB
published: true
---

Dataset: [game-of-thrones/characters.json at master · jeffreylancaster/game-of-thrones · GitHub](https://github.com/jeffreylancaster/game-of-thrones/blob/master/data/characters.json).

Source code: [tocttou / got-visual](https://github.com/tocttou/got-visual)

## Interesting finds

Someone who does not know about the show can enjoy it too :D

**Right click on image and "View Image" or "Open Image In New Tab" to see the zoomed version.**

### 1

People in the same house do not seem to marry among themsevles, unless they are Targaryen (green).

![house-marry](https://i.imgur.com/O8lCM3J.png)

### 2

Jon Snow is the link between the Starks and the Targaryens (brown and green here).

![jonsnow](https://i.imgur.com/liyFpsJ.png)

### 3

Women (pink) have a considerably higher degree of "killings" on average than men (blue) in this dataset. Cersei Lannister alone took down quite a few. The three most deadly people in Westeros are Cersei Lannister, Daenerys Targaryen, and Arya Stark (names can be seen on zoom).

![female-fatale](https://i.imgur.com/sdWbFYE.png)

### 4

The chain of love that started it all. This the longest such chain in the marriage graph. Possibly indicates unrest among elements.

![chain](https://i.imgur.com/GdBumxm.png)

### 5 - Circular relationship

These people killed their parents.

![kill-p](https://i.imgur.com/UjUBkNC.png)

### 6 - Circular relationship

These people killed their spouse/love interest.

![kill-w](https://i.imgur.com/K0lUSdj.png)

### 7 - Circular relationship

Of course the Targaryens married their siblings.

![marry-s](https://i.imgur.com/DvKtpjW.png)
