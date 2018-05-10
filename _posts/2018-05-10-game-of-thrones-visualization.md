---
title: Game Of Thrones Visualizations With Neo4j
published: true
---

## Task

Given a dataset ([game-of-thrones/characters.json at master · jeffreylancaster/game-of-thrones · GitHub](https://github.com/jeffreylancaster/game-of-thrones/blob/master/data/characters.json)), present it in a meaningful way.

## Source code

[tocttou / got-visual](https://github.com/tocttou/got-visual)

## Demo

No live demo available at the moment. Neo4j refuses to run properly on a 512MB RAM server and I cannot afford to give it more at the moment. Please deploy the code yourself if you need to see it in action. Deployment instructions are given in the source code README.

## Features

A free floating graph based representation with directed edges to define relationships, and colours to define grouping.

Size of dataset was reduced based on the fact that the most important characters are the most chaotic, and thus have the most number of fields available on them, or they are royal. Please see `external/import-data/clean.js` for the exact rules. This also means that some important characters might not be there in the database.

1. Group by sex (used another json file in the same repository to get information about this).
2. Group by House name.
3. Stack multiple relationships like `parentOf`, `killedBy` on top of each other concurrently.
4. Abilitiy to filter out data based on multiple selectors like `male`, `royal`, and `houseName`.
5. Ability to cluster outlier nodes (ones connected by only a single edge to other nodes).
6. Number of active characters on the screen, number of active relationships.
7. **Ability to find cicular relationships.**

## Interesting finds

Someone who does not know about the show can enjoy it too :D

### 1

![house-marry](https://i.imgur.com/O8lCM3J.png)

People in the same house do not seem to marry among themsevles, unless they are Targaryen (green).

### 2

![jonsnow](https://i.imgur.com/liyFpsJ.png)

Jon Snow is the link between the Starks and the Lannisters (brown and green here).

### 3

![female-fatale](https://i.imgur.com/sdWbFYE.png)

Fatal females: Women (pink) have a considerably higher degree of "killings" on average than men (blue) in this dataset. Cersei Lannister alone took down quite a few. The three most deadly people in Westeros are Cersei Lannister, Daenerys Targaryen, and Arya Stark (names can be seen on zoom).

### 4

![chain](https://i.imgur.com/GdBumxm.png)

The chain of love that started it all. This the longest such chain in the marriage graph. Possible indicates unrest among elements.

### 5 - Circular relationship

![kill-p](https://i.imgur.com/UjUBkNC.png)

These people killed their parents.

### 6 - Circular relationship

![kill-w](https://i.imgur.com/K0lUSdj.png)

These people killed their spouse/love interest.

### 7 - Circular relationship

![marry-s](https://i.imgur.com/DvKtpjW.png)

Of course the Targaryen's married their siblings.