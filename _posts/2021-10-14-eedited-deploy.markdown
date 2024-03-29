---
layout: post
title:  eedited 서비스 배포하기
date:   2021-10-14 00:00:00 +0930
categories: Javascript react aws
---

우당탕탕 eedited 배포 이야기

## 리엑트는 신이 아니야

1. 꽃밭이었던 우리들의 머릿속

    이렇게 동작할줄 알았다.

    ![이럴 줄 알았따](/assets/img/1014/1.png)

    다시 그리면서 생각한것이지만 얼마나 리액트를 블랙박스처럼 쓰고 있었는지를 알 수 있는 부분이다.

    브라우저에서 https://eedited.com으로 접속하면, 평소에 개발을 하던것 처럼,

    ```
    npm run start
    ```

    와 같이 동작하지 않을까? 라는 마인드가 강했다. npm run start로 계속 와치를 걸면서 개발을 하다보니 저러지 않을까라는 믿음이 은연중에 생긴것 같기도 하다.

    <물론 "npm run start"도 결국에는 웹펙이 build 결과를 만들어내지 않고 바로 브라우저에 보여준다 뿐이지 저따구로 동작하지는 않는다>

    결국에 리액트 서버가 axios 요청을 날려서 그것을 처리하고 그 처리한 결과를 '알아서 잘' 해줄것이다. 라는 믿음으로,,, 쓰고 있었다는 것이다.

    하지만 이런 믿음은 브라우저가 어떻게 html를 렌더링하고 js로 어떻게 동적인 연산을 처리하는지. 그 기본적인 생각이 결여되어있던 믿음이었다고 생각한다.

2. 실제로는 어떻게 돌아가는가

    실제로 리액트 서버는 그렇게 많은 동작을 관여하지 않는다.

    그저 "npm run build"를 통해 만들어진 웹팩이 만들어낸 css와 js. 그리고 가장 중앙을 지킬 index.html, static한 이미지 파일들. 그것을 요청에 맞게 실행시키기 위한 nginx. 그게 끝이다.

    결국에 하고자 하는 말은 그냥 static한 파일을 요청에 맞게 response해주는 역할이 리액트 서버가 할 일의 전부다. 라는 말이다.

    그렇게 js와 html, css를 리액트 서버로부터 받은 브라우저는 필요에 맞게 js들을 실행시킨다. 거기에는 ajax 연산도 있겠지..

    그렇다 보니 우리는 1번의 그림처럼 흘러가겠지... 라고 생각했던 것은 사실 2번의 그림처럼 흘러갔다.

    ![이것이 진실](/assets/img/1014/2.png)

    그러면 볼 수 있는 문제는, 브라우저에서 internal 로드밸런서에 요청을 날린다. private subnet에 들어있는 internal 로드밸런서는 외부에서 들어오는 요청으로부터 격리가 되어있다.

    그렇기 때문에 같은 vpc에 있지 않는 한, 접근이 안되는 vpc에 요청을 날리고 있던 꼴이니.. 될리가 없다. 모든 요청은 이때 타임아웃이 났었다.

    이것과 함께 고통받고 있던 우리팀원이 '이거 브라우저에서 요청날리는거 같은데?'라고 하며 internal 로드밸런서를 vpc 밖으로 빼고나서 이 에러는 해결되었다.

    지금 그림을 그리고 생각해보니 너무나도 당연한 이야기고 그래서 더 화난다.

결과적으로는 모든 서비스가 internet facing 로드 밸런서 두개에 의해 돌아가는 서비스가 되어버렸다.

## CORS

cors에도 고통을 받았다.

https://evan-moon.github.io/2020/05/21/about-cors/

여기가 근본이다 ㅇㅇ

## npm run build와 docker

우리는 깃랩의 마스터 브랜치에 푸시가 되면, 그것을 깃랩 ci/cd를 통해 이번에 푸시된 소스코드에 대한 도커 이미지를 굽고 그것을 aws의 ecr에 올리는 과정을 거친다.

우리 리엑트의 이미지는 cra의 웹펙으로 빌드하고, 그것을 nginx에 붙인 후 nginx로 서버를 실행하라는 cmd를 붙인. 그런 이미지다.

웹팩으로 빌드가 되면, 그 자체로 static한 파일이 되기 때문에, 환경변수를 고친다고 다른 작동 양상을 보이는 현상이 사라진다. 환경변수까지 npm build 하는 시점에 소스코드에 녹아들어간다는 것이다.

하지만 우리의 코드 파이프라인 계획은 이 이미지가 실행되는 시점(ec2에 우리의 이미지가 올라가서 docker run 할 때)에 환경변수를 넣어서 그 이미지를 사용할 생각이었는데 이때는 우리의 코드는 다 익어버린 고기마냥 .env에 독립적인 상태가 되어버렸다.

그래서 결론은 웹팩으로 빌드를 하는 시점에 넣어주는게 베스트인데 이놈을 어떻게 처리해야할지 골머리가 아팠다.

환경변수라는게 그냥 막 넣어도 되는것도 아니고 다른 사람들은 못보는 곳에 넣어서 빌드를 해야했기 때문이다.

---

골머리를 썩던 중 결론은 깃랩 ci/cd를 이용할 때 secure하게 사용가능한 변수들에 env값들을 정의해두는 것이다.

그렇게 변수를 선언하고 나면, 깃랩 ci/cd에서 docker build를 하는 시점에

``` yaml
docker build --build-arg 변수1=값1 --build-arg 변수2=값2
```

이렇게 도커파일에 명시적으로 넘기는 것이 가능하고, 이 변수의 값들은 모두 secure하게 처리가 가능하다.

하지만 모두 수동으로 해야하기 때문에 굉장히 귀찮다.

또, 도커 파일에서는 이 arg를

``` yaml
ARG=변수1
ARG=변수2
```

이렇게 선언해두고 이 값이 들어올 것이다 라고 명시해둘 수 있으며, 안들어왔을 때를 대비한 default value 또한 선언이 가능하다.

그리고 이렇게 환경변수들을 모두 받아왔으면,

``` yaml
ENV=변수1=${변수1} \
    변수2=${변수2} \
```

처럼 변수들을 환경변수에 등록시키고 "npm run build"를 하면 env파일이 없어도 env파일이 있는것마냥 파일을 구울 수 있다.

굉장히 손이 많이 가는 작업이지만, env값이 없는 시점에서 env를 노출시키지 않고 이미지를 정상적으로 빌드시키기 위해서는 이 방법이 최선이라고 생각한다.
