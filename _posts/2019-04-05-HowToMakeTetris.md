---
layout: post
title:  "테트리스를 만들어 봅시다"
date:   2019-04-05 02:00:00 +0900
categories: jekyll update
---
군대 가기 전에 테트리스를 만들어 보았다.

테트리스는 [여기1]에서 플레이 해볼 수 있다.
매우 대충 만든것처럼 생겼지만 맞다 매우 대충 만들었다.

앞으로 사라지기 전에 여기에 신기한 기능들을 많이 넣어놓고 사라져야지

매우 기초가 없는 상태에서 만들었기 때문에 js긴 js인데 매우 c style로 코딩이 되어 있으며 canvas크기도 매우 대충 만들었다

테트리스를 어떻게 만들 것인가를 곰곰히 생각해보면 다음과 같은 아이디어를 얻을 수 있다.

1. 게임을 할 판이 필요해!!
2. 그 판에 블록을 떨어트려서 블록이 판의 끝에 닿거나 블록이 쌓여있어서 다른 블록에 닿는다면 그만 떨어트려야한다.
3. 그 블록은 랜덤하게 생성해야겠지??
4. 방향키가 먹게 만들어야한다. 아래키를 누르면 더 빠르게 떨어지게, 위키를 누르면 블록이 회전하게, 왼쪽키를 누르면 블록이 왼쪽으로, 오른쪽을 누르면 블록이 오른쪽으로 움직이게 만들어야한다.
5. 왼쪽으로 쭉 가다가 블록이 판을 벗어나버리면?? 예외처리가 필요하다
6. 한줄이 블록으로 가득 차면 한줄을 없애고 점수를 올려야한다.

이정도면 테트리스의 간단한 구현을 할 수 있다.
즉, 테트리스를 예쁘지 않게 구현하는 것은 생각보다 쉽다.

먼저 게임을 할 판을 만들어 보았다. 판을 만들기 위해서 initBoard()라는 함수를 사용하였다.

{% highlight javascript %}
function initBoard(){
    for(var i  = 0;i<num_rows;i++){
        board[i] = []
        for(var j = 0;j<num_cols;j++){
            board[i][j] = "white"
        }
    }
    curBLockIdx = Math.floor(7*Math.random());
    block = blocks[curBLockIdx];
    color = block_Color[curBLockIdx];
    curX = -1;
    curY = num_cols/2-1;
    end = false;
    nextBlockIdx = Math.floor(7*Math.random());
    drawBoard();
}
{% endhighlight %}
board라는 baord를 관리하는 변수에 모두 흰색으로 채우겠다라고 적어두고, 현재 블록, 다음 블록을 결정한 후, board를 그려주었다. 여기서 볼 수 있듯이, 테트리스의 블록은 모두 랜덤하게 생성하였다.

그 다음에 이제 시간에 따라서 블록이 떨어지게 만들어야한다.

js문법중에는 특정 시간 간격으로 함수를 실행할 수 있도록 하는 setInterval함수와 그것을 그만두게 만드는 clearInterval함수가 존재한다. 이것을 가지고 블록이 떨어지게끔 만들어줄 수 있다.
{% highlight javascript %}
playAlert = setInterval(function(){
    play(); 
    if(end) {
        alert("game over!");
        clearInterval(playAlert);
    }
},time);
{% endhighlight %}
play함수는 블록을 내릴 수 없을 떄까지 블록을 한칸한칸 내리는 함수이다. end는 게임이 끝났는지 안끝났는지를 관리하는 변수이다. 이런식으로 코딩을 하면 시간이 지날때마다 블록이 한칸한칸 내려가게 만들어 줄 수 있다. 그러다 게임이 끝나면 알아서 gameover를 출력하고 내려오는것도 멈춘다.

{% highlight javascript %}
function play() {
    drawBoard();
    if(canBlockDown(block,++curX,curY)){
        drawCurBlock(block,curX,curY,curBLockIdx);
    }
    else{
        if(curX==0) {end = true; return;}
        console.log(end)
        curX--;
        addBlockToBoard(block,curX,curY,curBLockIdx);
        tmp = deleteline()
        score += 100*tmp*tmp;
        updateScoreBoard();
        drawBoard();
        curBLockIdx = nextBlockIdx;
        nextBlockIdx = Math.floor(7*Math.random());
        updateNextBlock();
        block = blocks[curBLockIdx];
        color = block_Color[curBLockIdx];
        curX = -1;
        curY = num_cols/2-1;
    }
}
{% endhighlight %}
블록을 내리는 play함수이다. 블록을 내리려면 다음과 일단 현재 블록이 포함되어 있지 않은 보드를 그리면 전에 그렸던 한칸 내리기 전의 블록이 지워져있을 것이다. 그 후, 내려갈 수 있다면 현재 블록을 그려주고, 내려갈 수 없다면 새로운 블록을 만들어주는 과정을 가지면 된다.
그리고 내려갈 수 없을 떄 가득 찬 줄을 지워줘야 한다.

이렇게 구현 한 후, 세부 함수까지 다 구현을 했다면, 남은것은 아마 방향키를 입력하였을 떄 어떻게 해야할 것인가에 대한 문제만 남았을 것이다.

이 또한 js에 eventhandler 중 keyDownHandler 키가 내려갔을 때, 즉, 키가 입력되었을 떄 어떻게 할 것인지를 관리하는 함수로 쉽게 해결이 가능하다.

{% highlight javascript %}
function keyDownHandler(e){
    if(e.keyCode == 40&&!end) play(); 
    if(e.keyCode == 38&&!end) {
        tmp=blockRotate(block);
        if(canBlockDown(tmp,curX,curY)){
            block = tmp;
            drawBoard();
            drawCurBlock(block,curX,curY,curBLockIdx);
        }
    }
    if(e.keyCode == 39&&!end) {
        if(canBlockDown(block,curX,curY+1)){
            curY++;
            drawBoard();
            drawCurBlock(block,curX,curY,curBLockIdx);  
        }
    } 
    if(e.keyCode == 37&&!end){
        if(canBlockDown(block,curX,curY-1)){
            curY--;
            drawBoard();
            drawCurBlock(block,curX,curY,curBLockIdx);
        }
    }
}
{% endhighlight %}

이러면 테트리스 구현이 끝난다!! WOWOWOW
매우 간단하게 만들어줄 수 있다.

이제 이거가지고 테트리스 모양을 좀 더 예쁘게 만들고 유전 알고리즘을 돌려보고 싶은데 현재 내 지식 상태로는 불가능해서 조금은 공부를 하고 해봐야 할것 같다...


[여기1]:https://bambbam.github.io/jekyll/update/2019/04/04/%EB%82%B4%EA%B0%80%EB%A7%8C%EB%93%A0%ED%85%8C%ED%8A%B8%EB%A6%AC%EC%8A%A4.html