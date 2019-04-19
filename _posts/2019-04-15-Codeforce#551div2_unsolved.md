---
layout: post
title: "Codeforces Round #551 (Div. 2) Hard Problem"
date: 2019-04-16 01:00:00 +0900
categories: jekyll update
---

이 이후로는 문제가 너무 어렵다.. 멍청이가 된 기분..

[D. Serval and Rooted Tree]

이번에 Serval이는 트리를 가지고 놀 것이다.

트리의 루트는 문제 조건 상 1로 고정이 되어 있으며, 트리의 각각의 노드(vertex)에는 min 또는 max의 속성이 붙어있다. leaf인 노드는 1~k까지의 (k는 리프노드의 갯수) 숫자를 가지고 있으며, leaf가 아닌 노드는 자신이 가지고 있는 속성과 자식의 숫자에 따라 자신의 숫자가 결정된다. 이 때, 리프노드의 숫자를 어떻게 배치해야 가장 큰 값을 가질 수 있겠는가를 물어보는 문제이다.

매우매우 강한 트리 dp의 냄새가 나지만, 풀지 못하였다. 실제로 대회가 끝난 후, 대회 editorial을 본 결과 트리 dp라고 한다. 근데 풀이를 봤는데... 올라온 소스 코드를 봤는데... 왜 풀이가 이렇게 되는지 이해가 안된다...!!!!

`악악악`

일단 올라온 풀이는 다음과 같다.

![Dimg]({{ "/assets/codeforce551d.png" | absolute_url }})

트리가 다음과 같이 구성되어 있다고 하자. 그렇다면 답을 다음과 같은 방법으로 찾아주면 된다고 한다.

1. leaf노드일 떄 : 일단 노드의 값을 무조건 1로 준다.
2. min 노드일 떄 : 자식 노드의 값들을 모두 더한 값을 자신의 값으로 갖는다.
3. max 노드일 떄 : 자식 노드 중 가장 작은 값을 자신의 값으로 가진다.
4. 답은 (leaf 노드의 갯수 + 1) - (root 노드에 저장되어 있는 값)이다.



[D. Serval and Rooted Tree]:http://codeforces.com/contest/1153/problem/D
