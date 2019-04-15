---
layout: post
title: "Codeforces Round #551 (Div. 2) Easy Problem"
date: 2019-04-16 01:00:00 +0900
categories: jekyll update
---
나는 평소에 PS 속칭 알고리즘이라는 것을 공부할 떄 그냥 오 풀었다아아아 하고 넘기고 안풀리는 것은 그냥 언젠가 내 지식이 증가하면 풀리겠지 하고 남겨두고 내 갈길을 갔다.

요즘 이 방법으로는 더 이상 발전이 어렵다고 느꼈을 뿐더러, codejam도 준비를 해보고 싶어서..!! 각각의 대회에서 푼 문제와 풀지 못한 문제의 아이디어와 구현을 해보고 그것을 정리해보는 시간이 필요하다 생각하였다.

잡설 1을 적다가 시간이 늦어져서 그냥 이번 대회에서 푼 문제만 정리해보고 자고 일어나서 내일 못푼 문제를 정리해보려고 한다.

[A - Serval and Bus]

문제를 요약해 보면 Serval이라는 아이가 t라는 시간에 버스 정류장으로 나가서 그 떄 가장 빨리 오는 아무 버스나 타려고 한다. n대의 버스가 있다고 할 때, n대의 버스 첫차 시간과 버스의 배차 간격이 주어졌을 때(s,d), Serval이라는 친구가 어떤 버스를 타게 될지를 출력하는 문제이다. 

입력은 n,t가 주어지며, 그 아래 n개의 줄에 버스의 정보가 주어진다.

우리는 첫차와 배차 간격을 알기 때문에, t에 가장 가까운 (s+dx)-t가 양수이며 최소가 되도록 하는 x를 각각의 버스에 대해서 구할 수 있으며, 그 중에서 가장 작은 값을 가지는 인덱스를 출력하면 된다.

따라서 시간복잡도는 O(n)

{% highlight c++ %}
#include <stdio.h>
#include <algorithm>
#include <vector>
#include <queue>
using namespace std;
int main() {
	int n, t; scanf("%d %d", &n, &t);
	int ans = 0;
	int diff = 2147483647;
	for (int i = 1; i <= n; i++) {
		int x, y; scanf("%d %d", &x, &y);
		int curdiff = 0;
		if (t > x) {
			int k = (t - x) / y;
			if ((t - x) % y != 0) k++;
			curdiff = k * y + x - t;
		}
		else curdiff = x - t;
		if (diff > curdiff) {
			diff = curdiff;
			ans = i;
		}
	}
	printf("%d", ans);
	return 0;
}
{% endhighlight %}

그냥 그렇게 어렵지 않은 수학 내용을 구현하면 되는 내용이었기 때문에 어려운 점은 없었다. 대회 시작 후 7분만에 풀었다.

[B - Serval and Toy Bricks]

운이 좋게도 아무 버스나 골라 탔더니 유치원에 가는 버스였던 Serval이!! 유치원에서 블록 놀이를 한다.

놀이의 내용은 다음과 같다. Serval이가 블록을 임의로 쌓은 후, 그것을 앞에서 본 모양, 옆에서 본 모양, 위에서 본 모양을 나에게 알려주면, 그런 모양이 될 수 있도록 쌓여진 블록 모양들 중 하나를 출력하면 된다. 입력은 항상 가능한 모양이 적어도 하나가 존재하도록 주어진다고 한다.

이 문제를 처음 다 해석하고 든 생각은 

?????????? 왜 b번인데 어렵지 ????????? 라는 생각이 먼저 들었다.

그 후 펜을 들고 종이에 몇번 끄적여 본 결과 이 문제는 

ans[i][j] = min(right[i], front[j])

이렇게 된다는 것을 꺠달을 수 있었다.

즉, (i,j)그리드에는 오른쪽에서 본 높이와 앞에서 본 높이의 min값만큼을 올리면 어떻게든 모양이 나온다는 결론이었다.

어떻게든 그렇게 하면 오른쪽에서 보든 앞에서 보든 문제는 없을 것이고, 답이 나오는 입력만이 주어지기 때문에, 답이 나올거라 생각했다. 

정확히 증명은 못하겠지만, 내 직관이 이것은 무조건 맞다라는 확신이 들어서 코딩을 하였고 맞았다.

대회 시작한지 19분만에 solve
{% highlight c++ %}
#include <stdio.h>
#include <algorithm>
using namespace std;
int top[150][150];
int right[150];
int front[150];
int ans[150][150];
int main() {
	int n, m, h; scanf("%d %d %d", &n, &m, &h);
	for (int i = 0; i < m; i++) {
		scanf("%d", &front[i]);
	}
	for (int i = 0; i < n; i++) {
		scanf("%d", &right[i]);
	}
	for(int i = 0;i<n;i++){
		for (int j = 0; j < m; j++) {
			scanf("%d", &top[i][j]);
		}
	}
	for (int i = 0; i < n; i++) {
		for (int j = 0; j < m; j++) {
			if (top[i][j] != 0) {
				ans[i][j] = min(right[i], front[j]);
			}
		}
	}
	for (int i = 0; i < n; i++) {
		for (int j = 0; j < m; j++) {
			printf("%d ", ans[i][j]);
		}
		puts("");
	}
	return 0;
}
{% endhighlight %}


[C - Serval and Parenthesis Sequence]

문제 제목을 해석해 보면 serval과 괄호 문자열이다.

문제는 단순하다.

n과 n개의 character가 입력으로 주어진다. n개의 character는 ( 또는 ) 또는 ?로만 이루어져있다. ?는 이곳에 (가 들어올지, )가 들어올지 모른다는 뜻이다. ?를 내 마음대로 ( 또는 )로 넣었을 떄, 문장이 끝나기 전까지는 완벽한 괄호 문자열이 만들어지지 않다가 문장이 끝나는 순간 완벽한 괄호 문자열이 되도록 만들 수 있는가? 가 문제이다.

가능하다면 그 문자열을 출력하도록 하고, 불가능하다면, :(를 출력하도록 한다.

또 문제를 해석하고 난 후 든 생각은

??????????? 왜 또 어려운거야아아아아!!!!!!!!! 이었다.

또 종이에 몇번 끄적이고 떠오른 생각은 이것이었다.

1. 원래부터 (나 )이었던 것은 갯수가 정해져있다.
2. 문자열의 길이 n과 1의 갯수가 있기 때문에, 완벽한 문자열을 만들기 위해서 필요한 (와 )의 갯수를 셀 수 있다.
3. 일단 무조건 (를 넣을 수 있는 대로 넣고 그 후 ?에 다 )를 넣어버리면 될거 같다. 이것이 괄호는 열 수 있는 대로 다 열어버린 후 다 닫는 것이기 때문에 최적의 해일 것이다.
4. 그 후, 그렇게 만들어진 문장이 완벽한 괄호 문자열인지 판단해주면 답 소스겠다.

그래서 그대로 구현하였고 맞았다.
패널티를 2번 받아서 47분이라 적혀있는데 그것보다는 일찍 구현하였다.

{% highlight c++ %}
#include <stdio.h>
#include <string.h>
#include <algorithm>
using namespace std;

char arr[350000];
char ans[350000];
int main() {
	int n; scanf("%d", &n);
	scanf("%s", &arr);
	int x=0, t = 0;
	for (int i = 0; i < n; i++) {
		if (arr[i] != '?') {
			if (arr[i] == '(') x++;
			if (arr[i] == ')') x--;
			t++;
		}
	}
	int k = n - t;
	int nump, numx;

	if (x > 0) {
		if ((k - x) % 2 != 0) {
			puts(":("); return 0;
		}
		nump = (k - x) / 2;
		numx = (k - x) / 2 + x;
	}
	else {
		if ((k + x) % 2 != 0) {
			puts(":("); return 0;
		}
		numx = (k + x) / 2;
		nump = (k + x) / 2 - x;
	}
	int idx = 0;
	for (int i = 0; i < n; i++) {
		if (arr[i] != '?') ans[i] = arr[i];
		else {                       
			if (idx < nump) {
				ans[i] = '(';
				idx++;
			}
			else ans[i] = ')';
		}
	}
	int st = 0;
	int end = false;
	for (int i = 0; i < n; i++) {
		if (ans[i] == '(') st++;
		if (ans[i] == ')') st--;
		if (st < 0) { end = true; break; }
		if (st == 0 && i != n - 1) { end = true; break; }
	}
	if (st != 0 && !end) end = true;
	if (!end) puts(ans);
	else puts(":(");
	return 0;
}
{% endhighlight %}

이 문제를 푼 후, d번에 매달려 보았지만 실패하였다...

이렇게 2시간동안 3문제를 풀고,

866/5213

등을 하여 blue로 승격하였다. 

물론 못 푼 문제를 푸는 것도 중요하지만, PS에서 생명은 속도와 시간이다. 내 소스를 다시 보니 쓸모 없는 부분, 더 조금만 코딩할 수 있는 부분이 많이 보인다. 물론 시간에 쫓겨 급하게 짰기 때문에 의식의 흐름대로 구현이 되어 있지만, 그러면 의식의 흐름을 좀 더 간결하게 할 수 있도록 노력을 해야할거 같다. 

`PS를 더 할 생각이 있다면`

`노가다 랭작..`

[A - Serval and Bus]:http://codeforces.com/contest/1153/problem/A
[B - Serval and Toy Bricks]:http://codeforces.com/contest/1153/problem/B
[C - Serval and Parenthesis Sequence]:http://codeforces.com/contest/1153/problem/C