---
title: Game Of Thrones Visualizations With Neo4j
published: true
---

## Task

Given a dataset ([game-of-thrones/characters.json at master · jeffreylancaster/game-of-thrones · GitHub](https://github.com/jeffreylancaster/game-of-thrones/blob/master/data/characters.json)), present it in a meaningful way.

## Source code

React-Typescript-Visjs-Sagas-antd

[tocttou / got-visual](https://github.com/tocttou/got-visual)

## Demo

No live demo available at the moment. Neo4j refuses to run properly on a 512MB RAM server and I cannot afford to give it more at the moment. Please deploy the code yourself if you need to see it in action. Deployment instructions are given in the source code README.

## Features

A free floating graph based representation with directed edges to define relationships, and colours to define grouping.

1. Group by sex (used another json file in the same repository to get information about this).
2. Group by House name.
3. Stack multiple relationships like `parentOf`, `killedBy` on top of each other concurrently.
4. Abilitiy to filter out data based on multiple selectors like `male`, `royal`, and `houseName`.
5. Ability to cluster outlier nodes (ones connected by only a single edge to other nodes).
6. Number of active characters on the screen, number of active relationships.
7. **Ability to find circular relationships.**

After a quick look at the dataset, it was clear to me that a graph db would be perfect for this use case. I did know about what graph databases are and how they work, but did not have prior practical experince. I started working with the `Go.js` graphing library which I had previously used in 2-3 projects, and with `neo4j` as the database.

I started looking at some other libs too (`Alchemy.js` in particular, which turned out to be a nightmare because it has not been updated to use modules.) After wasting 4-5 hours with Alchemy, I switched to `Vis.js` graphing lib which worked flawlessly.

To connect to neo4j I made a small proxy with expressjs that relays commands via a nodejs-only neo4j library.

Size of dataset was reduced based on the fact that the most important characters are the most chaotic, and thus have the most number of fields available on them, or they are royal. Please see `external/import-data/clean.js` for the exact rules. This also means that some important characters might not be there in the database.

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

Fatal females: Women (pink) have a considerably higher degree of "killings" on average than men (blue) in this dataset. Cersei Lannister alone took down quite a few. The three most deadly people in Westeros are Cersei Lannister, Daenerys Targaryen, and Arya Stark (names can be seen on zoom).

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
